"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scale, ArrowRight, ShieldCheck, BookOpen, Calculator, Users, Zap, CheckCircle2, Star, ChevronDown, Sparkles } from "lucide-react";
import { useRef } from "react";

const features = [
  { icon: Scale, title: "Engine Faraid Pro", desc: "Deteksi otomatis Normal, Aul, Radd & Gharrawain dengan penjelasan syar'i lengkap.", color: "from-emerald-400 to-teal-500" },
  { icon: ShieldCheck, title: "Dalil Transparan", desc: "Setiap angka disertai dasar hukum dari Al-Qur'an Surah An-Nisa & ijtihad Sahabat.", color: "from-blue-400 to-indigo-500" },
  { icon: Users, title: "Manajemen Arsip", desc: "Arsip lengkap keluarga, dokumen, dan riwayat distribusi dalam satu sistem.", color: "from-violet-400 to-purple-500" },
  { icon: Calculator, title: "Kalkulator Instan", desc: "Hitung tanpa daftar akun. Masuk data, hasil langsung muncul secara real-time.", color: "from-amber-400 to-orange-500" },
];

const stats = [
  { value: "4", label: "Kasus Ijtihadi", sub: "Normal, Aul, Radd, Gharrawain" },
  { value: "100%", label: "Berdasar Syariat", sub: "Al-Qur'an & Sunnah" },
  { value: "∞", label: "Ahli Waris", sub: "Tidak ada batasan input" },
];

const demoHeirs = [
  { name: "Suami", porsi: "1/2", nominal: "300 Jt", status: "Mewarisi", color: "emerald" },
  { name: "Ibu", porsi: "1/3 Sisa", nominal: "100 Jt", status: "Gharrawain", color: "blue" },
  { name: "Bapak", porsi: "Ashabah", nominal: "200 Jt", status: "Mewarisi", color: "violet" },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

        {/* Blob backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-100 via-teal-50 to-transparent opacity-70 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-slate-100 to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-50 blur-3xl opacity-50" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-10"
            >
              <Sparkles size={12} fill="currentColor" />
              Engine Faraid Standar KHI Indonesia
            </motion.div>

            <h1 className="text-[4.5rem] lg:text-[5.5rem] font-black leading-[0.92] tracking-[-0.04em] mb-8">
              Distribusi<br />
              <span className="gradient-text">Waris Islam</span><br />
              yang Adil.
            </h1>

            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-12">
              SI-WARIS menghitung pembagian harta warisan sesuai kaidah <strong className="text-slate-800">Faraid</strong> dari Al-Qur'an — dengan penjelasan syar'i untuk setiap ahli waris.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/kalkulator"
                className="group flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-base hover:bg-emerald-600 transition-all duration-300 shadow-2xl shadow-slate-400/20 active:scale-95">
                <Calculator size={20} />
                Hitung Gratis Sekarang
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/syariah"
                className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-base hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300">
                <BookOpen size={20} />
                Pelajari Dalil
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex gap-10">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Demo Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="float"
          >
            <div className="relative">
              {/* Shadow card behind */}
              <div className="absolute inset-0 bg-emerald-600 rounded-[3rem] translate-y-4 translate-x-4 opacity-10 blur-sm" />

              {/* Main Card */}
              <div className="relative bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">

                {/* Card Header */}
                <div className="bg-slate-900 p-8 pb-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Scale size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-black text-white text-sm">Kasus Gharrawain</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Demo Analisis Syariat</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Live ✦
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 rounded-2xl p-5 border border-white/10">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Harta (Mirkah)</span>
                    <span className="text-white font-black text-2xl">Rp 600 Juta</span>
                  </div>
                </div>

                {/* Heirs */}
                <div className="p-8 space-y-4">
                  {demoHeirs.map((h, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }}
                      className={`flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-100 transition-all group cursor-default`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-${h.color}-100 text-${h.color}-600 rounded-xl flex items-center justify-center`}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{h.name}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest text-${h.color}-600`}>{h.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg">{h.porsi}</p>
                        <p className="text-emerald-600 font-bold text-sm">Rp {h.nominal}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Verified badge */}
                <div className="px-8 pb-8">
                  <div className="bg-emerald-600 p-5 rounded-2xl text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} />
                      <span className="font-black text-sm">Terverifikasi Syar'i</span>
                    </div>
                    <span className="text-emerald-100 font-black text-xs uppercase tracking-widest">An-Nisa: 11-12</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #059669 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 40%)" }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs mb-6">Platform Waris Terlengkap</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
              Satu Sistem.<br /><span className="gradient-text">Semua Kebutuhan.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mb-4">{f.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CASES ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-xs mb-6">Mesin Ijtihadi</p>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-8">
              Semua Kasus<br /><span className="gradient-text">Terdeteksi.</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-lg mb-12 max-w-md">
              Dari kasus sesederhana Normal hingga selengkap Gharrawain hasil ijtihad Umar bin Khattab ra. — semuanya ditangani secara otomatis.
            </p>
            <Link href="/syariah" className="inline-flex items-center gap-3 font-black text-slate-900 hover:text-emerald-600 transition-colors group">
              Pelajari semua dalilnya <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="space-y-5">
            {[
              { label: "Normal", sub: "Harta terbagi habis sempurna", color: "emerald", pct: "100%" },
              { label: "Aul", sub: "Penyebut dinaikkan agar proporsional", color: "amber", pct: "78%" },
              { label: "Radd", sub: "Sisa dikembalikan ke Dzawil Furud", color: "blue", pct: "65%" },
              { label: "Gharrawain", sub: "Ibu dapat 1/3 sisa (Tsulutsul Baqi)", color: "violet", pct: "45%" },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`group p-8 rounded-[2rem] border-2 border-${c.color}-50 bg-${c.color}-50/30 hover:border-${c.color}-200 hover:bg-${c.color}-50 transition-all duration-300 cursor-default`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter">{c.label}</h4>
                    <p className="text-slate-500 font-medium text-sm mt-1">{c.sub}</p>
                  </div>
                  <CheckCircle2 size={24} className={`text-${c.color}-500`} />
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-${c.color}-500 rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: c.pct }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.15 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 100%, rgba(5,150,105,0.3) 0%, transparent 60%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <motion.div className="relative max-w-4xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-12 float">
            <Zap size={44} fill="currentColor" />
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-8">
            Mulai Hitung<br /><span className="gradient-text">Sekarang Juga.</span>
          </h2>
          <p className="text-slate-400 font-medium text-xl leading-relaxed mb-16 max-w-xl mx-auto">
            Tidak perlu daftar, tidak perlu bayar. Masukkan data, hasil langsung tampil.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/kalkulator"
              className="group flex items-center justify-center gap-3 px-12 py-6 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95">
              <Calculator size={24} /> Kalkulator Gratis
            </Link>
            <Link href="/admin/dashboard"
              className="flex items-center justify-center gap-3 px-12 py-6 bg-white/10 border border-white/10 text-white rounded-2xl font-black text-xl hover:bg-white/15 transition-all">
              Panel Admin →
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
