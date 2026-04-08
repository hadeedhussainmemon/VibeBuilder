import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Website from "@/models/Website";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12");

    await connectToDatabase();
    
    // Fetch latest websites that are public
    const showcase = await Website.find({ isPublic: true })
      .populate("ownerId", "name image")
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(showcase);
  } catch (error) {
    console.error("SHOWCASE_API_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
