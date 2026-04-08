"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Layout, Globe, Code, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const PROMPTS = [
  {
    category: "SaaS & Core Tech",
    title: "Elite SaaS Landing",
    prompt: "A high-performance SaaS landing page for a cloud computing startup called 'Aether'. Use dark mode with vibrant neon purple accents, glassmorphism cards, and a sleek feature grid. Include a high-converting hero section with a floating dashboard illustration.",
    vibe: "sleek",
    gradient: "from-purple-600 to-blue-600"
  },
  {
    category: "Creative Agencies",
    title: "Minimalist Studio",
    prompt: "A bold, minimalist portfolio for 'Prism Studio', a design agency. Use a 'Brutalist' aesthetic with large typography, monochromatic colors, and raw grid layouts. Focus on high-impact project case studies.",
    vibe: "brutalist",
    gradient: "from-gray-700 to-black"
  },
  {
    category: "Luxury & Elegance",
    title: "Real Estate Portal",
    prompt: "A premium property portal for 'Onyx Estates'. Use an elegant 'Glass' theme with gold and charcoal tones, large serif headings, and high-fidelity masonry galleries for luxury listings.",
    vibe: "glassmorphism",
    gradient: "from-amber-600 to-orange-900"
  },
  {
    category: "Fintech",
    title: "Crypto Banking",
    prompt: "A clean, trustworthy landing page for 'Flow Finance', a crypto-banking app. Use an 'Electric Blue' palette, smooth entrance animations, and a secure feel with layered dashboard previews.",
    vibe: "sleek",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    category: "Personal Brand",
    title: "Dev Portfolio",
    prompt: "A sleek developer portfolio with a terminal-inspired aesthetic. Include sections for projects, skills, and a blog. Use a dark theme with emerald green accents and code-snippet decorations.",
    vibe: "brutalist",
    gradient: "from-emerald-600 to-teal-900"
  },
  {
    category: "Health & Fitness",
    title: "Fitness AI Platform",
    prompt: "A high-energy landing page for 'PulseAI', an at-home fitness app. Use aggressive reds and dark grays, bold headlines, and a dynamic workout-tracker illustration with stats.",
    vibe: "sleek",
    gradient: "from-red-600 to-rose-900"
  },
  {
    category: "Commerce",
    title: "Luxury Watch Store",
    prompt: "A high-end product showcase for 'Chronos Watches'. Use a sophisticated dark theme, elegant product sections with parallax effects, and a heritage story layout.",
    vibe: "glassmorphism",
    gradient: "from-slate-700 to-gray-900"
  },
  {
    category: "SaaS & Core Tech",
    title: "AI Workspace",
    prompt: "A landing page for 'LogicFlow', an AI-powered project manager. Use a clean 'Glass' interface with pastel secondary colors and a futuristic workflow diagram.",
    vibe: "glassmorphism",
    gradient: "from-indigo-500 to-purple-800"
  },
  {
    category: "Security",
    title: "Cybersecurity Suite",
    prompt: "A high-security landing page for 'NeuralGuard'. Use cyber-blue and deep blacks, honeycomb grid patterns, and trust-building security metrics with glow effects.",
    vibe: "sleek",
    gradient: "from-cyan-900 to-blue-900"
  },
  {
    category: "Architecture",
    title: "Modern Firm Portfolio",
    prompt: "A clean, white-space heavy portfolio for 'Apex Architects'. Use wide horizontal layouts, thin serif fonts, and a minimalist aesthetic with structural image overlays.",
    vibe: "brutalist",
    gradient: "from-stone-500 to-neutral-800"
  },
  {
    category: "Commerce",
    title: "Artisanal Coffee",
    prompt: "A warm, earthy landing page for 'Roast & Revel'. Use deep browns and creams, artisanal imagery, and a subscription-first focus with rustic typography.",
    vibe: "sleek",
    gradient: "from-orange-800 to-amber-900"
  },
  {
    category: "Luxury & Elegance",
    title: "Fashion Editorial",
    prompt: "A sleek fashion catalog for 'Vogue Elite'. Use high-fashion photography sections, elegant transitions, and a magazine-style layout with high contrast.",
    vibe: "glassmorphism",
    gradient: "from-pink-900 to-purple-950"
  },
  {
    category: "Entertainment",
    title: "Music Hub",
    prompt: "A vibrant landing page for 'EchoStream'. Use neon gradients, futuristic wave patterns, and a community-first social layout with integrated player mockups.",
    vibe: "sleek",
    gradient: "from-fuchsia-600 to-purple-600"
  },
  {
    category: "Travel",
    title: "Adventure Discovery",
    prompt: "An adventurous landing page for 'Wanderer'. Use breathtaking landscape hero sections, elegant vertical navigation, and trip-planner forms with nature tones.",
    vibe: "glassmorphism",
    gradient: "from-sky-500 to-blue-700"
  },
  {
    category: "SaaS & Core Tech",
    title: "Data Analytics",
    prompt: "A data-driven landing page for 'InsightEngine'. Use clean charts, complex table layouts, and a professional light-mode aesthetic with interactive hover states.",
    vibe: "sleek",
    gradient: "from-blue-400 to-indigo-600"
  },
  {
    category: "Gaming",
    title: "Pro Gaming Gear",
    prompt: "A high-octane page for 'Raptor Gear'. Use neon greens and stealth blacks, aggressive angular sections, and hardware detail zooms with metallic flares.",
    vibe: "brutalist",
    gradient: "from-lime-500 to-green-900"
  },
  {
    category: "HR & Business",
    title: "Collaborative Team Hub",
    prompt: "A friendly, corporate landing page for 'TeamUp'. Use soft rounded corners, playful illustrations, and a collaborative feel with profile stack previews.",
    vibe: "sleek",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    category: "Health & Beauty",
    title: "Wellness Retreat",
    prompt: "An elegant booking page for 'Silk & Stone', a beauty salon. Use soft pinks and maroons, serene imagery, and a premium service list with thin borders.",
    vibe: "glassmorphism",
    gradient: "from-rose-400 to-pink-600"
  },
  {
    category: "SaaS & Core Tech",
    title: "Blockchain Protocol",
    prompt: "A technical but clean landing page for 'BlockNode'. Use geometric patterns, blue-to-violet gradients, and a protocol-first layout with node maps.",
    vibe: "sleek",
    gradient: "from-purple-900 to-blue-900"
  },
  {
    category: "Luxury & Elegance",
    title: "Supercar Concierge",
    prompt: "A high-speed landing page for 'Vector Drive'. Use metallic grays, cinematic wide-screen sections, and an 'Apply for Membership' focus with carbon texture.",
    vibe: "brutalist",
    gradient: "from-gray-800 to-zinc-950"
  }
];

