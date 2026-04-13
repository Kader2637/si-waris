"use client";

import { motion } from "framer-motion";
import { BookOpen, Scale, Users, ArrowRight, Quote } from "lucide-react";
import Link from "next/link";

const ayat = [
  {
    ref: "An-Nisa: 11",
    arabic: "يُوصِيكُمُ ٱللَّهُ فِىٓ أَوْلَٰدِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ ٱلْأُنثَيَيْنِ",
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
    konteks: "Dasar warisan Saudara Sekandung & Kelalah",
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
    arabic: "لَيْسَ لِلْقَاتِلِ شَيْءٌ",
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
  { name: "Suami", bagian: "1/2 atau 1/4", syarat: "1/2 jika tidak ada keturunan; 1/4 jika ada keturunan" },
  { name: "Istri", bagian: "1/4 atau 1/8", syarat: "1/4 jika tidak ada keturunan; 1/8 jika ada keturunan" },
  { name: "Anak Perempuan", bagian: "1/2 atau 2/3", syarat: "1/2 jika tunggal; 2/3 jika lebih dari satu; Ashabah jika bersama saudara laki-laki" },
  { name: "Ibu", bagian: "1/3 atau 1/6", syarat: "1/3 jika tidak ada keturunan & saudara < 2; 1/6 jika ada keturunan atau banyak saudara" },
  { name: "Ayah/Bapak", bagian: "1/6 + Ashabah", syarat: "1/6 jika ada keturunan; Ashabah penuh jika tidak ada keturunan" },
  { name: "Saudara Pr Sekandung", bagian: "1/2 atau 2/3", syarat: "Jika tidak ada Anak/Bapak; 1/2 tunggal, 2/3 jika lebih dari satu" },
];

export default function SyariahPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-32 px-6 lg:px-24 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-50 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-emerald-600 font-black uppercase tracking-widest text-xs mb-6">Dalil & Landasan Syariat</p>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-10 leading-[1.1]">
              Hukum Waris Islam<br />Bersumber dari<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Al-Qur'an & Hadits.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Pembagian waris (Faraid) bukan sekadar angka — ia adalah perintah Allah yang wajib ditegakkan. SI-WARIS memastikan setiap kalkulasi berpijak pada dalil yang sahih.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ayat Al-Qur'an */}
      <section className="bg-slate-900 py-32 px-6 lg:px-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <BookOpen size={28} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] mb-1">Sumber Utama</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Dalil Al-Qur'an</h2>
            </div>
          </div>
          
          <div className="space-y-8">
            {ayat.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all duration-500" />
                <div className="flex flex-wrap items-center gap-3 mb-12">
                  <span className="px-5 py-2 bg-emerald-600/90 backdrop-blur text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-900/50">{a.ref}</span>
                  <span className="px-5 py-2 bg-slate-800/80 backdrop-blur text-emerald-300 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">{a.konteks}</span>
                </div>
                <p className="text-4xl md:text-5xl font-medium text-white text-right leading-[1.8] md:leading-[2] mb-12 font-serif drop-shadow-lg" dir="rtl">{a.arabic}</p>
                <div className="bg-slate-950/40 p-6 md:p-8 rounded-3xl border border-white/5">
                  <p className="text-slate-300 font-medium leading-relaxed text-lg lg:text-xl italic">"{a.terjemah}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dalil Hadits */}
      <section className="bg-slate-950 py-32 px-6 lg:px-24 relative overflow-hidden">
        {/* Dekorasi Hadits */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <Quote size={28} className="text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-1">Rincian & Penjelasan</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Dalil Hadits Sahih</h2>
            </div>
          </div>
          
          <div className="space-y-8">
            {hadits.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group bg-blue-950/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-blue-900/20 hover:bg-blue-900/20 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/0 group-hover:bg-blue-500 transition-all duration-500" />
                <div className="flex flex-wrap items-center gap-3 mb-12">
                  <span className="px-5 py-2 bg-blue-600/90 backdrop-blur text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/50">{h.ref}</span>
                  <span className="px-5 py-2 bg-slate-900/80 backdrop-blur text-blue-300 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-500/20">{h.konteks}</span>
                </div>
                <p className="text-3xl md:text-4xl font-medium text-white text-right leading-[2] md:leading-[2.2] mb-12 font-serif drop-shadow-md" dir="rtl">{h.arabic}</p>
                <div className="bg-slate-950/60 p-6 md:p-8 rounded-3xl border border-blue-900/30">
                  <p className="text-slate-300 font-medium leading-relaxed text-lg italic">"{h.terjemah}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabel Dzawil Furud */}
      <section className="py-32 px-6 lg:px-24 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <Scale size={28} className="text-emerald-600" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Tabel Dzawil Furud (Ahli Waris Pasti)</h2>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900 text-white px-10 py-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ahli Waris</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bagian Fardhu</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syarat</p>
            </div>
            {dzawilFurud.map((d, i) => (
              <div key={i} className={`grid grid-cols-3 px-10 py-6 border-t border-slate-50 hover:bg-emerald-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                <p className="font-black text-slate-900">{d.name}</p>
                <p className="font-black text-emerald-600">{d.bagian}</p>
                <p className="text-slate-500 font-medium text-sm">{d.syarat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kasus Ijtihadi */}
      <section className="py-32 px-6 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users size={28} className="text-emerald-600" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Kasus-Kasus Ijtihadi Para Sahabat</h2>
          </div>
          <p className="text-slate-500 font-medium mb-16 max-w-2xl">
            Kasus-kasus di bawah ini adalah hasil ijtihad para Sahabat Nabi yang menjadi rujukan ulama hingga saat ini.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ijtihadCases.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2.5rem] border border-${c.color}-100 bg-${c.color}-50/30 hover:shadow-xl transition-all`}>
                <div className={`w-16 h-16 bg-${c.color}-100 text-${c.color}-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-8 shadow-inner`}>
                  {c.icon}
                </div>
                <p className={`text-[10px] font-black text-${c.color}-600 uppercase tracking-widest mb-2`}>{c.by}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">{c.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">{c.desc}</p>
                <div className={`bg-${c.color}-100 p-4 rounded-xl`}>
                  <p className={`text-${c.color}-700 font-bold text-sm italic`}>{c.example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-24 bg-emerald-600 text-white text-center">
        <h2 className="text-4xl font-black tracking-tighter mb-6">Siap Menghitung Waris?</h2>
        <p className="text-emerald-100 font-medium text-lg mb-10">Gunakan kalkulator kami yang sudah mengimplementasikan semua kaidah di atas.</p>
        <Link href="/kalkulator" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-xl">
          Buka Kalkulator <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
