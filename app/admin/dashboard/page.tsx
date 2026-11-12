import { prisma } from "@/lib/prisma";
import Link from "next/link";
import InteractiveChart from "@/components/InteractiveChart";
import DashboardHeaderFilter from "@/components/DashboardHeaderFilter";
import {
  FileText,
  Users,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; range?: string }>;
}) {
  const { tab = "semua", range = "semua" } = await searchParams;

  // Build date filter clause based on URL searchParam "range"
  let dateFilter: { gte?: Date } = {};
  const now = new Date();
  if (range === "today") {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFilter = { gte: startOfDay };
  } else if (range === "7days") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    dateFilter = { gte: d };
  } else if (range === "30days") {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    dateFilter = { gte: d };
  }

  const whereClause = range !== "semua" ? { createdAt: dateFilter } : {};
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let totalJenazah = 0;
  let totalWaris = 0;
  let totalCalculated = 0;
  let totalIslam = 0;
  let totalJawa = 0;
  let totalPerdata = 0;
  let totalHartaValue = 0;
  let lastActive: Awaited<ReturnType<typeof prisma.jenazah.findMany<{ include: { logKalkulasi: true; hasilWaris: true } }>>> = [];
  let dayStats = [6, 5, 4, 3, 2, 1, 0].map((daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return { day: daysOfWeek[d.getDay()], count: 0, isToday: daysAgo === 0 };
  });
  let dbWarning: string | null = null;

  try {
    // Fetch real aggregated metrics dynamically filtered by range
    const [
      jenazahCount,
      warisCount,
      calculatedCount,
      islamCount,
      jawaCount,
      perdataCount,
      totalHartaDistributedResult,
      totalHartaKotorResult,
    ] = await Promise.all([
      prisma.jenazah.count({ where: whereClause }),
      prisma.ahliWaris.count({
        where: range !== "semua" ? { jenazah: { createdAt: dateFilter } } : {},
      }),
      prisma.logKalkulasi.count({
        where: range !== "semua" ? { createdAt: dateFilter } : {},
      }),
      prisma.jenazah.count({ where: { ...whereClause, hukum: "Islam" } }),
      prisma.jenazah.count({ where: { ...whereClause, hukum: "Jawa" } }),
      prisma.jenazah.count({ where: { ...whereClause, hukum: "Perdata" } }),
      prisma.logKalkulasi.aggregate({
        _sum: { totalHartaBersih: true },
        where: range !== "semua" ? { createdAt: dateFilter } : {},
      }),
      prisma.jenazah.aggregate({
        _sum: { hartaKotor: true },
        where: whereClause,
      }),
    ]);

    totalJenazah = jenazahCount;
    totalWaris = warisCount;
    totalCalculated = calculatedCount;
    totalIslam = islamCount;
    totalJawa = jawaCount;
    totalPerdata = perdataCount;
    totalHartaValue =
      totalHartaDistributedResult._sum.totalHartaBersih ||
      totalHartaKotorResult._sum.hartaKotor ||
      0;

    // Build table query based on URL searchParam "tab"
    const tableWhereClause =
      tab === "realtime"
        ? { ...whereClause, logKalkulasi: { isNot: null } }
        : { ...whereClause };

    // Real recent cases table filtered dynamically
    lastActive = await prisma.jenazah.findMany({
      take: tab === "terbaru" ? 3 : 6,
      where: tableWhereClause,
      orderBy: { updatedAt: "desc" },
      include: { logKalkulasi: true, hasilWaris: true },
    });

    // Calculate day-by-day distribution for bar chart (Last 7 days)
    dayStats = await Promise.all(
      [6, 5, 4, 3, 2, 1, 0].map(async (daysAgo) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

        const count = await prisma.jenazah.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

        return {
          day: daysOfWeek[d.getDay()],
          count,
          isToday: daysAgo === 0,
        };
      })
    );
  } catch (err) {
    console.error("Dashboard database error:", err);
    const hasEnvUrl = Boolean(
      process.env.POSTGRES_PRISMA_URL ||
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.DIRECT_URL
    );
    dbWarning = hasEnvUrl
      ? "Gagal terhubung ke database PostgreSQL. Periksa kredensial DATABASE_URL dan pastikan server PostgreSQL sedang berjalan."
      : "Variabel DATABASE_URL belum ditemukan. Buat file .env di root proyek dengan koneksi PostgreSQL (contoh: DATABASE_URL=\"postgresql://user:password@localhost:5432/si_waris\") lalu restart server.";
  }

  const totalHartaFormatted = totalHartaValue.toLocaleString("id-ID");

  // Calculate system distribution percentages dynamically
  const pctIslam = totalJenazah > 0 ? Math.round((totalIslam / totalJenazah) * 100) : 0;
  const pctPerdata = totalJenazah > 0 ? Math.round((totalPerdata / totalJenazah) * 100) : 0;
  const pctJawa = totalJenazah > 0 ? Math.round((totalJawa / totalJenazah) * 100) : 0;

  const maxDayCount = Math.max(...dayStats.map((s) => s.count), 1);

  return (
    <div className="space-y-8 text-[#0f172a] dark:text-slate-100 font-sans">
      {dbWarning && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-700/70 bg-amber-50 dark:bg-amber-950/40 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Koneksi Database Belum Siap</p>
            <p className="leading-relaxed opacity-90">{dbWarning}</p>
          </div>
        </div>
      )}
      
      {/* FULLY INTERACTIVE HEADER TABS & FILTER WITH URL SEARCHPARAMS */}
      <DashboardHeaderFilter />

      {/* TOP 4 METRIC CARDS (SCROLL REVEAL ANIMATED & DYNAMICALLY FILTERED) */}
      <div className="animate-rise grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Kasus Waris */}
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-500 dark:text-rose-400">
              <FileText className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Kasus Waris</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalJenazah}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">
              <TrendingUp className="size-3" /> {range !== "semua" ? range : "Real-time"}
            </span>
          </div>
        </div>

        {/* Card 2: Total Ahli Waris */}
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Users className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Ahli Waris</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalWaris}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">
              <TrendingUp className="size-3" /> Terdaftar
            </span>
          </div>
        </div>

        {/* Card 3: Total Harta Terhitung */}
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Harta Terhitung</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white truncate">Rp {totalHartaFormatted}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full shrink-0">
              Net Asset
            </span>
          </div>
        </div>

        {/* Card 4: Laporan Valid */}
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Laporan Selesai</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalCalculated}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">
              100% Valid
            </span>
          </div>
        </div>

      </div>

      {/* CHARTS SECTION (SCROLL REVEAL ANIMATED) */}
      <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Bar Chart (7 Days Dynamic) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Aktivitas Kasus 7 Hari Terakhir</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400">Hover atau klik batang grafik untuk melihat statistik per hari</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 rounded-full">
              Interactive Chart
            </span>
          </div>

          {/* Interactive Chart Component */}
          <InteractiveChart
            dayStats={dayStats}
            maxDayCount={maxDayCount}
            totalJenazah={totalJenazah}
          />
        </div>

        {/* Right Distribution Breakdown (Real Percentages) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Distribusi Sistem Hukum</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400">Persentase Kasus Berdasarkan Hukum</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-4">
            {/* Islam */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">Hukum Islam (Faraidh)</span>
                <span className="text-[#0b6245] dark:text-emerald-400 font-mono">{pctIslam}% ({totalIslam} kasus)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0b6245] dark:bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${pctIslam}%` }}
                />
              </div>
            </div>

            {/* Perdata */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">KUHPerdata (BW)</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">{pctPerdata}% ({totalPerdata} kasus)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${pctPerdata}%` }}
                />
              </div>
            </div>

            {/* Adat Jawa */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">Hukum Adat Jawa</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">{pctJawa}% ({totalJawa} kasus)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${pctJawa}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION (SCROLL REVEAL ANIMATED) */}
      <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Real Cases Table */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Kasus Waris ({tab === "terbaru" ? "Terbaru" : tab === "realtime" ? "Selesai Dihitung" : "Semua"})
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400">
                Data real terfilter berdasarkan filter ({range === "semua" ? "Semua Waktu" : range})
              </p>
            </div>
            <Link href="/admin/keluarga" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Lihat semua
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Nama Pewaris</th>
                  <th className="px-4 py-3">Sistem Hukum</th>
                  <th className="px-4 py-3">Waktu Update</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lastActive.length > 0 ? (
                  lastActive.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-900 dark:text-white block">{item.nama}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">NIK: {item.nik || "-"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : "Faraidh Islam"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(item.updatedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.logKalkulasi || item.hasilWaris?.length > 0
                            ? "bg-[#e6f4ee] dark:bg-emerald-500/15 text-[#0b6245] dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}>
                          {item.logKalkulasi || item.hasilWaris?.length > 0 ? "Selesai" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/admin/keluarga/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#0b6245] text-white rounded-full text-[11px] font-medium no-underline hover:bg-[#084b34] transition-colors"
                        >
                          Detail <ArrowUpRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      Tidak ada data kasus yang memenuhi filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Quick Action & Enterprise Info */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-[#0b6245] via-[#094d36] to-slate-900 p-7 text-white flex flex-col justify-between relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 size-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-emerald-200 backdrop-blur-md">
              <Sparkles className="size-3.5 text-[#ca9a28]" /> Filter Terhubung Prisma
            </span>
            <h3 className="text-xl font-extrabold leading-snug">
              Metrik & Tabel Menyesuaikan Filter yang Anda Pilih
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Saat filter berubah, query Prisma akan memfilter rentang waktu dan status kalkulasi secara real-time.
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <Link
              href="/admin/keluarga/tambah"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-xl shadow-md transition-all no-underline"
            >
              + Input Kasus Baru
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
