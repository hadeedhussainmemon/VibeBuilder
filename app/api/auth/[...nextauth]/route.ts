import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.id = dbUser._id;
          session.user.role = dbUser.role;
          session.user.sitesCount = dbUser.sitesCount;
          session.user.isPremium = dbUser.isPremium;
        }
      }
      return session;
    },
    async signIn({ user }: any) {
        await connectToDatabase();
        const userCount = await User.countDocuments();
        const isAdminEmail = user.email === process.env.ADMIN_EMAIL;
        
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            await User.create({
                email: user.email,
                name: user.name,
                image: user.image,
                role: (userCount === 0 || isAdminEmail) ? "admin" : "user",
                sitesCount: 0,
                isPremium: false,
            });
        } else if (isAdminEmail && existingUser.role !== "admin") {
            // Also promote existing users if their email matches ADMIN_EMAIL later
            await User.findOneAndUpdate({ email: user.email }, { role: "admin" });
        }
        return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
