"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Scale, ArrowRight, Landmark, Users, ChevronDown, Coins, Volume2, Sparkles, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const prinsipAdat = [
  {
    id: "sepikul",
    title: "Sepikul Segendongan",
    subtitle: "Pembagian Proporsional Tradisi Jawa",
    desc: "Metode warisan berdasarkan tanggung jawab nafkah keluarga. Anak laki-laki dianggap 'memikul' beban keluarga sehingga mendapat 2 bagian, sedangkan anak perempuan 'menggendong' sehingga mendapat 1 bagian (Rasio 2:1).",
    ratio: "2 : 1",
    filosof: "Laki-laki memikul (beban di pundak), perempuan menggendong (beban di punggung). Perbedaan porsi mencerminkan tanggung jawab nafkah dan sosial.",
    jawa: "Sing lanang mikul, sing wadon nggendong",
    icon: "🏋️",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/50",
  },
  {
    id: "kumkum",
    title: "Kum-Kum Kupat",
    subtitle: "Pembagian Sama Rata (Dum-Duman)",
    desc: "Metode berlandaskan asas kerukunan keluarga (Mangan ora mangan kumpul). Harta waris dibagi sama rata (Rasio 1:1) tanpa memandang gender, mengedepankan kesamaan hak sebagai keturunan.",
    ratio: "1 : 1",
    filosof: "Semua anak adalah keturunan kandung yang setara. Hak waris tidak bergantung pada gender melainkan gotong-royong dan kebersamaan keluarga.",
    jawa: "Mangan ora mangan kumpul",
    icon: "🤝",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200/50",
  },
];

const konsepPenting = [
  { title: "Harta Gono-Gini", desc: "Harta pencaharian bersama suami-istri dipotong 50% terlebih dahulu untuk pasangan yang hidup terlama sebelum dibagi ke waris.", jawa: "Gono-gini iku bandha sesarengane", icon: "💍" },
  { title: "Musyawarah Keluarga", desc: "Penentuan hukum waris adat selalu bersandar pada rembug keluarga agar tercipta kesepakatan damai bebas konflik.", jawa: "Rembug bareng, penak bareng", icon: "🏛️" },
  { title: "Ahli Waris Pengganti", desc: "Apabila anak pewaris meninggal terlebih dahulu, hak warisnya dapat diwakilkan oleh cucu pewaris.", jawa: "Turune nggenteni panggonane", icon: "🌿" },
  { title: "Anak Angkat (Pupon)", desc: "Anak angkat berhak memperoleh bagian gono-gini (harta pencarian bersama) melalui hibah, namun tidak atas harta asal.", jawa: "Anak pupon oleh gono-gini", icon: "👶" },
];

const tabelPerbandingan = [
  { aspek: "Dasar Hukum", sepikul: "Tradisi tanggung jawab sosial Jawa", kumkum: "Asas kerukunan & kebersamaan" },
  { aspek: "Rasio Laki-laki : Perempuan", sepikul: "2 : 1", kumkum: "1 : 1 (Sama Rata)" },
  { aspek: "Filosofi Utama", sepikul: "Beban tanggung jawab nafkah keluarga", kumkum: "Kesetaraan hak keturunan kandung" },
  { aspek: "Pemotongan Gono-Gini", sepikul: "Ya, dipotong 50% terlebih dahulu", kumkum: "Ya, dipotong 50% terlebih dahulu" },
  { aspek: "Gaya Penerapan", sepikul: "Komunitas Jawa tradisional/pedesaan", kumkum: "Masyarakat Jawa perkotaan/modern" },
  { aspek: "Prinsip Utama", sepikul: "Keadilan proporsional", kumkum: "Kedamaian & keutuhan keluarga" },
];

