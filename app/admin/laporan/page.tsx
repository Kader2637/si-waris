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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Laporan & Analitik</h1>
        <p className="text-slate-500 mt-1 font-medium text-xs">Analisis kumulatif distribusi harta waris di seluruh basis data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[
          { label: "Total Asset", value: `Rp ${totalHartaStrings}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Keluarga", value: countFamilies, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Ahli Waris", value: countHeirs, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Kalkulasi", value: countCalculated, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 group hover:-translate-y-1 transition-all">
             <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-inner`}>
                <item.icon size={20} />
             </div>
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
             <h4 className="text-lg font-black text-slate-800 tracking-tighter">{item.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/20">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Performa Distribusi</h3>
              <button className="p-2.5 bg-slate-50 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Download size={16} /></button>
           </div>
           
           <div className="space-y-6">
              {[
                { label: "Akurasi Syar'i", percent: "100%", color: "bg-emerald-500" },
                { label: "Kelengkapan Berkas", percent: "85%", color: "bg-blue-500" },
                { label: "Kepatuhan Hukum", percent: "98%", color: "bg-amber-500" },
              ].map((bar, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{bar.label}</span>
                      <span className="text-slate-900">{bar.percent}</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`${bar.color} h-full rounded-full transition-all duration-1000`} style={{ width: bar.percent }} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
           <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                 <h3 className="text-lg font-black text-white tracking-tight">Unduh Laporan Tahunan</h3>
                 <p className="text-slate-450 mt-2 font-medium text-xs">Dapatkan ringkasan PDF lengkap untuk audit Baitul Maal.</p>
              </div>
              <button className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 active:scale-95">
                 Generate Reports (.PDF)
              </button>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-5 text-white pointer-events-none">
              <PieChart size={140} />
           </div>
        </div>
      </div>
    </div>
  );
}
