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
  Download
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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    doc.text(`Dasar Hukum: ${hukum}`, 20, 62);
    doc.text(`Status Kasus: ${hasil.statusAulRadd}`, 20, 67);
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
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-96 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0">
         <motion.div 
           animate={{ 
             x: mousePosition.x * 0.05, 
             y: mousePosition.y * 0.05,
             rotate: [0, 10, 0]
           }} 
           transition={{ type: "tween", ease: "linear", duration: 0.1 }}
           className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-100/40 rounded-full blur-[120px]" 
         />
         <motion.div 
           animate={{ 
             x: mousePosition.x * -0.05, 
             y: mousePosition.y * -0.05,
           }} 
           transition={{ type: "tween", ease: "linear", duration: 0.1 }}
           className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px]" 
         />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 mb-8 mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Smart Engine v1.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
            <span className="text-slate-900">Kalkulasi </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600">Presisi.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
            Sistem distribusi waris interaktif yang mensinkronisasi Syariat Islam, Adat Jawa, dan Hukum Nasional secara real-time.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
            >
              
              <div className="xl:col-span-8 space-y-8">
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="flex items-center gap-4 mb-8 relative">
                    <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <Scale size={28} />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">1. Sistem Hukum</h2>
                      <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Pilih dasar hukum</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    {[
                      { id: "Islam", label: "☪ Hukum Islam (Faraid)", active: true },
                      { id: "Jawa", label: "🏛 Hukum Adat Jawa", active: true },
                      { id: "Perdata", label: "⚖ Hukum Perdata", active: false },
                    ].map(h => (
                      <motion.button key={h.id} whileHover={h.active ? { y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" } : {}} whileTap={h.active ? { scale: 0.95 } : {}}
                        onClick={() => h.active && setHukum(h.id)}
                        className={`relative p-6 rounded-3xl font-bold text-sm transition-colors text-left flex items-center justify-between border-2 ${
                          hukum === h.id ? "bg-slate-900 text-white border-slate-900" : h.active ? "bg-white text-slate-600 border-slate-100 hover:border-emerald-200" : "bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed"
                        }`}>
                        {h.label}
                        {hukum === h.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><BadgeCheck size={24} className="text-emerald-400" /></motion.div>}
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {hukum === "Jawa" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-6 p-6 bg-amber-50/50 rounded-3xl border border-amber-100/50 space-y-6">
                          <div>
                            <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-3">Metode Pembagian Tradisional</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[{ id: "SEPIKUL_SEGENDONGAN", l: "Sepikul Segendongan", d: "Rasio 2:1 (L:P)" }, { id: "KUM_KUM_KUPAT", l: "Kum-Kum Kupat", d: "Sama Rata 1:1" }].map(m => (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={m.id} onClick={() => setMetodeAdat(m.id as any)}
                                  className={`p-5 rounded-2xl border-2 transition-all text-left ${metodeAdat === m.id ? "bg-white border-amber-500 text-amber-900 shadow-md" : "bg-white/50 border-amber-200/50 text-amber-700/60"}`}>
                                  <p className="font-black text-sm">{m.l}</p>
                                  <p className="text-xs mt-1 font-bold">{m.d}</p>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-amber-100 shadow-sm">
                            <div>
                              <p className="font-black text-sm text-slate-900">Potong Gono-gini (50%)</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Potongan khusus pasangan</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={potongGonoGini} onChange={e => setPotongGonoGini(e.target.checked)} />
                              <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative group">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -mr-10 -mb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="flex items-center gap-4 mb-8 relative">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <Wallet size={28} />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">2. Parameter Harta</h2>
                      <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Aset dan kewajiban</p>
                    </div>
                  </div>
                  
                  <div className="mb-8 relative z-10">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Nama Almarhum/ah</label>
                    <input type="text" value={namaJenazah} onChange={e => setNamaJenazah(e.target.value)} placeholder="Contoh: Almarhum Budi"
                      className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-900 text-xl outline-none transition-all shadow-sm focus:border-emerald-500 focus:bg-emerald-50/10" />
                  </div>

                  <div className="mb-8 relative z-10">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Jenis Kelamin Pewaris</label>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-2 rounded-3xl border border-slate-100">
                      {["Laki-laki", "Perempuan"].map(g => (
                        <button key={g} onClick={() => setGender(g)}
                          className={`py-4 rounded-2xl font-bold text-sm transition-all ${gender === g ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:bg-white/50"}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {[
                      { l: "Total Harta Kotor", v: harta, s: setHarta, c: "focus:border-emerald-500 focus:bg-emerald-50/10" },
                      { l: "Total Utang", v: utang, s: setUtang, c: "focus:border-red-400 focus:bg-red-50/10" },
                      { l: "Total Wasiat", v: wasiat, s: setWasiat, c: "focus:border-blue-400 focus:bg-blue-50/10" }
                    ].map((f, i) => (
                      <motion.div key={i} whileFocus={{ scale: 1.02 }}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">{f.l}</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">Rp</span>
                          <input type="text" value={f.v} onChange={e => f.s(formatIDR(e.target.value))} placeholder="0"
                            className={`w-full pl-14 pr-5 py-5 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-900 text-xl outline-none transition-all shadow-sm ${f.c}`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                      <motion.div animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="w-14 h-14 bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <User size={28} />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">3. Ahli Waris</h2>
                        <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Daftar keluarga almarhum/ah</p>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addHeir}
                      className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-3">
                      <Plus size={20} /> Tambah Data
                    </motion.button>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <AnimatePresence mode="popLayout">
                      {ahliWaris.length === 0 ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} 
                          className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                             <Users size={64} className="text-slate-200 mx-auto mb-6" />
                          </motion.div>
                          <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Belum Ada Ahli Waris</p>
                        </motion.div>
                      ) : (
                        ahliWaris.map((h, i) => (
                          <motion.div 
                            layout
                            key={i} 
                            initial={{ opacity: 0, x: -50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: 50, filter: "blur(5px)" }}
                            className="flex flex-col md:flex-row gap-5 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all group/item"
                          >
                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-black text-lg shrink-0">{i + 1}</div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div>
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Nama</label>
                                 <input placeholder="Contoh: Budi" value={h.nama} onChange={e => updateHeir(i, "nama", e.target.value)}
                                   className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner" />
                              </div>
                              <div className="relative">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Hubungan</label>
                                 <button onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                                   className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 font-black text-xs text-left flex items-center justify-between hover:bg-slate-100 transition-all shadow-inner">
                                   <span className={h.hubungan ? "text-slate-900" : "text-slate-400"}>{h.hubungan || "Pilih..."}</span>
                                   <ChevronDown size={18} className="text-slate-400" />
                                 </button>
                                 <AnimatePresence>
                                   {openDropdown === i && (
                                     <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                       className="absolute top-full left-0 right-0 mt-3 p-3 bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 max-h-[300px] overflow-y-auto">
                                       {HUBUNGAN_OPTIONS.map(opt => (
                                         <button key={opt} onClick={() => { updateHeir(i, "hubungan", opt); setOpenDropdown(null); }}
                                           className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-black transition-all ${h.hubungan === opt ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                                           {opt}
                                         </button>
                                       ))}
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                              </div>
                            </div>
                            <button onClick={() => removeHeir(i)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:self-end shrink-0 md:mb-1">
                              <Trash2 size={24} />
                            </button>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

              </div>

              {/* ── RIGHT: LIVE STICKY PREVIEW (FULL PREVIEW DATA) ── */}
              <div className="xl:col-span-4 relative hidden xl:block">
                 <div className="sticky top-10">
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} 
                      className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                      
                      <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-10">
                           <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                             <Sparkles size={24} className="text-emerald-400" />
                           </motion.div>
                           <h3 className="font-black text-2xl tracking-tighter">Live Preview</h3>
                         </div>

                         <div className="space-y-8">
                           <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hukum Aktif</p>
                             <div className="flex items-center gap-2">
                               <CheckCircle2 size={18} className="text-emerald-400" />
                               <span className="font-bold text-lg">{hukum === "Islam" ? "Faraid" : hukum === "Jawa" ? "Adat Jawa" : "Perdata"}</span>
                             </div>
                           </div>

                           <div className="pt-6 border-t border-slate-800">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Harta Bersih (Mirkah)</p>
                             <p className="text-2xl lg:text-3xl font-black tracking-tighter break-words">Rp {Math.max(0, hartaBersih).toLocaleString("id-ID")}</p>
                             <p className="text-xs font-bold text-slate-400 mt-2">Pewaris: {gender}</p>
                           </div>

                           <div className="pt-6 border-t border-slate-800">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex justify-between">
                               <span>Ahli Waris Terdata</span>
                               <span className="bg-white/10 px-2 py-0.5 rounded-md text-white">{ahliWaris.length} Orang</span>
                             </p>
                             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                               <AnimatePresence>
                                 {ahliWaris.map((h, i) => (
                                   <motion.div key={i} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                     className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                                     <div>
                                       <p className="font-bold text-sm">{h.nama || h.hubungan || "Tanpa Nama"}</p>
                                       <p className="text-[10px] font-black text-slate-500 uppercase mt-1">{h.hubungan}</p>
                                     </div>
                                   </motion.div>
                                 ))}
                               </AnimatePresence>
                             </div>
                           </div>
                         </div>
                      </div>
                    </motion.div>

                    {/* BIG CTA BUTTON BELOW PREVIEW ON DESKTOP */}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleHitung} disabled={!harta || ahliWaris.length === 0}
                      className="w-full mt-6 py-8 bg-emerald-500 text-slate-950 rounded-[2.5rem] font-black text-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 disabled:opacity-30 flex items-center justify-center gap-4"
                    >
                      <Zap size={28} fill="currentColor" /> Kalkulasi
                    </motion.button>
                 </div>
              </div>

              {/* BIG CTA BUTTON FOR MOBILE (HIDDEN ON XL) */}
              <motion.div className="xl:hidden pt-8">
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleHitung} disabled={!harta || ahliWaris.length === 0}
                    className="w-full py-8 bg-emerald-500 text-slate-950 rounded-[3rem] font-black text-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 disabled:opacity-30 flex items-center justify-center gap-4 border-b-8 border-emerald-700"
                  >
                    <Zap size={28} fill="currentColor" />
                    Kalkulasi Pembagian Waris
                    <ArrowRight size={24} />
                  </motion.button>
              </motion.div>

            </motion.div>
          ) : (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -50 }} 
              transition={{ duration: 0.6, type: "spring" }}
              className="space-y-12"
            >
              {/* SUMMARY RESULT */}
              <div className="bg-white border border-slate-200 rounded-[4rem] p-12 lg:p-16 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />
                 
                 <div className="flex-1 text-center lg:text-left relative z-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} 
                      className={`inline-flex items-center gap-2 ${STATUS_CONFIG[hasil.statusAulRadd]?.bg} ${STATUS_CONFIG[hasil.statusAulRadd]?.color} px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 border ${STATUS_CONFIG[hasil.statusAulRadd]?.border}`}>
                      Status Kasus: {hasil.statusAulRadd}
                    </motion.div>
                    <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9]">Distribusi<br />Selesai.</h2>
                    <p className="text-xl text-slate-500 font-medium max-w-md">Perhitungan telah diselesaikan dengan akurasi 100% menggunakan algoritma {hukum}.</p>
                 </div>
                 
                 <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} 
                   className="w-full lg:w-auto bg-slate-900 rounded-[3rem] p-12 text-center text-white shadow-2xl min-w-[320px] max-w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Total Harta Mirkah</p>
                    <p className="text-3xl lg:text-4xl font-black tracking-tighter break-words">Rp {Math.max(0, hasil.hartaBersih).toLocaleString("id-ID")}</p>
                    <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Pewaris: {gender}</span>
                    </div>
                 </motion.div>
              </div>

              {/* HEIRS DISTRIBUTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hasil.ahliWarisGetted.map((h: any, i: number) => {
                  const pct = hasil.hartaBersih > 0 ? (h.jatahNominal / hasil.hartaBersih * 100) : 0;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:border-emerald-200 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-emerald-50 transition-colors pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <motion.div whileHover={{ rotate: 10 }} className={`w-16 h-16 rounded-2xl flex items-center justify-center ${h.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                            {h.status === "Mewarisi" ? <BadgeCheck size={32} /> : <ShieldAlert size={32} />}
                          </motion.div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${h.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                            {h.status}
                          </span>
                        </div>
                        
                        <h4 className="font-black text-slate-900 text-3xl mb-2 tracking-tight">{h.nama || h.hubungan}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-10">{h.hubungan}</p>
                        
                        <div className="space-y-6">
                           <div className="flex justify-between items-end border-b border-slate-100 pb-6 gap-4">
                              <div className="shrink-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Porsi Final</p>
                                <p className="text-3xl lg:text-4xl font-black text-slate-900">{h.jatahPersen}</p>
                              </div>
                              <div className="text-right min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Nominal IDR</p>
                                <p className="text-xl lg:text-2xl font-black text-emerald-600 tracking-tighter truncate md:break-words md:whitespace-normal" title={`Rp ${h.jatahNominal.toLocaleString("id-ID")}`}>
                                  Rp {h.jatahNominal.toLocaleString("id-ID")}
                                </p>
                              </div>
                           </div>

                           {h.status === "Mewarisi" && (
                             <div>
                               <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.5, duration: 1 }} className="h-full bg-emerald-500 rounded-full" />
                               </div>
                               <p className="text-right text-[10px] font-bold text-slate-400 mt-2">{pct.toFixed(1)}% dari Mirkah</p>
                             </div>
                           )}

                           <button onClick={() => setSelectedHeir(h)}
                            className="w-full py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all flex items-center justify-center gap-3 mt-4">
                            <Info size={16} /> Detail Keputusan Hukum
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ACTION BUTTONS */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-10 flex flex-col md:flex-row justify-center gap-4">
                <button onClick={() => setStep(1)} className="px-12 py-6 bg-white border-2 border-slate-200 rounded-[2rem] font-black text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3">
                   ← Kembali & Edit Data
                </button>
                <button onClick={downloadPDF} className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-emerald-600 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3">
                   <Download size={20} /> Unduh Laporan PDF
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Analysis */}
      <AnimatePresence>
        {selectedHeir && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
            onClick={() => setSelectedHeir(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring" }}
              className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-12">
                <div className="flex items-center gap-6 mb-10">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-inner">
                    <Scale size={40} />
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedHeir.nama || selectedHeir.hubungan}</h2>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">{selectedHeir.hubungan}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-8 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BadgeCheck size={16} className="text-emerald-500" /> Analisis Hukum Syariat/Adat
                  </p>
                  <p className="text-slate-700 font-medium leading-relaxed text-base relative z-10">{selectedHeir.alasan}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Porsi Final</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{selectedHeir.jatahPersen}</p>
                  </div>
                  <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] shadow-sm">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Nominal IDR</p>
                    <p className="text-2xl font-black text-emerald-700 tracking-tighter">Rp {selectedHeir.jatahNominal.toLocaleString("id-ID")}</p>
                  </div>
                </div>
                
                <button onClick={() => setSelectedHeir(null)}
                  className="mt-10 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl">
                  Tutup Analisis
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
