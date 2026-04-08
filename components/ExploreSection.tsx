"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Code } from "lucide-react";
import Link from "next/link";

export default function ExploreSection({ limit }: { limit?: number }) {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/websites/showcase${limit ? `?limit=${limit}` : ""}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSites(data);
        }
      })
      .catch(err => console.error("Failed to load showcase", err))
      .finally(() => setLoading(false));
  }, [limit]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (loading) return (
    <div className="py-20 flex justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );

  const getVibeStyles = (vibe: string) => {
    switch (vibe) {
      case "glassmorphism":
        return "from-cyan-500/20 via-blue-500/10 to-transparent";
      case "brutalist":
        return "from-gray-500/10 via-zinc-500/5 to-transparent";
      default:
        return "from-purple-500/20 via-blue-500/10 to-transparent";
    }
  };

  return (
    <section id="explore" className="py-32 px-6 max-w-[1600px] mx-auto scroll-mt-20">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8"
      >
        <div className="space-y-4">
          <motion.h2 variants={cardVariants} className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Discovery <br />
            <span className="text-purple-500 text-6xl md:text-8xl">Cosmos</span>
          </motion.h2>
          <motion.p variants={cardVariants} className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">Curated Manifestos • Zero Latency</motion.p>
        </div>
        <motion.div variants={cardVariants} className="max-w-md text-right md:text-left">
           <p className="text-gray-400 text-sm leading-relaxed font-medium">
             Experience the design essence of the community's latest creations. We've optimized discovery with high-performance visualizations of every site's core vibe.
           </p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {sites.map((site, i) => (
          <motion.div
            key={site._id}
            variants={cardVariants}
            className="group relative rounded-[40px] overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col h-[500px]"
          >
            {/* Visual Essence Background */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 opacity-20 group-hover:opacity-40 ${getVibeStyles(site.vibe)}`} />
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            
            {/* Vibe Pattern/Atmosphere */}
            <div className="absolute top-0 right-0 p-8">
               <div className="w-32 h-32 rounded-full bg-purple-500/10 blur-[60px] group-hover:bg-purple-500/20 transition-all duration-700" />
            </div>

            <div className="relative z-10 p-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 inline-flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${site.vibe === 'brutalist' ? 'bg-white' : 'bg-purple-500'}`} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">{site.vibe || 'sleek'} vibe</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                   <Code className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>

              {/* Essence Manifesto */}
              <div className="space-y-6">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none group-hover:text-purple-400 transition-colors">
                  {site.slug.replace(/-/g, ' ')}
                </h3>
                <div className="h-px w-12 bg-white/10" />
                <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-4 italic group-hover:text-gray-300 transition-colors">
                  "{site.prompt || 'A visionary project generated with the VibeBuilder Elite engine.'}"
                </p>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-8 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={site.ownerId?.image || "/logo.png"} className="w-6 h-6 rounded-lg border border-white/10" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{site.ownerId?.name || "Anonymous"}</span>
                </div>
                <Link 
                  href={`/${site.slug}`}
                  className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10 hover:bg-purple-500 hover:text-white"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {limit && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <Link 
            href="/explore"
            className="group relative px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-sm tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
              Discover Full Galaxy <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
