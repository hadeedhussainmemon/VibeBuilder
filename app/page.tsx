import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, Code, Loader2, Menu, X } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import ExploreSection from "@/components/ExploreSection";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-purple-500/30 overflow-x-hidden scroll-smooth relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform overflow-hidden">
              <img src="/logo.png" alt="VibeBuilder Logo" className="w-full h-full object-cover p-2" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">VibeBuilder</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 items-center">
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

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl md:hidden p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-20">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <img src="/logo.png" className="w-full h-full object-contain p-1.5" />
                 </div>
                 <span className="font-black italic uppercase tracking-tighter">VibeBuilder</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-white/5 rounded-full border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-10">
               {[
                 { label: "Home", href: "/" },
                 { label: "Explore", href: "#explore" },
                 { label: "Pricing", href: "https://wa.me/92332965814" }
               ].map((item, i) => (
                 <a 
                   key={i}
                   href={item.href}
                   onClick={() => setMobileMenuOpen(false)}
                   className="text-4xl font-black italic uppercase tracking-tighter hover:text-purple-500 transition-colors"
                 >
                   {item.label}
                 </a>
               ))}
            </div>

            <div className="mt-auto">
               <button 
                onClick={() => { setMobileMenuOpen(false); signIn("google"); }}
                className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest shadow-2xl shadow-white/10"
               >
                 Launch Builder
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-purple-400 mb-8 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-[pulse_2s_infinite]" />
              Elite AI Engine • Groq Llama-3.3
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-[100px] font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent leading-[0.9] uppercase italic">
              Your Vision, <br />
              <span className="text-purple-500">Instantly.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              The world's fastest high-end AI website builder. Upload your assets, 
              describe your vibe, and launch a stunning production-ready site in seconds.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {status === "authenticated" ? (
                  <Link 
                    href="/builder"
                    className="group relative px-12 py-5 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest overflow-hidden block shadow-2xl shadow-white/5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
                      Launch Builder <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => signIn("google")}
                    className="group relative px-12 py-5 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest overflow-hidden block shadow-2xl shadow-white/5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
                      Launch Builder <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                )}
              </motion.div>
              <a 
                href="#explore"
                className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                Showcase
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
              title: "Lightning Core",
              desc: "Deploy premium designs in under 5 seconds with Groqued Llama inference."
            },
            {
              icon: <Code className="w-6 h-6 text-blue-400" />,
              title: "Pro Export",
              desc: "Download high-performance ZIP archives with optimized Tailwind structures."
            },
            {
              icon: <Shield className="w-6 h-6 text-purple-400" />,
              title: "Elite Limits",
              desc: "Scale your creative studio with automated credits and premium support."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10" />
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium italic">
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
          <p className="text-[10px] text-gray-800 uppercase tracking-[0.4em] font-black">
            © 2026 VibeBuilder Elite. Mastered by AI.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
