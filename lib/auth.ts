// ============================================================================
// NextAuth Configuration
// ============================================================================
// - GitHub OAuth provider for Participants
// - Credentials provider for Judges, Organizers, and Admins
// - Role-based session enrichment

import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  // -----------------------------------------------------------------------
  // Providers
  // -----------------------------------------------------------------------
  providers: [
    // GitHub OAuth — used exclusively by Participants
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),

    // Email + Password — used by Judges, Organizers, Admins
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  // -----------------------------------------------------------------------
  // Callbacks
  // -----------------------------------------------------------------------
  callbacks: {
    // On sign-in: handle GitHub OAuth → create/find participant in MongoDB
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        await dbConnect();

        const githubProfile = profile as {
          login?: string;
          id?: number;
          name?: string;
          email?: string;
          avatar_url?: string;
        };

        const githubId = String(githubProfile.id ?? account.providerAccountId);
        const githubUsername = githubProfile.login ?? "";
        const email =
          githubProfile.email ?? user.email ?? `${githubUsername}@github.local`;
        const name = githubProfile.name ?? githubUsername;
        const image = githubProfile.avatar_url ?? user.image ?? undefined;

        // Find existing participant by githubId, or by email
        let dbUser = await User.findOne({
          $or: [{ githubId }, { email: email.toLowerCase() }],
        });

        if (dbUser) {
          // If user exists but isn't a participant, block sign-in
          // (judges/organizers must use credentials)
          if (dbUser.role !== "participant") {
            return false;
          }
          // Update GitHub info
          dbUser.githubId = githubId;
          dbUser.githubUsername = githubUsername;
          dbUser.image = image;
          dbUser.name = name;
          await dbUser.save();
        } else {
          // Create new participant
          dbUser = await User.create({
            role: "participant",
            name,
            email: email.toLowerCase(),
            image,
            githubId,
            githubUsername,
          });
        }

        // Attach MongoDB _id so JWT callback can read it
        (user as any).dbId = dbUser._id.toString();
        (user as any).role = dbUser.role;
      }
      return true;
    },

    // Enrich the JWT token with role and DB user id
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.dbId = (user as any).dbId || (user as any).id;
      }

      // For GitHub sign-in, fetch role from DB if not already set
      if (account?.provider === "github" && !token.role) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.dbId = dbUser._id.toString();
        }
      }

      return token;
    },

    // Expose role and dbId in the session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.dbId;
      }
      return session;
    },
  },

  // -----------------------------------------------------------------------
  // Pages
  // -----------------------------------------------------------------------
  pages: {
    signIn: "/auth",
    error: "/auth",
  },

  // -----------------------------------------------------------------------
  // Session strategy: JWT (stateless)
  // -----------------------------------------------------------------------
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
