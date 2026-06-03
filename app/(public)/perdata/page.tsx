"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Scale, ArrowRight, Landmark, Shield, FileText, Heart, ShieldCheck, ChevronRight, Volume2 } from "lucide-react";
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
  { 
    id: "Golongan I", 
    golongan: "Golongan I", 
    anggota: "Anak-anak & Keturunannya, Suami/Istri yang hidup terlama", 
    keterangan: "Mewarisi bagian yang sama rata. Keberadaan Golongan I menutup hak waris Golongan II, III, dan IV sepenuhnya.",
    prioritas: "Prioritas Utama (Utama)",
    color: "blue",
    members: ["Suami / Istri (hidup terlama)", "Anak Kandung Laki-laki", "Anak Kandung Perempuan", "Keturunan Anak (jika anak meninggal lebih dulu)"]
  },
  { 
    id: "Golongan II", 
    golongan: "Golongan II", 
    anggota: "Orang Tua (Bapak/Ibu), Saudara Kandung & Keturunannya", 
    keterangan: "Mewarisi jika Golongan I tidak ada. Bapak dan Ibu masing-masing mendapat minimal 1/4 bagian dari harta warisan.",
    prioritas: "Prioritas Kedua (Alternatif 1)",
    color: "emerald",
    members: ["Bapak (Ayah Pewaris)", "Ibu (Pewaris)", "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung", "Keturunan Saudara"]
  },
  { 
    id: "Golongan III", 
    golongan: "Golongan III", 
    anggota: "Kakek, Nenek, Leluhur dalam garis lurus ke atas", 
    keterangan: "Mewarisi jika Golongan I & II tidak ada. Harta dibagi dua (kloving): 50% untuk keluarga garis ayah, 50% untuk keluarga garis ibu.",
    prioritas: "Prioritas Ketiga (Alternatif 2)",
    color: "amber",
    members: ["Kakek & Nenek dari Bapak", "Kakek & Nenek dari Ibu", "Leluhur garis lurus ke atas lainnya"]
  },
  { 
    id: "Golongan IV", 
    golongan: "Golongan IV", 
    anggota: "Keluarga Sedarah dalam garis menyimpang (derajat ke-6)", 
    keterangan: "Mewarisi jika Golongan I, II, & III tidak ada. Meliputi Paman, Tante, Sepupu hingga derajat keenam. Jika tidak ada ahli waris, harta jatuh ke Negara.",
    prioritas: "Prioritas Keempat (Terakhir)",
    color: "rose",
    members: ["Paman (Saudara Bapak/Ibu)", "Tante (Saudara Bapak/Ibu)", "Sepupu (Anak Paman/Tante)", "Keluarga sedarah lain s.d. derajat 6"]
  },
];

