import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Website from "@/models/Website";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const maxDuration = 60; // Allow 60 seconds for complex generations

export async function POST(req: Request) {
  try {
    const { prompt, vibe, logoUrl } = await req.json();

    if (!prompt) {
      return new Response("Missing prompt", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const ownerId = session.user.id;

    await connectToDatabase();
    const user = await User.findById(ownerId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Check Limit against dynamic maxSites
    if (user.sitesCount >= (user.maxSites || 5)) {
      return new Response(JSON.stringify({ status: "LIMIT_REACHED" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add Vibe specific instructions
    const vibeInstructions = vibe === "glassmorphism" 
      ? `
        - Background: Deep mesh gradients with blur.
        - Components: backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)].
        - Transitions: Smooth hover effects with scale and glow.
        - Feel: Futuristic, translucent, and premium.`
      : vibe === "brutalist" 
      ? `
        - Colors: High-contrast (Black/White/Neon Yellow/Shocking Pink).
        - Borders: Thick 4px-8px black borders (border-b-8 border-r-8).
        - Typography: Extra bold, all-caps headings, large spacing.
        - Feel: Raw, energetic, and extremely bold.`
      : `
        - Style: Sleek dark mode or ultra-clean light mode.
        - Spacing: Extreme whitespace (container mx-auto px-6 py-24).
        - Aesthetics: Subtle gradients, rounded-3xl corners, hidden borders.
        - Feel: Apple-style elegance, professional, and sophisticated.`;

    const systemPrompt = `
      You are a World-Class UI/UX Designer and Frontend Master. 
      Your task is to generate a premium, single-page website based on the user's prompt.
      
      CORE REQUIREMENTS:
      1. Technical Stack: HTML5, Tailwind CSS (CDN), Lucide Icons (CDN), Animate.css (CDN).
      2. Typography: Use the 'Outfit' Google Font for a modern, high-end feel.
      3. Design Vibe: ${vibeInstructions}
      4. Assets: 
         ${logoUrl ? `- LOGO: Use this image URL: "${logoUrl}" prominently in the header (max-h-10).` : "- LOGO: Create a premium text-based logo or use a Sparkles icon."}
         - Images: Use high-quality Unsplash URLs (e.g., https://images.unsplash.com/...) relevant to the topic.
      5. Mandatory Footer: You MUST include a footer with the text "Made with Vibe Builder" and a link to "https://vibe-builder-seven.vercel.app". Make it look stylish but professional.
      6. Quality: Use vibrant color palettes, smooth section transitions, and entrance animations (animate__animated animate__fadeInUp).
      7. Responsive: Ensure it looks stunning on both Mobile (375px) and Desktop (1440px).
      
      Output ONLY the full HTML code. No pre-amble. No talk.
      
      CDNs to include in <head>:
      - <script src="https://cdn.tailwindcss.com"></script>
      - <script src="https://unpkg.com/lucide@latest"></script>
      - <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
      - <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      
      Important: Always call lucide.createIcons(); inside a <script> at the end of the body.
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
