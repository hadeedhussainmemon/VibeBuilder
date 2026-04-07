import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Website from "@/models/Website";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const allUsers = await User.find({}).sort({ createdAt: -1 });
    const allWebsites = await Website.find({})
      .populate("ownerId", "email name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users: allUsers,
      websites: allWebsites,
      stats: {
        totalUsers: allUsers.length,
        totalSites: allWebsites.length,
      }
    });

  } catch (error) {
    console.error("ADMIN API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
