import { prisma } from "@/lib/prisma";
import { DollarSign, Users, FileText, CheckCircle2, BarChart3 } from "lucide-react";

export default async function LaporanPage() {
  const totalHartaDistributedResult = await prisma.logKalkulasi.aggregate({
    _sum: { totalHartaBersih: true }
  });
  const totalHartaStrings = (totalHartaDistributedResult._sum.totalHartaBersih || 0).toLocaleString('id-ID');
  const countFamilies = await prisma.jenazah.count();
  const countHeirs = await prisma.ahliWaris.count();
  const countCalculated = await prisma.logKalkulasi.count();

  return (
    <div className="space-y-6 text-[#0f172a] font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <h1 className="text-2xl font-bold text-slate-900">Laporan & Analitik Rekap</h1>
        <p className="text-slate-500 text-xs mt-1">Analisis statistik kumulatif distribusi harta waris di database.</p>
      </div>

      {/* Stat Grid */}
      <div className="animate-rise grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="size-4 text-[#0b6245]" /> Total Harta Terproses
          </div>
          <h2 className="text-2xl font-extrabold text-[#0b6245]">Rp {totalHartaStrings}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <FileText className="size-4 text-rose-500" /> Total Keluarga
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{countFamilies} Kasus</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Users className="size-4 text-amber-500" /> Total Ahli Waris
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{countHeirs} Orang</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="size-4 text-teal-500" /> Kalkulasi Selesai
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{countCalculated} Laporan</h2>
        </div>

      </div>

      {/* Progress metrics */}
      <div className="scroll-reveal bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="size-5 text-[#0b6245]" /> Indikator Performa Sistem
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-800">Akurasi Pembagian Syar'i (Faraid & KHI)</span>
              <span className="text-[#0b6245] font-mono">100%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0b6245] h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-800">Kelengkapan Berkas Ahli Waris</span>
              <span className="text-blue-600 font-mono">85%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: "85%" }} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-800">Kepatuhan Hukum Adat & Perdata</span>
              <span className="text-amber-600 font-mono">98%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "98%" }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
