"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Scale, Users, ArrowRight, Quote, Volume2 } from "lucide-react";
import Link from "next/link";

const ayat = [
  {
    ref: "An-Nisa: 11",
    arabic: "يُوصِيكُمُ ٱللَّهُ فِىٓ أَوْلَٰدِكُمْ ۖ Lِلذَّكَرِ مِثْلُ حَظِّ ٱلْأُنثَيَيْنِ",
    terjemah: "Allah mensyariatkan (mewajibkan) kepadamu tentang (pembagian warisan untuk) anak-anakmu, (yaitu) bagian seorang anak laki-laki sama dengan bagian dua orang anak perempuan.",
    konteks: "Dasar pembagian Anak Laki-laki & Anak Perempuan (2:1)",
  },
  {
    ref: "An-Nisa: 12",
    arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَٰجُكُمْ",
    terjemah: "Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh istri-istrimu, jika mereka tidak mempunyai anak.",
    konteks: "Dasar bagian Suami (1/2 tanpa anak, 1/4 dengan anak)",
  },
  {
    ref: "An-Nisa: 176",
    arabic: "وَهُوَ يَرِثُهَآ إِن لَّمْ يَكُن لَّهَا وَلَدٌ",
    terjemah: "Dan saudara laki-laki mewarisi (dari saudara perempuan), jika saudara perempuan itu tidak mempunyai anak.",
    konteks: "Dasar warisan Saudara Sekandung & Kalalah",
  },
];

const hadits = [
  {
    ref: "HR. Bukhari & Muslim",
    arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لأَوْلَى رَجُلٍ ذَكَرٍ",
    terjemah: "Berikanlah bagian-bagian warisan kepada ahli warisnya, maka seandainya ada sisa, ia menjadi milik orang laki-laki yang paling dekat nasabnya (Ashabah).",
    konteks: "Dalil Dasar Ashabah (Sisa Warisan)",
  },
  {
    ref: "HR. Bukhari & Muslim",
    arabic: "لَا يَرِثُ الْمُسْلِمُ الْكَافِرَ ، وَلَا الْكَافِرُ الْمُسْلِمَ",
    terjemah: "Seorang muslim tidak mewarisi orang kafir, dan orang kafir tidak mewarisi muslim.",
    konteks: "Pencegah Kewarisan (Beda Agama)",
  },
  {
    ref: "HR. Tirmidzi, Abu Dawud, Ibnu Majah",
    arabic: "لَيْسَ Lِلْقَاتِلِ شَيْءٌ",
    terjemah: "Tidak ada bagian (warisan) sedikitpun bagi pembunuh.",
    konteks: "Pencegah Kewarisan (Pembunuhan)",
  }
];

const ijtihadCases = [
  {
    icon: "عم",
    title: "Aul (التعصيب بالكسر)",
    by: "Ijtihad: Umar bin Khattab ra.",
    desc: "Ketika total bagian lebih dari satu (penyebut kecil), maka penyebut dinaikkan (KPK bertambah) agar semua dapat bagian secara proporsional.",
    example: "Contoh: Istri (1/8) + Ibu (1/6) + 2 Anak Pr (2/3) = Aul",
    color: "amber",
  },
  {
    icon: "ر",
    title: "Radd (الرد)",
    by: "Ijtihad: Ali bin Abi Thalib ra.",
    desc: "Jika ada sisa harta dan tidak ada Ashabah, sisa tersebut dikembalikan kepada Dzawil Furud (selain Suami/Istri) secara proporsional.",
    example: "Contoh: Istri (1/4) + 1 Anak Pr (1/2) → Sisa dikembalikan ke Anak Pr",
    color: "blue",
  },
  {
    icon: "غ",
    title: "Gharrawain (الغراوين)",
    by: "Ijtihad: Umar bin Khattab ra.",
    desc: "Jika ada Suami/Istri + Ibu + Bapak tanpa keturunan, Ibu mendapat 1/3 SISA (bukan 1/3 total) agar Bapak tetap 2x lipat Ibu.",
    example: "Contoh: Suami (1/2) → Sisa 300jt → Ibu 1/3=100jt, Bapak 200jt",
    color: "violet",
  },
  {
    icon: "م",
    title: "Mahjub Hirman (المحجوب)",
    by: "Kaidah Umum Faraid",
    desc: "Ahli waris yang terhalang oleh ahli waris lain yang lebih dekat. Misalnya: Saudara terhalang oleh Anak Laki-laki atau Bapak.",
    example: "Contoh: Saudara Kandung → Mahjub jika ada Bapak atau Anak Laki-laki",
    color: "red",
  },
];

