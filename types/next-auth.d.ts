// ============================================================================
// NextAuth Types Extension
// ============================================================================
// Extend the default NextAuth types to include `role` and `id` in session.

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "participant" | "organizer" | "judge" | "admin";
    };
  }

  interface User {
    role?: string;
    dbId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    dbId?: string;
  }
}
