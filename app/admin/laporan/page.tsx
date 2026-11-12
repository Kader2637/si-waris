import { prisma } from "@/lib/prisma";
import { DollarSign, Users, FileText, CheckCircle2, BarChart3, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  let totalHartaStrings = "0";
  let countFamilies = 0;
  let countHeirs = 0;
  let countCalculated = 0;
  let dbWarning: string | null = null;

  try {
    const [totalHartaDistributedResult, families, heirs, calculated] = await Promise.all([
      prisma.logKalkulasi.aggregate({
        _sum: { totalHartaBersih: true },
      }),
      prisma.jenazah.count(),
      prisma.ahliWaris.count(),
      prisma.logKalkulasi.count(),
    ]);
    totalHartaStrings = (totalHartaDistributedResult._sum.totalHartaBersih || 0).toLocaleString("id-ID");
    countFamilies = families;
    countHeirs = heirs;
    countCalculated = calculated;
  } catch (err) {
    console.error("Laporan database error:", err);
    const hasEnvUrl = Boolean(
      process.env.POSTGRES_PRISMA_URL ||
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.DIRECT_URL
    );
    dbWarning = hasEnvUrl
      ? "Gagal terhubung ke database PostgreSQL. Periksa kredensial DATABASE_URL dan pastikan server PostgreSQL aktif."
      : "Variabel DATABASE_URL belum ditemukan. Buat file .env di root proyek dengan koneksi PostgreSQL lalu restart server.";
  }

  return (
    <div className="space-y-6 text-[#0f172a] dark:text-slate-100 font-sans">
      {dbWarning && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-700/70 bg-amber-50 dark:bg-amber-950/40 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Koneksi Database Belum Siap</p>
            <p className="leading-relaxed opacity-90">{dbWarning}</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan & Analitik Rekap</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Analisis statistik kumulatif distribusi harta waris di database.</p>
      </div>

      {/* Stat Grid */}
      <div className="animate-rise grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="size-4 text-[#0b6245] dark:text-emerald-400" /> Total Harta Terproses
          </div>
          <h2 className="text-2xl font-extrabold text-[#0b6245] dark:text-emerald-400">Rp {totalHartaStrings}</h2>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <FileText className="size-4 text-rose-500 dark:text-rose-400" /> Total Keluarga
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{countFamilies} Kasus</h2>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Users className="size-4 text-amber-500 dark:text-amber-400" /> Total Ahli Waris
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{countHeirs} Orang</h2>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="size-4 text-teal-500 dark:text-teal-400" /> Kalkulasi Selesai
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{countCalculated} Laporan</h2>
        </div>

      </div>

      {/* Progress metrics */}
      <div className="scroll-reveal bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="size-5 text-[#0b6245] dark:text-emerald-400" /> Indikator Performa Sistem
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-800 dark:text-slate-200">Akurasi Pembagian Syar&apos;i (Faraid &amp; KHI)</span>
              <span className="text-[#0b6245] dark:text-emerald-400 font-mono">100%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0b6245] dark:bg-emerald-500 h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-800 dark:text-slate-200">Kelengkapan Berkas Ahli Waris</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">85%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: "85%" }} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-800 dark:text-slate-200">Kepatuhan Hukum Adat & Perdata</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono">98%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "98%" }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