const dzawilFurud = [
  { name: "Suami", bagian: "1/2 atau 1/4", syarat: "1/2 jika tidak ada keturunan; 1/4 jika ada keturunan", kategori: "Pasangan" },
  { name: "Istri", bagian: "1/4 atau 1/8", syarat: "1/4 jika tidak ada keturunan; 1/8 jika ada keturunan", kategori: "Pasangan" },
  { name: "Anak Perempuan", bagian: "1/2 atau 2/3", syarat: "1/2 jika tunggal; 2/3 jika lebih dari satu; Ashabah jika bersama saudara laki-laki", kategori: "Anak" },
  { name: "Ibu", bagian: "1/3 atau 1/6", syarat: "1/3 jika tidak ada keturunan & saudara < 2; 1/6 jika ada keturunan atau banyak saudara", kategori: "Orang Tua" },
  { name: "Ayah/Bapak", bagian: "1/6 + Ashabah", syarat: "1/6 jika ada keturunan; Ashabah penuh jika tidak ada keturunan", kategori: "Orang Tua" },
  { name: "Saudara Pr Sekandung", bagian: "1/2 atau 2/3", syarat: "Jika tidak ada Anak/Bapak; 1/2 tunggal, 2/3 jika lebih dari satu", kategori: "Saudara" },
];

