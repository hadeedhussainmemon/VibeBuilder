"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, Globe, Code, Layout, Rocket, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

function CommunityShowcase() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/websites/showcase")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSites(data);
        }
      })
      .catch(err => console.error("Failed to load showcase", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );

  return (
    <section id="showcase" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Community <span className="text-purple-500">Spotlight</span></h2>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Wowed by the vibe? See what others are building in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sites.map((site, i) => (
          <motion.div
            key={site._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative rounded-[32px] overflow-hidden bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all aspect-[4/3] flex flex-col"
          >
            <div className="flex-1 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center p-8 overflow-hidden relative">
               <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
               <div className="w-full h-full rounded-2xl border border-white/5 shadow-2xl bg-black/40 backdrop-blur-xl flex flex-col p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono italic line-clamp-4">"{site.prompt}"</p>
               </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-black/50 backdrop-blur-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm tracking-tight mb-1">{site.slug}</p>
                <div className="flex items-center gap-2">
                  <img src={site.ownerId?.image || "/logo.png"} className="w-4 h-4 rounded-full" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{site.ownerId?.name || "Anonymous"}</span>
                </div>
              </div>
              <Link 
                href={`/${site.slug}`}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-xl shadow-white/10"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { data: session, status } = useSession();
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform overflow-hidden">
              <img src="/logo.png" alt="VibeBuilder Logo" className="w-full h-full object-cover p-2" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic italic">VibeBuilder</span>
          </motion.div>

          <div className="flex gap-4 items-center">
            {status === "loading" ? (
               <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-500 flex items-center gap-2">
                 <Loader2 className="w-3 h-3 animate-spin" />
                 Checking...
               </div>
            ) : status === "authenticated" ? (
              <div className="flex items-center gap-4">
                {session?.user?.role === "admin" && (
                   <Link href="/admin" className="text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-300">Admin</Link>
                )}
                <Link 
                  href="/builder"
                  className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5"
                >
                  Go to Builder
                </Link>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => signIn("google")}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => signIn("google")}
                  className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 mb-8 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Powered by Groq Llama-3.3
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent leading-[1.1]">
              Your Vision, <br />
              <span className="text-purple-500 uppercase italic">Instantly</span> Coded.
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your logo, describe your dream site, and watch VibeBuilder generate a stunning, 
              responsive website in seconds. All powered by Groq's lightning-fast AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {(status === "loading" ) ? (
                <div className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-bold text-sm tracking-widest flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  Authenticating...
                </div>
              ) : status === "authenticated" ? (
                <Link 
                  href="/builder"
                  className="group relative px-10 py-5 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
                    Launch the Builder <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ) : (
                <button 
                  onClick={() => signIn("google")}
                  className="group relative px-10 py-5 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
                    Launch the Builder <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              )}
              <a 
                href="#showcase"
                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest hover:bg-white/10 transition-all"
              >
                View Showcase
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Showcase */}
      <CommunityShowcase />

      {/* Feature Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-6 h-6 text-yellow-400" />,
              title: "Instant Gen",
              desc: "Get a full website in under 5 seconds with Groq's high-speed inference."
            },
            {
              icon: <Code className="w-6 h-6 text-blue-400" />,
              title: "Clean Code",
              desc: "Download ZIP files with production-ready Tailwind CSS and HTML structure."
            },
            {
              icon: <Shield className="w-6 h-6 text-purple-400" />,
              title: "Adaptive Limits",
              desc: "Start with 5 sites free. Top up your quota anytime via our simplified dashboard."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="font-black uppercase tracking-tighter text-xl">VibeBuilder</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">
            © 2026 VibeBuilder. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
