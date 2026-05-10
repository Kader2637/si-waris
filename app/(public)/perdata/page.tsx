"use client";

import { motion } from "framer-motion";
import { BookOpen, Scale, ArrowRight, Landmark, Shield, FileText } from "lucide-react";
import Link from "next/link";

const pasalPenting = [
  {
    ref: "Pasal 830 KUHPerdata",
    desc: "Pewarisan hanya berlangsung karena kematian.",
    konteks: "Dasar pembukaan warisan",
  },
  {
    ref: "Pasal 832 KUHPerdata",
    desc: "Yang berhak menjadi ahli waris ialah para keluarga sedarah, baik sah maupun luar kawin, dan si suami atau istri yang hidup terlama.",
    konteks: "Dasar siapa yang berhak waris",
  },
  {
    ref: "Pasal 852 KUHPerdata",
    desc: "Anak-anak atau sekalian keturunan mereka, biar dilahirkan dari lain-lain perkawinan sekalipun, mewarisi dari kedua orang tua, kakek, nenek, atau semua keluarga sedarah mereka selanjutnya dalam garis lurus ke atas, dengan tiada perbedaan antara laki atau perempuan dan tiada perbedaan berdasarkan kelahiran lebih dulu.",
    konteks: "Hak waris anak — sama rata tanpa diskriminasi gender",
  },
  {
    ref: "Pasal 913 KUHPerdata",
    desc: "Legitieme portie atau bagian warisan menurut undang-undang ialah suatu bagian dari harta peninggalan yang harus diberikan kepada para waris dalam garis lurus menurut undang-undang.",
    konteks: "Bagian mutlak (Legitieme Portie)",
  },
];

const golonganWaris = [
  { golongan: "Golongan I", anggota: "Anak, Suami/Istri", keterangan: "Mewarisi bagian yang sama rata. Suami/Istri disamakan posisinya dengan anak." },
  { golongan: "Golongan II", anggota: "Orang tua, Saudara", keterangan: "Mewarisi jika tidak ada Golongan I. Orang tua minimal mendapat 1/4." },
  { golongan: "Golongan III", anggota: "Kakek/Nenek (garis Ayah & Ibu)", keterangan: "Harta dibagi dua (kloving): setengah untuk garis ayah, setengah untuk garis ibu." },
  { golongan: "Golongan IV", anggota: "Keluarga sedarah lainnya", keterangan: "Sampai derajat keenam. Jika tidak ada satupun, harta jatuh ke negara." },
];

export default function PerdataPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-32 px-6 lg:px-24 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-blue-600 font-black uppercase tracking-widest text-xs mb-6">Referensi Hukum Perdata</p>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-10 leading-[1.1]">
              Hukum Waris<br />Perdata (BW)<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">KUHPerdata Indonesia.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              Hukum waris perdata (Burgerlijk Wetboek) mengatur pembagian warisan berdasarkan Kitab Undang-Undang Hukum Perdata. 
              Sistem ini membagi ahli waris ke dalam <strong>4 golongan</strong> dengan prinsip sama rata tanpa perbedaan gender.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-5 py-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl font-black text-sm">
              <Shield size={16} />
              Fitur Kalkulator Perdata — Segera Hadir
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pasal-Pasal Penting */}
      <section className="bg-slate-950 py-32 px-6 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/15 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <FileText size={28} className="text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-1">Sumber Hukum</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Pasal-Pasal Kunci</h2>
            </div>
          </div>

          <div className="space-y-8">
            {pasalPenting.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/0 group-hover:bg-blue-500 transition-all duration-500" />
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="px-5 py-2 bg-blue-600/90 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">{p.ref}</span>
                  <span className="px-5 py-2 bg-slate-800/80 text-blue-300 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-500/20">{p.konteks}</span>
                </div>
                <p className="text-slate-300 font-medium leading-relaxed text-lg">"{p.desc}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabel Golongan */}
      <section className="py-32 px-6 lg:px-24 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <Landmark size={28} className="text-blue-600" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Empat Golongan Ahli Waris</h2>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900 text-white px-10 py-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Golongan</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Anggota</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Keterangan</p>
            </div>
            {golonganWaris.map((g, i) => (
              <div key={i} className={`grid grid-cols-3 px-10 py-6 border-t border-slate-50 hover:bg-blue-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                <p className="font-black text-slate-900">{g.golongan}</p>
                <p className="font-bold text-blue-600">{g.anggota}</p>
                <p className="text-slate-500 font-medium text-sm">{g.keterangan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-24 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-black tracking-tighter mb-6">Kalkulator Perdata Segera Hadir</h2>
        <p className="text-blue-100 font-medium text-lg mb-10">Saat ini gunakan kalkulator Faraid atau Adat Jawa untuk kebutuhan perhitungan waris Anda.</p>
        <Link href="/kalkulator" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl">
          Buka Kalkulator <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
