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
  Download,
  Coins,
  ChevronLeft
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

const LAW_CARD_ACTIVE_CONFIG: Record<string, string> = {
  Islam: "bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/5",
  Jawa: "bg-amber-50/80 border-amber-500 text-amber-955 shadow-md shadow-amber-500/5",
  Perdata: "bg-blue-50/80 border-blue-500 text-blue-955 shadow-md shadow-blue-500/5",
};

const chartColors = [
  "bg-emerald-500 shadow-emerald-500/10",
  "bg-blue-500 shadow-blue-500/10",
  "bg-indigo-500 shadow-indigo-500/10",
  "bg-amber-500 shadow-amber-500/10",
  "bg-purple-500 shadow-purple-500/10",
  "bg-rose-500 shadow-rose-500/10",
  "bg-teal-500 shadow-teal-500/10",
  "bg-cyan-500 shadow-cyan-500/10",
];
const textColors = [
  "text-emerald-650",
  "text-blue-600",
  "text-indigo-600",
  "text-amber-600",
  "text-purple-650",
  "text-rose-600",
  "text-teal-600",
  "text-cyan-600",
];

const formatIDR = (val: string) => {
  const n = val.replace(/\D/g, "");
  return n ? new Intl.NumberFormat("id-ID").format(parseInt(n)) : "";
};
const parseNum = (v: string) => parseInt(v.replace(/\D/g, "")) || 0;

