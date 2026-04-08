"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import ExploreSection from "@/components/ExploreSection";

export default function ExplorePage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform overflow-hidden">
              <img src="/logo.png" alt="VibeBuilder Logo" className="w-full h-full object-cover p-2" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic italic">VibeBuilder</span>
          </Link>

          <div className="flex gap-4 items-center">
            {status === "loading" ? (
               <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-500 flex items-center gap-2">
                 <Loader2 className="w-3 h-3 animate-spin" />
                 Checking...
               </div>
            ) : status === "authenticated" ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/builder"
                  className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5"
                >
                  Launch Builder
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => signIn("google")}
                className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <ExploreSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="font-black uppercase tracking-tighter text-xl">VibeBuilder</span>
          </div>
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">
            © 2026 VibeBuilder. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
