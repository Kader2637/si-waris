"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Scale, ArrowRight, Landmark, TreePine, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const prinsipAdat = [
  {
    title: "Sepikul Segendongan",
    subtitle: "Pembagian Proporsional Tradisi Jawa",
    desc: "Metode warisan berdasarkan asas musyawarah keluarga mengikuti tradisi Jawa asli. Laki-laki dianggap 'memikul' beban tanggung jawab nafkah keluarga yang lebih berat sehingga mendapat porsi ganda (2 bagian), sedangkan perempuan 'menggendong' sehingga mendapat 1 bagian.",
    ratio: "2 : 1",
    filosof: "Laki-laki memikul (sepikul = beban di pundak), perempuan menggendong (segendongan = beban di punggung). Perbedaan porsi mencerminkan tanggung jawab publik & nafkah.",
    jawa: "Sing lanang mikul, sing wadon nggendong",
    icon: "🏋️",
  },
  {
    title: "Kum-Kum Kupat",
    subtitle: "Pembagian Sama Rata (Dum-Duman)",
    desc: "Metode berdasarkan asas 'mangan ora mangan kumpul' (makan tidak makan tetap bersama). Harta dibagi sama rata (1:1) tanpa memandang gender. Fokus pembagian murni pada garis keturunan dan kebersamaan.",
    ratio: "1 : 1",
    filosof: "Semua anak adalah keturunan yang sama, hak atas harta warisan tidak bergantung pada jenis kelamin. Asas gotong-royong dan kerukunan keluarga.",
    jawa: "Mangan ora mangan kumpul",
    icon: "🤝",
  },
];

const konsepPenting = [
  { title: "Harta Gono-Gini", desc: "Harta yang diperoleh selama pernikahan dipotong 50% terlebih dahulu untuk pasangan yang masih hidup.", jawa: "Gono-gini iku bandha sesarengane", icon: "💍" },
  { title: "Musyawarah Keluarga", desc: "Pembagian waris selalu berdasarkan rembug keluarga. Metode dipilih lewat kesepakatan bersama.", jawa: "Rembug bareng, penak bareng", icon: "🏛️" },
  { title: "Ahli Waris Pengganti", desc: "Jika ahli waris meninggal lebih dulu, bagiannya diwakilkan oleh keturunannya (cucu pewaris).", jawa: "Turune nggenteni panggonane", icon: "🌿" },
  { title: "Anak Angkat", desc: "Anak pupon punya hak atas harta pencarian (gono-gini), tidak atas harta bawaan (gawan).", jawa: "Anak pupon oleh gono-gini", icon: "👶" },
];

const tabelPerbandingan = [
  { aspek: "Dasar Hukum", sepikul: "Tradisi proporsional Jawa", kumkum: "Asas kesamaan & kerukunan" },
  { aspek: "Rasio L : P", sepikul: "2 : 1", kumkum: "1 : 1 (Sama Rata)" },
  { aspek: "Filosofi", sepikul: "Beban tanggung jawab berbeda", kumkum: "Kesetaraan hak keturunan" },
  { aspek: "Gono-Gini", sepikul: "Dipotong 50% (opsional)", kumkum: "Dipotong 50% (opsional)" },
  { aspek: "Penerapan", sepikul: "Masyarakat Jawa tradisional", kumkum: "Masyarakat Jawa modern" },
  { aspek: "Keputusan", sepikul: "Musyawarah keluarga", kumkum: "Musyawarah keluarga" },
];

const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" } }),
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 120 } }),
};