export default function PerdataPage() {
  const [selectedGol, setSelectedGol] = useState("Golongan I");
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
      const text = "Hukum waris perdata diatur berdasarkan Kitab Undang-Undang Hukum Perdata. Sistem ini membagi ahli waris ke dalam empat golongan utama dengan membagi rata porsi waris tanpa membedakan gender antara laki-laki dan perempuan, serta mendahulukan keluarga dalam garis lurus ke bawah sebelum golongan menyimpang lainnya.";
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

  const activeGol = golonganWaris.find(g => g.id === selectedGol) || golonganWaris[0];

  return (
    <div className="bg-slate-50 overflow-x-hidden text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[700px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-teal-300/10 to-blue-500/15 blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-dot-grid opacity-75 pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6 lg:px-8 border-b border-slate-200/50 max-w-7xl mx-auto">
        <div className="w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-4">Referensi Hukum Perdata</p>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              Hukum Waris Perdata <br />
              <span className="text-blue-600">KUHPerdata Indonesia.</span>
            </h1>
            <p className="text-base text-slate-550 font-medium leading-relaxed max-w-2xl">
              Hukum waris perdata (Burgerlijk Wetboek) mengatur pembagian warisan berdasarkan Kitab Undang-Undang Hukum Perdata. 
              Sistem ini membagi ahli waris ke dalam <strong>4 golongan</strong> dengan prinsip pembagian sama rata tanpa membedakan gender.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-slate-200 text-xs rounded-xl text-slate-700 font-bold shadow-sm backdrop-blur-sm">
                <Shield size={14} className="text-blue-600 animate-pulse" />
                <span>Fitur Kalkulator Perdata — Segera Hadir</span>
              </div>
              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm border ${
                  isSpeaking 
                    ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50 cursor-pointer"
                }`}
              >
                <Volume2 size={14} className={isSpeaking ? "animate-pulse" : ""} />
                <span>{isSpeaking ? "Hentikan Suara" : "Dengarkan Penjelasan"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visualizer 4 Golongan */}
      <section className="relative z-10 py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest mb-3">
              <Landmark size={12} />
              <span>DIAGRAM INTERAKTIF</span>
            </div>
            <h2 className="text-3xl font-black text-slate-955 tracking-tight mb-4">
              Visualizer Golongan Ahli Waris
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
              Pilih golongan di bawah ini untuk melihat siapa saja yang termasuk di dalamnya, tingkat prioritas kewarisan, serta aturan penyekatan (hijab) hukum perdata.
            </p>
          </motion.div>

          {/* Golongan Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {golonganWaris.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGol(g.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-305 cursor-pointer ${
                  selectedGol === g.id
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10"
                    : "bg-white/80 border-slate-200/60 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  {g.prioritas}
                </span>
                <span className="font-extrabold text-sm block">
                  {g.golongan}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Golongan Output Board */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGol.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 text-left"
            >
              {/* Left detail Column */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-lg">
                    {activeGol.golongan}
                  </span>
                  <span className="text-slate-400 text-xs font-bold font-mono">
                    {activeGol.prioritas}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">{activeGol.anggota}</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">{activeGol.keterangan}</p>
                
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest block mb-1.5">Kaidah Hukum Utama</span>
                  <div className="flex gap-2 text-slate-700 font-bold text-xs">
                    <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>Hukum Perdata membagi rata tanpa membedakan gender Laki-laki dan Perempuan (1:1).</span>
                  </div>
                </div>
              </div>

              {/* Right family member checklist Column */}
              <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-4 block">Daftar Anggota Golongan:</span>
                <div className="space-y-3">
                  {activeGol.members.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[9px] font-black text-blue-600">
                        {idx + 1}
                      </div>
                      <span className="text-xs text-slate-705 font-extrabold">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pasal-Pasal Penting */}
      <section className="relative z-10 py-20 px-6 lg:px-8 border-t border-slate-200/50 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-12 h-12 bg-white/80 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[9px] mb-0.5">Sumber Hukum</p>
              <h2 className="text-2xl font-black text-slate-955 tracking-tight">Pasal-Pasal Kunci</h2>
            </div>
          </motion.div>

          <div className="space-y-6">
            {pasalPenting.map((p, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, amount: 0.15 }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3.5 py-1 bg-blue-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider">{p.ref}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-wider border border-blue-100/50">{p.konteks}</span>
                </div>
                <p className="text-slate-700 font-semibold leading-relaxed text-xs">"{p.desc}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabel Golongan */}
      <section className="relative z-10 py-20 px-6 lg:px-8 border-t border-slate-200/50 max-w-7xl mx-auto">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="flex items-center gap-3 mb-8"
          >
            <Landmark size={20} className="text-blue-600" />
            <h2 className="text-2xl font-black text-slate-955 tracking-tight">Empat Golongan Ahli Waris</h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-3 bg-slate-950 text-white px-6 py-4 text-xs font-black uppercase tracking-wider">
              <p className="text-slate-300">Golongan</p>
              <p className="text-blue-400">Anggota Keluarga</p>
              <p className="text-slate-300">Keterangan</p>
            </div>
            {golonganWaris.map((g, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-4 border-t border-slate-100 text-xs transition-colors duration-200 ${i % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/40'} hover:bg-blue-50/20`}>
                <p className="font-extrabold text-slate-900">{g.golongan}</p>
                <p className="font-extrabold text-blue-600">{g.anggota}</p>
                <p className="text-slate-500 font-semibold">{g.keterangan}</p>
              </div>
            ))}
          </motion.div>
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
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-2xl leading-tight">
              Kalkulator Perdata Segera Hadir
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-medium text-sm leading-relaxed">
              Saat ini silakan gunakan kalkulator Faraid (Islam) atau Adat Jawa untuk kebutuhan perhitungan waris Anda.
            </p>
            <div className="flex justify-center">
              <Link href="/kalkulator" className="inline-flex px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-full font-black text-xs hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/15 items-center gap-2">
                Buka Kalkulator Waris <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
