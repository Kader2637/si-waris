"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  FileText, 
  Code, 
  AlertTriangle,
  Zap,
  Clock
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Fade-in animation helper (Type-safe transition)
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: false, margin: "-100px" }
};

const staggerChild = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

// 5 Stacked Layers Data (Indonesian)
const ladderSteps = [
  {
    id: "layer_01",
    label: "LAYER_01",
    title: "ATURAN WARIS",
    subtitle: "Identifikasi Ahli Waris",
    desc: "Langkah pertama adalah mendata seluruh silsilah keluarga yang masih hidup. Sistem secara otomatis menyaring ahli waris yang berhak menerima serta menyaring yang terhalang (status Hijab/Mahjub) berdasarkan rujukan undang-undang.",
    features: [
      "Pemetaan Diagram Silsilah Keluarga",
      "Pendeteksian Status Hubungan Darah",
      "Penyaringan Hijab & Mahjub Otomatis",
      "Identifikasi Ahli Waris Utama & Pengganti"
    ]
  },
  {
    id: "layer_02",
    label: "LAYER_02",
    title: "DATA & PARAMETER",
    subtitle: "Akumulasi Parameter Harta",
    desc: "Mengumpulkan seluruh data aset aktif, pasif, utang, biaya pengurusan jenazah, serta wasiat almarhum/ah. Menjamin bahwa kewajiban dibayarkan terlebih dahulu sebelum harta bersih siap dibagikan.",
    features: [
      "Kalkulasi Estimasi Harta Bersih (Mirkah)",
      "Pencatatan Rincian Utang & Kewajiban",
      "Validasi Batas Wasiat (Maksimal 1/3 Harta)",
      "Pemotongan Harta Gono-Gini Adat (50%)"
    ]
  },
  {
    id: "layer_03",
    label: "LAYER_03",
    title: "IMPLEMENTASI HUKUM",
    subtitle: "Penentuan Hukum Dasar",
    desc: "Menerapkan sistem hukum pembagian yang disepakati oleh keluarga. Sistem mendukung tiga jalur utama: Syariat Islam (Faraid), Hukum Adat Jawa (Sepikul Segendongan/Kum-Kum), dan Hukum Perdata BW.",
    features: [
      "Penetapan Porsi Pecahan Utama",
      "Sinkronisasi Undang-Undang KHI",
      "Penyesuaian Aturan Adat Daerah",
      "Verifikasi Konsensus Ahli Waris"
    ]
  },
  {
    id: "layer_04",
    label: "LAYER_04",
    title: "PENERAPAN & ADOPSI",
    subtitle: "Penyesuaian Kasus Khusus",
    desc: "Menggunakan algoritma penyeimbang porsi jika terjadi selisih antara nilai total pecahan dengan jumlah harta waris yang tersedia, seperti kasus Aul dan Radd pada hukum Islam.",
    features: [
      "Penyelarasan Porsi Aul (Harta Kurang)",
      "Pengembalian Porsi Radd (Harta Lebih)",
      "Rasio Pembagian Sepikul Segendongan (2:1)",
      "Rasio Pembagian Kum-Kum Kupat (Sama Rata 1:1)"
    ]
  },
  {
    id: "layer_05",
    label: "LAYER_05",
    title: "LAPORAN & DOKUMEN",
    subtitle: "Laporan Final & Dokumentasi",
    desc: "Menerbitkan berkas resmi hasil kalkulasi pembagian waris yang transparan, lengkap dengan dasar hukum, rincian nominal rupiah, dan rujukan pasal pendukung untuk kesepakatan keluarga.",
    features: [
      "Penerbitan Laporan Resmi Unduh PDF",
      "Lembar Rincian Keputusan per Ahli Waris",
      "Lampiran Rujukan Pasal & Dalil Syar'i",
      "Panduan Teknis Pembagian Harta Fisik"
    ]
  }
];

// Terminal simulation logs (Indonesian)
const terminalLogs = [
  "$ e-mawarits init-kalkulator",
  "> Menganalisis silsilah keluarga & hubungan darah...",
  "> 3 landasan hukum diaktifkan (Islam, Adat, Perdata)...",
  "> MENGHITUNG PORSI AHLI WARIS UTAMA...",
  "AGENT ID   DEPT        STATUS    CAPACITY",
  "istri_01   PASANGAN    ONLINE    1/8 (Dzawil)",
  "anak_l_01  KETURUNAN   ONLINE    2/3 (Ashabah)",
  "anak_p_01  KETURUNAN   ONLINE    1/3 (Ashabah)",
  "ℹ Porsi terdistribusi:",
  "- Istri (12.5% porsi)",
  "- Anak Laki-laki (47.2% porsi)",
  "- Anak Perempuan (23.6% porsi)",
  "Success! Perhitungan selesai dengan akurasi 100%.",
  "> Status: Bebas sengketa & terverifikasi.",
  "> Selisih nominal pembagian: Rp0"
];
const manualDot1Coords = [
  { x: 90, y: 175, opacity: 1 },
  { x: 270, y: 87.5, opacity: 1 },
  { x: 450, y: 175, opacity: 1 },
  { x: 630, y: 87.5, opacity: 1 },
  { x: 810, y: 175, opacity: 1 },
  { x: 810, y: 175, opacity: 0 },
];

