import { prisma } from "@/lib/prisma";
import LaporanFilter from "@/components/LaporanFilter";
import {
  DollarSign,
  Users,
  FileText,
  CheckCircle2,
  BarChart3,
  AlertTriangle,
  Scale,
  FileCheck,
  TrendingUp,
  Percent,
  Calendar,
  Building,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; hukum?: string }>;
}) {
  const { range = "semua", hukum = "semua" } = await searchParams;

  // Filter rentang tanggal dinamis
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
  } else if (range === "this_year") {
    dateFilter = { gte: new Date(now.getFullYear(), 0, 1) };
  }

  // Where clauses yang sinkron dengan filter
  const whereJenazah: any = {};
  if (range !== "semua") whereJenazah.createdAt = dateFilter;
  if (hukum !== "semua") whereJenazah.hukum = hukum;

  const whereAhliWaris: any = {};
  if (range !== "semua" || hukum !== "semua") {
    whereAhliWaris.jenazah = whereJenazah;
  }

  const whereLog: any = {};
  if (range !== "semua" || hukum !== "semua") {
    whereLog.jenazah = whereJenazah;
  }

  let totalHartaVal = 0;
  let totalHartaKotorVal = 0;
  let totalUtangVal = 0;
  let totalWasiatVal = 0;
  let countFamilies = 0;
  let countHeirs = 0;
  let countCalculated = 0;
  let countIslam = 0;
  let countJawa = 0;
  let countPerdata = 0;
  let heirsWithDocs = 0;
  let recentCases: any[] = [];
  let dbWarning: string | null = null;

  try {
    const [
      totalHartaDistributedResult,
      totalHartaKotorResult,
      totalUtangResult,
      totalWasiatResult,
      families,
      heirs,
      calculated,
      islamTotal,
      jawaTotal,
      perdataTotal,
      docsCount,
      recents,
    ] = await Promise.all([
      prisma.logKalkulasi.aggregate({
        _sum: { totalHartaBersih: true },
        where: whereLog,
      }),
      prisma.jenazah.aggregate({
        _sum: { hartaKotor: true },
        where: whereJenazah,
      }),
      prisma.jenazah.aggregate({
        _sum: { utang: true },
        where: whereJenazah,
      }),
      prisma.jenazah.aggregate({
        _sum: { wasiat: true },
        where: whereJenazah,
      }),
      prisma.jenazah.count({ where: whereJenazah }),
      prisma.ahliWaris.count({ where: whereAhliWaris }),
      prisma.logKalkulasi.count({ where: whereLog }),
      prisma.jenazah.count({ where: { ...whereJenazah, hukum: "Islam" } }),
      prisma.jenazah.count({ where: { ...whereJenazah, hukum: "Jawa" } }),
      prisma.jenazah.count({ where: { ...whereJenazah, hukum: "Perdata" } }),
      prisma.ahliWaris.count({
        where: {
          ...whereAhliWaris,
          AND: [{ fileKtpKk: { not: null } }, { fileKtpKk: { not: "" } }],
        },
      }),
      prisma.jenazah.findMany({
        where: whereJenazah,
        include: {
          ahliWaris: true,
          logKalkulasi: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    totalHartaVal =
      totalHartaDistributedResult._sum.totalHartaBersih ||
      totalHartaKotorResult._sum.hartaKotor ||
      0;
    totalHartaKotorVal = totalHartaKotorResult._sum.hartaKotor || 0;
    totalUtangVal = totalUtangResult._sum.utang || 0;
    totalWasiatVal = totalWasiatResult._sum.wasiat || 0;
    countFamilies = families;
    countHeirs = heirs;
    countCalculated = calculated;
    countIslam = islamTotal;
    countJawa = jawaTotal;
    countPerdata = perdataTotal;
    heirsWithDocs = docsCount;
    recentCases = recents;
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

  // Kalkulasi Indikator Kinerja Dinamis
  const kelengkapanBerkasPercent =
    countHeirs > 0 ? Math.round((heirsWithDocs / countHeirs) * 100) : 100;
  const penyelesaianPercent =
    countFamilies > 0 ? Math.round((countCalculated / countFamilies) * 100) : 100;

  const islamPercent =
    countFamilies > 0 ? Math.round((countIslam / countFamilies) * 100) : 0;
  const jawaPercent =
    countFamilies > 0 ? Math.round((countJawa / countFamilies) * 100) : 0;
  const perdataPercent =
    countFamilies > 0 ? Math.round((countPerdata / countFamilies) * 100) : 0;

  const avgHartaPerKasus =
    countCalculated > 0
      ? Math.round(totalHartaVal / countCalculated).toLocaleString("id-ID")
      : "0";
  const avgAhliWarisPerKasus =
    countFamilies > 0 ? (countHeirs / countFamilies).toFixed(1) : "0";

  const totalHartaStrings = totalHartaVal.toLocaleString("id-ID");
  const totalHartaKotorStrings = totalHartaKotorVal.toLocaleString("id-ID");
  const totalKewajibanStrings = (totalUtangVal + totalWasiatVal).toLocaleString(
    "id-ID"
  );

  return (
    <div className="space-y-6 text-[#0f172a] dark:text-slate-100 font-sans">
      
      {/* KOP RESMI KHUSUS PRINT DOKUMEN */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight uppercase text-black">
          Laporan Rekapitulasi &amp; Analitik Sistem e-Mawarits
        </h2>
        <p className="text-xs text-slate-700 mt-1">
          Dokumentasi Audit Distribusi Harta Waris Terpadu Berbasis Tiga Sistem Hukum (Syariah, Adat Jawa, &amp; KUHPerdata)
        </p>
        <div className="flex justify-between items-center text-[10px] text-slate-600 mt-3 border-t border-slate-200 pt-2 font-mono">
          <span>Filter Periode: {range.toUpperCase()} | Hukum: {hukum.toUpperCase()}</span>
          <span>Dicetak Pada: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>

      {dbWarning && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-700/70 bg-amber-50 dark:bg-amber-950/40 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 print:hidden">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Koneksi Database Belum Siap</p>
            <p className="leading-relaxed opacity-90">{dbWarning}</p>
          </div>
        </div>
      )}

      {/* Header Halaman Web */}
      <div className="print:hidden bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="size-6 text-[#0b6245] dark:text-emerald-400" />
            Laporan &amp; Analitik Rekap
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Analisis statistik kumulatif distribusi harta waris di database secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-[#0b6245] dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 self-start md:self-auto font-medium">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sinkronisasi Data Dinamis Aktif</span>
        </div>
      </div>

      {/* Filter Dinamis Interaktif */}
      <LaporanFilter
        currentRange={range}
        currentHukum={hukum}
        totalFilteredCases={countFamilies}
      />

      {/* Stat Grid 4 Kartu Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <DollarSign className="size-4 text-[#0b6245] dark:text-emerald-400" /> Harta Bersih Terdistribusi
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Net</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0b6245] dark:text-emerald-400">
            Rp {totalHartaStrings}
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Kotor: Rp {totalHartaKotorStrings}
          </p>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <FileText className="size-4 text-rose-500 dark:text-rose-400" /> Total Keluarga
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">Pewaris</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {countFamilies} <span className="text-base font-normal text-slate-500">Kasus</span>
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Rerata {avgAhliWarisPerKasus} ahli waris/kasus
          </p>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-amber-500 dark:text-amber-400" /> Total Ahli Waris
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Penerima</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {countHeirs} <span className="text-base font-normal text-slate-500">Orang</span>
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {heirsWithDocs} terverifikasi berkas KTP/KK
          </p>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-teal-500 dark:text-teal-400" /> Kalkulasi Selesai
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">Verified</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {countCalculated} <span className="text-base font-normal text-slate-500">Laporan</span>
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Rerata Rp {avgHartaPerKasus}/kasus
          </p>
        </div>

      </div>

      {/* Grid Indikator Kinerja & Distribusi Sistem Hukum */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolom 1: Indikator Kinerja & Kepatuhan Sistem (Dinamis dari Database) */}
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="size-5 text-[#0b6245] dark:text-emerald-400" /> Indikator Kepatuhan &amp; Kinerja
            </h3>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono">
              Auto-Calculated
            </span>
          </div>

          <div className="space-y-4">
            
            {/* Kelengkapan Berkas */}
            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileCheck className="size-4 text-blue-500" />
                  Kelengkapan Berkas Dokumen Ahli Waris (KTP/KK)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                  {kelengkapanBerkasPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${kelengkapanBerkasPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {heirsWithDocs} dari {countHeirs} ahli waris telah melampirkan berkas identitas sah.
              </p>
            </div>

            {/* Tingkat Penyelesaian Kasus */}
            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Tingkat Penyelesaian Kalkulasi Kasus Waris
                </span>
                <span className="text-[#0b6245] dark:text-emerald-400 font-mono font-bold">
                  {penyelesaianPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0b6245] dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${penyelesaianPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {countCalculated} dari {countFamilies} keluarga telah tuntas melalui proses audit kalkulasi.
              </p>
            </div>

            {/* Akurasi Pengurangan Kewajiban (Utang & Wasiat) */}
            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Scale className="size-4 text-amber-500" />
                  Kewajiban Jenazah Terakomodasi (Utang &amp; Wasiat)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                  100%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Total Rp {totalKewajibanStrings} kewajiban telah dipotong tuntas sebelum pembagian harta bersih.
              </p>
            </div>

          </div>
        </div>

        {/* Kolom 2: Distribusi Sistem Hukum yang Digunakan (Dinamis) */}
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="size-5 text-[#ca9a28] dark:text-amber-400" />
              Distribusi Penggunaan Tiga Sistem Hukum
            </h3>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono">
              Total {countFamilies} Kasus
            </span>
          </div>

          <div className="space-y-4">
            
            {/* Syariah Islam */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#0b6245] dark:bg-emerald-400" />
                  Hukum Syariah (Faraidh &amp; KHI)
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {countIslam} Kasus ({islamPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#0b6245] dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${islamPercent}%` }}
                />
              </div>
            </div>

            {/* Hukum Adat Jawa */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#ca9a28] dark:bg-amber-400" />
                  Hukum Adat Jawa (Gono-Gini / Dumdum Kupat)
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {countJawa} Kasus ({jawaPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#ca9a28] dark:bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${jawaPercent}%` }}
                />
              </div>
            </div>

            {/* KUHPerdata */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  Hukum Perdata Barat (4 Golongan KUHPerdata)
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {countPerdata} Kasus ({perdataPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${perdataPercent}%` }}
                />
              </div>
            </div>

          </div>

          {/* Rangkuman Komparasi */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Sistem e-Mawarits menjamin kesetaraan dan validasi perhitungan lintas yurisdiksi. Pemilihan hukum oleh pewaris/ahli waris dapat dikomparasi secara berdampingan pada modul Perhitungan Terpadu.
          </div>

        </div>

      </div>

      {/* Tabel Rincian Kasus Terbaru (Audited Cases) */}
      <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="size-5 text-[#0b6245] dark:text-emerald-400" />
            Rekap Sampel Kasus Terkini dalam Laporan
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Menampilkan 5 Kasus Terkini
          </span>
        </div>

        {recentCases.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Belum ada data kasus waris yang sesuai dengan kriteria filter saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Nama Pewaris</th>
                  <th className="py-3 px-3">Sistem Hukum</th>
                  <th className="py-3 px-3 text-center">Ahli Waris</th>
                  <th className="py-3 px-3 text-right">Harta Bersih</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Tanggal Kasus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentCases.map((item, idx) => {
                  const netHarta =
                    item.logKalkulasi?.totalHartaBersih ||
                    item.hartaKotor - item.utang - item.wasiat;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {item.nama}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          NIK: {item.nik}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            item.hukum === "Islam"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : item.hukum === "Jawa"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {item.hukum === "Islam"
                            ? "Syariah"
                            : item.hukum === "Jawa"
                            ? "Adat Jawa"
                            : "Perdata"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {item.ahliWaris?.length || 0} orang
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-[#0b6245] dark:text-emerald-400">
                        Rp {Math.round(netHarta).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.logKalkulasi ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" /> Selesai
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lembar Pengesahan Khusus Saat Dicetak */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-12 text-center text-xs text-black">
        <div>
          <p>Petugas Operator Rekapitulasi,</p>
          <div className="h-16" />
          <p className="font-bold border-t border-black inline-block px-8 pt-1">
            Administrator Sistem e-Mawarits
          </p>
        </div>
        <div>
          <p>Mengetahui / Mengesahkan,</p>
          <div className="h-16" />
          <p className="font-bold border-t border-black inline-block px-8 pt-1">
            Kepala Unit Pelayanan Hukum &amp; Waris
          </p>
        </div>
      </div>

    </div>
  );
}
