"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Scale, ArrowRight, ShieldCheck, BookOpen, Calculator, Users, Zap,
  CheckCircle2, Star, ChevronDown, Sparkles, HelpCircle, MousePointer2
} from "lucide-react";
import { useRef, useState } from "react";

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
  { name: "Suami", porsi: "1/2", nominal: "300 Jt", status: "Mewarisi", color: "emerald" as const },
  { name: "Ibu", porsi: "1/3 Sisa", nominal: "100 Jt", status: "Gharrawain", color: "blue" as const },
  { name: "Bapak", porsi: "Ashabah", nominal: "200 Jt", status: "Mewarisi", color: "violet" as const },
];

const heirColorMap = {
  emerald: { text500: "text-emerald-500", text600: "text-emerald-600" },
  blue: { text500: "text-blue-500", text600: "text-blue-600" },
  violet: { text500: "text-violet-500", text600: "text-violet-600" },
};

const howItWorks = [
  { step: "01", title: "Input Data Harta", desc: "Masukkan total harta kotor, utang, dan wasiat yang ditinggalkan.", icon: Calculator },
  { step: "02", title: "Daftar Ahli Waris", desc: "Tambahkan seluruh ahli waris yang ada sesuai hubungan kekeluargaan.", icon: Users },
  { step: "03", title: "Analisis Otomatis", desc: "Sistem mendeteksi kasus hijab (penghalang) dan jenis pembagian.", icon: Zap },
  { step: "04", title: "Hasil & Dalil", desc: "Dapatkan rincian pembagian dalam rupiah lengkap dengan dasar hukumnya.", icon: BookOpen },
];

