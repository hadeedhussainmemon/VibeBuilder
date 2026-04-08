"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, Code, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import ExploreSection from "@/components/ExploreSection";

export default function LandingPage() {
  const { data: session, status } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

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
            <span className="text-2xl font-black tracking-tighter uppercase italic">VibeBuilder</span>
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
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 mb-8 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Powered by Groq Llama-3.3
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent leading-[1.1]">
              Your Vision, <br />
              <span className="text-purple-500 uppercase italic whitespace-nowrap">Instantly Coded.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your logo, describe your dream site, and watch VibeBuilder generate a stunning, 
              responsive website in seconds. All powered by Groq's lightning-fast AI.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                href="#explore"
                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest hover:bg-white/10 transition-all font-sans"
              >
                View Showcase
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Community Discovery */}
      <ExploreSection />

      {/* Feature Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
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
              variants={itemVariants}
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="font-black uppercase tracking-tighter text-xl italic">VibeBuilder</span>
          </div>
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">
            © 2026 VibeBuilder. All Rights Reserved.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