export default function PromptsPage() {
  const { data: session, status } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform overflow-hidden">
              <img src="/logo.png" alt="VibeBuilder Logo" className="w-full h-full object-cover p-2" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">VibeBuilder</span>
          </Link>

          <div className="flex gap-6 items-center">
            <Link href="/explore" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Explore</Link>
            <Link href="/prompts" className="text-xs font-black uppercase tracking-widest text-white border-b border-purple-500 pb-1">Prompts</Link>
            {status === "authenticated" ? (
              <Link href="/builder" className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Launch Builder</Link>
            ) : (
              <Link href="/builder" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Get Started</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.2em] text-purple-400 mb-8 uppercase italic">
              <Sparkles className="w-3 h-3" />
              Elite Prompt Library
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase">
              Proven <span className="text-purple-500">Visuals.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-500 font-medium text-lg">
              Unlock the most demanded AI prompts curated for high-end conversions and premium aesthetics. 
              Deploy instantly with one click.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {PROMPTS.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative rounded-[40px] bg-[#0a0a0a] border border-white/5 p-8 hover:border-purple-500/30 transition-all flex flex-col h-full overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 blur-3xl -z-10 group-hover:opacity-10 transition-opacity`} />
                
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-500">{item.category}</p>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight">{item.title}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                <div className="flex-1 mb-10 overflow-hidden">
                   <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-4 group-hover:text-gray-400 transition-colors">
                      "{item.prompt}"
                   </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">{item.vibe}</span>
                   </div>
                   <Link
                      href={`/builder?prompt=${encodeURIComponent(item.prompt)}&vibe=${item.vibe}`}
                      className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                   >
                     Deploy Now <ArrowRight className="w-3.5 h-3.5" />
                   </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 px-6 bg-black/30 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="font-black uppercase tracking-tighter text-xl italic">VibeBuilder</span>
          </div>
          <div className="flex gap-8">
             <Link href="/explore" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">Galaxy</Link>
             <Link href="/prompts" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">Prompts</Link>
             <Link href="https://wa.me/92332965814" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">Contact</Link>
          </div>
          <p className="text-[10px] text-gray-800 uppercase tracking-[0.4em] font-black">
            © 2026 VibeBuilder Elite. Mastered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
