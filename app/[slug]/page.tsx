import connectToDatabase from "@/lib/db";
import Website from "@/models/Website";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const website = await Website.findOne({ slug });

  return {
    title: website ? `${website.title} | VibeBuilder` : "Website not found",
    description: "Powered by VibeBuilder AI",
  };
}

export default async function PublicWebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectToDatabase();
  const website = await Website.findOne({ slug });

  if (!website) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full relative group">
      <div 
        className="min-h-screen w-full"
        dangerouslySetInnerHTML={{ __html: website.html }} 
      />

      {/* Viral Badge */}
      <a 
        href="https://vibe-builder-seven.vercel.app" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999] px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 shadow-2xl hover:scale-105 transition-all text-white no-underline group/badge"
      >
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <span className="text-[10px] font-black">V</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 group-hover/badge:opacity-100">Built with VibeBuilder</span>
      </a>
    </div>
  );
}
