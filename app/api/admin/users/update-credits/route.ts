import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const { userId, maxSites } = await req.json();

    if (!userId || maxSites === undefined) {
      return NextResponse.json({ error: "Missing userId or maxSites" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { maxSites },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Credits updated successfully", 
      user: { 
        id: updatedUser._id, 
        email: updatedUser.email, 
        maxSites: updatedUser.maxSites 
      } 
    });

  } catch (error) {
    console.error("ADMIN_UPDATE_CREDITS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
