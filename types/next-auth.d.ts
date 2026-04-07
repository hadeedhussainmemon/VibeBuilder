import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      sitesCount: number;
      isPremium: boolean;
    } & DefaultSession["user"];
  }
}
