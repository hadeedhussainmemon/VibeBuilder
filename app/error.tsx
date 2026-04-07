"use client";

import { motion } from "framer-motion";
import { Sparkles, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-purple-500/30">
      <div className="max-w-md w-full text-center">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-[40px] border border-white/5 flex items-center justify-center mx-auto mb-10 shadow-2xl"
        >
          <Sparkles className="w-10 h-10 text-gray-700" />
        </motion.div>
        
        <h1 className="text-8xl font-black italic tracking-tighter mb-4 opacity-20 text-red-500">500</h1>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-6 italic italic">System Glitch</h2>
        <p className="text-gray-500 mb-12 leading-relaxed text-sm">
          Something went wrong on our end. We're dispatching a technician into the shadow realm to fix it.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            href="/"
            className="w-full py-5 rounded-[24px] bg-white text-black font-black uppercase text-sm tracking-widest hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-3 shadow-xl shadow-white/10"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-5 rounded-[24px] bg-white/5 border border-white/10 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Retry System
          </button>
        </div>
      </div>
    </div>
  );
}
