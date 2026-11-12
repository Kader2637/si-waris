"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getKeluargaById, processFaraid } from "@/app/actions/waris";
import InteractiveChart from "@/components/InteractiveChart";
import AudioExplanation from "@/components/AudioExplanation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileDown,
  Calculator,
  User,
  Wallet,
  ShieldCheck,
  Users,
  Sparkles,
  PieChart,
  Scale,
  Calendar,
  CreditCard,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function DetailKeluargaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterWaris, setFilterWaris] = useState("Semua");

  const fetchData = async () => {
    setLoading(true);
    const result = await getKeluargaById(id);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCalculate = async () => {
    setCalculating(true);
    toast.loading("Memproses kalkulasi waris...", { id: "calc" });
    await processFaraid(id);
    await fetchData();
    setCalculating(false);
    toast.success("Kalkulasi selesai & berhasil disimpan!", { id: "calc" });
  };

  const downloadPDF = () => {
    if (!data || !data.logKalkulasi) return toast.error("Jalankan kalkulasi terlebih dahulu.");

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text("LAPORAN ARSIP PEMBAGIAN WARIS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Keluarga: ${data.nama} | ID Registrasi: ${data.id.substring(0, 8)}`, 105, 26, { align: "center" });
    doc.line(20, 30, 190, 30);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${data.nama}`, 20, 40);
    doc.text(`NIK: ${data.nik || "-"}`, 20, 46);
    doc.text(`Jenis Kelamin: ${data.gender}`, 20, 52);
    doc.text(`Sistem Hukum: ${data.hukum === "Islam" ? "Hukum Islam (Faraid KHI)" : data.hukum === "Perdata" ? "Hukum Perdata (BW)" : "Adat Jawa"}`, 20, 58);

    doc.text(`Harta Kotor: Rp ${data.hartaKotor.toLocaleString("id-ID")}`, 120, 40);
    doc.text(`Utang & Wasiat: Rp ${(data.utang + data.wasiat).toLocaleString("id-ID")}`, 120, 46);
    doc.text(`Harta Bersih: Rp ${data.logKalkulasi.totalHartaBersih.toLocaleString("id-ID")}`, 120, 52);

    autoTable(doc, {
      startY: 66,
      head: [['NO', 'AHLI WARIS', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'ALASAN HUKUM']],
      body: data.ahliWaris.map((h: any, i: number) => [
        i + 1,
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.hasil?.status || "Mahjub",
        h.hasil?.jatahPersen || "0%",
        `Rp ${(h.hasil?.jatahNominal || 0).toLocaleString("id-ID")}`,
        h.hasil?.alasan || "Terhalang (Mahjub)."
      ]),
      headStyles: { fillColor: [11, 98, 69], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`arsip-waris-${data.nama}.pdf`);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xs font-mono space-y-3">
        <span className="inline-block size-8 border-3 border-[#0b6245] dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p>Memuat detail keluarga & hasil kalkulasi...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-rose-500 dark:text-rose-400 font-semibold text-sm bg-white dark:bg-[#131b2b] rounded-2xl border border-rose-200 dark:border-rose-800/60">
        Data keluarga tidak ditemukan di database.
      </div>
    );
  }

  const hartaBersih = data.logKalkulasi?.totalHartaBersih || Math.max(0, data.hartaKotor - data.utang - data.wasiat);

  const chartData = data.ahliWaris
    .filter((h: any) => h.hasil?.status === "Mewarisi" && h.hasil?.jatahNominal > 0)
    .map((h: any) => ({
      nama: `${h.nama || h.hubungan} (${h.hubungan})`,
      jatahNominal: h.hasil.jatahNominal,
      jatahPersen: h.hasil.jatahPersen,
    }));

  const textVoice = `Berikut ringkasan kasus waris almarhum atau almarhumah ${data.nama}. Total harta peninggalan tercatat Rp ${data.hartaKotor.toLocaleString('id-ID')}. Setelah dikurangi kewajiban utang dan wasiat, harta bersih yang siap dibagikan berjumlah Rp ${hartaBersih.toLocaleString('id-ID')}. Perhitungan ini mengacu pada ${data.hukum === "Islam" ? "Faraidh Islam" : data.hukum === "Perdata" ? "Hukum Perdata KUHPerdata" : "Hukum Adat Jawa"}.`;

  return (
    <div className="space-y-6 text-[#0f172a] dark:text-slate-100 font-sans antialiased">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link 
          href="/admin/keluarga" 
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131b2b] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all no-underline shadow-2xs"
        >
          <ArrowLeft className="size-4" /> Kembali ke Kelola Data
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={downloadPDF} 
            disabled={!data.logKalkulasi}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-200 dark:border-rose-800/70 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25 disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
          >
            <FileDown className="size-4" /> Unduh Laporan PDF
          </button>
          <button 
            onClick={handleCalculate} 
            disabled={calculating}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0b6245] hover:bg-[#084b34] shadow-md transition-all cursor-pointer"
          >
            <Calculator className="size-4" /> {data.ahliWaris.some((h: any) => h.hasil) ? "Hitung Ulang Now" : "Jalankan Kalkulasi"}
          </button>
        </div>
      </div>

      {/* ULTRA PREMIUM HERO CASE BANNER */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a3a2a] to-[#0b6245] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Scale className="size-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-extrabold text-2xl shadow-inner shrink-0">
              {data.nama.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{data.nama}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase ${
                  data.hukum === "Jawa"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                    : data.hukum === "Perdata"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                }`}>
                  {data.hukum === "Jawa" ? "Adat Jawa" : data.hukum === "Perdata" ? "Hukum Perdata (BW)" : "Faraid Islam"}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 font-mono"><CreditCard className="size-3.5" /> NIK: {data.nik || "-"}</span>
                <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Wafat: {new Date(data.tanggalWafat || data.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><User className="size-3.5" /> Kelamin: {data.gender}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right space-y-1 shrink-0">
            <div className="text-[11px] uppercase tracking-widest text-slate-300 font-mono">Harta Bersih (Tirkah)</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-300">
              Rp {hartaBersih.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* AUDIO EXPLANATION ASSISTANT WIDGET */}
      <AudioExplanation
        title={`Ringkasan Audio Kasus Pewaris ${data.nama}`}
        badge="Ringkasan Audio Kasus"
        text={textVoice}
      />

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">Harta Kotor</span>
            <Wallet className="size-4 text-[#0b6245] dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            Rp {data.hartaKotor.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Total aset kotor peninggalan</p>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">Utang & Wasiat</span>
            <Building2 className="size-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            Rp {(data.utang + data.wasiat).toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Utang: Rp {data.utang.toLocaleString('id-ID')} | Wasiat: Rp {data.wasiat.toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">Harta Bersih</span>
            <Sparkles className="size-4 text-[#ca9a28] dark:text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-[#0b6245] dark:text-emerald-400 font-mono">
            Rp {hartaBersih.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Siap dibagi kepada ahli waris</p>
        </div>

        <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">Status Kalkulasi</span>
            <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {data.logKalkulasi?.statusAulRadd || "Normal"}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {data.logKalkulasi ? "Tersimpan di PostgreSQL DB" : "Draft (Belum dihitung)"}
          </p>
        </div>

      </div>

      {/* VISUAL CHART SECTION */}
      {chartData.length > 0 && (
        <InteractiveChart
          title={`Diagram Porsi Waris — ${data.nama}`}
          data={chartData}
        />
      )}

      {/* TABEL AHLI WARIS DETAIL */}
      <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <Users className="size-5 text-[#0b6245] dark:text-emerald-400" /> Silsilah & Pembagian Ahli Waris ({data.ahliWaris.length})
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Rincian status porsi, persentase, nominal rupiah, dan dasar hukum KHI / BW.</p>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 p-1 rounded-xl">
            {["Semua", "Mewarisi", "Mahjub"].map(f => (
              <button 
                key={f}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterWaris === f ? "bg-white dark:bg-[#131b2b] text-[#0b6245] dark:text-emerald-400 shadow-2xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                onClick={() => setFilterWaris(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">No</th>
                <th className="px-4 py-3.5">Nama Ahli Waris</th>
                <th className="px-4 py-3.5">Hubungan</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Porsi</th>
                <th className="px-4 py-3.5">Nominal Rupiah</th>
                <th className="px-4 py-3.5">Alasan Hukum / KHI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.ahliWaris
                .filter((h: any) => filterWaris === "Semua" || (filterWaris === "Mewarisi" ? h.hasil?.status === "Mewarisi" : h.hasil?.status !== "Mewarisi"))
                .map((h: any, idx: number) => (
                  <tr key={idx} className={h.hasil?.status === "Mahjub" || h.hasil?.status === "Terhijab" ? "bg-rose-50/40 dark:bg-rose-950/20 text-slate-500 dark:text-slate-400" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"}>
                    <td className="px-4 py-3.5 font-bold font-mono text-slate-500 dark:text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <strong className="text-slate-900 dark:text-white block font-semibold text-sm">{h.nama || "-"}</strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">NIK: {h.nik || "-"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {h.hubungan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        h.hasil?.status === "Mewarisi" ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300" : "bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300"
                      }`}>
                        {h.hasil?.status === "Mewarisi" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                        {h.hasil?.status || "Mahjub"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] font-mono text-xs font-bold text-slate-900 dark:text-slate-100 shadow-2xs">
                        {h.hasil?.jatahPersen || "0%"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-[#0b6245] dark:text-emerald-400 font-mono text-sm">
                      Rp {(h.hasil?.jatahNominal || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">{h.hasil?.alasan || "Terhalang (Mahjub)."}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
