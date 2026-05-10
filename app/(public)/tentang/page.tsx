"use client";

import { motion } from "framer-motion";
import { Scale, BookOpen, Code, Heart, Target, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const values = [
  { icon: Scale, title: "Keadilan", desc: "Setiap hitungan berpedoman pada sumber hukum yang sah — Al-Qur'an, tradisi adat, maupun KUHPerdata.", color: "emerald" },
  { icon: BookOpen, title: "Transparansi", desc: "Setiap hasil dilengkapi dalil atau dasar hukum yang jelas agar mudah dipahami dan diverifikasi.", color: "blue" },
  { icon: Heart, title: "Aksesibilitas", desc: "Gratis untuk semua. Mendukung 3 sistem hukum: Faraid, Adat Jawa, dan Perdata dalam satu platform.", color: "red" },
  { icon: Target, title: "Akurasi", desc: "Engine multi-hukum mendeteksi Aul, Radd, Gharrawain (Islam) dan Sepikul/Kum-kum (Adat) secara otomatis.", color: "amber" },
];

const timeline = [
  { year: "2024", badge: "01", title: "Latar Belakang", desc: "Sengketa waris kerap terjadi karena perbedaan sistem hukum (Islam, Adat, Perdata) dan minimnya alat bantu hitung yang mudah diakses masyarakat." },
  { year: "2025", badge: "02", title: "Inisiasi Proyek", desc: "E-MAWARITS dikembangkan sebagai platform multi-hukum pertama yang mengintegrasikan Faraid, Adat Jawa (Sepikul Segendongan & Kum-kum Kupat), dan Perdata." },
  { year: "2026", badge: "03", title: "Peluncuran Sistem", desc: "Sistem berjalan penuh dengan 3 engine kalkulasi, arsip digital, dan kalkulator instan yang mendukung seluruh kebutuhan pembagian waris di Indonesia." },
];

const techStack = [
  { name: "Next.js 15", desc: "App Router + Server Actions" },
  { name: "TypeScript", desc: "Type-safe end-to-end" },
  { name: "Prisma ORM", desc: "Relational DB layer" },
  { name: "PostgreSQL", desc: "Production database" },
  { name: "Framer Motion", desc: "Premium animations" },
  { name: "Tailwind CSS", desc: "Utility-first styling" },
];

export default function TentangPage() {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-32 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-emerald-50 via-teal-50 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 opacity-70" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-50 rounded-full -translate-x-1/2 translate-y-1/4" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-10">
              <Sparkles size={12} fill="currentColor" /> Tentang E-MAWARITS
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[0.92] tracking-[-0.04em] mb-8">
              Membangun Sistem<br />Waris yang<br />
              <span className="gradient-text">Bermartabat.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              E-MAWARITS lahir dari keprihatinan terhadap banyaknya sengketa waris di Indonesia — baik dalam keluarga Muslim, penganut adat, maupun hukum perdata — yang sebenarnya bisa dicegah dengan panduan distribusi yang benar, adil, dan transparan.
            </p>

            {/* 3 hukum badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-black">☪ Hukum Islam (Faraid)</span>
              <span className="px-4 py-2 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs font-black">🏛 Hukum Adat Jawa</span>
              <span className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs font-black">⚖ Hukum Perdata (BW)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-32 px-6 lg:px-16 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #059669 0%, transparent 50%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Nilai yang Kami Pegang</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-5xl font-black text-white tracking-tighter">Empat Pilar <span className="gradient-text">Utama</span></motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`group bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-${v.color}-500/10 hover:border-${v.color}-500/20 transition-all duration-500`}>
                <div className={`w-16 h-16 bg-${v.color}-500/20 text-${v.color}-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <v.icon size={28} />
                </div>
                <h3 className="font-black text-white text-xl tracking-tight mb-4">{v.title}</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-32 px-6 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Perjalanan Proyek</p>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Dari Ide ke <span className="gradient-text">Realita</span></h2>
          </div>
          <div className="relative space-y-8">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-slate-100 to-transparent" />

            {timeline.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex gap-10 items-start group">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center font-black flex-shrink-0 z-10 group-hover:bg-emerald-600 transition-all duration-300 shadow-xl">
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-200">{t.year}</span>
                  <span className="text-lg leading-none">{t.badge}</span>
                </div>
                <div className="flex-1 bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl shadow-slate-100/50 hover:border-emerald-100 hover:shadow-emerald-50 transition-all duration-300">
                  <h3 className="font-black text-slate-900 text-xl tracking-tight mb-3">{t.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-32 px-6 lg:px-16 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 100%, rgba(5,150,105,0.2) 0%, transparent 60%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <Code size={44} className="text-emerald-400 mx-auto mb-8" />
          <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Stack Teknologi</p>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-6">Dibangun dengan <span className="gradient-text">Modern Stack</span></h2>
          <p className="text-slate-400 font-medium text-lg mb-16 max-w-lg mx-auto">Performa tinggi, type-safe, dan siap produksi untuk sistem administrasi waris profesional.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-20">
            {techStack.map((tech, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group">
                <p className="font-black text-white text-lg tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{tech.name}</p>
                <p className="text-slate-500 text-xs font-bold">{tech.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/kalkulator" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20">
              Coba Kalkulator <ArrowRight size={20} />
            </Link>
            <Link href="/syariah" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/15 transition-all">
              <ShieldCheck size={20} /> Pelajari Hukum
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
