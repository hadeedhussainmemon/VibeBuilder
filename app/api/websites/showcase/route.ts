import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Website from "@/models/Website";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch latest 6 websites that are public
    const showcase = await Website.find({ isPublic: true })
      .populate("ownerId", "name image")
      .sort({ createdAt: -1 })
      .limit(6);

    return NextResponse.json(showcase);
  } catch (error) {
    console.error("SHOWCASE_API_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
