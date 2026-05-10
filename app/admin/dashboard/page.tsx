import { prisma } from "@/lib/prisma";
import { Users, FileDiff, Wallet, ArrowUpRight, Clock, ShieldCheck, Sparkles, Scale, Landmark, TreePine, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const totalJenazah = await prisma.jenazah.count();
  const totalWaris = await prisma.ahliWaris.count();
  const totalCalculated = await prisma.logKalkulasi.count();

  // Per-hukum breakdown
  const totalIslam = await prisma.jenazah.count({ where: { hukum: "Islam" } });
  const totalJawa = await prisma.jenazah.count({ where: { hukum: "Jawa" } });
  const totalPerdata = await prisma.jenazah.count({ where: { hukum: "Perdata" } });

  const calculatedIslam = await prisma.logKalkulasi.count({ where: { jenazah: { hukum: "Islam" } } });
  const calculatedJawa = await prisma.logKalkulasi.count({ where: { jenazah: { hukum: "Jawa" } } });

  const lastActive = await prisma.jenazah.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { logKalkulasi: true }
  });

  const stats = [
    { label: "Total Keluarga", value: totalJenazah, icon: Users, color: "bg-blue-600", shadow: "shadow-blue-200" },
    { label: "Anggota Keluarga", value: totalWaris, icon: ShieldCheck, color: "bg-emerald-600", shadow: "shadow-emerald-200" },
    { label: "Sudah Dihitung", value: totalCalculated, icon: FileDiff, color: "bg-violet-600", shadow: "shadow-violet-200" },
  ];

  const hukumBreakdown = [
    { label: "Hukum Islam", count: totalIslam, calculated: calculatedIslam, color: "emerald", icon: "☪️" },
    { label: "Adat Jawa", count: totalJawa, calculated: calculatedJawa, color: "amber", icon: "🏛️" },
    { label: "Perdata", count: totalPerdata, calculated: 0, color: "blue", icon: "⚖️" },
  ];

  const totalForChart = totalIslam + totalJawa + totalPerdata || 1;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Multi-Hukum</h1>
          <p className="text-slate-500 mt-2 font-medium">Analisis distribusi waris — Faraid, Adat Jawa & Perdata.</p>
        </div>
        <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Database Terkoneksi</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="group relative bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-b-8 border-b-slate-50 hover:border-b-emerald-500">
            <div className="relative z-10 flex justify-between items-start">
              <div className={`p-5 rounded-2xl ${stat.color} text-white shadow-xl ${stat.shadow} group-hover:rotate-12 transition-all duration-500`}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="bg-slate-50 p-2 rounded-xl text-slate-300">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="relative z-10 mt-8">
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-6xl font-black text-slate-900 mt-3 tracking-tighter">{stat.value}</h3>
            </div>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${stat.color} opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-1000`} />
          </div>
        ))}
      </div>

      {/* Hukum Breakdown + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Bar Chart Visual */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Distribusi Per Hukum</h2>
              <p className="text-slate-400 font-medium text-sm mt-0.5">Perbandingan data keluarga berdasarkan sistem hukum.</p>
            </div>
          </div>

          {/* Horizontal bar chart */}
          <div className="space-y-6">
            {hukumBreakdown.map((h, i) => {
              const pct = Math.round((h.count / totalForChart) * 100);
              return (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{h.icon}</span>
                      <span className="font-black text-slate-800 text-sm">{h.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-${h.color}-600 font-black text-2xl tracking-tighter`}>{h.count}</span>
                      <span className="text-slate-400 text-xs font-bold">keluarga</span>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${h.color}-500 rounded-full transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pct}% dari total</span>
                    <span className={`text-[10px] font-black text-${h.color}-500 uppercase tracking-widest`}>{h.calculated} dihitung</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donut-like summary */}
          <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-3 gap-6">
            {hukumBreakdown.map((h, i) => (
              <div key={i} className={`text-center p-5 rounded-2xl bg-${h.color}-50/50 border border-${h.color}-100/50`}>
                <p className="text-3xl mb-1">{h.icon}</p>
                <p className={`text-${h.color}-600 font-black text-xl tracking-tighter`}>{h.count}</p>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Card */}
        <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group flex flex-col justify-between border-4 border-slate-800">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8">
              <Sparkles size={32} />
            </div>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tighter">Engine Waris <span className="text-emerald-500">Multi-Hukum.</span></h2>
            <p className="text-slate-400 mt-6 font-medium leading-relaxed text-sm">Sistem kalkulasi waris yang mendukung Syariat Islam (Faraid), Adat Jawa (Sepikul Segendongan & Kum-kum Kupat), dan Perdata (KUHPerdata).</p>
            
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-xs font-bold">Faraid — Aul, Radd, Gharrawain</span>
              </div>
              <div className="flex items-center gap-3 text-amber-400">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-xs font-bold">Adat Jawa — Sepikul & Kum-kum</span>
              </div>
              <div className="flex items-center gap-3 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-xs font-bold">Perdata — 4 Golongan (Segera)</span>
              </div>
            </div>
          </div>
          <Link href="/admin/panduan" className="relative z-10 mt-12 bg-emerald-600 text-white px-10 py-5 rounded-[1.5rem] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 w-full text-center">
            Pelajari Sistem
          </Link>
          <div className="absolute top-0 right-0 p-12 text-white/5">
            <ShieldCheck size={200} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Aktifitas Terbaru</h2>
            <p className="text-slate-400 font-medium text-sm mt-1">Daftar keluarga yang baru saja diperbarui sistem.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
            <Clock size={24} />
          </div>
        </div>
        <div className="space-y-4">
          {lastActive.length > 0 ? lastActive.map((item, idx) => {
            const hukumColor = item.hukum === "Jawa" ? "amber" : item.hukum === "Perdata" ? "blue" : "emerald";
            const hukumLabel = item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : "Faraid";
            return (
              <Link href={`/admin/keluarga/${item.id}`} key={idx} className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                <div className={`w-14 h-14 bg-${hukumColor}-100 text-${hukumColor}-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform`}>
                  {item.nama.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-800 text-lg leading-tight">{item.nama}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-${hukumColor}-50 text-${hukumColor}-600 border border-${hukumColor}-100`}>{hukumLabel}</span>
                    <span className="text-sm text-slate-400 font-medium">Diperbarui {new Date(item.updatedAt).toLocaleTimeString('id-ID')}</span>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.logKalkulasi ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {item.logKalkulasi ? 'Selesai' : 'Input'}
                </div>
              </Link>
            );
          }) : (
            <div className="py-20 text-center text-slate-200 font-black uppercase tracking-widest text-xs">Belum ada aktifitas database</div>
          )}
        </div>
      </div>
    </div>
  );
}
