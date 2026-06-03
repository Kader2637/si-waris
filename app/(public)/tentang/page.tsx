"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Scale, BookOpen, Heart, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

const values = [
  { icon: Scale, title: "Keadilan", desc: "Setiap hitungan berpedoman pada sumber hukum yang sah — Al-Qur'an, tradisi adat, maupun KUHPerdata.", color: "emerald" },
  { icon: BookOpen, title: "Transparansi", desc: "Setiap hasil dilengkapi dalil atau dasar hukum yang jelas agar mudah dipahami dan diverifikasi.", color: "blue" },
  { icon: Heart, title: "Aksesibilitas", desc: "Gratis untuk semua. Mendukung 3 sistem hukum: Faraid, Adat Jawa, dan Perdata dalam satu platform.", color: "red" },
  { icon: Target, title: "Akurasi", desc: "Engine multi-hukum mendeteksi Aul, Radd, Gharrawain (Islam) dan Sepikul/Kum-kum (Adat) secara otomatis.", color: "amber" },
];
const cardColorMap: Record<string, { 
  borderHover: string; 
  shadowHover: string; 
  iconBg: string; 
  iconText: string; 
  orbBg: string;
  gradFrom: string;
}> = {
  emerald: {
    borderHover: "hover:border-emerald-500/40",
    shadowHover: "hover:shadow-emerald-500/10",
    iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500/20",
    iconText: "text-emerald-600 group-hover:text-emerald-750",
    orbBg: "bg-emerald-500/5",
    gradFrom: "from-emerald-50/30",
  },
  blue: {
    borderHover: "hover:border-blue-500/40",
    shadowHover: "hover:shadow-blue-500/10",
    iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-500/20",
    iconText: "text-blue-600 group-hover:text-blue-700",
    orbBg: "bg-blue-500/5",
    gradFrom: "from-blue-50/30",
  },
  red: {
    borderHover: "hover:border-rose-500/40",
    shadowHover: "hover:shadow-rose-500/10",
    iconBg: "bg-rose-50 text-rose-600 group-hover:bg-rose-500/20",
    iconText: "text-rose-600 group-hover:text-rose-700",
    orbBg: "bg-rose-500/5",
    gradFrom: "from-rose-50/30",
  },
  amber: {
    borderHover: "hover:border-amber-500/40",
    shadowHover: "hover:shadow-amber-500/10",
    iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-500/20",
    iconText: "text-amber-600 group-hover:text-amber-700",
    orbBg: "bg-amber-500/5",
    gradFrom: "from-amber-50/30",
  },
};

const timeline = [
  { year: "2024", badge: "01", title: "Latar Belakang", desc: "Sengketa waris kerap terjadi karena perbedaan sistem hukum (Islam, Adat, Perdata) dan minimnya alat bantu hitung yang mudah diakses masyarakat." },
  { year: "2025", badge: "02", title: "Inisiasi Proyek", desc: "E-MAWARITS dikembangkan sebagai platform multi-hukum pertama yang mengintegrasikan Faraid, Adat Jawa (Sepikul Segendongan & Kum-kum Kupat), dan Perdata." },
  { year: "2026", badge: "03", title: "Peluncuran Sistem", desc: "Sistem berjalan penuh dengan 3 engine kalkulasi, arsip digital, dan kalkulator instan yang mendukung seluruh kebutuhan pembagian waris di Indonesia." },
];



export default function TentangPage() {
  const timelineRef = useRef<HTMLDivElement>(null);

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
  
  // Track scroll position in timeline section for the active bar
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-slate-50 overflow-x-hidden text-slate-900 relative">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[700px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-300/10 to-emerald-500/15 blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-dot-grid opacity-75 pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6 lg:px-8 border-b border-slate-200/50 max-w-7xl mx-auto">
        <div className="relative w-full">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest mb-6">
              Tentang E-MAWARITS
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-6">
              Membangun Sistem Waris yang <span className="text-emerald-600">Bermartabat.</span>
            </h1>
            <p className="text-base text-slate-550 font-medium leading-relaxed max-w-2xl">
              E-MAWARITS lahir dari keprihatinan terhadap banyaknya sengketa waris di Indonesia — baik dalam keluarga Muslim, penganut adat, maupun hukum perdata — yang sebenarnya bisa dicegah dengan panduan distribusi yang benar, adil, dan transparan.
            </p>

            {/* 3 hukum badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100/50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">☪ Hukum Islam (Faraid)</span>
              <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-100/50 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-wider">🏛 Hukum Adat Jawa</span>
              <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-100/50 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-wider">⚖ Hukum Perdata (BW)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8 border-y border-slate-200/50 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.4] pointer-events-none" />
        <div className="relative w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="text-center mb-12"
          >
            <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[9px] mb-2">Nilai yang Kami Pegang</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Empat Pilar Utama</h2>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((v, i) => {
              const colors = cardColorMap[v.color] || cardColorMap.emerald;
              return (
                <motion.div 
                  key={i} 
                  variants={staggerChild}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className={`bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 transition-all duration-300 shadow-sm cursor-pointer group ${colors.borderHover} ${colors.shadowHover} relative overflow-hidden`}
                >
                  {/* Floating glow orb */}
                  <div className={`absolute top-0 right-0 w-24 h-24 ${colors.orbBg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${colors.iconBg}`}>
                    <v.icon size={20} />
                  </div>
                  <h3 className="relative z-10 font-extrabold text-slate-900 text-base mb-2 group-hover:text-slate-950 transition-colors duration-300">{v.title}</h3>
                  <p className="relative z-10 text-slate-500 font-semibold text-xs leading-relaxed group-hover:text-slate-700 transition-colors duration-300">{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="text-center mb-16"
          >
            <p className="text-emerald-700 font-black uppercase tracking-[0.2em] text-[9px] mb-2">Perjalanan Proyek</p>
            <h2 className="text-3xl font-black text-slate-955 tracking-tight">Dari Ide ke Realita</h2>
          </motion.div>
          
          <div ref={timelineRef} className="relative space-y-8 pb-4 max-w-3xl w-full">
            {/* Background Grey line */}
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-200/60" />

            {/* Foreground Scroll-Animated Green line */}
            <motion.div 
              style={{ scaleY }}
              className="absolute left-6 top-2 bottom-2 w-0.5 bg-emerald-500 origin-top z-10"
            />

            {timeline.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex gap-6 items-start relative"
              >
                {/* Timeline badge */}
                <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex flex-col items-center justify-center font-black flex-shrink-0 z-20 shadow-md text-xs relative overflow-hidden group">
                  <span className="text-[7px] text-slate-400 leading-none mb-0.5">{t.year}</span>
                  <span className="leading-none text-emerald-450">{t.badge}</span>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 bg-white/80 backdrop-blur-md border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:border-emerald-500/30 hover:bg-white transition-all duration-300 hover:shadow-lg">
                  <h3 className="font-extrabold text-slate-900 text-base mb-2">{t.title}</h3>
                  <p className="text-slate-505 font-semibold text-xs leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 lg:px-8 max-w-7xl mx-auto">
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
              Siap Menghitung Waris Sekarang?
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-medium text-sm leading-relaxed">
              Gunakan E-MAWARITS untuk menghitung pembagian secara cepat, transparan, dan sesuai aturan hukum yang berlaku.
            </p>
            <div className="flex justify-center">
              <Link href="/kalkulator" className="inline-flex px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-black text-xs transition-all items-center gap-2 shadow-lg shadow-emerald-500/15">
                Buka Kalkulator Waris <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
