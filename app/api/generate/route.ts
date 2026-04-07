import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Website from "@/models/Website";

export const maxDuration = 60; // Allow 60 seconds for complex generations

export async function POST(req: Request) {
  try {
    const { prompt, ownerId, vibe } = await req.json();

    if (!prompt || !ownerId) {
      return new Response("Missing prompt or ownerId", { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(ownerId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Check Limit
    if (!user.isPremium && user.sitesCount >= 5) {
      return new Response(JSON.stringify({ status: "LIMIT_REACHED" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add Vibe specific instructions
    const vibeInstructions = vibe === "glassmorphism" 
      ? "Use intense glassmorphism (backdrop-blur-md, bg-white/10, border-white/20, shadow-xl)."
      : vibe === "brutalist" 
      ? "Use a retro-brutalist style (thick black borders, neon yellow/pink, high-contrast, bold typography)."
      : "Use a clean, modern, professional enterprise style (subtle shadows, lots of whitespace, rounded corners).";

    const systemPrompt = `
      You are an expert web designer and developer. 
      Your task is to generate a beautiful, modern, single-page website based on the user's prompt.
      
      CORE RULES:
      1. Use ONLY HTML and Tailwind CSS (via CDN).
      2. Style: ${vibeInstructions}
      3. Use Lucide icons (via CDN) where appropriate.
      4. Make it fully responsive.
      5. Output ONLY the full HTML code. No talk.
      6. Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
    `;

    // Start Streaming
    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: `Create a website for: ${prompt}. Ensure it's interactive and visually stunning.`,
      onFinish: async (event) => {
        // Save to Database after generation is complete
        const finalHtml = event.text;
        const slug = `${user.name.split(" ")[0].toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
        
        await Website.create({
          ownerId: user._id,
          slug,
          title: `Generated Site for ${user.name}`,
          prompt,
          vibe, // Saving the vibe here
          html: finalHtml,
        });

        // Increment user sites count
        await User.findByIdAndUpdate(ownerId, { $inc: { sitesCount: 1 } });
      },
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("GENERATION ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
