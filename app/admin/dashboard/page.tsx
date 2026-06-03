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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Multi-Hukum</h1>
          <p className="text-slate-550 mt-1 font-medium text-sm">Analisis distribusi waris — Faraid, Adat Jawa & Perdata.</p>
        </div>
        <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Terkoneksi</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 overflow-hidden border-b-4 border-b-slate-100 hover:border-b-emerald-500">
            <div className="relative z-10 flex justify-between items-start">
              <div className={`p-4 rounded-xl ${stat.color} text-white shadow-lg ${stat.shadow} group-hover:rotate-12 transition-all duration-500`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg text-slate-300">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="relative z-10 mt-6">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 ${stat.color} opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-1000`} />
          </div>
        ))}
      </div>

      {/* Hukum Breakdown + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Visual */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Distribusi Per Hukum</h2>
              <p className="text-slate-400 font-medium text-xs mt-0.5">Perbandingan data keluarga berdasarkan sistem hukum.</p>
            </div>
          </div>

          {/* Horizontal bar chart */}
          <div className="space-y-4">
            {hukumBreakdown.map((h, i) => {
              const pct = Math.round((h.count / totalForChart) * 100);
              return (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{h.icon}</span>
                      <span className="font-bold text-slate-800 text-xs">{h.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-${h.color}-600 font-black text-xl tracking-tighter`}>{h.count}</span>
                      <span className="text-slate-400 text-[10px] font-bold">keluarga</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${h.color}-500 rounded-full transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{pct}% dari total</span>
                    <span className={`text-[9px] font-black text-${h.color}-500 uppercase tracking-widest`}>{h.calculated} dihitung</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donut-like summary */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
            {hukumBreakdown.map((h, i) => (
              <div key={i} className={`text-center p-3 rounded-xl bg-${h.color}-50/50 border border-${h.color}-100/50`}>
                <p className="text-xl mb-0.5">{h.icon}</p>
                <p className={`text-${h.color}-600 font-black text-base tracking-tighter`}>{h.count}</p>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Card */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden group flex flex-col justify-between border-2 border-slate-800">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-black text-white leading-tight tracking-tight">Engine Waris <span className="text-emerald-500">Multi-Hukum.</span></h2>
            <p className="text-slate-400 mt-4 font-medium leading-relaxed text-xs">Sistem kalkulasi waris yang mendukung Syariat Islam (Faraid), Adat Jawa (Sepikul Segendongan & Kum-kum Kupat), dan Perdata (KUHPerdata).</p>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-[11px] font-bold">Faraid — Aul, Radd, Gharrawain</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-400">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                <span className="text-[11px] font-bold">Adat Jawa — Sepikul & Kum-kum</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-400">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span className="text-[11px] font-bold">Perdata — 4 Golongan (Segera)</span>
              </div>
            </div>
          </div>
          <Link href="/admin/panduan" className="relative z-10 mt-8 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 w-full text-center">
            Pelajari Sistem
          </Link>
          <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
            <ShieldCheck size={140} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Aktifitas Terbaru</h2>
            <p className="text-slate-400 font-medium text-xs mt-0.5">Daftar keluarga yang baru saja diperbarui sistem.</p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
            <Clock size={20} />
          </div>
        </div>
        <div className="space-y-3">
          {lastActive.length > 0 ? lastActive.map((item, idx) => {
            const hukumColor = item.hukum === "Jawa" ? "amber" : item.hukum === "Perdata" ? "blue" : "emerald";
            const hukumLabel = item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : "Faraid";
            return (
              <Link href={`/admin/keluarga/${item.id}`} key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                <div className={`w-11 h-11 bg-${hukumColor}-100 text-${hukumColor}-600 rounded-xl flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform`}>
                  {item.nama.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm leading-tight">{item.nama}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-${hukumColor}-55 text-${hukumColor}-600 border border-${hukumColor}-100`}>{hukumLabel}</span>
                    <span className="text-xs text-slate-400 font-medium">Diperbarui {new Date(item.updatedAt).toLocaleTimeString('id-ID')}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.logKalkulasi ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {item.logKalkulasi ? 'Selesai' : 'Input'}
                </div>
              </Link>
            );
          }) : (
            <div className="py-12 text-center text-slate-200 font-black uppercase tracking-widest text-[10px]">Belum ada aktifitas database</div>
          )}
        </div>
      </div>
    </div>
  );
}