const manualDot2Coords = [
  { x: 90, y: 175, opacity: 1 },
  { x: 270, y: 262.5, opacity: 1 },
  { x: 450, y: 175, opacity: 1 },
  { x: 450, y: 175, opacity: 0 },
  { x: 450, y: 175, opacity: 0 },
  { x: 450, y: 175, opacity: 0 },
];

const aiDotCoords = [
  { x: 90, y: 175, opacity: 1 },
  { x: 450, y: 175, opacity: 1 },
  { x: 810, y: 175, opacity: 1 },
  { x: 810, y: 175, opacity: 0 },
];

export default function HomePage() {
  const [isManualWorkflow, setIsManualWorkflow] = useState(false);
  const [activeLayer, setActiveLayer] = useState(0);
  
  const [manualStep, setManualStep] = useState(0);
  const [aiStep, setAiStep] = useState(0);

  // Reset steps when toggling
  useEffect(() => {
    setManualStep(0);
    setAiStep(0);
  }, [isManualWorkflow]);

  // Timer for Manual Step (loops 0 to 5)
  useEffect(() => {
    if (!isManualWorkflow) return;
    const interval = setInterval(() => {
      setManualStep((prev) => (prev + 1) % 6);
    }, 1500);
    return () => clearInterval(interval);
  }, [isManualWorkflow]);

  // Timer for AI Step (loops 0 to 3)
  useEffect(() => {
    if (isManualWorkflow) return;
    const interval = setInterval(() => {
      setAiStep((prev) => (prev + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, [isManualWorkflow]);
  
  // Terminal animation states
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Background mouse position for visual effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Run terminal command simulation
  useEffect(() => {
    if (!isPlaying) return;

    if (terminalIndex < terminalLogs.length) {
      const timer = setTimeout(() => {
        setTerminalLines((prev) => [...prev, terminalLogs[terminalIndex]]);
        setTerminalIndex((prev) => prev + 1);
      }, terminalIndex === 0 ? 500 : terminalIndex === 4 ? 1000 : 600);
      return () => clearTimeout(timer);
    } else {
      // Loop after 5 seconds
      const loopTimer = setTimeout(() => {
        setTerminalLines([]);
        setTerminalIndex(0);
      }, 5000);
      return () => clearTimeout(loopTimer);
    }
  }, [terminalIndex, isPlaying]);

  const restartTerminal = () => {
    setTerminalLines([]);
    setTerminalIndex(0);
    setIsPlaying(true);
  };

  const currentSystem = ladderSteps[activeLayer];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden relative font-sans">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[900px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 blur-[140px]" />
        <div className="absolute top-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-blue-400/20 to-indigo-400/20 blur-[120px]" />
      </div>

      <div className="absolute inset-0 bg-dot-grid opacity-75 pointer-events-none z-0" />

      {/* ── 1. HERO SECTION (Split Left Text, Right Terminal) ── */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center pt-28 pb-12 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
           {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-extrabold text-blue-500 font-mono tracking-[0.2em] uppercase"
            >
              — PROSES KALKULASI OTOMATIS —
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.05] text-slate-955"
            >
              Sistem Waris yang Bekerja Sesuai Syariat.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed"
            >
              Kami merancang sistem yang menghitung pembagian secara otomatis—tanpa celah keraguan. Pembagian porsi waris secara presisi dan transparan langsung ke ahli waris Anda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="pt-2"
            >
              <Link href="/kalkulator" className="inline-flex px-8 py-4 bg-slate-950 text-white rounded-full font-bold text-xs hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-950/10 items-center gap-2">
                Mulai Kalkulasi Waris <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right Terminal */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Terminal Header */}
              <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-200/80">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-450 block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 block" />
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                  <Code size={12} />
                  <span>e-mawarits-engine.sh</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer">
                    <Zap size={10} className={isPlaying ? "opacity-50" : "text-emerald-500"} />
                  </button>
                  <button onClick={restartTerminal} className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer">
                    <Clock size={10} />
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-[11px] leading-relaxed text-slate-600 min-h-[280px] text-left bg-slate-50/30">
                <div className="space-y-1">
                  {terminalLines.map((line, i) => {
                    let colorClass = "text-slate-600";
                    if (line.startsWith("$")) colorClass = "text-emerald-600 font-bold";
                    else if (line.startsWith(">")) colorClass = "text-slate-400";
                    else if (line.startsWith("AGENT ID")) colorClass = "text-slate-500 underline";
                    else if (line.startsWith("Success!")) colorClass = "text-emerald-600 font-extrabold";
                    else if (line.startsWith("istri_01")) colorClass = "text-blue-600 font-bold";
                    else if (line.startsWith("anak_")) colorClass = "text-blue-600 font-bold";
                    return (
                      <div key={i} className={colorClass}>
                        {line}
                      </div>
                    );
                  })}
                  {isPlaying && (
                    <span className="w-1.5 h-4 bg-slate-400 inline-block animate-pulse align-middle ml-1" />
                  )}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── 2. TRUSTED BY LOGO BAND ── */}
      <section className="relative z-10 border-y border-slate-200/50 bg-white py-10">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.p variants={staggerChild} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Terpercaya untuk kepatuhan hukum waris nasional
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-35 grayscale">
            {["KEMENTERIAN AGAMA", "KOMPILASI HUKUM ISLAM", "MAHKAMAH AGUNG", "HUKUM ADAT NASIONAL", "KUHPERDATA"].map((logo, idx) => (
              <motion.span 
                variants={staggerChild}
                key={idx} 
                className="font-mono text-xs font-black tracking-widest text-slate-900"
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 3. OUR CORE BELIEF SECTION ── */}
      <section className="relative z-10 py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp} className="space-y-6">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] block">
              PRINSIP UTAMA KAMI
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Tidak ada jalan pintas untuk keadilan.<br />Namun, ada metode yang teruji.
            </h2>
            <p className="text-slate-500 font-medium text-base sm:text-lg leading-relaxed pt-2">
              Bagi keluarga, kepastian waris hanya tercipta ketika selaras dengan hukum resmi nasional. Pendekatan kami telah diuji berdasarkan ratusan kasus waris riil secara nasional untuk memastikan ketepatan porsi setiap ahli waris.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 4. THE MANUAL TAX SECTION (Split Left text, Right Table) ── */}
      <section className="relative z-10 py-24 border-t border-slate-200/60 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.15 }}
              className="lg:col-span-5 space-y-6 text-left"
            >
              <motion.p variants={staggerChild} className="text-[10px] font-black text-rose-500 uppercase tracking-[0.25em]">BEBAN PROSES MANUAL</motion.p>
              <motion.h2 variants={staggerChild} className="text-3xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                Keluarga Anda menghadapi perhitungan yang rumit.
              </motion.h2>
              <motion.p variants={staggerChild} className="text-slate-500 font-medium leading-relaxed text-sm">
                Data harta waris sering kali tersebar tanpa pencatatan yang jelas. Setiap keputusan pembagian mengandalkan perhitungan manual yang rentan terhadap salah paham.
              </motion.p>
              <motion.p variants={staggerChild} className="text-slate-400 text-xs leading-relaxed font-semibold">
                Ini bukan berarti berniat tidak adil—ini adalah masalah kerumitan sistem hukum waris yang bercabang. Masalahnya bukan pada niat keluarga Anda, melainkan belum adanya visualisasi alur yang presisi.
              </motion.p>
              
              <div className="pt-6 space-y-6 border-t border-slate-200">
                <motion.div variants={staggerChild} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-500">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Akumulasi Kesalahan Hitung</h4>
                    <p className="text-xs text-slate-500 mt-1">Kesalahan pembagian porsi pecahan yang kecil dapat menumpuk dan berujung pada pelanggaran hak ahli waris lainnya.</p>
                  </div>
                </motion.div>
                
                <motion.div variants={staggerChild} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-500">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Waktu Keluarga Terbuang</h4>
                    <p className="text-xs text-slate-500 mt-1">Anggota keluarga menghabiskan waktu berhari-hari berdebat mengenai porsi masing-masing alih-alih fokus pada musyawarah kekeluargaan.</p>
                  </div>
                </motion.div>
                
                <motion.div variants={staggerChild} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-500">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Ketiadaan Validasi Tunggal</h4>
                    <p className="text-xs text-slate-500 mt-1">Ketika hukum Islam, adat, dan perdata bertabrakan tanpa penengah yang netral, keluarga menjadi penentu sepihak yang subjektif.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Task Monitor Log Column */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: false, amount: 0.15 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 bg-dot-grid">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MONITOR ANTREAN SISTEM</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">Log Aktivitas Kalkulasi Real-time</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Biaya Manual: Sangat Tinggi</p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto text-left">
                  <table className="w-full text-left font-mono text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-wider font-extrabold">
                        <th className="py-2.5">Waktu</th>
                        <th className="py-2.5">Kasus Ahli Waris</th>
                        <th className="py-2.5">Solusi Sistem</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Durasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {[
                        { time: "09:01:23", task: "Istri, 2 Anak L, 1 Anak P", sol: "Kalkulator Faraid", status: "OTOMATIS", cost: "12 sec", active: true },
                        { time: "09:15:00", task: "2 Anak Perempuan, Ibu", sol: "Kompilasi KHI", status: "OTOMATIS", cost: "0 min", active: true },
                        { time: "09:45:12", task: "Harta Gono-Gini Pasangan", sol: "Hukum Adat Jawa", status: "OTOMATIS", cost: "5 sec", active: true },
                        { time: "10:00:00", task: "Kasus Aul (Harta kurang)", sol: "Aul Engine", status: "OTOMATIS", cost: "2 sec", active: true },
                        { time: "10:30:45", task: "Pembagian Golongan I & II", sol: "Hukum Perdata", status: "OTOMATIS", cost: "45 sec", active: true },
                        { time: "11:15:00", task: "Kasus Radd (Harta sisa)", sol: "Radd Engine", status: "OTOMATIS", cost: "15 sec", active: true },
                        { time: "13:00:22", task: "Musyawarah Pembagian Adat", sol: "Rasio Sepikul", status: "OTOMATIS", cost: "1 min", active: true },
                        { time: "14:20:10", task: "Sengketa Saudara Kandung", sol: "Konsultasi Manual", status: "MANUAL", cost: "3 hari", active: false },
                        { time: "15:45:00", task: "Audit Nominal Aset", sol: "Excel Manual", status: "MANUAL", cost: "2 hari", active: false }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 text-slate-400">{row.time}</td>
                          <td className="py-3 font-bold text-slate-900">{row.task}</td>
                          <td className="py-3 text-slate-500">{row.sol}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              row.active 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
                                : "bg-slate-100 text-slate-450 border border-slate-200/50"
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className={`py-3 text-right font-bold ${row.active ? "text-emerald-600" : "text-rose-500"}`}>
                            {row.cost}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 5. OUR APPROACH SECTION ── */}
      <section className="relative z-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] mb-3">PENDEKATAN KAMI</p>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-950 tracking-tight">
              Kami tidak hanya memberi hitungan. Kami memberi kepastian hukum.
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Kebanyakan kalkulator waris hanya memberikan angka acak tanpa penjelasan detail. Kami menyajikan rincian keputusan lengkap beserta pasal-pasal hukum pendukung.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {[
              {
                t: "Analisis Berbasis Silsilah",
                d: "Kami tidak langsung menghitung angka. Kami memetakan silsilah keluarga terlebih dahulu untuk menyaring ahli waris yang berhak (hijab-mahjub)."
              },
              {
                t: "Integrasi 3 Jalur Hukum",
                d: "Sistem kami terhubung langsung dengan aturan Faraid (Islam), hukum adat Sepikul Segendongan (Jawa), dan penderajatan Golongan (Perdata)."
              },
              {
                t: "Kerahasiaan Data Keluarga",
                d: "Setiap data keluarga dan nominal aset yang Anda hitung dilindungi sepenuhnya dan tidak akan disimpan di server publik kami."
              }
            ].map((item, idx) => (
              <motion.div 
                variants={staggerChild}
                key={idx} 
                className="p-8 bg-slate-50 border border-slate-200/60 rounded-3xl space-y-4 hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-extrabold text-lg text-slate-905">{item.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 6. THE AI STACK LADDER SECTION (Stacked Cards) ── */}
      <section className="relative z-10 py-24 border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <motion.div {...fadeInUp} className="text-center mb-20">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] mb-3">5 TAHAPAN KALKULASI</p>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-950 tracking-tight">
              Proses Perhitungan yang Presisi & Transparan.
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Dari data mentah hingga keputusan final, Anda mengetahui dengan pasti porsi masing-masing ahli waris secara transparan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left [perspective:1200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSystem.id}
                  initial={{ rotateY: 90, opacity: 0, transformOrigin: "left center" }}
                  animate={{ rotateY: 0, opacity: 1, transformOrigin: "left center" }}
                  exit={{ rotateY: -90, opacity: 0, transformOrigin: "left center" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{currentSystem.label}</span>
                  </div>

                  <h3 className="text-2xl font-black tracking-tight text-slate-950">
                    {currentSystem.title} / <span className="text-blue-500">{currentSystem.subtitle}</span>
                  </h3>

                  <p className="text-slate-500 font-medium leading-relaxed text-sm">
                    {currentSystem.desc}
                  </p>

                  <div className="space-y-3 pt-2">
                    {currentSystem.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                        <span className="text-slate-700 font-bold text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Controls */}
                  <div className="pt-6 flex items-center gap-3 border-t border-slate-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLayer((prev) => (prev - 1 + ladderSteps.length) % ladderSteps.length);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-650 hover:bg-slate-200 hover:text-slate-900 transition-all text-xs font-black active:scale-90"
                      title="Sebelumnya"
                    >
                      ←
                    </button>
                    <span className="text-[10px] font-mono font-extrabold text-slate-400">
                      Tahap {activeLayer + 1} dari {ladderSteps.length}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLayer((prev) => (prev + 1) % ladderSteps.length);
                      }}
                      className="inline-flex items-center justify-center px-4 py-2 bg-slate-950 hover:bg-emerald-600 hover:text-white rounded-full transition-all text-xs font-black gap-1 shadow-sm active:scale-95 text-white"
                    >
                      <span>Lanjut</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Interactive Card Stack Column */}
            <div className="lg:col-span-6 flex justify-center items-center h-[350px] relative">
              {ladderSteps.map((sys, idx) => {
                const isCurrent = idx === activeLayer;
                const offsetIdx = (idx - activeLayer + 5) % 5; // Modulo stack logic
                
                let zIndex = 10;
                let rotate = 4;
                let translateY = 20;
                let scale = 0.9;
                let opacity = 0.5;

                if (offsetIdx === 0) { // Active
                  zIndex = 30;
                  rotate = 0;
                  translateY = 0;
                  scale = 1.0;
                  opacity = 1;
                } else if (offsetIdx === 1) { // Layer 2
                  zIndex = 25;
                  rotate = -3;
                  translateY = -12;
                  scale = 0.97;
                  opacity = 0.9;
                } else if (offsetIdx === 2) { // Layer 3
                  zIndex = 20;
                  rotate = 3;
                  translateY = -24;
                  scale = 0.94;
                  opacity = 0.8;
                } else if (offsetIdx === 3) { // Layer 4
                  zIndex = 15;
                  rotate = -5;
                  translateY = 12;
                  scale = 0.91;
                  opacity = 0.6;
                } else if (offsetIdx === 4) { // Layer 5
                  zIndex = 10;
                  rotate = 5;
                  translateY = 24;
                  scale = 0.88;
                  opacity = 0.45;
                }

                return (
                  <motion.div
                    key={sys.id}
                    animate={{
                      zIndex,
                      rotate,
                      y: translateY,
                      scale,
                      opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25
                    }}
                    onClick={() => setActiveLayer(idx)}
                    className={`absolute w-full max-w-[360px] aspect-[4/3] bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-2xl cursor-pointer select-none transition-all group ${
                      isCurrent 
                        ? "border-blue-500/35 ring-1 ring-blue-500/10" 
                        : "border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                        L0{idx + 1}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        {sys.label}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sys.subtitle}</span>
                      <h4 className="text-xl font-black text-slate-900 mt-1 tracking-tight">{sys.title}</h4>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-bold text-slate-500">
                      <span>{isCurrent ? "Tahap Aktif" : "Klik untuk melihat"}</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. SAMPLE ROADMAP SECTION (CSV Table) ── */}
      <section className="relative z-10 py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <motion.div {...fadeInUp} className="text-center mb-16 text-left">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] mb-3">BAGAN PEMBAGIAN WARIS</p>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-950 tracking-tight leading-none">
              Sebelum membagi, lihat rincian porsi secara transparan.
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl mt-4 text-sm leading-relaxed">
              Ini adalah gambaran bagan distribusi nominal E-Mawarits. Anda melihat porsi persentase, nominal rupiah, dan dasar hukum sebelum mengeksekusi pembagian harta waris.
            </p>
          </motion.div>

          {/* Table Container */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.15 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 bg-dot-grid text-left"
          >
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LOG MATRIKS PEMBAGIAN</span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">LAPORAN_WARIS_KELUARGA.CSV</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-wider font-black">
                    <th className="py-2.5">AHLI WARIS</th>
                    <th className="py-2.5">KATEGORI / PORSI</th>
                    <th className="py-2.5">METODE</th>
                    <th className="py-2.5">PERSEN</th>
                    <th className="py-2.5">NOMINAL</th>
                    <th className="py-2.5">STATUS</th>
                    <th className="py-2.5 text-right">AKURASI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { dept: "Anak Laki-laki", tool: "Ashabah (Sisa)", desc: "Bagian sisa bersama anak perempuan", type: "Hukum Islam", score: "47.2%", impact: "Rp 566.666.667", build: "Mewarisi", roi: "100%" },
                    { dept: "Anak Perempuan", tool: "Ashabah (Sisa)", desc: "Bagian sisa bersama anak laki-laki", type: "Hukum Islam", score: "23.6%", impact: "Rp 283.333.333", build: "Mewarisi", roi: "100%" },
                    { dept: "Istri", tool: "Dzawil Furudh (1/8)", desc: "Mendapat 1/8 bagian karena ada keturunan", type: "Hukum Islam", score: "12.5%", impact: "Rp 150.000.000", build: "Mewarisi", roi: "100%" },
                    { dept: "Ibu", tool: "Dzawil Furudh (1/6)", desc: "Mendapat 1/6 bagian karena ada keturunan", type: "Hukum Islam", score: "16.7%", impact: "Rp 200.000.000", build: "Mewarisi", roi: "100%" },
                    { dept: "Saudara Kandung", tool: "Terhijab (Mahjub)", desc: "Terhalang oleh adanya anak laki-laki", type: "Hukum Islam", score: "0.0%", impact: "Rp 0", build: "Terhijab", roi: "100%" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-extrabold text-slate-900">{row.dept}</td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800">{row.tool}</span>
                        <p className="text-[9px] text-slate-400 font-sans mt-0.5">{row.desc}</p>
                      </td>
                      <td className="py-3 text-slate-500">{row.type}</td>
                      <td className="py-3 text-slate-500">{row.score}</td>
                      <td className="py-3 text-slate-800 font-extrabold">{row.impact}</td>
                      <td className="py-3 text-slate-500">{row.build}</td>
                      <td className="py-3 text-right font-black text-blue-600">{row.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
              Catatan: Representasi skema kalkulasi waris — pembagian presisi total 100%
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. USE CASE: PEMBAGIAN WARIS SECTION (Toggle & Hexagon Diagram) ── */}
      <section className="relative z-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
          
          <motion.div {...fadeInUp} className="text-center mb-10">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3">
              STUDI KASUS: ALUR KERJA WARIS
            </p>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-950 tracking-tight leading-none">
              Dari 2 Minggu ke 2 Detik.
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Kami menggantikan alur kerja perhitungan manual yang rumit dan berlarut-larut dengan satu alur kalkulasi digital otomatis. Tanpa sengketa keluarga, tanpa salah hitung, tanpa bolak-balik pengurusan.
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className={`text-[10px] font-mono tracking-wider uppercase font-extrabold transition-colors duration-200 ${isManualWorkflow ? "text-rose-500" : "text-slate-400"}`}>
              Manual
            </span>
            <button 
              onClick={() => setIsManualWorkflow(!isManualWorkflow)}
              className="w-12 h-7 rounded-full p-1 transition-colors duration-300 relative bg-slate-200/80 cursor-pointer"
            >
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-5 h-5 rounded-full shadow transition-all ${isManualWorkflow ? "bg-rose-500 translate-x-0" : "bg-emerald-500 translate-x-5"}`}
              />
            </button>
            <span className={`text-[10px] font-mono tracking-wider uppercase font-extrabold transition-colors duration-200 ${!isManualWorkflow ? "text-emerald-500" : "text-slate-400"}`}>
              Alur Kerja Cerdas
            </span>
          </div>

          {/* Diagram Card */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.15 }}
            className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 relative bg-dot-grid"
          >
            
            {/* Window Dots */}
            <div className="absolute top-4 right-4 flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            </div>

            {/* Scrollable container for mobile */}
            <div className="w-full overflow-x-auto scrollbar-none py-6">
              <div className="min-w-[800px] h-[350px] relative">
                
                {/* Active States for Nodes & Paths */}
                {(() => {
                  const isNode1Active = isManualWorkflow ? (manualStep === 0) : (aiStep === 0);
                  const isNode2Active = isManualWorkflow ? (manualStep === 1) : (aiStep === 1);
                  const isNode3Active = isManualWorkflow ? (manualStep === 1) : (aiStep === 1);
                  const isNode4Active = isManualWorkflow ? (manualStep === 2) : (aiStep === 1);
                  const isNode5Active = isManualWorkflow ? (manualStep === 3) : false;
                  const isNode6Active = isManualWorkflow ? (manualStep === 4) : (aiStep === 2);

                  const isManualLine1Active = manualStep >= 1;
                  const isManualLine2Active = manualStep >= 1;
                  const isManualLine3Active = manualStep >= 2;
                  const isManualLine4Active = manualStep >= 2;
                  const isManualLine5Active = manualStep >= 3;
                  const isManualLine6Active = manualStep >= 4;

                  const isAiLine1Active = aiStep >= 1;
                  const isAiLine2Active = aiStep >= 1;
                  const isAiLine3Active = aiStep >= 2;

                  return (
                    <>
                      {/* Connection Lines (SVG) */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 900 350">
                        <AnimatePresence mode="wait">
                          {isManualWorkflow ? (
                            <motion.g 
                              key="manual-paths"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <path d="M 90,175 L 270,87.5" className={`stroke-[2] stroke-dasharray-[5,5] fill-none transition-colors duration-500 ${isManualLine1Active ? "stroke-rose-300" : "stroke-rose-100"}`} />
                              <path d="M 90,175 L 270,262.5" className={`stroke-[2] stroke-dasharray-[5,5] fill-none transition-colors duration-500 ${isManualLine2Active ? "stroke-rose-300" : "stroke-rose-100"}`} />
                              <path d="M 270,87.5 L 450,175" className={`stroke-[2] stroke-dasharray-[5,5] fill-none transition-colors duration-500 ${isManualLine3Active ? "stroke-rose-300" : "stroke-rose-100"}`} />
                              <path d="M 270,262.5 L 450,175" className={`stroke-[2] stroke-dasharray-[5,5] fill-none transition-colors duration-500 ${isManualLine4Active ? "stroke-rose-300" : "stroke-rose-100"}`} />
                              <path d="M 630,87.5 L 810,175" className={`stroke-[2] stroke-dasharray-[5,5] fill-none transition-colors duration-500 ${isManualLine6Active ? "stroke-rose-300" : "stroke-rose-100"}`} />
                              <path d="M 450,175 L 810,175" className="stroke-rose-100 stroke-[2] stroke-dasharray-[5,5] fill-none" />
                              <motion.path 
                                d="M 450,175 L 630,87.5" 
                                className={`stroke-[3] fill-none transition-colors duration-500 ${isManualLine5Active ? "stroke-rose-500" : "stroke-rose-200"}`} 
                              />
                            </motion.g>
                          ) : (
                            <motion.g 
                              key="auto-paths"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <path d="M 90,175 L 270,87.5" className={`stroke-[3] fill-none transition-colors duration-300 ${isAiLine1Active ? "stroke-emerald-400" : "stroke-emerald-100"}`} />
                              <path d="M 270,87.5 L 450,175" className={`stroke-[3] fill-none transition-colors duration-300 ${isAiLine1Active ? "stroke-emerald-400" : "stroke-emerald-100"}`} />
                              <path d="M 90,175 L 270,262.5" className={`stroke-[3] fill-none transition-colors duration-300 ${isAiLine2Active ? "stroke-emerald-400" : "stroke-emerald-100"}`} />
                              <path d="M 270,262.5 L 450,175" className={`stroke-[3] fill-none transition-colors duration-300 ${isAiLine2Active ? "stroke-emerald-400" : "stroke-emerald-100"}`} />
                              <path d="M 450,175 L 810,175" className={`stroke-[3] fill-none transition-colors duration-300 ${isAiLine3Active ? "stroke-emerald-500" : "stroke-emerald-100"}`} />
                            </motion.g>
                          )}
                        </AnimatePresence>

                        {/* Animated Glowing Particle Dots */}
                        {isManualWorkflow ? (
                          <>
                            {/* Dot 1 */}
                            <motion.circle
                              cx={manualDot1Coords[manualStep]?.x ?? 90}
                              cy={manualDot1Coords[manualStep]?.y ?? 175}
                              r="6"
                              fill="#f43f5e"
                              style={{ filter: "drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))" }}
                              animate={{
                                cx: manualDot1Coords[manualStep]?.x ?? 90,
                                cy: manualDot1Coords[manualStep]?.y ?? 175,
                                opacity: manualDot1Coords[manualStep]?.opacity ?? 1,
                              }}
                              transition={{ duration: 1.2, ease: "easeInOut" }}
                            />
                            {/* Dot 2 */}
                            <motion.circle
                              cx={manualDot2Coords[manualStep]?.x ?? 90}
                              cy={manualDot2Coords[manualStep]?.y ?? 175}
                              r="6"
                              fill="#f43f5e"
                              style={{ filter: "drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))" }}
                              animate={{
                                cx: manualDot2Coords[manualStep]?.x ?? 90,
                                cy: manualDot2Coords[manualStep]?.y ?? 175,
                                opacity: manualDot2Coords[manualStep]?.opacity ?? 1,
                              }}
                              transition={{ duration: 1.2, ease: "easeInOut" }}
                            />
                          </>
                        ) : (
                          <motion.circle
                            cx={aiDotCoords[aiStep]?.x ?? 90}
                            cy={aiDotCoords[aiStep]?.y ?? 175}
                            r="6"
                            fill="#10b981"
                            style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))" }}
                            animate={{
                              cx: aiDotCoords[aiStep]?.x ?? 90,
                              cy: aiDotCoords[aiStep]?.y ?? 175,
                              opacity: aiDotCoords[aiStep]?.opacity ?? 1,
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        )}
                      </svg>

                      {/* Node 1: Ahli Waris */}
                      <div className="absolute left-[10%] top-[50%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isNode1Active 
                            ? isManualWorkflow 
                              ? "border-rose-500 ring-4 ring-rose-500/20 text-rose-600 scale-105 shadow-lg shadow-rose-500/20" 
                              : "border-emerald-500 ring-4 ring-emerald-500/20 text-emerald-600 scale-105 shadow-lg shadow-emerald-500/20"
                            : "border-slate-200 text-slate-400"
                        }`}>
                          <Users size={18} />
                        </div>
                        <div className="mt-4 text-center">
                          <span className={`text-[10px] font-black uppercase tracking-tight block transition-colors duration-300 ${isNode1Active ? (isManualWorkflow ? "text-rose-600" : "text-emerald-600") : "text-slate-800"}`}>AHLI WARIS</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono block mt-0.5">Sales Rep</span>
                        </div>
                      </div>

                      {/* Node 2: Aturan Faraid */}
                      <div className="absolute left-[30%] top-[25%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isNode2Active 
                            ? isManualWorkflow 
                              ? "border-rose-500 ring-4 ring-rose-500/20 text-rose-600 scale-105 shadow-lg shadow-rose-500/20" 
                              : "border-emerald-500 ring-4 ring-emerald-500/20 text-emerald-600 scale-105 shadow-lg shadow-emerald-500/20"
                            : "border-slate-200 text-slate-400"
                        }`}>
                          <Code size={18} />
                        </div>
                        <div className="mt-4 text-center">
                          <span className={`text-[10px] font-black uppercase tracking-tight block transition-colors duration-300 ${isNode2Active ? (isManualWorkflow ? "text-rose-600" : "text-emerald-600") : "text-slate-800"}`}>ATURAN FARAID</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono block mt-0.5">HubSpot</span>
                        </div>
                      </div>

                      {/* Node 3: Aset Keluarga */}
                      <div className="absolute left-[30%] top-[75%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isNode3Active 
                            ? isManualWorkflow 
                              ? "border-rose-500 ring-4 ring-rose-500/20 text-rose-600 scale-105 shadow-lg shadow-rose-500/20" 
                              : "border-emerald-500 ring-4 ring-emerald-500/20 text-emerald-600 scale-105 shadow-lg shadow-emerald-500/20"
                            : "border-slate-200 text-slate-400"
                        }`}>
                          <FileText size={18} />
                        </div>
                        <div className="mt-4 text-center">
                          <span className={`text-[10px] font-black uppercase tracking-tight block transition-colors duration-300 ${isNode3Active ? (isManualWorkflow ? "text-rose-600" : "text-emerald-600") : "text-slate-800"}`}>ASET KELUARGA</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono block mt-0.5">Price Sheet</span>
                        </div>
                      </div>

                      {/* Node 4: Hitung Porsi */}
                      <div className="absolute left-[50%] top-[50%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isNode4Active 
                            ? isManualWorkflow 
                              ? "border-rose-500 ring-4 ring-rose-500/20 text-rose-600 scale-105 shadow-lg shadow-rose-500/20" 
                              : "border-emerald-500 ring-4 ring-emerald-500/20 text-emerald-600 scale-105 shadow-lg shadow-emerald-500/20"
                            : "border-slate-200 text-slate-400"
                        }`}>
                          <Zap size={18} />
                        </div>
                        <div className="mt-4 text-center">
                          <span className={`text-[10px] font-black uppercase tracking-tight block transition-colors duration-300 ${isNode4Active ? (isManualWorkflow ? "text-rose-600" : "text-emerald-600") : "text-slate-800"}`}>HITUNG PORSI</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono block mt-0.5">Writer</span>
                        </div>
                      </div>

                      {/* Node 5: Berkas Laporan */}
                      <div className="absolute left-[70%] top-[25%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isNode5Active 
                            ? "border-rose-500 ring-4 ring-rose-500/25 text-rose-600 scale-110 animate-pulse shadow-lg shadow-rose-500/20" 
                            : "border-slate-200 text-slate-400"
                        }`}>
                          <Clock size={18} />
                        </div>
                        <div className="mt-4 text-center relative">
                          <span className={`text-[10px] font-black uppercase tracking-tight block transition-colors duration-300 ${isNode5Active ? "text-rose-600" : "text-slate-800"}`}>BERKAS LAPORAN</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono block mt-0.5">Canva</span>
                          {isNode5Active && (
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 font-sans font-extrabold text-[8px] rounded uppercase tracking-wider block whitespace-nowrap animate-bounce z-20">
                              Mandek (2 Minggu)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Node 6: Distribusi Selesai */}
                      <div className="absolute left-[90%] top-[50%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center shadow-md transition-all duration-300 ${
                          isNode6Active 
                            ? isManualWorkflow 
                              ? "border-rose-500 ring-4 ring-rose-500/20 text-rose-600 scale-105 shadow-lg shadow-rose-500/20" 
                              : "border-emerald-500 ring-4 ring-emerald-500/20 text-emerald-600 scale-105 shadow-lg shadow-emerald-500/20"
                            : "border-slate-200 text-slate-450"
                        }`}>
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="mt-4 text-center">
                          <span className={`text-[10px] font-black uppercase tracking-tight block transition-colors duration-300 ${isNode6Active ? (isManualWorkflow ? "text-rose-600" : "text-emerald-600") : "text-slate-800"}`}>DISTRIBUSI</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono block mt-0.5">Client</span>
                        </div>
                      </div>
                    </>
                  );
                })()}

              </div>
            </div>

            {/* Bottom Info Status (Centered Badge) */}
            <div className="mt-6 border-t border-slate-100 pt-6 flex justify-center">
              <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded border text-[10px] font-mono font-extrabold uppercase tracking-widest transition-all duration-300 ${
                isManualWorkflow 
                  ? "bg-rose-50 border-rose-200 text-rose-600" 
                  : "bg-emerald-50 border-emerald-200 text-emerald-600"
              }`}>
                ⏱ Durasi Perhitungan: {isManualWorkflow ? "2 Minggu" : "2 Detik"}
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ── 9. CALL TO ACTION SECTION ── */}
      <section className="relative z-10 py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-800"
        >
          {/* Glowing background */}
          <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-2xl leading-tight">
              Setiap keluarga berhak mendapatkan kepastian hukum yang adil.
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-medium text-sm leading-relaxed">
              Kami tidak hanya memberikan hitungan acak, melainkan kepastian pembagian waris yang sah, transparan, dan sesuai aturan hukum yang berlaku secara nasional.
            </p>
            <div className="flex justify-center">
              <Link href="/kalkulator" className="inline-flex px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-black text-xs transition-all items-center gap-2 shadow-lg shadow-emerald-500/15">
                Mulai Hitung Waris Sekarang <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}