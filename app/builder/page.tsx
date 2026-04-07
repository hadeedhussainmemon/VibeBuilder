"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Sparkles, Layout, Globe, Code, Download, Send, Plus, Upload, Loader2, Maximize2, Trash2, Shield, Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function BuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [logoUrl, setLogoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        setLogoUrl(data.url);
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    };
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file("index.html", generatedHtml);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "website-generator-site.zip");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check limit first (frontend check)
    if (session?.user && !session.user.isPremium && session.user.sitesCount >= 5) {
      setShowLimitModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ 
          prompt: `${prompt} ${logoUrl ? `Use this logo URL: ${logoUrl}` : ""}`, 
          ownerId: session?.user?.id 
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.status === "LIMIT_REACHED") {
        setShowLimitModal(true);
      } else {
        setGeneratedHtml(data.html);
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (status === "loading") return <div className="h-screen w-screen flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 animate-spin text-purple-500" /></div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar / Prompt Area */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-[400px] border-r border-white/5 bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto shrink-0 z-20 shadow-2xl relative"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">VibeBuilder</h2>
        </div>

        <div className="flex-1 flex flex-col gap-8">
          {/* Prompt Input */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400 flex justify-between">
              Describe your website
              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest leading-none flex items-center">Free: {5 - (session?.user?.sitesCount || 0)} left</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: A luxury dark-themed barbershop portfolio with a gallery section and contact form. Use high-end typography and smooth gradients."
              className="w-full h-48 p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none resize-none text-[15px] leading-relaxed placeholder:text-gray-600"
            />
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-400">Logo & Assets</label>
            <input 
              type="file" 
              id="logo-upload" 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload}
            />
            <label 
              htmlFor="logo-upload"
              className="aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-3 group hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer relative overflow-hidden"
            >
              {logoUrl ? (
                <img src={logoUrl} className="w-full h-full object-contain p-4" />
              ) : isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              ) : (
                <>
                  <div className="p-3 rounded-full bg-white/5 group-hover:bg-purple-500/10 transition-all">
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 group-hover:text-gray-400 transition-all">Upload logo (PNG/SVG)</span>
                </>
              )}
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isGenerating || !prompt}
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale cursor-pointer shadow-lg shadow-purple-600/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting Website...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Instant Site</span>
              </>
            )}
          </motion.button>
        </div>

        {/* User Card */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3">
          <img src={session?.user?.image || ""} className="w-10 h-10 rounded-full border border-white/10" />
          <div className="flex-1">
            <p className="text-sm font-bold truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{session?.user?.role}</p>
          </div>
          <button onClick={() => router.push("/")} className="p-2 rounded-lg hover:bg-white/5 text-gray-500">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Preview Area */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <header className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-gray-400">
              <Globe className="w-3 h-3" />
              <span>PREVIEW MODE</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {generatedHtml && (
               <>
                <button 
                  onClick={copyCode}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
                <button 
                  onClick={downloadZip}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download ZIP
                </button>
               </>
             )}
             <button 
               disabled={!generatedHtml}
               className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold transition-all flex items-center gap-2 shadow-xl shadow-white/5 disabled:opacity-50"
             >
                <Send className="w-4 h-4" />
                Publish Live
             </button>
          </div>
        </header>

        <div className="flex-1 bg-[#111] p-6 perspective-1000">
          <AnimatePresence mode="wait">
            {!generatedHtml ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full rounded-3xl border border-white/5 bg-black/40 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                  <Layout className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Your website will appear here</h3>
                <p className="text-gray-500 max-w-sm leading-relaxed">
                  Enter a detailed description on the left and hit the generate button to see the magic happen.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="rendered"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full rounded-3xl overflow-hidden bg-white shadow-2xl shadow-purple-500/5 ring-1 ring-white/10"
              >
                <iframe
                  srcDoc={generatedHtml}
                  className="w-full h-full"
                  title="Site Preview"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[32px] p-10 text-center shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600" />
             <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-8">
                <Shield className="w-10 h-10 text-purple-400" />
             </div>
             <h2 className="text-3xl font-black mb-4 uppercase italic">Account Frozen</h2>
             <p className="text-gray-400 mb-10 leading-relaxed text-sm">
                You've reached your free limit of 5 websites. To continue generating unlimited professional sites, please upgrade to premium for just <span className="text-white font-bold">$10</span>.
             </p>
             <div className="flex flex-col gap-3">
                <button className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest hover:scale-[1.02] transition-transform">
                   Pay $10 and Unfreeze
                </button>
                <button 
                  onClick={() => setShowLimitModal(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-bold text-sm tracking-widest hover:bg-white/10 transition-all outline-none"
                >
                   Close
                </button>
             </div>
             <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3" />
                Contact: support@siteforge.io
             </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
