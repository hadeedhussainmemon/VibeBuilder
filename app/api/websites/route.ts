import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Website from "@/models/Website";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch latest 5 websites for the user
    const websites = await Website.find({ ownerId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("slug title vibe createdAt html isPublic");

    return new Response(JSON.stringify(websites), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("HISTORY_API_ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