export default function KalkulatorPage() {
  // Wizard Steps: 1 (Dasar Hukum & Pewaris), 2 (Parameter Harta), 3 (Daftar Ahli Waris), 4 (Hasil Perhitungan)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [namaJenazah, setNamaJenazah] = useState("");
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);
  const [hasil, setHasil] = useState<any>(null);
  const [selectedHeir, setSelectedHeir] = useState<any>(null);
  const [hukum, setHukum] = useState<string>("Islam");
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT">("SEPIKUL_SEGENDONGAN");
  const [potongGonoGini, setPotongGonoGini] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const addHeir = (hubungan: string = "Anak Laki-laki") => {
    setAhliWaris([...ahliWaris, { nama: "", hubungan }]);
  };
  
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
    setCurrentStep(4);
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
    doc.text(`Nama Pewaris: ${namaJenazah || "-"}`, 20, 52);
    doc.text(`Jenis Kelamin: ${gender}`, 20, 57);
    doc.text(`Dasar Hukum: ${hukum === "Islam" ? "Syariat Islam (Faraid)" : "Adat Jawa"}`, 20, 62);
    doc.text(`Status Kasus: ${hasil.statusAulRadd}`, 20, 67);
    doc.text(`Tanggal Cetak: ${date}`, 20, 72);

    doc.text("RINGKASAN KEUANGAN HARTA", 130, 45);
    doc.text(`Harta Kotor: Rp ${parseNum(harta).toLocaleString("id-ID")}`, 130, 52);
    doc.text(`Utang/Kewajiban: Rp ${parseNum(utang).toLocaleString("id-ID")}`, 130, 57);
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
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("LAPORAN RESMI PEMBAGIAN WARIS - E-MAWARITS", 20, 10);
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

  // Step names for progress tracking
  const stepsConfig = [
    { num: 1, label: "Hukum & Pewaris", icon: User },
    { num: 2, label: "Parameter Harta", icon: Wallet },
    { num: 3, label: "Ahli Waris", icon: Users },
    { num: 4, label: "Hasil Distribusi", icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-48 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden">
      
      {/* Background tracking blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[80px]"
        />
      </div>

      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none z-0" />

      {/* Header Section */}
      <div className="relative z-10 pt-32 pb-10 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white border border-slate-200 mb-4 mx-auto shadow-sm">
            <Calculator size={12} className="text-emerald-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kalkulator Waris Terintegrasi</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 leading-none text-slate-955">
            Kalkulator Waris <span className="text-emerald-600">Multi-Hukum.</span>
          </h1>

          <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
            Sistem kalkulasi porsi warisan yang presisi, mendukung hukum Faraid Islam dan Adat Jawa secara real-time.
          </p>
        </motion.div>
      </div>

      {/* Progress Steps Indicator Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex justify-between items-center relative">
          
          {/* Progress bar background line */}
          <div className="absolute left-[10%] right-[10%] top-[42%] h-0.5 bg-slate-100 z-0 hidden md:block" />

          {stepsConfig.map((s) => {
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;
            const Icon = s.icon;
            
            return (
              <div key={s.num} className="flex flex-col items-center z-10 relative flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 font-black text-xs ${
                  isCompleted 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm"
                    : isActive 
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-550/25 scale-105"
                      : "bg-white border-slate-200 text-slate-400"
                }`}>
                  {isCompleted ? <CheckCircle2 size={16} /> : <span>{s.num}</span>}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider mt-2 hidden md:block ${isActive ? "text-slate-900" : isCompleted ? "text-emerald-600" : "text-slate-450"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main wizard frame */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
          
          {/* STEP 1: DASAR HUKUM & DATA PEWARIS */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 text-left"
            >
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-650 rounded-xl flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Dasar Hukum & Identitas Pewaris</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Langkah awal penentuan skema</p>
                </div>
              </div>

              {/* Law selection cards */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sistem Hukum Pembagian</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "Islam", label: "☪ Hukum Islam (Faraid)", desc: "Pembagian porsi pasti berdasarkan Al-Qur'an dan Hadits.", active: true },
                    { id: "Jawa", label: "🏛 Hukum Adat Jawa", desc: "Asas rukun musyawarah dengan opsi Sepikul Segendongan.", active: true },
                    { id: "Perdata", label: "⚖ Hukum Perdata", desc: "Penderajatan golongan ahli waris BW (Segera Hadir).", active: false },
                  ].map(h => (
                    <button 
                      key={h.id}
                      disabled={!h.active}
                      onClick={() => h.active && setHukum(h.id)}
                      className={`p-5 rounded-2xl text-left border transition-all duration-200 relative group flex flex-col justify-between min-h-[120px] ${
                        hukum === h.id 
                          ? `${LAW_CARD_ACTIVE_CONFIG[h.id]} border-2`
                          : h.active 
                            ? "bg-white text-slate-700 border-slate-200/80 hover:border-emerald-500/50 hover:bg-slate-50/50 cursor-pointer" 
                            : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-extrabold text-xs">{h.label}</span>
                        {hukum === h.id && <BadgeCheck size={16} className={`${h.id === "Islam" ? "text-emerald-600" : h.id === "Jawa" ? "text-amber-600" : "text-blue-600"} shrink-0`} />}
                      </div>
                      <p className={`text-[10px] mt-2 font-medium leading-relaxed ${hukum === h.id ? "text-slate-600" : "text-slate-400"}`}>{h.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pewaris Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Almarhum / Almarhumah</label>
                  <input 
                    type="text" 
                    value={namaJenazah} 
                    onChange={e => setNamaJenazah(e.target.value)} 
                    placeholder="Contoh: Almarhum Budi"
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl font-bold text-slate-900 text-xs outline-none transition-all focus:border-emerald-500 focus:bg-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Kelamin Pewaris</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-150 p-1.5 rounded-xl border border-slate-200/80">
                    {["Laki-laki", "Perempuan"].map(g => (
                      <button 
                        key={g} 
                        onClick={() => setGender(g)}
                        className={`py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          gender === g 
                            ? "bg-white text-slate-950 shadow-sm border border-slate-200/50" 
                            : "text-slate-500 hover:bg-white/50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!namaJenazah}
                  className="px-6 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-30 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-550/15 cursor-pointer"
                >
                  <span>Lanjut Langkah Harta</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PARAMETER HARTA */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 text-left"
            >
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-650 rounded-xl flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Parameter Nominal Harta & Utang</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kalkulasi Mirats Bersih</p>
                </div>
              </div>

              {/* Jawa specific options */}
              <AnimatePresence mode="wait">
                {hukum === "Jawa" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }} 
                    className="overflow-hidden bg-amber-50/40 border border-amber-100/50 rounded-2xl p-5 space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-amber-700 uppercase tracking-widest block">Metode Pembagian Adat</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { id: "SEPIKUL_SEGENDONGAN", l: "Sepikul Segendongan", d: "Porsi 2:1 untuk Laki-laki vs Perempuan" },
                          { id: "KUM_KUM_KUPAT", l: "Kum-Kum Kupat", d: "Sama rata 1:1 tanpa pembedaan gender" }
                        ].map(m => (
                          <button 
                            key={m.id} 
                            onClick={() => setMetodeAdat(m.id as any)}
                            className={`p-4 rounded-xl border transition-all text-left cursor-pointer ${
                              metodeAdat === m.id 
                                ? "bg-white border-amber-500 text-amber-950 shadow-sm" 
                                : "bg-white/50 border-slate-200/80 text-slate-500 hover:border-amber-300"
                            }`}
                          >
                            <p className="font-black text-xs">{m.l}</p>
                            <p className="text-[10px] mt-1 text-slate-405 font-medium leading-relaxed">{m.d}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-200/40 shadow-sm">
                      <div>
                        <p className="font-bold text-xs text-slate-900">Potong Harta Gono-gini (50%)</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Keluarkan hak pasangan hidup sebelum diwariskan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={potongGonoGini} 
                          onChange={e => setPotongGonoGini(e.target.checked)} 
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Harta fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { l: "Total Harta Kotor", v: harta, s: setHarta, c: "focus:border-emerald-500" },
                  { l: "Total Utang & Jenazah", v: utang, s: setUtang, c: "focus:border-rose-450" },
                  { l: "Wasiat Terdaftar", v: wasiat, s: setWasiat, c: "focus:border-blue-500" }
                ].map((f, i) => (
                  <div key={i} className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{f.l}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-350 text-xs">Rp</span>
                      <input 
                        type="text" 
                        value={f.v} 
                        onChange={e => f.s(formatIDR(e.target.value))} 
                        placeholder="0"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl font-bold text-slate-900 text-xs outline-none transition-all ${f.c} focus:bg-white`} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial calculations preview info box */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between text-xs font-bold text-slate-600">
                <div className="flex items-center gap-3">
                  <Coins size={18} className="text-emerald-600" />
                  <span>Estimasi Harta Bersih Terhitung (Mirkah):</span>
                </div>
                <span className="text-base font-black text-slate-950">
                  Rp {Math.max(0, hartaBersih).toLocaleString("id-ID")}
                </span>
              </div>

              {/* Step Navigation buttons */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft size={14} />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={parseNum(harta) <= 0}
                  className="px-6 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-30 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-550/15 cursor-pointer"
                >
                  <span>Lanjut Ahli Waris</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DAFTAR AHLI WARIS */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-650 rounded-xl flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Daftar Silsilah Ahli Waris</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Masukkan keluarga dekat almarhum</p>
                  </div>
                </div>
                <button 
                  onClick={() => addHeir()}
                  className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus size={14} /> Tambah Ahli Waris
                </button>
              </div>

              {/* Quick Preset Buttons for heirs to make input fast */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pintasan Cepat Tambah Ahli Waris</span>
                <div className="flex flex-wrap gap-2">
                  {["Istri", "Suami", "Anak Laki-laki", "Anak Perempuan", "Ayah", "Ibu"].map((h) => {
                    // Disable suami if almarhum is laki-laki and vice versa
                    const isSuamiDisabled = gender === "Laki-laki" && h === "Suami";
                    const isIstriDisabled = gender === "Perempuan" && h === "Istri";
                    
                    return (
                      <button
                        key={h}
                        disabled={isSuamiDisabled || isIstriDisabled}
                        onClick={() => addHeir(h)}
                        className="px-3.5 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-xl border border-slate-200/70 text-xs font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        + {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic list of heirs */}
              <div className="space-y-4 pt-2">
                <AnimatePresence mode="popLayout">
                  {ahliWaris.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="py-14 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50"
                    >
                      <Users size={32} className="text-slate-350 mx-auto mb-3" />
                      <p className="text-slate-450 font-black text-[10px] uppercase tracking-widest">Belum Ada Ahli Waris Terdaftar</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Gunakan pintasan di atas atau klik tambah ahli waris untuk mendata.</p>
                    </motion.div>
                  ) : (
                    ahliWaris.map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50/30 rounded-2xl border border-slate-200/70 shadow-inner hover:border-slate-300 transition-colors"
                      >
                        {/* Number Index */}
                        <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 text-emerald-750 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name Input */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">Nama / Identifikasi</label>
                            <input 
                              placeholder="Contoh: Budi (Anak)" 
                              value={h.nama} 
                              onChange={e => updateHeir(i, "nama", e.target.value)}
                              className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 font-bold text-xs outline-none focus:border-slate-400" 
                            />
                          </div>

                          {/* Relationship Selection */}
                          <div className="space-y-1 relative">
                            <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">Hubungan Keluarga</label>
                            <button 
                              onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                              className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 font-bold text-xs text-left flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer"
                            >
                              <span className={h.hubungan ? "text-slate-900" : "text-slate-400"}>{h.hubungan || "Pilih..."}</span>
                              <ChevronDown size={14} className="text-slate-400" />
                            </button>
                            <AnimatePresence>
                              {openDropdown === i && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute top-full left-0 right-0 mt-2 p-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-[180px] overflow-y-auto"
                                >
                                  {HUBUNGAN_OPTIONS.map(opt => (
                                    <button 
                                      key={opt} 
                                      onClick={() => { updateHeir(i, "hubungan", opt); setOpenDropdown(null); }}
                                      className={`w-full text-left px-4 py-2.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                                        h.hubungan === opt 
                                          ? "bg-emerald-600 text-white" 
                                          : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        
                        {/* Remove Heir Button */}
                        <button 
                          onClick={() => removeHeir(i)} 
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all md:self-end shrink-0 md:mb-0.5 cursor-pointer border border-transparent hover:border-rose-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Step Navigation buttons */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft size={14} />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={handleHitung}
                  disabled={ahliWaris.length === 0}
                  className="px-6 py-3.5 bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-30 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <Zap size={14} />
                  <span>Hitung Distribusi Waris</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: HASIL PERHITUNGAN */}
          {currentStep === 4 && hasil && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* SUMMARY RESULT CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden text-left">
                <div className="flex-1 space-y-4">
                  <div className={`inline-flex items-center gap-2 ${STATUS_CONFIG[hasil.statusAulRadd]?.bg} ${STATUS_CONFIG[hasil.statusAulRadd]?.color} px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${STATUS_CONFIG[hasil.statusAulRadd]?.border}`}>
                    Kasus: {hasil.statusAulRadd}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 leading-none">Distribusi Berhasil Dihitung.</h2>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Pembagian nominal porsi waris secara presisi dan transparan berdasarkan rujukan hukum {hukum === "Islam" ? "Syariat Islam (Faraid)" : "Adat Jawa"}.
                  </p>
                </div>

                <div className="w-full lg:w-auto bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-center text-white min-w-[280px] shadow-lg shadow-emerald-500/10">
                  <p className="text-emerald-100/70 text-[9px] font-black uppercase tracking-widest mb-1.5">Harta Bersih yang Dibagikan (Mirkah)</p>
                  <p className="text-2xl font-black tracking-tight text-white">Rp {Math.max(0, hasil.hartaBersih).toLocaleString("id-ID")}</p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-emerald-100/70">
                    <span>Almarhum/ah: {gender}</span>
                    <span>Hukum: {hukum}</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC INTERACTIVE CHART BAR */}
              {(() => {
                const heirsMewarisi = hasil.ahliWarisGetted.filter((h: any) => h.status === "Mewarisi" && h.jatahNominal > 0);
                if (heirsMewarisi.length === 0) return null;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm text-left space-y-6"
                  >
                    <div>
                      <h3 className="font-bold text-base text-slate-800 tracking-tight flex items-center gap-2">
                        <Scale size={18} className="text-emerald-600" />
                        <span>Visualisasi Proporsi Pembagian Harta</span>
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                        Grafik pembagian akumulatif harta waris keluarga
                      </p>
                    </div>

                    {/* Horizontal Stacked Bar */}
                    <div className="w-full h-10 bg-slate-100 rounded-2xl overflow-hidden flex shadow-inner border border-slate-200/40">
                      {heirsMewarisi.map((h: any, idx: number) => {
                        const pct = (h.jatahNominal / hasil.hartaBersih) * 100;
                        const isHovered = hoveredIndex === idx;
                        return (
                          <motion.div
                            key={idx}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={{
                              flexGrow: pct,
                              scaleY: isHovered ? 1.05 : 1.0,
                              filter: isHovered ? "brightness(1.1)" : "brightness(1.0)",
                            }}
                            className={`${chartColors[idx % chartColors.length]} h-full transition-all cursor-pointer relative group`}
                            style={{ width: `${pct}%` }}
                          >
                            {/* Centered percentage on hover or if large enough */}
                            {pct > 5 && (
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white pointer-events-none drop-shadow-sm select-none opacity-80 group-hover:opacity-100 transition-opacity">
                                {pct.toFixed(0)}%
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Legend Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {heirsMewarisi.map((h: any, idx: number) => {
                        const pct = (h.jatahNominal / hasil.hartaBersih) * 100;
                        const isHovered = hoveredIndex === idx;
                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                              isHovered 
                                ? "bg-emerald-50/40 border-emerald-500 shadow-sm" 
                                : "bg-white border-slate-150 hover:border-slate-300"
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full ${chartColors[idx % chartColors.length].split(" ")[0]} shrink-0 mt-0.5`} />
                            <div className="space-y-1">
                              <p className="font-extrabold text-xs text-slate-800 leading-none">{h.nama || h.hubungan}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{h.hubungan}</p>
                              <div className="flex items-center gap-2 pt-1">
                                <span className={`text-[10px] font-black ${textColors[idx % textColors.length]}`}>{pct.toFixed(1)}%</span>
                                <span className="text-[10px] font-black text-slate-900">Rp {h.jatahNominal.toLocaleString("id-ID")}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })()}

              {/* HEIRS DISTRIBUTION LIST CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {hasil.ahliWarisGetted.map((h: any, i: number) => {
                  const pct = hasil.hartaBersih > 0 ? (h.jatahNominal / hasil.hartaBersih * 100) : 0;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-450"}`}>
                            {h.status === "Mewarisi" ? <BadgeCheck size={22} /> : <ShieldAlert size={22} />}
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded border ${h.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                            {h.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-slate-900 text-lg mb-0.5 tracking-tight">{h.nama || h.hubungan}</h4>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.hubungan}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-y border-slate-150 py-4">
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Porsi Bagian</p>
                            <p className="text-lg font-black text-slate-900">{h.jatahPersen}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nominal Rupiah</p>
                            <p className="text-base font-black text-emerald-600 tracking-tight">
                              Rp {h.jatahNominal.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                        
                        {h.status === "Mewarisi" && (
                          <div className="space-y-1">
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${pct}%` }} 
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-full bg-emerald-500 rounded-full" 
                              />
                            </div>
                            <p className="text-right text-[8px] font-black text-slate-400 uppercase tracking-widest">{pct.toFixed(1)}% Dari Total Harta</p>
                          </div>
                        )}

                        <button 
                          onClick={() => setSelectedHeir(h)}
                          className="w-full py-2.5 bg-slate-50 border border-transparent hover:border-emerald-250 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-550 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Info size={12} /> Detail Keputusan Hukum
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ACTION NAVIGATION BUTTONS */}
              <div className="pt-4 flex flex-col md:flex-row justify-center gap-4">
                <button 
                  onClick={() => setCurrentStep(3)} 
                  className="px-6 py-3 bg-white border border-slate-300 hover:border-slate-900 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  ← Edit Ahli Waris
                </button>
                <button 
                  onClick={downloadPDF} 
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-550/15"
                >
                  <Download size={14} /> Unduh Laporan PDF
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        </div>
      </div>

      {/* Modal Analysis pop-up */}
      <AnimatePresence>
        {selectedHeir && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6"
            onClick={() => setSelectedHeir(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-left" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <Scale size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedHeir.nama || selectedHeir.hubungan}</h2>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">{selectedHeir.hubungan}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <BadgeCheck size={14} className="text-emerald-500" /> Analisis Hukum Rujukan
                  </p>
                  <p className="text-slate-700 font-semibold leading-relaxed text-xs">{selectedHeir.alasan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Porsi Bagian</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">{selectedHeir.jatahPersen}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100/50 rounded-xl">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Nominal IDR</p>
                    <p className="text-base font-black text-emerald-700 tracking-tight">Rp {selectedHeir.jatahNominal.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedHeir(null)}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors cursor-pointer shadow-md shadow-emerald-550/15"
                >
                  Tutup Rincian
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