const faqs = [
  { q: "Apa itu E-MAWARITS?", a: "E-MAWARITS adalah platform digital untuk menghitung pembagian waris Islam (Faraid) sesuai dengan kaidah Al-Qur'an, Sunnah, dan KHI Indonesia." },
  { q: "Apakah perhitungan ini akurat?", a: "Ya, sistem kami telah diuji dengan berbagai kasus ijtihadi seperti Aul, Radd, dan Gharrawain untuk memastikan akurasi 100% secara syar'i." },
  { q: "Apakah saya harus mendaftar untuk menggunakan kalkulator?", a: "Tidak. Kalkulator publik kami tersedia secara gratis dan dapat digunakan tanpa harus membuat akun." },
  { q: "Bagaimana jika ada kasus yang rumit?", a: "Sistem kami didesain untuk menangani kasus berlapis. Jika Anda membutuhkan bantuan lebih lanjut, silakan hubungi ahli waris profesional melalui panel admin." },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">

      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient">

        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-emerald-200/30 blur-[120px] pulse-soft" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-[120px] pulse-soft" style={{ animationDelay: "-4s" }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-10 backdrop-blur-md"
            >
              <Sparkles size={12} className="text-emerald-500" fill="currentColor" />
              Engine Faraid Standar KHI Indonesia
            </motion.div>

            <h1 className="text-[4rem] lg:text-[6rem] font-black leading-[0.9] tracking-[-0.05em] mb-8 text-slate-900">
              Keadilan dalam<br />
              <span className="gradient-text">Warisan Islam</span><br />
              di Era Digital.
            </h1>

            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-12">
              Platform modern untuk menghitung <strong className="text-slate-800">Faraid</strong> dengan akurasi mutlak, transparansi dalil, dan kemudahan akses bagi setiap muslim.
            </p>

            <div className="flex flex-wrap gap-5 mb-16">
              <Link href="/kalkulator"
                className="group flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-base hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-900/20 active:scale-95">
                <Calculator size={20} />
                Mulai Hitung Gratis
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/syariah"
                className="flex items-center gap-3 px-8 py-5 bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 rounded-2xl font-black text-base hover:bg-white hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300 active:scale-95">
                <BookOpen size={20} />
                Pelajari Syariat
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex gap-12">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{s.value}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Demo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative lg:ml-12"
          >
            {/* Decorative background cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-emerald-500/5 rounded-[4rem] -rotate-3 blur-3xl pointer-events-none" />

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[3rem] opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

              <div className="relative bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden float">
                {/* Card Header */}
                <div className="bg-slate-950 p-8 pb-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Scale size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-black text-white text-base">Analisis Faraid</p>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Kasus: Gharrawain</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20" />)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Harta Bersih (Mirkah)</p>
                    <div className="flex items-end gap-2">
                      <span className="text-white font-black text-3xl">Rp 600.000.000</span>
                      <span className="text-emerald-500 font-bold text-xs mb-1">IDR</span>
                    </div>
                  </div>
                </div>

                {/* Heirs */}
                <div className="p-8 space-y-4">
                  {demoHeirs.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                      whileHover={{ x: 8 }}
                      className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-100 transition-all group/item cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover/item:scale-110 transition-transform`}>
                          <CheckCircle2 size={20} className={heirColorMap[h.color].text500} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{h.name}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${heirColorMap[h.color].text600}`}>{h.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg leading-tight">{h.porsi}</p>
                        <p className="text-emerald-600 font-bold text-xs">Rp {h.nominal}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Status */}
                <div className="px-8 pb-8">
                  <div className="bg-emerald-600 p-4 rounded-2xl text-white flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20">
                    <ShieldCheck size={20} />
                    <span className="font-black text-sm uppercase tracking-wider">Hasil Terverifikasi Syariat</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Explore</span>
          <ChevronDown size={18} />
        </motion.div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-slate-950 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-32">
            <div>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs mb-8">Teknologi Faraid Modern</motion.p>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95]">
                Satu Ekosistem. <span className="gradient-text">Tanpa Celah</span>
              </motion.h2>
            </div>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
              Kami menggabungkan ketelitian syariat dengan algoritma mutakhir untuk memberikan solusi waris terbaik.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all duration-500"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <f.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mb-4">{f.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">{f.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-white/0 group-hover:text-emerald-400 transition-colors duration-300 font-black text-[10px] uppercase tracking-widest">
                  Detail <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-emerald-600 font-black uppercase tracking-[0.4em] text-xs mb-6">Alur Penggunaan</p>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">Cara Kerja <span className="gradient-text">E-MAWARITS</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-12 z-0" />

            {howItWorks.map((step, i) => step.icon && (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 bg-slate-50 border-4 border-white shadow-xl rounded-full flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <step.icon size={32} />
                </div>
                <div className="absolute top-0 right-0 lg:right-4 text-6xl font-black text-slate-50 -z-10 select-none group-hover:text-emerald-50 transition-colors">
                  {step.step}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CASES ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-1 w-24 bg-emerald-500 mb-10" />
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8">
              Cerdas.<br /><span className="gradient-text">Terintegrasi.</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-xl mb-12 max-w-md">
              Algoritma kami dirancang untuk mendeteksi setiap kerumitan hukum waris secara otomatis, dari <strong>Normal</strong> hingga <strong>Gharrawain</strong>.
            </p>
            <Link href="/kalkulator" className="group flex items-center gap-4 bg-slate-900 text-white w-fit px-8 py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
              Coba Simulasi <MousePointer2 size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Normal", sub: "Distribusi Sempurna", color: "emerald" as const, icon: CheckCircle2 },
              { label: "Aul", sub: "Penyesuaian Porsi", color: "amber" as const, icon: Scale },
              { label: "Radd", sub: "Pengembalian Sisa", color: "blue" as const, icon: Users },
              { label: "Gharrawain", sub: "Ijtihad Khalifah", color: "violet" as const, icon: Star },
            ].map((c, i) => {
              const caseColorMap = {
                emerald: { shadow: "hover:shadow-emerald-500/5", bg: "bg-emerald-50", text: "text-emerald-600" },
                amber: { shadow: "hover:shadow-amber-500/5", bg: "bg-amber-50", text: "text-amber-600" },
                blue: { shadow: "hover:shadow-blue-500/5", bg: "bg-blue-50", text: "text-blue-600" },
                violet: { shadow: "hover:shadow-violet-500/5", bg: "bg-violet-50", text: "text-violet-600" },
              };
              const colors = caseColorMap[c.color];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-[2.5rem] border border-white bg-white shadow-sm hover:shadow-xl ${colors.shadow} transition-all duration-300 group`}
                >
                  <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <c.icon size={24} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tighter mb-2">{c.label}</h4>
                  <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">{c.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6">Pertanyaan <span className="gradient-text">Umum</span></h2>
            <p className="text-slate-500 font-medium">Beberapa hal yang sering ditanyakan mengenai platform kami.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 hover:border-emerald-200">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-slate-800 text-lg leading-snug pr-8">{faq.q}</span>
                  <div className={`p-2 rounded-full bg-slate-100 transition-transform duration-300 ${activeFaq === i ? "rotate-180 bg-emerald-100 text-emerald-600" : ""}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: activeFaq === i ? "auto" : 0 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="p-8 pt-0 text-slate-500 font-medium leading-relaxed border-t border-slate-100/50">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-40 px-6 lg:px-16 bg-slate-950 relative overflow-hidden dark-mesh-gradient">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <motion.div className="relative max-w-4xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-emerald-500/20 pulse-soft">
            <Zap size={44} fill="currentColor" />
          </div>
          <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-10">
            Tunaikan Hak<br /><span className="gradient-text text-emerald-400">Ahli Waris.</span>
          </h2>
          <p className="text-slate-400 font-medium text-xl leading-relaxed mb-16 max-w-xl mx-auto">
            Hanya butuh beberapa menit untuk menghitung pembagian yang adil dan sesuai syariat.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/kalkulator"
              className="group flex items-center justify-center gap-3 px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/30 active:scale-95">
              <Calculator size={24} /> Buka Kalkulator
            </Link>
            <Link href="/admin/dashboard"
              className="flex items-center justify-center gap-3 px-12 py-6 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all active:scale-95">
              Dashboard Admin <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
