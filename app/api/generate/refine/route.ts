import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Website from "@/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { websiteId, instruction } = await req.json();

    if (!websiteId || !instruction) {
      return new Response("Missing websiteId or instruction", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Check Credit Limit (Refinement counts as a generation)
    if (user.sitesCount >= (user.maxSites || 5)) {
      return new Response(JSON.stringify({ status: "LIMIT_REACHED" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const website = await Website.findById(websiteId);
    if (!website) {
      return new Response("Website not found", { status: 404 });
    }

    const systemPrompt = `
      You are a World-Class UI/UX Editor.
      Your task is to MODIFY the existing HTML of a website based on the user's instructions.
      
      EXISTING HTML:
      ${website.html}
      
      CORE REQUIREMENTS:
      1. ONLY return the updated full HTML code. No talk. No pre-amble.
      2. Maintain the existing branding, CDNs, and styling (Tailwind, Outfit font).
      3. Focus exactly on the user's instruction: "${instruction}".
      4. Ensure all animations and icons continue to work.
      5. Do not lose the "Made with Vibe Builder" footer.
      
      If the user wants a major new section, build it with the same high-end aesthetic as the original.
    `;

    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: `Refine this website with the following instruction: ${instruction}`,
      onFinish: async (event) => {
        // Update the existing website with the refined HTML
        await Website.findByIdAndUpdate(websiteId, {
          html: event.text,
          $push: { assets: { url: `Refinement: ${instruction}`, type: "log" } } // Logging the change in assets for now
        });

        // Increment user sites count (or charge differently if preferred)
        await User.findByIdAndUpdate(session.user.id, { $inc: { sitesCount: 1 } });
      },
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("REFINEMENT ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
