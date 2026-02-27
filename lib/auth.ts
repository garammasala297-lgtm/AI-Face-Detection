import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Request additional profile data from GitHub
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubUsername: profile.login,
          githubId: profile.id.toString(),
          role: "PARTICIPANT" as const,
        };
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      // When signing in via GitHub, update the user's GitHub-specific fields
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as any;
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              githubUsername: githubProfile.login,
              githubId: githubProfile.id?.toString(),
              image: githubProfile.avatar_url,
              role: "PARTICIPANT",
            },
          });
        } catch {
          // User might not exist yet (first sign-in) — adapter handles creation
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      // Capture GitHub username on first sign-in
      if (account?.provider === "github" && profile) {
        token.githubUsername = (profile as any).login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).githubUsername = token.githubUsername;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
});
