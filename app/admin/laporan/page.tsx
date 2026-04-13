import { prisma } from "@/lib/prisma";
import { PieChart, Download, Calendar, BarChart3, TrendingUp, Users, Wallet } from "lucide-react";

export default async function LaporanPage() {
  const totalHartaDistributedResult = await prisma.logKalkulasi.aggregate({
    _sum: { totalHartaBersih: true }
  });
  const totalHartaStrings = (totalHartaDistributedResult._sum.totalHartaBersih || 0).toLocaleString('id-ID');
  const countFamilies = await prisma.jenazah.count();
  const countHeirs = await prisma.ahliWaris.count();
  const countCalculated = await prisma.logKalkulasi.count();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Laporan & Analitik</h1>
        <p className="text-slate-500 mt-2 font-medium">Analisis kumulatif distribusi harta waris di seluruh basis data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[
          { label: "Total Asset", value: `Rp ${totalHartaStrings}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Keluarga", value: countFamilies, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Ahli Waris", value: countHeirs, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Kalkulasi", value: countCalculated, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:-translate-y-1 transition-all">
             <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
                <item.icon size={28} />
             </div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
             <h4 className="text-xl font-black text-slate-800 tracking-tighter">{item.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Performa Distribusi</h3>
              <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Download size={20} /></button>
           </div>
           
           <div className="space-y-8">
              {[
                { label: "Akurasi Syar'i", percent: "100%", color: "bg-emerald-500" },
                { label: "Kelengkapan Berkas", percent: "85%", color: "bg-blue-500" },
                { label: "Kepatuhan Hukum", percent: "98%", color: "bg-amber-500" },
              ].map((bar, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                      <span>{bar.label}</span>
                      <span className="text-slate-900">{bar.percent}</span>
                   </div>
                   <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`${bar.color} h-full rounded-full transition-all duration-1000`} style={{ width: bar.percent }} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <h3 className="text-2xl font-black text-white tracking-tight">Unduh Laporan Tahunan</h3>
              <p className="text-slate-400 mt-4 font-medium">Dapatkan ringkasan PDF lengkap untuk audit Baitul Maal.</p>
              <button className="mt-10 w-full py-5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition shadow-xl shadow-emerald-500/20 active:scale-95">
                 Generate Reports (.PDF)
              </button>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-5 text-white">
              <PieChart size={200} />
           </div>
        </div>
      </div>
    </div>
  );
}
