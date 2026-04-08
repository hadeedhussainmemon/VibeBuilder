import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      sitesCount: number;
      maxSites: number;
      isPremium: boolean;
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
    sitesCount: number;
    maxSites: number;
    isPremium: boolean;
  }
}
