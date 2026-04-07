"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Globe, 
  Activity, 
  ArrowLeft, 
  Search, 
  Clock, 
  ShieldCheck,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetch("/api/admin")
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            router.push("/");
          } else {
            setData(data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-purple-500 animate-[loading_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-2">
              <ArrowLeft className="w-3 h-3" />
              Back to site
            </Link>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-4">
              Admin <span className="text-purple-500">Core</span> Control
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </h1>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
             <img src={session?.user?.image || ""} className="w-10 h-10 rounded-full" />
             <div>
               <p className="text-sm font-bold">{session?.user?.name}</p>
               <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Master Admin</p>
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "Total Users", value: data?.stats?.totalUsers || "0", color: "from-blue-500 to-cyan-500" },
            { icon: Globe, label: "Sites Built", value: data?.stats?.totalSites || "0", color: "from-purple-500 to-pink-500" },
            { icon: Activity, label: "System Health", value: "99.9%", color: "from-emerald-500 to-teal-500" }
          ].map((stat, i) => (
            <div key={i} className="p-1 rounded-[32px] bg-gradient-to-br from-white/10 to-transparent">
               <div className="p-8 rounded-[30px] bg-black h-full flex flex-col justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-xl`}>
                     <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* User Activity Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-tight">Recent Generations</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search user..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-sm focus:border-purple-500/50 outline-none transition-all w-64"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 bg-white/[0.03]">
                  <th className="px-8 py-6">User / Identity</th>
                  <th className="px-8 py-6">Gen Prompt (Requirement)</th>
                  <th className="px-8 py-6">Created On</th>
                  <th className="px-8 py-6 text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.websites.map((site: any) => (
                  <tr key={site._id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">{site.ownerId?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500 font-mono tracking-tight">{site.ownerId?.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-gray-400 line-clamp-2 max-w-sm font-medium leading-relaxed italic">
                        "{site.prompt}"
                      </p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                         <Clock className="w-3 h-3" />
                         {new Date(site.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <Link 
                         href={`/${site.slug}`}
                         className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400 hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-purple-500/5 group-hover:scale-105"
                       >
                         View Site
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