export default function AdatJawaPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const wayangY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const wayangRotate = useTransform(scrollYProgress, [0, 1], [0, 3]);

  // Speech Synthesis State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dynamic balance scale simulator settings
  const [simulasiMethod, setSimulasiMethod] = useState<"sepikul" | "kumkum">("sepikul");
  const [hartaSimulasi, setHartaSimulasi] = useState(300000000);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayAudio = (text: string) => {
    if (typeof window === "undefined") return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(voice => voice.lang.includes("id") || voice.lang.includes("ID"));
      if (idVoice) utterance.voice = idVoice;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        if ((window as any)._activeUtterance === utterance) {
          (window as any)._activeUtterance = null;
        }
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        if ((window as any)._activeUtterance === utterance) {
          (window as any)._activeUtterance = null;
        }
      };
      
      (window as any)._activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }, 100);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  // Math variables
  const isSepikul = simulasiMethod === "sepikul";
  const porsiLaki = isSepikul ? (hartaSimulasi * 2) / 3 : hartaSimulasi / 2;
  const porsiPerempuan = isSepikul ? hartaSimulasi / 3 : hartaSimulasi / 2;

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: false, amount: 0.15 }
  };

  const staggerChild = {
    initial: { opacity: 0, y: 30 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="bg-slate-50 overflow-x-hidden text-slate-900 selection:bg-amber-100 selection:text-amber-900 relative">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[900px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-amber-400/20 to-orange-400/20 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-yellow-300/10 to-amber-500/15 blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-dot-grid opacity-75 pointer-events-none z-0" />

      {/* ── 1. PREMIUM SPLIT HERO SECTION ── */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center pt-28 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Text Box */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] font-extrabold text-amber-800 uppercase tracking-widest"
            >
              <Sparkles size={12} className="animate-spin text-amber-600" />
              <span>Sistem Hukum Adat Jawa</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.05] text-slate-950"
            >
              Kerukunan Keluarga & <span className="text-amber-700">Musyawarah.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base text-slate-500 font-medium leading-relaxed"
            >
              Hukum waris adat Jawa bersandar pada nilai kebersamaan, keadilan sosial, dan gotong royong. Menyelesaikan pembagian warisan melalui rembug keluarga demi kedamaian batin.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 items-center"
            >
              <Link href="/kalkulator" className="inline-flex px-6 py-3.5 bg-amber-800 text-white rounded-xl font-bold text-xs hover:bg-amber-700 transition-all shadow-md shadow-amber-800/10 items-center gap-1.5">
                Hitung Waris Adat <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => handlePlayAudio("Hukum waris adat Jawa mengedepankan asas kekeluargaan dan musyawarah keluarga untuk mencapai kerukunan bersama. Dua pilar utama metode yang didukung adalah Sepikul Segendongan dengan rasio pembagian dua banding satu antara laki-laki dan perempuan berdasarkan beban tanggung jawab nafkah, serta metode Kum-kum Kupat yang membagi harta secara sama rata tanpa membedakan jenis kelamin.")}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm border ${
                  isSpeaking 
                    ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
                    : "bg-white border-amber-250 text-amber-800 hover:bg-amber-50 cursor-pointer"
                }`}
              >
                <Volume2 size={14} className={isSpeaking ? "animate-pulse" : ""} />
                <span>{isSpeaking ? "Hentikan Suara" : "Dengarkan Penjelasan"}</span>
              </button>
            </motion.div>

            {/* Javanese Quote Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4 max-w-md"
            >
              <p className="text-amber-900 font-extrabold text-sm italic text-center">"Rukun agawe santosa, crah agawe bubrah"</p>
              <p className="text-[9px] font-black text-amber-550 uppercase tracking-widest text-center mt-1">Pepatah Kerukunan Jawa</p>
            </motion.div>
          </div>

          {/* Right interactive balancer panel */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
              className="w-full max-w-[420px] bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative bg-dot-grid"
            >
              {/* Window dots */}
              <div className="absolute top-4 right-4 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="w-2 h-2 rounded-full bg-slate-200" />
              </div>

              <div className="text-left mb-4">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">WIDGET BALANCER ADAT</span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">Timbangan Keseimbangan Porsi</h3>
              </div>

              {/* Timbangan SVG */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex items-center justify-center min-h-[220px]">
                <svg viewBox="0 0 400 240" className="w-full h-full max-h-[220px] drop-shadow-sm">
                  {/* Stand */}
                  <path d="M 185,210 L 215,210 L 205,210 L 205,120 L 195,120 L 195,210 Z" fill="#78350f" opacity="0.85" />
                  <path d="M 165,210 L 235,210" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
                  
                  {/* Pivot */}
                  <circle cx="200" cy="115" r="7" fill="#451a03" />
                  
                  {/* Dynamic Arm */}
                  <motion.g
                    animate={{ rotate: isSepikul ? -10 : 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    style={{ originX: "200px", originY: "115px" }}
                  >
                    {/* Beam */}
                    <line x1="80" y1="115" x2="320" y2="115" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
                    
                    {/* Left Plate (Laki-laki) */}
                    <line x1="80" y1="115" x2="80" y2="155" stroke="#78350f" strokeWidth="1.5" />
                    <line x1="80" y1="155" x2="60" y2="175" stroke="#78350f" strokeWidth="1.5" />
                    <line x1="80" y1="155" x2="100" y2="175" stroke="#78350f" strokeWidth="1.5" />
                    <path d="M 50,175 L 110,175 Q 80,205 50,175 Z" fill="#d97706" opacity="0.9" />
                    
                    {/* Right Plate (Perempuan) */}
                    <line x1="320" y1="115" x2="320" y2="155" stroke="#78350f" strokeWidth="1.5" />
                    <line x1="320" y1="155" x2="300" y2="175" stroke="#78350f" strokeWidth="1.5" />
                    <line x1="320" y1="155" x2="340" y2="175" stroke="#78350f" strokeWidth="1.5" />
                    <path d="M 290,175 L 350,175 Q 320,205 290,175 Z" fill="#f59e0b" opacity="0.9" />
                  </motion.g>
                </svg>
              </div>

              {/* Balancer Toggles */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {prinsipAdat.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setSimulasiMethod(m.id as any)}
                    className={`py-2 px-3 border rounded-xl text-left transition-all cursor-pointer ${
                      simulasiMethod === m.id 
                        ? "bg-slate-950 border-slate-950 text-white shadow-md"
                        : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    <p className="font-extrabold text-[10px] leading-tight">{m.title}</p>
                    <span className="text-[8px] font-mono opacity-80 font-bold block mt-0.5">Rasio {m.ratio}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── 2. TWO MAIN PRINCIPLES SECTION ── */}
      <section className="relative z-10 py-20 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.15 }}
          className="w-full"
        >
          <motion.div variants={staggerChild} className="text-center mb-16">
            <p className="text-amber-700 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Pondasi Hukum Adat</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
              Dua Pilar Utama Waris Adat
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed mt-3">
              Masyarakat adat Jawa menganut dua mekanisme pembagian porsi utama yang dapat dipilih secara fleksibel sesuai kesepakatan bersama keluarga.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {prinsipAdat.map((p, i) => (
              <motion.div 
                key={p.id} 
                variants={staggerChild}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/85 backdrop-blur-md border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Floating glow background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                      {p.icon}
                    </span>
                    <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-850 font-black text-[9px] uppercase tracking-wider rounded-lg">
                      Rasio {p.ratio}
                    </span>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100/30 rounded-2xl p-4 text-center">
                    <p className="text-amber-900 font-black text-xs italic">"{p.jawa}"</p>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-lg mb-1 tracking-tight">{p.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.subtitle}</p>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-3">{p.desc}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 mt-6 bg-slate-50/50 rounded-2xl p-4 border">
                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest block mb-1">Filosofi Adat</span>
                  <p className="text-xs text-slate-705 font-bold leading-relaxed">{p.filosof}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 3. INTERACTIVE SIMULATOR DASHBOARD ── */}
      <section className="relative z-10 py-20 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.15 }}
          className="w-full"
        >
          <motion.div variants={staggerChild} className="text-center mb-12">
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-black uppercase rounded-lg tracking-wider">
              Kalkulator Dashboard
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mt-3">
              Simulator Simulasi Pembagian
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed mt-3">
              Geser slider nominal harta pencarian untuk memantau perbandingan porsi nominal pembagian antara Laki-laki dan Perempuan berdasarkan metode yang dipilih.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerChild}
            className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 max-w-4xl mx-auto"
          >
            {/* Slider Controls */}
            <div className="space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Harta Waris Simulasi:</span>
                <span className="text-2xl font-black text-amber-800 font-mono">{formatIDR(hartaSimulasi)}</span>
              </div>
              
              <input 
                type="range" 
                min="50000000" 
                max="2000000000" 
                step="50000000" 
                value={hartaSimulasi} 
                onChange={(e) => setHartaSimulasi(Number(e.target.value))} 
                className="w-full h-2.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-800" 
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest font-mono">
                <span>Rp 50 Juta</span>
                <span>Rp 1 Miliar</span>
                <span>Rp 2 Miliar</span>
              </div>
            </div>

            {/* Method Tabs inside Simulator */}
            <div className="flex justify-center border-b border-slate-100 pb-5 gap-3">
              {prinsipAdat.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSimulasiMethod(m.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                    simulasiMethod === m.id
                      ? "bg-amber-800 border-amber-800 text-white shadow-lg shadow-amber-800/10 scale-105"
                      : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  {m.title} ({m.ratio})
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Laki-laki portion */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Anak Laki-laki</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Penerima Porsi</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-800 font-mono font-black text-[10px] rounded-lg">
                    {isSepikul ? "2 Bagian (2/3)" : "1 Bagian (1/2)"}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-amber-850 font-mono">{formatIDR(porsiLaki)}</p>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: isSepikul ? "66.6%" : "50%" }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-amber-700" 
                    />
                  </div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Representasi {isSepikul ? "66.7%" : "50%"} Dari Total Harta
                  </p>
                </div>
              </div>

              {/* Perempuan portion */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Anak Perempuan</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Penerima Porsi</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-800 font-mono font-black text-[10px] rounded-lg">
                    {isSepikul ? "1 Bagian (1/3)" : "1 Bagian (1/2)"}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-amber-850 font-mono">{formatIDR(porsiPerempuan)}</p>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: isSepikul ? "33.3%" : "50%" }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-amber-500" 
                    />
                  </div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Representasi {isSepikul ? "33.3%" : "50%"} Dari Total Harta
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 4. PREMIUM COMPARISON TABLE BOARD ── */}
      <section className="relative z-10 py-20 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.15 }}
          className="w-full"
        >
          <motion.div variants={staggerChild} className="flex items-center gap-3 mb-10 max-w-4xl mx-auto">
            <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center">
              <Landmark size={18} />
            </div>
            <div>
              <span className="text-[8px] font-black text-slate-450 uppercase tracking-widest block">KOMPARASI KOMPREHENSIF</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Tabel Perbandingan Metode</h2>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerChild} 
            className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 overflow-hidden shadow-lg max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-3 bg-slate-950 text-white px-6 py-4 text-xs font-black uppercase tracking-wider text-left">
              <p className="text-slate-300">Aspek Komparasi</p>
              <p className="text-amber-400">Sepikul Segendongan (2:1)</p>
              <p className="text-orange-400">Kum-Kum Kupat (1:1)</p>
            </div>
            {tabelPerbandingan.map((d, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-3 px-6 py-4 border-t border-slate-100 text-xs transition-colors duration-200 text-left ${
                  i % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/40'
                } hover:bg-amber-50/20`}
              >
                <p className="font-extrabold text-slate-900">{d.aspek}</p>
                <p className="text-slate-650 font-semibold">{d.sepikul}</p>
                <p className="text-slate-650 font-semibold">{d.kumkum}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 5. ADDITIONAL CONCEPTS CARD DECK ── */}
      <section className="relative z-10 py-20 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.15 }}
          className="w-full"
        >
          <motion.div variants={staggerChild} className="text-center mb-16">
            <span className="px-3 py-1 bg-amber-50 border border-amber-250 text-amber-800 text-[9px] font-black uppercase rounded-lg tracking-wider">
              Hukum Adat Tambahan
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mt-3">
              Kaidah & Istilah Penting Adat
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed mt-3">
              Mekanisme pembagian warisan adat Jawa turut bersandar pada empat instrumen pendukung penting berikut ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {konsepPenting.map((k, i) => (
              <motion.div 
                key={i} 
                variants={staggerChild}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-white/85 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-700/30 transition-all duration-300 shadow-sm flex flex-col justify-between text-left group"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {k.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">{k.title}</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">{k.desc}</p>
                  </div>
                </div>

                <div className="bg-amber-50/40 border border-amber-100/50 px-3.5 py-2.5 rounded-xl mt-6">
                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">Bahasa Jawa</span>
                  <p className="text-amber-800 font-black text-[10px] italic">"{k.jawa}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 6. CALL TO ACTION SECTION ── */}
      <section className="relative z-10 py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-amber-950 rounded-[2.5rem] p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl border border-amber-900"
        >
          {/* Glowing background */}
          <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-yellow-500/10 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-amber-250 font-extrabold italic text-sm mb-2">"Waris kudu adil, keluarga kudu rukun"</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-2xl leading-tight">
              Siap Menghitung Waris Adat?
            </h2>
            <p className="text-amber-100/70 mb-10 max-w-lg mx-auto font-medium text-sm leading-relaxed">
              Gunakan kalkulator kami yang sudah mengimplementasikan Sepikul Segendongan & Kum-Kum Kupat secara presisi.
            </p>
            <div className="flex justify-center">
              <Link href="/kalkulator" className="inline-flex px-8 py-4 bg-white text-amber-955 rounded-full font-black text-xs hover:bg-slate-50 transition-colors shadow-lg shadow-white/10 items-center gap-2">
                Buka Kalkulator Waris <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
