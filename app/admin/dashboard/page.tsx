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
} from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; range?: string }>;
}) {
  const { tab = "semua", range = "semua" } = await searchParams;

  // Build date filter clause based on URL searchParam "range"
  let dateFilter: any = {};
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

  // Fetch real aggregated metrics dynamically filtered by range
  const totalJenazah = await prisma.jenazah.count({ where: whereClause });
  const totalWaris = await prisma.ahliWaris.count({
    where: range !== "semua" ? { jenazah: { createdAt: dateFilter } } : {},
  });
  const totalCalculated = await prisma.logKalkulasi.count({
    where: range !== "semua" ? { createdAt: dateFilter } : {},
  });

  const totalIslam = await prisma.jenazah.count({ where: { ...whereClause, hukum: "Islam" } });
  const totalJawa = await prisma.jenazah.count({ where: { ...whereClause, hukum: "Jawa" } });
  const totalPerdata = await prisma.jenazah.count({ where: { ...whereClause, hukum: "Perdata" } });

  // Sum of net assets distributed
  const totalHartaDistributedResult = await prisma.logKalkulasi.aggregate({
    _sum: { totalHartaBersih: true },
    where: range !== "semua" ? { createdAt: dateFilter } : {},
  });
  
  // Sum of total gross assets across all cases
  const totalHartaKotorResult = await prisma.jenazah.aggregate({
    _sum: { hartaKotor: true },
    where: whereClause,
  });

  const totalHartaValue = totalHartaDistributedResult._sum.totalHartaBersih || totalHartaKotorResult._sum.hartaKotor || 0;
  const totalHartaFormatted = totalHartaValue.toLocaleString("id-ID");

  // Calculate system distribution percentages dynamically
  const pctIslam = totalJenazah > 0 ? Math.round((totalIslam / totalJenazah) * 100) : 0;
  const pctPerdata = totalJenazah > 0 ? Math.round((totalPerdata / totalJenazah) * 100) : 0;
  const pctJawa = totalJenazah > 0 ? Math.round((totalJawa / totalJenazah) * 100) : 0;

  // Build table query based on URL searchParam "tab"
  let tableWhereClause: any = { ...whereClause };
  if (tab === "realtime") {
    tableWhereClause.logKalkulasi = { isNot: null };
  }

  // Real recent cases table filtered dynamically
  const lastActive = await prisma.jenazah.findMany({
    take: tab === "terbaru" ? 3 : 6,
    where: tableWhereClause,
    orderBy: { updatedAt: "desc" },
    include: { logKalkulasi: true, hasilWaris: true },
  });

  // Calculate day-by-day distribution for bar chart (Last 7 days)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayStats = await Promise.all(
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
        count: count,
        isToday: daysAgo === 0,
      };
    })
  );

  const maxDayCount = Math.max(...dayStats.map((s) => s.count), 1);

  return (
    <div className="space-y-8 text-[#0f172a] font-sans">
      
      {/* FULLY INTERACTIVE HEADER TABS & FILTER WITH URL SEARCHPARAMS */}
      <DashboardHeaderFilter />

      {/* TOP 4 METRIC CARDS (SCROLL REVEAL ANIMATED & DYNAMICALLY FILTERED) */}
      <div className="animate-rise grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Kasus Waris */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-rose-50 text-rose-500">
              <FileText className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500">Total Kasus Waris</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{totalJenazah}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="size-3" /> {range !== "semua" ? range : "Real-time"}
            </span>
          </div>
        </div>

        {/* Card 2: Total Ahli Waris */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-amber-50 text-amber-600">
              <Users className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500">Total Ahli Waris</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{totalWaris}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="size-3" /> Terdaftar
            </span>
          </div>
        </div>

        {/* Card 3: Total Harta Terhitung */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <DollarSign className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500">Harta Terhitung</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-slate-900 truncate">Rp {totalHartaFormatted}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Net Asset
            </span>
          </div>
        </div>

        {/* Card 4: Laporan Valid */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-teal-50 text-teal-600">
              <CheckCircle2 className="size-5" />
            </span>
            <span className="text-xs font-medium text-slate-500">Laporan Selesai</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{totalCalculated}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              100% Valid
            </span>
          </div>
        </div>

      </div>

      {/* CHARTS SECTION (SCROLL REVEAL ANIMATED) */}
      <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Bar Chart (7 Days Dynamic) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Aktivitas Kasus 7 Hari Terakhir</h2>
              <p className="text-xs text-slate-400">Hover atau klik batang grafik untuk melihat statistik per hari</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
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
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Distribusi Sistem Hukum</h2>
              <p className="text-xs text-slate-400">Persentase Kasus Berdasarkan Hukum</p>
            </div>
            <span className="text-xs font-semibold text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-4">
            {/* Islam */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">Hukum Islam (Faraidh)</span>
                <span className="text-[#0b6245] font-mono">{pctIslam}% ({totalIslam} kasus)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0b6245] rounded-full transition-all duration-500"
                  style={{ width: `${pctIslam}%` }}
                />
              </div>
            </div>

            {/* Perdata */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">KUHPerdata (BW)</span>
                <span className="text-blue-600 font-mono">{pctPerdata}% ({totalPerdata} kasus)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${pctPerdata}%` }}
                />
              </div>
            </div>

            {/* Adat Jawa */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">Hukum Adat Jawa</span>
                <span className="text-amber-600 font-mono">{pctJawa}% ({totalJawa} kasus)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
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
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Kasus Waris ({tab === "terbaru" ? "Terbaru" : tab === "realtime" ? "Selesai Dihitung" : "Semua"})
              </h2>
              <p className="text-xs text-slate-400">
                Data real terfilter berdasarkan filter ({range === "semua" ? "Semua Waktu" : range})
              </p>
            </div>
            <Link href="/admin/keluarga" className="text-xs font-semibold text-blue-600 hover:underline">
              Lihat semua
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Nama Pewaris</th>
                  <th className="px-4 py-3">Sistem Hukum</th>
                  <th className="px-4 py-3">Waktu Update</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lastActive.length > 0 ? (
                  lastActive.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-900 block">{item.nama}</span>
                        <span className="text-[11px] text-slate-400 font-mono">NIK: {item.nik || "-"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : "Faraidh Islam"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                        {new Date(item.updatedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.logKalkulasi || item.hasilWaris?.length > 0
                            ? "bg-[#e6f4ee] text-[#0b6245]"
                            : "bg-slate-100 text-slate-600"
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
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
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
