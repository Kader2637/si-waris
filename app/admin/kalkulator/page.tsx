"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Zap,
  BadgeCheck,
  ShieldAlert,
  Info,
  Scale,
  ChevronDown,
  ArrowRight,
  Calculator,
  User,
  Wallet,
  Users,
  CheckCircle2,
  Sparkles,
  Download,
  Gavel,
  ArrowLeft
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";

const HUBUNGAN_OPTIONS = [
  "Suami", "Istri",
  "Anak Laki-laki", "Anak Perempuan",
  "Cucu Laki-laki", "Cucu Perempuan",
  "Ayah", "Ibu", "Kakek", "Nenek",
  "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung",
  "Saudara Laki-laki Seibu", "Saudara Perempuan Seibu",
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Normal: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  Aul: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  Radd: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  Gharrawain: { color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  "Sepikul Segendongan": { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  "Kum-Kum Kupat": { color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
};

const formatIDR = (val: string) => {
  const n = val.replace(/\D/g, "");
  return n ? new Intl.NumberFormat("id-ID").format(parseInt(n)) : "";
};
const parseNum = (v: string) => parseInt(v.replace(/\D/g, "")) || 0;

export default function KalkulatorPage() {
  const [namaJenazah, setNamaJenazah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);
  const [hasil, setHasil] = useState<any>(null);
  const [selectedHeir, setSelectedHeir] = useState<any>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [hukum, setHukum] = useState<string>("Islam");
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT">("SEPIKUL_SEGENDONGAN");
  const [potongGonoGini, setPotongGonoGini] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const addHeir = () => setAhliWaris([...ahliWaris, { nama: "", hubungan: "Anak Laki-laki" }]);
  const removeHeir = (i: number) => setAhliWaris(ahliWaris.filter((_, idx) => idx !== i));
  const updateHeir = (i: number, field: string, value: string) => {
    const arr = [...ahliWaris];
    arr[i] = { ...arr[i], [field]: value };
    setAhliWaris(arr);
  };

  const handleHitung = () => {
    const jenazah = { id: "temp", gender, hartaKotor: parseNum(harta), utang: parseNum(utang), wasiat: parseNum(wasiat), potongGonoGini };
    const warisList = ahliWaris.map((h, i) => ({ id: `heir-${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));

    if (hukum === "Jawa") {
      const result = calculateAdatJawa(jenazah, warisList, metodeAdat);
      setHasil({
        ...result,
        ahliWarisGetted: result.results,
        kpk: null,
        statusAulRadd: metodeAdat === "SEPIKUL_SEGENDONGAN" ? "Sepikul Segendongan" : "Kum-Kum Kupat"
      });
    } else {
      setHasil(calculateFaraid(jenazah as any, warisList as any));
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(22);
    doc.text("LAPORAN PEMBAGIAN WARIS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("E-MAWARITS | Sistem Informasi Waris Terpadu", 105, 28, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.text("DATA PEWARIS (ALMARHUM/AH)", 20, 45);
    doc.setFontSize(10);
    doc.text(`Nama: ${namaJenazah || "-"}`, 20, 52);
    doc.text(`Jenis Kelamin: ${gender}`, 20, 57);
    doc.text(`Dasar Hukum: ${hukum === "Islam" ? "Hukum Islam (Faraid)" : hukum === "Jawa" ? "Hukum Adat Jawa" : "Hukum Perdata"}`, 20, 62);

    // Dynamic Status display
    const displayStatus = hukum === "Jawa"
      ? `Metode Adat: ${hasil.statusAulRadd}`
      : `Status Kasus: ${hasil.statusAulRadd}`;
    doc.text(displayStatus, 20, 67);
    doc.text(`Tanggal Cetak: ${date}`, 20, 72);

    doc.text("RINGKASAN HARTA", 130, 45);
    doc.text(`Harta Kotor: Rp ${parseNum(harta).toLocaleString("id-ID")}`, 130, 52);
    doc.text(`Utang: Rp ${parseNum(utang).toLocaleString("id-ID")}`, 130, 57);
    doc.text(`Wasiat: Rp ${parseNum(wasiat).toLocaleString("id-ID")}`, 130, 62);
    doc.text(`Harta Bersih (Mirkah): Rp ${hasil.hartaBersih.toLocaleString("id-ID")}`, 130, 67);

    autoTable(doc, {
      startY: 85,
      head: [['NO', 'AHLI WARIS / HUBUNGAN', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'PENJELASAN HUKUM']],
      body: hasil.ahliWarisGetted.map((h: any, i: number) => [
        { content: i + 1, styles: { fontStyle: 'bold' } },
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.status,
        h.jatahPersen,
        `Rp ${h.jatahNominal.toLocaleString("id-ID")}`,
        h.alasan
      ]),
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        cellPadding: 5
      },
      styles: {
        fontSize: 7,
        cellPadding: 4,
        lineColor: [240, 240, 240],
        lineWidth: 0.1,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 35, fontStyle: 'bold' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 35, fontStyle: 'bold', textColor: [5, 150, 105] },
        5: { cellWidth: 'auto' }
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("LAPORAN RESMI PEMBAGIAN WARIS - E-MAWARITS v2.0", 20, 10);
        doc.text(date, 190, 10, { align: "right" });
        doc.setDrawColor(230, 230, 230);
        doc.line(20, 12, 190, 12);

        const str = "Halaman " + doc.getNumberOfPages();
        doc.setFontSize(7);
        doc.setTextColor(180);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.text("Dokumen ini dihasilkan secara otomatis oleh sistem E-MAWARITS. Nilai bersifat presisi berdasarkan data yang diinput.", 105, pageHeight - 15, { align: "center" });
        doc.text(str, 105, pageHeight - 10, { align: "center" });
      },
      margin: { top: 20, bottom: 25 }
    });

    const fileName = `pembagian waris keluarga ${namaJenazah || "tanpa nama"} - e mawarits.pdf`;
    doc.save(fileName.toLowerCase());
  };

  const hartaBersih = parseNum(harta) - parseNum(utang) - parseNum(wasiat);

  return (
    <div className="pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">

      {/* ── HEADER ── */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-3">
            <Sparkles size={12} className="animate-pulse" /> Simulation Engine v2.0
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Kalkulator Simulasi</h1>
          <p className="text-slate-400 mt-2 font-medium text-xs">Input parameter cepat untuk pengujian porsi waris.</p>
        </motion.div>
        {step === 2 && (
          <button onClick={() => setStep(1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95">
            <ArrowLeft size={16} /> Edit Parameter
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* ── LEFT COLUMN: INPUTS ── */}
              <div className="lg:col-span-8 space-y-6">

                {/* 1. SISTEM HUKUM */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                      <Scale size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">1. Sistem Hukum</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "Islam", label: "☪ Hukum Islam (Faraid)", active: true },
                      { id: "Jawa", label: "🏛 Hukum Adat Jawa", active: true },
                      { id: "Perdata", label: "⚖ Hukum Perdata", active: false },
                    ].map(h => (
                      <button key={h.id} onClick={() => h.active && setHukum(h.id)}
                        className={`relative p-4 rounded-xl font-bold text-xs text-left flex items-center justify-between border-2 transition-all ${hukum === h.id ? "bg-slate-900 text-white border-slate-900 shadow-xl" : h.active ? "bg-white text-slate-500 border-slate-100 hover:border-emerald-200" : "bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed"
                          }`}>
                        {h.label}
                        {!h.active && <span className="text-[8px] bg-slate-200 text-slate-400 px-1.5 py-0.5 rounded font-black">SOON</span>}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {hukum === "Jawa" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 pt-6 border-t border-slate-100 overflow-hidden">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Metode Adat Jawa</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: "SEPIKUL_SEGENDONGAN", l: "Sepikul Segendongan", d: "Rasio 2:1 (L:P)" },
                            { id: "KUM_KUM_KUPAT", l: "Kum-Kum Kupat", d: "Sama Rata 1:1" }
                          ].map(m => (
                            <button key={m.id} onClick={() => setMetodeAdat(m.id as any)}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${metodeAdat === m.id ? "bg-orange-50 border-orange-500 text-orange-900" : "bg-white border-slate-100 text-slate-400"}`}>
                              <p className="font-black text-sm">{m.l}</p>
                              <p className="text-[10px] font-bold mt-1 opacity-70">{m.d}</p>
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div>
                            <p className="font-black text-xs text-slate-900">Potong Gono-gini (50%)</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Khusus pasangan</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={potongGonoGini} onChange={e => setPotongGonoGini(e.target.checked)} />
                            <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. PARAMETER HARTA */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 p-6 group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <Wallet size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">2. Parameter Harta</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Nama Almarhum/ah</label>
                        <input type="text" value={namaJenazah} onChange={e => setNamaJenazah(e.target.value)} placeholder="Contoh: Almarhum Budi"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-bold text-slate-900 text-sm outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Status / Peran (Meninggal Sebagai)</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-bold text-slate-900 text-sm outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner appearance-none"
                          value={keterangan}
                          onChange={(e) => setKeterangan(e.target.value)}
                        >
                          <option value="">-- Pilih Peran --</option>
                          <option value="Ayah (Meninggal sebagai Bapak)">Ayah (Meninggal sebagai Bapak)</option>
                          <option value="Ibu (Meninggal sebagai Mama/Ibu)">Ibu (Meninggal sebagai Mama/Ibu)</option>
                          <option value="Kakek">Kakek</option>
                          <option value="Nenek">Nenek</option>
                          <option value="Anak Laki-laki">Anak Laki-laki</option>
                          <option value="Anak Perempuan">Anak Perempuan</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Jenis Kelamin</label>
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-xl">
                        {["Laki-laki", "Perempuan"].map(g => (
                          <button key={g} onClick={() => setGender(g)}
                            className={`py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${gender === g ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"}`}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { l: "Total Harta", v: harta, s: setHarta, c: "focus:border-emerald-500" },
                      { l: "Utang", v: utang, s: setUtang, c: "focus:border-red-400" },
                      { l: "Wasiat", v: wasiat, s: setWasiat, c: "focus:border-blue-400" }
                    ].map((f, i) => (
                      <div key={i}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">{f.l}</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">Rp</span>
                          <input type="text" value={f.v} onChange={e => f.s(formatIDR(e.target.value))} placeholder="0"
                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-bold text-slate-900 text-sm outline-none transition-all shadow-inner focus:bg-white ${f.c}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. AHLI WARIS */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 p-6 flex flex-col min-h-[400px]">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">3. Ahli Waris</h3>
                    </div>
                    <button onClick={addHeir} className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md active:scale-95 flex items-center gap-1.5">
                      <Plus size={14} /> Tambah Data
                    </button>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar pb-10">
                    <AnimatePresence mode="popLayout">
                      {ahliWaris.map((h, i) => (
                        <motion.div layout key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                          className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group/item hover:bg-white hover:shadow-md transition-all">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-100 shrink-0">{i + 1}</div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="Nama Ahli Waris..." value={h.nama} onChange={e => updateHeir(i, "nama", e.target.value)}
                              className="w-full bg-transparent border-b-2 border-slate-200 px-1 py-2 font-bold text-sm text-slate-900 outline-none focus:border-slate-900 transition-all" />
                            <div className="relative">
                              <button onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 font-bold text-[10px] uppercase tracking-widest flex items-center justify-between shadow-sm">
                                {h.hubungan || "Pilih Hubungan..."}
                                <ChevronDown size={14} className="text-slate-400" />
                              </button>
                              <AnimatePresence>
                                {openDropdown === i && (
                                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-[200px] overflow-y-auto">
                                    {HUBUNGAN_OPTIONS.map(opt => (
                                      <button key={opt} onClick={() => { updateHeir(i, "hubungan", opt); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${h.hubungan === opt ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"}`}>
                                        {opt}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <button onClick={() => removeHeir(i)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0">
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))}
                      {ahliWaris.length === 0 && (
                        <div className="py-12 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest bg-white border-2 border-dashed border-slate-100 rounded-2xl">Belum ada ahli waris ditambahkan</div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN: SUMMARY STICKY ── */}
              <div className="lg:col-span-4 relative">
                <div className="sticky top-10 space-y-4">
                  <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Sparkles size={14} className="text-emerald-400 animate-pulse" /> Live Preview
                      </p>
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                            <Scale size={20} className="text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Dasar Hukum</p>
                            <p className="font-black text-base">{hukum === "Islam" ? "Faraid Islam" : hukum === "Jawa" ? "Adat Jawa" : "Perdata"}</p>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Harta Bersih Estimasi</p>
                          <p className="text-2xl font-black tracking-tight text-emerald-400">Rp {Math.max(0, hartaBersih).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ahli Waris</p>
                              <p className="font-black text-xl">{ahliWaris.length} Orang</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Gender</p>
                              <p className="font-black text-base">{gender}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleHitung} disabled={!harta || ahliWaris.length === 0}
                    className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-30 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0">
                    <Zap size={24} fill="currentColor" /> KALKULASI
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="space-y-8">

            {/* RESULT HEADER */}
            <div className="bg-[#0f172a] text-white rounded-2xl p-8 flex flex-col lg:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -mr-64 -mt-64" />
              <div className="flex-1 text-center lg:text-left relative z-10">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border ${STATUS_CONFIG[hasil.statusAulRadd]?.bg} ${STATUS_CONFIG[hasil.statusAulRadd]?.color} ${STATUS_CONFIG[hasil.statusAulRadd]?.border}`}>
                  <BadgeCheck size={12} /> Status: {hasil.statusAulRadd}
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-4 leading-none">Distribusi Selesai.</h2>
                <p className="text-slate-400 text-sm max-w-md">Perhitungan porsi waris untuk {namaJenazah || "Tanpa Nama"} telah disesuaikan dengan algoritma {hukum}.</p>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 text-center min-w-[300px] relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Harta Bersih (Mirkah)</p>
                <p className="text-3xl font-black tracking-tight text-emerald-400">Rp {hasil.hartaBersih.toLocaleString("id-ID")}</p>
                <button onClick={downloadPDF} className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Download size={16} /> Unduh Laporan PDF
                </button>
              </div>
            </div>

            {/* HEIRS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasil.ahliWarisGetted.map((h: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md shadow-slate-200/20 relative overflow-hidden group hover:border-emerald-200 transition-all">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${h.status === "Mewarisi" ? "bg-emerald-500" : "bg-slate-200"}`} />
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-300"}`}>
                      {h.status === "Mewarisi" ? <BadgeCheck size={20} /> : <ShieldAlert size={20} />}
                    </div>
                    <span className={`text-[8px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${h.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                      {h.status}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{h.nama || h.hubungan}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{h.hubungan}</p>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Porsi Final</p>
                        <p className="text-xl font-black text-slate-900">{h.jatahPersen}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nominal IDR</p>
                        <p className="text-base font-black text-emerald-600 tracking-tighter">Rp {h.jatahNominal.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-emerald-50/50 transition-colors">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Gavel size={12} className="text-slate-950" /> Analisis Putusan
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{h.alasan}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
