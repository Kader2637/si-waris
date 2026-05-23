"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, 
  ArrowRight, 
  ShieldCheck, 
  Calculator, 
  CheckCircle2, 
  Zap, 
  ChevronRight, 
  Lock, 
  Users, 
  FileText, 
  BookOpen,
  Landmark
} from "lucide-react";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
} as const;

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 overflow-x-hidden text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-300/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-300/10 blur-[100px]" />
      </div>

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="text-center lg:text-left z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 mb-6"
            >
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Platform Kalkulator Waris v1.0</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900"
            >
              Perhitungan Waris <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Akurat & Terintegrasi.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Selesaikan pembagian harta warisan secara adil menggunakan algoritma cerdas yang mendukung Hukum Syariat, Adat Jawa, dan KUHPerdata.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link href="/kalkulator" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                <Calculator size={18} /> Mulai Hitung
              </Link>
              <Link href="/tentang" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                Pelajari Fitur
              </Link>
            </motion.div>
          </div>

          <div className="relative w-full h-[600px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-full max-w-[550px] h-full">
              
              <motion.div 
                initial={{ opacity: 0, x: -30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute top-0 left-0 z-20"
              >
                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-72 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><Scale size={24} /></div>
                    <div>
                      <p className="font-black text-slate-900 text-base">Hukum Islam</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sistem Faraid</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center border border-slate-100">
                    <span className="text-sm font-bold text-slate-600">Akurasi</span>
                    <span className="text-sm font-black text-emerald-600 uppercase tracking-tighter">100% Valid</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                className="absolute top-[28%] right-0 z-10"
              >
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="w-72 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><Users size={24} /></div>
                    <div>
                      <p className="font-black text-slate-900 text-base">Adat Jawa</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tradisional</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tighter">Porsi L : P</p>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-amber-500 w-2/3" />
                      <div className="h-full bg-amber-300 w-1/3" />
                    </div>
                    <div className="flex justify-between mt-2"><span className="text-[9px] font-bold text-slate-400">Sepikul (2)</span><span className="text-[9px] font-bold text-slate-400">Segendongan (1)</span></div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                className="absolute bottom-0 left-0 lg:left-8 z-40"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="w-72 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Landmark size={24} /></div>
                    <div>
                      <p className="font-black text-slate-900 text-base">KUH Perdata</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hukum Perdata Nasional</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center border border-slate-100 mt-2">
                    <span className="text-sm font-bold text-slate-600">Dasar Hukum</span>
                    <span className="text-sm font-black text-blue-600 uppercase tracking-tighter">Pasal 852</span>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-20 -mt-8 mb-16">
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100">
          {[
            { val: "100%", lab: "Perhitungan Akurat", icon: CheckCircle2, color: "text-emerald-500" },
            { val: "3 Opsi", lab: "Sistem Hukum", icon: Scale, color: "text-blue-500" },
            { val: "0 Detik", lab: "Waktu Kalkulasi", icon: Zap, color: "text-amber-500" },
            { val: "Lokal", lab: "Privasi Data", icon: Lock, color: "text-slate-500" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center px-4">
                <Icon size={20} className={`${s.color} mb-3`} />
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{s.val}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.lab}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Showcase Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-6 lg:px-8 relative z-20 mb-20"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/30 p-2 md:p-4">
          <img src="/banner.png" alt="E-Mawarits Brand Banner" className="w-full h-auto object-cover rounded-[2rem]" />
        </div>
      </motion.div>

      <section className="py-20 bg-white relative z-10 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6"><BookOpen size={24} /></div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 tracking-tight">Fleksibilitas Pilihan Hukum.</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Masyarakat Indonesia sangat majemuk. Kami memahami bahwa setiap keluarga memiliki pendekatan berbeda dalam menyelesaikan pembagian harta.
            </p>
            <ul className="space-y-4">
              {[
                { t: "Faraid (Islam)", d: "Otomatis hitung porsi pasti (dzawil furudh) & penyelesaian Aul/Radd." },
                { t: "Adat Jawa", d: "Sistem Sepikul Segendongan (2:1) & Kum-kum Kupat (1:1)." },
                { t: "KUHPerdata", d: "Distribusi ke 4 Golongan Ahli Waris berdasar asas proporsional." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{item.t}</p>
                    <p className="text-sm text-slate-500 mt-1">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp} className="bg-slate-900 rounded-[3rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <h3 className="text-2xl font-black mb-6 relative z-10">Kenapa E-Mawarits?</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><ShieldCheck size={18} className="text-emerald-400" /></div>
                <div><p className="font-bold text-white">Validasi Algoritma</p><p className="text-slate-400 text-sm mt-1">Struktur logika kami mengikuti referensi Kompilasi Hukum Islam (KHI).</p></div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Calculator size={18} className="text-emerald-400" /></div>
                <div><p className="font-bold text-white">Bebas Error Manusia</p><p className="text-slate-400 text-sm mt-1">Perhitungan pecahan waris yang rumit diselesaikan tanpa salah hitung.</p></div>
              </div>
            </div>
            <Link href="/kalkulator" className="mt-8 w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors">
              Coba Kalkulator <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative z-10 bg-slate-50 border-b border-slate-100 mb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            <motion.div {...fadeInUp} className="lg:col-span-5">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Cara Kerja</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[
                  { icon: FileText, t: "Masukkan Harta", d: "Tentukan harta kotor, utang, dan wasiat pewaris." },
                  { icon: Users, t: "Daftar Ahli Waris", d: "Pilih anggota keluarga yang ditinggalkan (istri, anak, orang tua, dll)." },
                  { icon: Zap, t: "Hasil Instan", d: "Lihat hasil pembagian porsi secara mendetail dan otomatis." }
                ].map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 bg-white shadow-sm text-emerald-600 font-black relative z-10">
                        {i + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ml-4 md:ml-0 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <StepIcon size={16} className="text-emerald-500" />
                          <h4 className="font-bold text-slate-900">{step.t}</h4>
                        </div>
                        <p className="text-sm text-slate-500">{step.d}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-7 lg:pl-12">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Pertanyaan Umum</h2>
              <div className="space-y-4">
                {[
                  { q: "Apakah data harta waris saya disimpan?", a: "Sama sekali tidak. Aplikasi E-Mawarits memproses seluruh perhitungan di sisi browser (client-side). Ketika Anda menutup tab, data Anda hilang." },
                  { q: "Apakah hasil hitungan ini sah di mata hukum?", a: "Perhitungan kami merujuk pada KHI dan KUHPerdata secara presisi. Namun, untuk legalitas formal tetap disarankan berkonsultasi dengan notaris/KUA setempat dengan membawa hasil cetakan kami." },
                  { q: "Fitur apa saja yang ada di versi Admin?", a: "Panel Admin (sedang tahap pengembangan) digunakan untuk mengelola data referensi master (seperti persentase hukum) secara dinamis." }
                ].map((faq, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-200 transition-colors">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                      <ChevronRight size={18} className={`text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <div className="p-5 pt-0 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-20 relative z-10 bg-slate-900 overflow-hidden mb-8 max-w-6xl mx-auto rounded-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-6">Mulai Transparansi<br/>Waris Keluarga Anda.</h2>
          <p className="text-slate-400 font-medium text-lg mb-10 max-w-xl mx-auto">Gunakan kalkulator kami secara gratis, tanpa perlu mendaftar akun. Hitung sekarang, selesaikan masalah dengan damai.</p>
          <Link href="/kalkulator" className="inline-flex px-10 py-5 bg-emerald-500 text-slate-950 rounded-full font-black text-lg hover:bg-emerald-400 transition-all items-center gap-3 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <Calculator size={20} /> Buka Kalkulator Waris
          </Link>
        </div>
      </section>

    </div>
  );
}