export default function AdatJawaPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const wayangY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const wayangRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-100 via-orange-50 to-transparent opacity-80 blur-3xl" />
          <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-100 to-transparent blur-3xl" />
        </div>

        {/* Top ornamental border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-3 bg-amber-50 border-2 border-amber-200 text-amber-800 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest mb-10">
              <span className="text-lg">☸</span> Referensi Hukum Adat Nusantara
            </motion.div>

            <h1 className="text-[4.5rem] lg:text-[5.5rem] font-black leading-[0.92] tracking-[-0.04em] text-amber-950 mb-8">
              Hukum Waris<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Adat Jawa.</span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-xl text-amber-900/60 font-medium leading-relaxed max-w-lg mb-6">
              Berlandaskan semangat kerukunan keluarga, musyawarah mufakat, dan keadilan yang dirasakan bersama.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-5 mb-12 max-w-md">
              <p className="text-amber-800 font-black text-lg italic text-center">"Rukun agawe santosa, crah agawe bubrah"</p>
              <p className="text-amber-500 text-xs font-bold text-center mt-1 uppercase tracking-widest">Pepatah Jawa</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-4">
              <Link href="/kalkulator" className="group flex items-center gap-3 px-8 py-5 bg-amber-800 text-white rounded-2xl font-black text-base hover:bg-amber-700 transition-all shadow-2xl shadow-amber-200/50 active:scale-95">
                Hitung Waris Adat <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/syariah" className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-amber-200 text-amber-800 rounded-2xl font-black text-base hover:border-amber-400 transition-all">
                Bandingkan Faraid
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Wayang Image */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end">
            <motion.div style={{ y: wayangY, rotate: wayangRotate }} className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-orange-200 rounded-full blur-[80px] opacity-40 scale-75" />
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                <Image src="/wayang.png" alt="Wayang Kulit" width={600} height={750} className="relative z-10 drop-shadow-2xl" priority />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-400"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <span className="text-[10px] font-black uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* ═══════════ DUA METODE ═══════════ */}
      <section className="py-32 px-6 lg:px-24 bg-amber-50/30 relative overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-20">
            <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-xs mb-6">Metode Pembagian</p>
            <h2 className="text-5xl lg:text-6xl font-black text-amber-950 tracking-tighter leading-none">
              Dua Pilar<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Adat Jawa.</span>
            </h2>
          </motion.div>

          <div className="space-y-10">
            {prinsipAdat.map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 1}
                className="group bg-white rounded-[3rem] p-10 md:p-14 border-2 border-amber-100 hover:border-amber-300 shadow-xl shadow-amber-100/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                
                {/* Wayang watermark */}
                <div className="absolute -right-4 -top-4 w-[150px] h-[200px] opacity-[0.04] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-500">
                  <Image src="/wayang.png" alt="" width={150} height={200} className="object-contain" />
                </div>

                {/* Hover accent bar */}
                <div className="absolute top-0 left-0 w-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-700" />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    <motion.span whileHover={{ scale: 1.05 }} className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-amber-200/50">
                      {p.icon} {p.title}
                    </motion.span>
                    <span className="px-5 py-3 bg-amber-50 text-amber-700 rounded-2xl text-sm font-black border border-amber-200">
                      Rasio {p.ratio}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 mb-8">
                    <p className="text-amber-700 font-black text-lg italic text-center">"{p.jawa}"</p>
                  </div>

                  <h3 className="text-2xl font-black text-amber-950 tracking-tight mb-3">{p.subtitle}</h3>
                  <p className="text-amber-900/60 font-medium leading-relaxed mb-8">{p.desc}</p>

                  <div className="bg-white border-2 border-amber-100 p-6 rounded-2xl group-hover:border-amber-200 transition-colors">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">☸ Filosofi</p>
                    <p className="text-amber-800 font-bold leading-relaxed">{p.filosof}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════ TABEL PERBANDINGAN ═══════════ */}
      <section className="py-32 px-6 lg:px-24 bg-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-16">
            <motion.div whileHover={{ rotate: 15 }} className="p-4 bg-amber-100 rounded-2xl text-amber-700">
              <Landmark size={28} />
            </motion.div>
            <h2 className="text-4xl font-black text-amber-950 tracking-tighter">Perbandingan Metode</h2>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="rounded-[2.5rem] border-2 border-amber-200 shadow-xl shadow-amber-100/20 overflow-hidden">
            <div className="grid grid-cols-3 bg-gradient-to-r from-amber-800 to-amber-700 text-white px-10 py-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-200">Aspek</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-200">⚖ Sepikul Segendongan</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-200">🤝 Kum-Kum Kupat</p>
            </div>
            {tabelPerbandingan.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`grid grid-cols-3 px-10 py-5 border-t border-amber-100 hover:bg-amber-50/60 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}`}>
                <p className="font-black text-amber-950 text-sm">{d.aspek}</p>
                <p className="font-bold text-amber-700 text-sm">{d.sepikul}</p>
                <p className="font-bold text-orange-700 text-sm">{d.kumkum}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ KONSEP PENTING ═══════════ */}
      <section className="py-32 px-6 lg:px-24 bg-amber-50/30 relative overflow-hidden">
        {/* Floating wayang bg */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[450px] opacity-[0.03] pointer-events-none">
          <Image src="/wayang.png" alt="" width={300} height={450} className="object-contain" />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl mx-auto relative z-10">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-20">
            <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-xs mb-6">Konsep Kunci</p>
            <h2 className="text-5xl lg:text-6xl font-black text-amber-950 tracking-tighter leading-none">
              Hukum Adat<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">yang Perlu Dipahami.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {konsepPenting.map((k, i) => (
              <motion.div key={i} variants={scaleIn} custom={i}
                className="group bg-white p-10 rounded-[2.5rem] border-2 border-amber-100 hover:border-amber-300 shadow-lg shadow-amber-50 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-amber-50 to-transparent group-hover:h-1/2 transition-all duration-700 pointer-events-none" />
                
                <div className="absolute top-4 right-4 w-14 h-20 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                  <Image src="/wayang.png" alt="" width={56} height={80} className="object-contain" />
                </div>

                <div className="relative z-10">
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-4xl mb-5 inline-block">{k.icon}</motion.div>
                  <h3 className="text-xl font-black text-amber-950 tracking-tighter mb-3">{k.title}</h3>
                  <p className="text-amber-900/60 font-medium leading-relaxed mb-5 text-sm">{k.desc}</p>
                  <div className="bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl">
                    <p className="text-amber-700 font-black text-xs italic">"{k.jawa}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-28 px-6 lg:px-24 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-700 text-white text-center relative overflow-hidden">
        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div key={i}
            animate={{ y: [0, -60, 0], x: [0, (i % 2 === 0 ? 20 : -20), 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 5 + i, delay: i * 0.5, ease: "easeInOut" }}
            className="absolute w-2 h-2 bg-amber-300 rounded-full"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          />
        ))}

        {/* Wayang silhouettes */}
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute left-10 bottom-0 w-[120px] h-[200px] opacity-[0.1] pointer-events-none">
          <Image src="/wayang.png" alt="" width={120} height={200} className="object-contain" />
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, delay: 1, ease: "easeInOut" }}
          className="absolute right-10 bottom-0 w-[120px] h-[200px] opacity-[0.1] pointer-events-none scale-x-[-1]">
          <Image src="/wayang.png" alt="" width={120} height={200} className="object-contain" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
          <p className="text-amber-200 font-black italic text-lg mb-4">"Waris kudu adil, keluarga kudu rukun"</p>
          <h2 className="text-5xl font-black tracking-tighter mb-6">Siap Menghitung<br />Waris Adat Jawa?</h2>
          <p className="text-amber-100 font-medium text-lg mb-10 max-w-lg mx-auto">Gunakan kalkulator kami yang sudah mengimplementasikan Sepikul Segendongan & Kum-Kum Kupat.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/kalkulator" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-amber-800 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all">
              Buka Kalkulator <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
