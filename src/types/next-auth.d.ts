import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type with additional properties.
   */
  interface User {
    role?: string;
  }

  /**
   * Extends the built-in session type to ensure the extended user properties are recognized.
   */
  interface Session {
    user: {
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT type with additional properties.
   */
  interface JWT {
    role?: string;
  }
}
