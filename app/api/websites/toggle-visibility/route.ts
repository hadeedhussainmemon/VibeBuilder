import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Website from "@/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const { websiteId, isPublic } = await req.json();

    if (!websiteId) {
      return NextResponse.json({ error: "Missing websiteId" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find and update if owner
    const website = await Website.findOneAndUpdate(
      { _id: websiteId, ownerId: session.user.id },
      { isPublic },
      { new: true }
    );

    if (!website) {
      return NextResponse.json({ error: "Website not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, isPublic: website.isPublic });
  } catch (error) {
    console.error("TOGGLE_VISIBILITY_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