export default function SyariahPage() {
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [isSpeaking, setIsSpeaking] = useState(false);


  const handlePlayAudio = () => {
    if (typeof window === "undefined") return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const text = "Hukum waris Islam, atau Faraid, mengatur pembagian harta peninggalan secara rinci berdasarkan ketetapan Al-Qur'an dan Hadits. Ketentuan utama meliputi pembagian porsi pasti bagi masing-masing ahli waris utama seperti suami, istri, anak, dan orang tua, serta penyelesaian kasus khusus seperti Aul dan Radd jika terjadi selisih nilai harta.";
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

  const filteredDzawil = dzawilFurud.filter(
    (d) => selectedKategori === "Semua" || d.kategori === selectedKategori
  );

  return (
    <div className="bg-slate-50 overflow-x-hidden text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[700px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 blur-[140px]" />
        <div className="absolute top-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-blue-400/20 to-indigo-400/20 blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-dot-grid opacity-75 pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6 lg:px-8 border-b border-slate-200/50 max-w-7xl mx-auto">
        <div className="relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Dalil & Landasan Syariat</p>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-955 tracking-tight mb-6 leading-tight">
              Hukum Waris Islam <br />
              <span className="text-emerald-600">Al-Qur'an & Hadits.</span>
            </h1>
            <p className="text-base text-slate-550 font-medium leading-relaxed max-w-2xl mb-6">
              Pembagian waris (Faraid) adalah perintah dari Allah SWT yang wajib ditegakkan secara adil. E-MAWARITS memastikan seluruh algoritma perhitungan berpijak pada dalil-dalil yang sahih.
            </p>

            <button
              onClick={handlePlayAudio}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all duration-300 shadow-sm border ${
                isSpeaking 
                  ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50"
              }`}
            >
              <Volume2 size={14} className={isSpeaking ? "animate-pulse" : ""} />
              <span>{isSpeaking ? "Hentikan Suara" : "Dengarkan Penjelasan"}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Ayat Al-Qur'an */}
      <section className="relative z-10 py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-12 h-12 bg-white/80 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm">
              <BookOpen size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[9px] mb-0.5">Sumber Utama</p>
              <h2 className="text-2xl font-black text-slate-955 tracking-tight">Ayat-Ayat Al-Qur'an</h2>
            </div>
          </motion.div>

          <div className="space-y-6">
            {ayat.map((a, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, amount: 0.15 }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3.5 py-1 bg-emerald-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider">{a.ref}</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-wider border border-emerald-100/50">{a.konteks}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-medium text-slate-955 text-right leading-[2] mb-8 font-serif" dir="rtl">{a.arabic}</p>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-650 font-medium leading-relaxed text-xs italic">"{a.terjemah}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dalil Hadits */}
      <section className="relative z-10 py-20 px-6 lg:px-8 border-t border-slate-200/50 max-w-7xl mx-auto">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-12 h-12 bg-white/80 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm">
              <Quote size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[9px] mb-0.5">Penjelasan & Hadits</p>
              <h2 className="text-2xl font-black text-slate-955 tracking-tight">Dalil Hadits Sahih</h2>
            </div>
          </motion.div>

          <div className="space-y-6">
            {hadits.map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, amount: 0.15 }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3.5 py-1 bg-blue-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider">{h.ref}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-wider border border-blue-100/50">{h.konteks}</span>
                </div>
                <p className="text-xl sm:text-2xl font-medium text-slate-955 text-right leading-[2] mb-8 font-serif" dir="rtl">{h.arabic}</p>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-600 font-medium leading-relaxed text-xs italic">"{h.terjemah}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabel Dzawil Furud */}
      <section className="relative z-10 py-20 px-6 lg:px-8 border-t border-slate-200/50 max-w-7xl mx-auto">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="flex items-center gap-3 mb-6"
          >
            <Scale size={20} className="text-emerald-600" />
            <h2 className="text-2xl font-black text-slate-955 tracking-tight">Tabel Dzawil Furud (Porsi Waris Pasti)</h2>
          </motion.div>

          {/* Interactive Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {["Semua", "Pasangan", "Orang Tua", "Anak", "Saudara"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedKategori(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  selectedKategori === cat
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-3 bg-slate-950 text-white px-6 py-4 text-xs font-black uppercase tracking-wider">
              <p className="text-slate-300">Ahli Waris</p>
              <p className="text-emerald-450">Bagian Fardhu</p>
              <p className="text-slate-300">Syarat Ketentuan</p>
            </div>
            <div className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredDzawil.map((d, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    key={d.name}
                    className={`grid grid-cols-3 px-6 py-4 text-xs transition-colors duration-205 ${i % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/40'} hover:bg-emerald-50/20`}
                  >
                    <p className="font-extrabold text-slate-900">{d.name}</p>
                    <p className="font-black text-emerald-600">{d.bagian}</p>
                    <p className="text-slate-550 font-semibold">{d.syarat}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kasus Ijtihadi */}
      <section className="relative z-10 py-20 px-6 lg:px-8 border-t border-slate-200/50 max-w-7xl mx-auto">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="flex items-center gap-3 mb-2"
          >
            <Users size={20} className="text-emerald-600" />
            <h2 className="text-2xl font-black text-slate-955 tracking-tight">Kasus Ijtihadi Para Sahabat</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-8"
          >
            Berikut merupakan kasus-kasus khusus hasil ijtihad para Sahabat Nabi yang menjadi rujukan kalkulasi waris hingga saat ini.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ijtihadCases.map((c, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.01, boxShadow: "0 20px 25px -5px rgb(16 185 129 / 0.05), 0 8px 10px -6px rgb(16 185 129 / 0.05)" }}
                className="p-6 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm hover:border-emerald-500/30 transition-all duration-305"
              >
                <div className="w-10 h-10 bg-emerald-50/50 border border-emerald-100/50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm mb-4">
                  {c.icon}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{c.by}</p>
                <h3 className="font-extrabold text-slate-900 text-base mb-2">{c.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 font-semibold">{c.desc}</p>
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 font-extrabold text-xs italic">{c.example}</p>
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
              Siap Menghitung Waris Faraid?
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-medium text-sm leading-relaxed">
              Kalkulator E-Mawarits telah mengimplementasikan seluruh kaidah syariat di atas secara presisi.
            </p>
            <div className="flex justify-center">
              <Link href="/kalkulator" className="inline-flex px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-955 rounded-full font-black text-xs transition-all items-center gap-2 shadow-lg shadow-emerald-500/15">
                Buka Kalkulator Waris <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
