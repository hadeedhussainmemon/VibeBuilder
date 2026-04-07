import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Website from "@/models/Website";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, ownerId } = await req.json();

    if (!prompt || !ownerId) {
      return NextResponse.json({ error: "Missing prompt or ownerId" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(ownerId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check Limit
    if (!user.isPremium && user.sitesCount >= 5) {
      return NextResponse.json({ status: "LIMIT_REACHED" });
    }

    // System Prompt for high-quality website generation
    const systemPrompt = `
      You are an expert web designer and developer. 
      Your task is to generate a beautiful, modern, and high-performance single-page website based on the user's prompt.
      
      RULES:
      1. Use ONLY HTML and Tailwind CSS (via CDN in the head).
      2. Use premium aesthetics: dark modes, glassmorphism, smooth gradients, and Inter font.
      3. Use Lucide icons (via CDN) where appropriate.
      4. Make the site fully mobile-responsive.
      5. Include subtle CSS animations.
      6. DO NOT include any explanatory text. ONLY output the full HTML code inside <html> tags.
      7. Use the Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create this website: ${prompt}` },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const generatedHtml = chatCompletion.choices[0]?.message?.content || "<html><body>Error generating content</body></html>";

    // Create unique slug
    const slug = `${user.name.split(" ")[0].toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;

    // Save to Database
    const newWebsite = await Website.create({
      ownerId: user._id,
      slug,
      title: `${user.name}'s Generated Site`,
      prompt,
      html: generatedHtml,
    });

    // Increment user sites count
    await User.findByIdAndUpdate(ownerId, { $inc: { sitesCount: 1 } });

    return NextResponse.json({ 
      html: generatedHtml, 
      slug: newWebsite.slug,
      status: "SUCCESS" 
    });

  } catch (error: any) {
    console.error("GROQ API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
