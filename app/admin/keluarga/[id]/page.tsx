"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { 
  Tag,
  Download,
  CheckCircle2,
  BadgeCheck,
  ShieldAlert,
  Users,
  Info,
  Scale,
  Zap,
  ArrowLeft,
  User,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getKeluargaById, processFaraid } from "@/app/actions/waris";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DetailKeluargaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterWaris, setFilterWaris] = useState("Semua");
  const [selectedHeir, setSelectedHeir] = useState<any>(null);
  const [hukum, setHukum] = useState<string>("Islam");

  useEffect(() => {
    if (data?.hukum) setHukum(data.hukum);
  }, [data]);

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
    await processFaraid(id);
    await fetchData();
    setCalculating(false);
  };

  const downloadPDF = () => {
    if (!data || !data.logKalkulasi) return alert("Kalkulasi harus dijalankan terlebih dahulu sebelum mengunduh laporan.");
    
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    
    doc.setFontSize(22);
    doc.text("LAPORAN RESMI PEMBAGIAN WARIS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Keluarga: ${data.nama} | Database ID: ${data.id.substring(0, 8)}`, 105, 28, { align: "center" });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.text("IDENTITAS PEWARIS", 20, 45);
    doc.setFontSize(10);
    doc.text(`Nama: ${data.nama}`, 20, 52);
    doc.text(`NIK: ${data.nik}`, 20, 57);
    doc.text(`Jenis Kelamin: ${data.gender}`, 20, 62);
    doc.text(`Meninggal Sebagai: ${data.keterangan || "-"}`, 20, 67);
    doc.text(`Dasar Hukum: ${data.hukum === "Islam" ? "Hukum Islam (Faraid)" : data.hukum === "Jawa" ? "Hukum Adat Jawa" : "Hukum Perdata"}`, 20, 72);
    
    // Dynamic Status display
    const displayStatus = data.hukum === "Jawa" 
      ? `Metode Adat: ${data.logKalkulasi.metodeAdat?.replace(/_/g, ' ') || 'Belum Ditentukan'}` 
      : `Status Kasus: ${data.logKalkulasi.statusAulRadd || "Normal"}`;
    doc.text(displayStatus, 20, 77);

    doc.text("RINGKASAN KEUANGAN", 130, 45);
    doc.text(`Harta Kotor: Rp ${data.hartaKotor.toLocaleString("id-ID")}`, 130, 52);
    doc.text(`Utang: Rp ${data.utang.toLocaleString("id-ID")}`, 130, 57);
    doc.text(`Wasiat: Rp ${data.wasiat.toLocaleString("id-ID")}`, 130, 62);
    doc.text(`Harta Bersih: Rp ${data.logKalkulasi.totalHartaBersih.toLocaleString("id-ID")}`, 130, 67);

    autoTable(doc, {
      startY: 85,
      head: [['NO', 'AHLI WARIS / HUBUNGAN', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'PENJELASAN HUKUM']],
      body: data.ahliWaris.map((h: any, i: number) => [
        { content: i + 1, styles: { fontStyle: 'bold' } },
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.hasil?.status || "Mahjub",
        h.hasil?.jatahPersen || "0%",
        `Rp ${(h.hasil?.jatahNominal || 0).toLocaleString("id-ID")}`,
        h.hasil?.alasan || "Terhalang (Mahjub) atau tidak memenuhi syarat waris."
      ]),
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', halign: 'center' },
      styles: { fontSize: 7, cellPadding: 4, valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 35, fontStyle: 'bold' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 35, fontStyle: 'bold', textColor: [5, 150, 105] },
        5: { cellWidth: 'auto' }
      },
      alternateRowStyles: { fillColor: [252, 252, 252] },
      didDrawPage: (d) => {
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("E-MAWARITS - DATABASE ARCHIVE REPORT", 20, 10);
        doc.text(date, 190, 10, { align: "right" });
        const ph = doc.internal.pageSize.getHeight();
        doc.text("Dokumen ini adalah arsip resmi dari database E-MAWARITS.", 105, ph - 15, { align: "center" });
        doc.text("Halaman " + doc.getNumberOfPages(), 105, ph - 10, { align: "center" });
      },
      margin: { top: 20, bottom: 25 }
    });

    doc.save(`arsip waris ${data.nama} - e mawarits.pdf`.toLowerCase());
  };

  const getProblemDescription = (status: string) => {
    if (data?.hukum === "Jawa") {
      const metode = data.logKalkulasi?.metodeAdat;
      if (metode === "SEPIKUL_SEGENDONGAN") {
        return "Alasan Pemilihan Metode (Sepikul Segendongan): Diterapkan karena musyawarah keluarga sepakat memakai tradisi proporsional Jawa asli. Laki-laki memikul beban tanggung jawab yang lebih berat sehingga mendapat 2 porsi, sedangkan perempuan menggendong sehingga mendapat 1 porsi.";
      } else if (metode === "KUM_KUM_KUPAT") {
        return "Alasan Pemilihan Metode (Kum-Kum Kupat): Diterapkan karena musyawarah keluarga sepakat untuk mengesampingkan perbedaan gender demi asas kerukunan 'mangan ora mangan kumpul'. Semua harta keturunan dibagi sama rata (1:1) untuk mencegah konflik.";
      }
      return data.ahliWaris.some((h: any) => h.hasil) 
        ? `Sesuai Hukum Adat Jawa (${metode?.replace(/_/g, ' ') || '-'}).`
        : "Sesuai Hukum Adat Jawa: Tekan tombol kalkulasi untuk memulai perhitungan berbasis kesepakatan adat.";
    }

    switch (status) {
      case "Gharrawain":
        return "Alasan Terdeteksi (Gharrawain): Terjadi karena susunan ahli waris yang tersisa HANYA terdiri dari Suami/Istri, Ibu, dan Bapak. Aturan khusus ijtihad Umar bin Khattab ra. diaktifkan agar porsi Bapak tetap 2x lipat dari porsi Ibu (Ibu mendapat 1/3 dari SISA harta).";
      case "Aul":
        return "Alasan Terdeteksi (Aul): Terjadi karena total persentase hak pasti (Furud) dari para ahli waris MELEBIHI 100% dari total harta. Sistem otomatis menaikkan angka penyebut secara proporsional agar harta tidak minus dan semua pihak tetap terakomodasi.";
      case "Radd":
        return "Alasan Terdeteksi (Radd): Terjadi karena masih ADA SISA harta setelah dibagikan, namun TIDAK ADA ahli waris jalur laki-laki (Ashabah) yang hidup untuk mengambilnya. Sisa tersebut dikembalikan (di-radd) proporsional kepada ahli waris yang ada selain suami/istri.";
      case "Normal":
        return "Alasan Terdeteksi (Normal): Perhitungan berjalan mulus tanpa kendala. Hal ini karena total jatah ahli waris pas 100%, atau sisa harta langsung terdistribusi habis kepada ahli waris Ashabah (penerima sisa).";
      default:
        return "Sesuai Kaidah Faraid: Tekan tombol kalkulasi untuk mendeteksi status dan melihat hasil pembagian syar'i.";
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest text-sm">Sinkronisasi Database...</div>;
  if (!data) return <div className="p-20 text-center font-bold text-red-400">Data Keluarga tidak ditemukan.</div>;

  const isJawa = data.hukum === "Jawa";
  const theme = isJawa 
    ? { primary: "amber", bg: "bg-amber-600", text: "text-amber-600", border: "border-amber-500", light: "bg-amber-50", shadow: "shadow-amber-200" }
    : { primary: "emerald", bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-500", light: "bg-emerald-50", shadow: "shadow-emerald-200" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-6">
          <Link href="/admin/keluarga" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{data.nama}</h1>
            <p className="text-slate-500 font-medium">Verified NIK: {data.nik} • Ditambahkan {new Date(data.createdAt).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">Sistem Hukum Terpilih</label>
            <div className="flex gap-2">
              {[
                { id: "Islam", label: "Islam" },
                { id: "Jawa", label: "Adat Jawa" },
                { id: "Perdata", label: "Perdata" },
              ].map(h => {
                const isSelectedLaw = data.hukum === h.id || (h.id === "Islam" && !data.hukum);
                return (
                  <button 
                    key={h.id}
                    disabled={!isSelectedLaw}
                    className={`px-4 py-3 rounded-xl font-bold text-[11px] transition-all flex items-center gap-2 whitespace-nowrap ${
                      isSelectedLaw
                        ? "bg-slate-900 text-white shadow-lg cursor-default" 
                        : "bg-slate-50 text-slate-200 border border-slate-50 cursor-not-allowed opacity-40"
                    }`}
                  >
                    {h.label}
                    {h.id === "Perdata" && <span className="text-[8px] opacity-50 italic">Soon</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={downloadPDF} disabled={!data.logKalkulasi} className="p-5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 shadow-lg">
                <Download size={20} />
             </button>
             <button onClick={handleCalculate} disabled={calculating} className={`flex items-center justify-center gap-3 px-10 py-5 ${theme.bg} text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-xl ${theme.shadow} active:scale-95 disabled:opacity-50`}>
                {calculating ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Zap size={20} fill="currentColor" />}
                <span>{data.ahliWaris.some((h: any) => h.hasil) ? "Kalkulasi Ulang" : "Mulai Kalkulasi"}</span>
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`p-8 rounded-[2.5rem] border shadow-2xl transition-all ${data.ahliWaris.some((h: any) => h.hasil) ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-100'}`}>
             <div className={`flex items-center gap-3 mb-6 font-black uppercase text-xs tracking-widest ${theme.text}`}>
                <Scale size={18} />
                <span>{data.hukum === "Jawa" ? "Kategori Masalah Adat" : "Kategori Masalah Syariat"}</span>
             </div>
             <div>
                <h3 className="text-3xl font-black mb-3">
                  {data?.hukum === "Jawa" 
                    ? (data.logKalkulasi?.metodeAdat === "SEPIKUL_SEGENDONGAN" ? "Sepikul Segendongan" : data.logKalkulasi?.metodeAdat === "KUM_KUM_KUPAT" ? "Kum-Kum Kupat" : "Belum Dikalkulasi") 
                    : (data.logKalkulasi?.statusAulRadd || "Normal")}
                </h3>
                <p className="text-sm font-medium leading-relaxed opacity-70">
                   {getProblemDescription(data.logKalkulasi?.statusAulRadd)}
                </p>
             </div>
          </motion.div>

          {/* Profil Almarhum */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden relative border-b-8 ${theme.border}`}>
            <div className={`relative z-10 flex items-center gap-3 mb-8 ${theme.text} font-black uppercase text-xs tracking-widest`}>
              <User size={16} strokeWidth={3} />
              <span>Identitas Jenazah</span>
            </div>
            <div className="relative z-10 space-y-6">
               <div className="bg-slate-50 p-6 rounded-3xl">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                     <Tag size={12} /> Status / Peran
                  </div>
                  <p className="font-black text-slate-900 text-lg leading-snug">Meninggal sebagai {data.keterangan || "-"}</p>
               </div>
               <div className="flex justify-between items-center px-4">
                 <span className="text-slate-400 font-bold text-[10px] uppercase">Gender</span>
                 <span className="font-black text-slate-800">{data.gender}</span>
               </div>
               <div className="flex justify-between items-center px-4">
                 <span className="text-slate-400 font-bold text-[10px] uppercase whitespace-nowrap">Waktu Wafat</span>
                 <span className="font-black text-slate-800 text-right">
                   {data.tanggalWafat ? new Date(data.tanggalWafat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                 </span>
               </div>
                <div className="pt-6 border-t border-slate-50">
                   <div className={`${theme.light} p-6 rounded-[2rem] ${theme.text}`}>
                     <p className="font-bold text-[10px] uppercase tracking-widest mb-1">Total Aset (Mirkah)</p>
                     <p className="font-black text-2xl">Rp {data.hartaKotor.toLocaleString('id-ID')}</p>
                   </div>
                </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           {/* Section Ringkasan */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3 font-black uppercase text-xs tracking-widest text-slate-400">
                  <Users size={18} />
                  <span>Daftar Ahli Waris & Porsi Final</span>
                </div>
                <div className="flex gap-2">
                   {["Semua", "Mewarisi", "Mahjub"].map(f => (
                     <button key={f} onClick={() => setFilterWaris(f)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterWaris === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                        {f}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.ahliWaris
                  .filter((h: any) => filterWaris === "Semua" || (filterWaris === "Mewarisi" ? h.hasil?.status === "Mewarisi" : h.hasil?.status !== "Mewarisi"))
                  .map((h: any, i: number) => (
                  <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedHeir(h)}
                    className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-lg tracking-tight">{h.nama}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.hubungan}</p>
                      </div>
                      <span className={`text-[8px] font-black px-2 py-1 rounded-md border uppercase tracking-widest ${h.hasil?.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                        {h.hasil?.status || "Belum Dihitung"}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-slate-200/50">
                       <div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Porsi</p>
                         <p className="text-xl font-black text-slate-900">{h.hasil?.jatahPersen || "0%"}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Nominal</p>
                         <p className="text-sm font-black text-emerald-600">Rp {(h.hasil?.jatahNominal || 0).toLocaleString('id-ID')}</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedHeir && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
            onClick={() => setSelectedHeir(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-12">
                <div className="flex items-center gap-6 mb-10">
                  <div className={`w-20 h-20 ${theme.light} rounded-[2rem] flex items-center justify-center ${theme.text} shadow-inner`}>
                    <Scale size={40} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedHeir.nama}</h2>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">{selectedHeir.hubungan}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-8 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BadgeCheck size={16} className={theme.text} /> Analisis Hukum Keputusan
                  </p>
                  <p className="text-slate-700 font-medium leading-relaxed text-base">{selectedHeir.hasil?.alasan || "Detail perhitungan belum tersedia. Silakan jalankan kalkulasi terlebih dahulu."}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Porsi Final</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{selectedHeir.hasil?.jatahPersen || "0%"}</p>
                  </div>
                  <div className={`p-8 ${theme.light} border ${theme.border}/20 rounded-[2rem] shadow-sm text-center`}>
                    <p className={`text-[10px] font-black ${theme.text} uppercase tracking-widest mb-2`}>Nominal IDR</p>
                    <p className={`text-2xl font-black ${theme.text} tracking-tighter`}>Rp {(selectedHeir.hasil?.jatahNominal || 0).toLocaleString('id-ID')}</p>
                  </div>
                </div>
                
                <button onClick={() => setSelectedHeir(null)}
                  className="mt-10 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl">
                  Tutup Detail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
