"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getKeluargaById, processFaraid } from "@/app/actions/waris";
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
    toast.success("Kalkulasi selesai!", { id: "calc" });
  };

  const downloadPDF = () => {
    if (!data || !data.logKalkulasi) return toast.error("Jalankan kalkulasi terlebih dahulu.");

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(20);
    doc.text("LAPORAN ARSIP PEMBAGIAN WARIS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Keluarga: ${data.nama} | Database ID: ${data.id.substring(0, 8)}`, 105, 27, { align: "center" });
    doc.line(20, 32, 190, 32);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${data.nama}`, 20, 42);
    doc.text(`NIK: ${data.nik || "-"}`, 20, 48);
    doc.text(`Jenis Kelamin: ${data.gender}`, 20, 54);
    doc.text(`Dasar Hukum: ${data.hukum === "Islam" ? "Hukum Islam (Faraid KHI)" : "Adat Jawa"}`, 20, 60);

    doc.text(`Harta Kotor: Rp ${data.hartaKotor.toLocaleString("id-ID")}`, 120, 42);
    doc.text(`Utang & Wasiat: Rp ${(data.utang + data.wasiat).toLocaleString("id-ID")}`, 120, 48);
    doc.text(`Harta Bersih: Rp ${data.logKalkulasi.totalHartaBersih.toLocaleString("id-ID")}`, 120, 54);

    autoTable(doc, {
      startY: 68,
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
      <div className="p-12 text-center text-slate-400 text-xs font-mono">
        <span className="inline-block size-6 border-2 border-[#0b6245] border-t-transparent rounded-full animate-spin me-2" />
        Memuat detail keluarga...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-rose-500 font-semibold text-sm">
        Data keluarga tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#0f172a] font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">{data.nama}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f4ee] text-[#0b6245]">
              {data.hukum}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            NIK: {data.nik || "-"} • Ditambahkan {new Date(data.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link 
            href="/admin/keluarga" 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all no-underline"
          >
            <ArrowLeft className="size-4" /> Kembali
          </Link>
          <button 
            onClick={downloadPDF} 
            disabled={!data.logKalkulasi}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-all cursor-pointer"
          >
            <FileDown className="size-4" /> Unduh PDF
          </button>
          <button 
            onClick={handleCalculate} 
            disabled={calculating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0b6245] hover:bg-[#084b34] shadow-xs transition-all cursor-pointer"
          >
            <Calculator className="size-4" /> {data.ahliWaris.some((h: any) => h.hasil) ? "Hitung Ulang" : "Mulai Kalkulasi"}
          </button>
        </div>
      </div>

      {/* 3 Summary Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Identitas Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#0b6245] font-bold text-xs uppercase tracking-wider">
            <User className="size-4" /> Identitas Pewaris
          </div>
          <div className="text-xs text-slate-600 pt-1 space-y-1">
            <div><span className="font-semibold text-slate-800">Nama:</span> {data.nama}</div>
            <div><span className="font-semibold text-slate-800">NIK:</span> {data.nik || "-"}</div>
            <div><span className="font-semibold text-slate-800">Jenis Kelamin:</span> {data.gender}</div>
            <div><span className="font-semibold text-slate-800">Meninggal Sebagai:</span> {data.keterangan || "-"}</div>
          </div>
        </div>

        {/* Keuangan Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <Wallet className="size-4" /> Ringkasan Keuangan
          </div>
          <div className="text-xs text-slate-600 pt-1 space-y-1">
            <div><span className="font-semibold text-slate-800">Harta Kotor:</span> Rp {data.hartaKotor.toLocaleString('id-ID')}</div>
            <div><span className="font-semibold text-slate-800">Utang:</span> Rp {data.utang.toLocaleString('id-ID')}</div>
            <div><span className="font-semibold text-slate-800">Wasiat:</span> Rp {data.wasiat.toLocaleString('id-ID')}</div>
            <div className="font-bold text-[#0b6245] pt-2 border-t border-slate-100">
              Harta Bersih: Rp {data.logKalkulasi?.totalHartaBersih ? data.logKalkulasi.totalHartaBersih.toLocaleString('id-ID') : (data.hartaKotor - data.utang - data.wasiat).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#0b6245] to-slate-900 text-white shadow-md space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="size-4" /> Status Kasus
          </div>
          <div className="text-lg font-bold">
            {data.hukum === "Jawa" 
              ? (data.logKalkulasi?.metodeAdat?.replace(/_/g, ' ') || "Belum Dihitung") 
              : (data.logKalkulasi?.statusAulRadd || "Normal")}
          </div>
          <p className="text-[11px] text-slate-300">
            {data.logKalkulasi ? "Kalkulasi berhasil disinkronkan dengan database." : "Tekan Mulai Kalkulasi untuk memproses."}
          </p>
        </div>

      </div>

      {/* Tabel Ahli Waris Detail */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Users className="size-5 text-[#0b6245]" /> Silsilah Ahli Waris ({data.ahliWaris.length})
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {["Semua", "Mewarisi", "Mahjub"].map(f => (
              <button 
                key={f}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterWaris === f ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => setFilterWaris(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px]">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Ahli Waris</th>
                <th className="px-4 py-3">Hubungan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Porsi</th>
                <th className="px-4 py-3">Nominal Rupiah</th>
                <th className="px-4 py-3">Alasan Hukum / KHI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.ahliWaris
                .filter((h: any) => filterWaris === "Semua" || (filterWaris === "Mewarisi" ? h.hasil?.status === "Mewarisi" : h.hasil?.status !== "Mewarisi"))
                .map((h: any, idx: number) => (
                  <tr key={idx} className={h.hasil?.status === "Mahjub" ? "bg-rose-50/40 text-slate-500" : "hover:bg-slate-50/80"}>
                    <td className="px-4 py-3.5 font-bold">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{h.nama || "-"}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {h.hubungan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        h.hasil?.status === "Mewarisi" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {h.hasil?.status || "Mahjub"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-white font-mono text-[11px] font-bold">
                        {h.hasil?.jatahPersen || "0%"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#0b6245]">
                      Rp {(h.hasil?.jatahNominal || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{h.hasil?.alasan || "Terhalang (Mahjub)."}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
