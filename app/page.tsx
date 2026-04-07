"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Layout, Globe, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="relative isolate flex flex-col items-center bg-black text-white selection:bg-purple-500/30 overflow-hidden min-h-screen">
      {/* Background Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Nav */}
      <nav className="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">VibeBuilder</span>
        </motion.div>

        <div className="flex gap-4 items-center">
          {session ? (
            <div className="flex items-center gap-4">
              {session.user.role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  Admin Panel
                </Link>
              )}
              <Link href="/builder">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-sm font-semibold transition-all"
                >
                  Dashboard
                </motion.button>
              </Link>
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signIn("google")}
              className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
            >
              Get Started
            </motion.button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-8">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Website Generation is Here</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent leading-[1.1]">
            Your Vision, <br />
            <span className="text-purple-500 uppercase italic">Instantly</span> Coded.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your logo, describe your dream site, and watch VibeBuilder generate a stunning, 
            responsive website in seconds. All powered by Groq's lightning-fast AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => session ? window.location.href = "/builder" : signIn("google")}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 group shadow-xl shadow-purple-600/20"
            >
              Start Generating for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
        >
          {[
            { icon: Layout, title: "Stunning Layouts", desc: "Clean, modern, and highly responsive components designed by AI." },
            { icon: Globe, title: "Live Hosting", desc: "Deploy your site instantly with its own unique link." },
            { icon: Shield, title: "Admin Controlled", desc: "Full transparency and management features for ultimate control." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-12 px-6 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="font-bold">SiteForge</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-600">© 2026 SiteForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
