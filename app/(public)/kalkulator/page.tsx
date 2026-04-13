"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Zap, BadgeCheck, ShieldAlert, Info, Scale, ChevronDown, Wallet, Users, Calculator, Sparkles, ArrowRight } from "lucide-react";
import { calculateFaraid } from "@/lib/faraidLogic";

const HUBUNGAN_OPTIONS = [
  "Suami", "Istri",
  "Anak Laki-laki", "Anak Perempuan",
  "Cucu Laki-laki", "Cucu Perempuan",
  "Ayah", "Ibu", "Kakek", "Nenek",
  "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung",
  "Saudara Laki-laki Seibu", "Saudara Perempuan Seibu",
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; badge: string; dot: string }> = {
  Normal: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-400", dot: "bg-emerald-500" },
  Aul: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-400", dot: "bg-amber-500" },
  Radd: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-400", dot: "bg-blue-500" },
  Gharrawain: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30", badge: "bg-violet-500/20 text-violet-400", dot: "bg-violet-500" },
};

const PROBLEM_DETAIL: Record<string, { desc: string; dalil: string }> = {
  Normal: { desc: "Harta terbagi habis sempurna sesuai porsi masing-masing ahli waris.", dalil: "An-Nisa: 11-12, 176" },
  Aul: { desc: "Penyebut dinaikkan agar distribusi tetap proporsional (Ijtihad Umar bin Khattab ra.).", dalil: "Ijtihad Sahabat" },
  Radd: { desc: "Sisa dikembalikan ke Dzawil Furud non-pasangan (Ijtihad Ali bin Abi Thalib ra.).", dalil: "Ijtihad Sahabat" },
  Gharrawain: { desc: "Ibu mendapat 1/3 sisa setelah bagian Suami/Istri diambil — Tsulutsul Baqi.", dalil: "Ijtihad Umar ra." },
};

const formatIDR = (val: string) => {
  const n = val.replace(/\D/g, "");
  return n ? new Intl.NumberFormat("id-ID").format(parseInt(n)) : "";
};
const parseNum = (v: string) => parseInt(v.replace(/\D/g, "")) || 0;

export default function KalkulatorPage() {
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);
  const [hasil, setHasil] = useState<ReturnType<typeof calculateFaraid> | null>(null);
  const [selectedHeir, setSelectedHeir] = useState<any>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const addHeir = () => setAhliWaris([...ahliWaris, { nama: "", hubungan: "Anak Laki-laki" }]);
  const removeHeir = (i: number) => setAhliWaris(ahliWaris.filter((_, idx) => idx !== i));
  const updateHeir = (i: number, field: string, value: string) => {
    const arr = [...ahliWaris];
    arr[i] = { ...arr[i], [field]: value };
    setAhliWaris(arr);
  };

  const handleHitung = () => {
    const jenazah = { id: "temp", gender, hartaKotor: parseNum(harta), utang: parseNum(utang), wasiat: parseNum(wasiat) };
    const warisList = ahliWaris.map((h, i) => ({ id: `heir-${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan }));
    setHasil(calculateFaraid(jenazah as any, warisList as any));
    setStep(2);
  };

  const sc = hasil ? (STATUS_CONFIG[hasil.statusAulRadd] || STATUS_CONFIG["Normal"]) : null;
  const pd = hasil ? (PROBLEM_DETAIL[hasil.statusAulRadd] || PROBLEM_DETAIL["Normal"]) : null;
  const hartaBersih = parseNum(harta) - parseNum(utang) - parseNum(wasiat);

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 60%)" }} />
        <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-10">
              <Sparkles size={12} fill="currentColor" />
              Hasil tidak disimpan — Privasi Terjaga
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-white tracking-[-0.04em] leading-none mb-6">
              Kalkulator<br /><span className="gradient-text">Faraid</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto">
              Masukkan data harta dan ahli waris — hasil distribusi syar'i langsung tampil secara instan.
            </p>
          </motion.div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mt-12">
            {[{ n: 1, label: "Data Harta & Waris" }, { n: 2, label: "Hasil Distribusi" }].map((s, i) => (
              <div key={s.n} className="flex items-center gap-4">
                <button onClick={() => s.n === 1 && setStep(1)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${step === s.n ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 text-slate-500 border border-white/10"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step === s.n ? "bg-white text-emerald-600" : "bg-white/10 text-slate-500"}`}>{s.n}</span>
                  {s.label}
                </button>
                {i === 0 && <ArrowRight size={16} className={`transition-colors ${step === 2 ? "text-emerald-500" : "text-slate-700"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-32">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left: Harta */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 px-2 mb-6">
                  <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center"><Wallet size={18} /></div>
                  <h2 className="text-white font-black text-lg tracking-tight">Data Jenazah & Harta</h2>
                </div>

                {/* Gender Card */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-white/20 transition-all">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Gender Jenazah</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Laki-laki", "Perempuan"].map(g => (
                      <button key={g} onClick={() => setGender(g)}
                        className={`py-4 rounded-2xl font-black text-sm transition-all ${gender === g ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"}`}>
                        {g === "Laki-laki" ? "♂ Laki-laki" : "♀ Perempuan"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Harta Inputs */}
                {[
                  { label: "Total Harta Kotor", val: harta, set: setHarta, icon: "💰", accent: "emerald", hint: "Seluruh aset sebelum dikurangi" },
                  { label: "Total Utang Almarhum", val: utang, set: setUtang, icon: "📋", accent: "red", hint: "Dibayar dari harta sebelum dibagi" },
                  { label: "Wasiat (Maks 1/3)", val: wasiat, set: setWasiat, icon: "📜", accent: "amber", hint: "Tidak boleh melebihi 1/3 harta bersih" },
                ].map((f, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-white/20 transition-all group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">{f.label}</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-500">Rp</span>
                      <input
                        className={`w-full py-4 px-4 pl-12 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-xl outline-none focus:border-${f.accent}-500/50 focus:bg-white/10 placeholder:text-slate-700 transition-all`}
                        value={f.val}
                        onChange={e => f.set(formatIDR(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <p className="text-slate-600 text-[10px] font-bold mt-2 pl-1">{f.hint}</p>
                  </div>
                ))}

                {/* Preview Harta Bersih */}
                {harta && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Preview Harta Bersih (Mirkah)</p>
                    <p className="text-3xl font-black text-white">Rp {hartaBersih <= 0 ? "0" : hartaBersih.toLocaleString("id-ID")}</p>
                    <p className="text-emerald-400/60 text-xs font-bold mt-1">= Harta − Utang − Wasiat</p>
                  </motion.div>
                )}
              </div>

              {/* Right: Ahli Waris */}
              <div className="space-y-5">
                <div className="flex items-center justify-between px-2 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center"><Users size={18} /></div>
                    <h2 className="text-white font-black text-lg tracking-tight">Daftar Ahli Waris</h2>
                    {ahliWaris.length > 0 && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black">{ahliWaris.length} orang</span>
                    )}
                  </div>
                  <button onClick={addHeir}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    <Plus size={14} /> Tambah
                  </button>
                </div>

                <AnimatePresence>
                  {ahliWaris.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="border-2 border-dashed border-white/10 rounded-[2rem] p-20 text-center">
                      <Users size={48} className="text-white/10 mx-auto mb-5" />
                      <p className="text-slate-600 font-black text-sm uppercase tracking-widest">Belum ada ahli waris</p>
                      <button onClick={addHeir} className="mt-6 px-6 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                        + Tambahkan sekarang
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {ahliWaris.map((h, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                          className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-white/20 transition-all group">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-[11px] font-black">{i + 1}</span>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ahli Waris #{i + 1}</span>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <input
                              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-white/10 transition-all"
                              placeholder="Nama lengkap (opsional)"
                              value={h.nama}
                              onChange={e => updateHeir(i, "nama", e.target.value)}
                            />
                            <div className="flex gap-3">
                              <div className="relative flex-1">
                                <select
                                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-white outline-none appearance-none focus:border-emerald-500/40 transition-all"
                                  value={h.hubungan}
                                  onChange={e => updateHeir(i, "hubungan", e.target.value)}
                                >
                                  {HUBUNGAN_OPTIONS.map(opt => <option key={opt} value={opt} className="text-slate-900 bg-white">{opt}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={15} />
                              </div>
                              <button onClick={() => removeHeir(i)}
                                className="w-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {/* CTA Hitung */}
                <button
                  onClick={handleHitung}
                  disabled={!harta || ahliWaris.length === 0}
                  className="w-full py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-[2rem] font-black text-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 mt-4"
                >
                  <Zap size={24} fill="currentColor" />
                  Hitung Distribusi Waris
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>

          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {hasil && (
                <div className="space-y-8">
                  {/* Result Summary Bar */}
                  <div className={`${sc!.bg} border ${sc!.border} rounded-[2.5rem] p-10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: `radial-gradient(circle, currentColor, transparent)` }} />
                    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      <div className="lg:col-span-2">
                        <div className={`inline-flex items-center gap-2 ${sc!.badge} px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest mb-5 border ${sc!.border}`}>
                          <span className={`w-2 h-2 ${sc!.dot} rounded-full animate-pulse`} />
                          Kategori: {hasil.statusAulRadd}
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-3">{pd!.desc}</h2>
                        <p className={`${sc!.text} font-bold text-sm`}>Rujukan: {pd!.dalil}</p>
                      </div>
                      <div className="bg-white/10 border border-white/10 rounded-3xl p-8 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Total Harta Bersih</p>
                        <p className="text-3xl font-black text-white leading-none">Rp</p>
                        <p className="text-4xl font-black text-white tracking-tighter">{(hasil.hartaBersih / 1000000).toLocaleString("id-ID")} Jt</p>
                        <p className="text-slate-500 text-xs font-bold mt-2">{hasil.hartaBersih.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Heir Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {hasil.ahliWarisGetted.map((h, i) => {
                      const isWarisi = h.status === "Mewarisi";
                      const pct = hasil.hartaBersih > 0 ? (h.jatahNominal / hasil.hartaBersih * 100) : 0;
                      return (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.07, type: "spring", stiffness: 200 }}
                          className={`relative bg-white/5 border rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-default ${isWarisi ? "border-emerald-500/20 hover:border-emerald-500/40" : "border-red-500/20 hover:border-red-500/40"}`}
                        >
                          {/* Top bar accent */}
                          <div className={`h-1.5 w-full ${isWarisi ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-red-500 to-rose-500"}`} />

                          <div className="p-8">
                            {/* Status & Name */}
                            <div className="flex justify-between items-start mb-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isWarisi ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                                {isWarisi ? <BadgeCheck size={26} /> : <ShieldAlert size={26} />}
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${isWarisi ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                {h.status}
                              </span>
                            </div>

                            <h4 className="text-lg font-black text-white tracking-tight">{h.nama}</h4>
                            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] mt-1 mb-6">{h.hubungan}</p>

                            {/* Amount */}
                            <div className="flex justify-between items-end mb-5">
                              <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Porsi</p>
                                <p className="text-3xl font-black text-white tracking-tighter">{h.jatahPersen}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Nominal</p>
                                <p className="font-black text-emerald-400 text-lg">Rp {h.jatahNominal.toLocaleString("id-ID")}</p>
                              </div>
                            </div>

                            {/* Progress bar */}
                            {isWarisi && (
                              <div className="mb-5">
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                  />
                                </div>
                                <p className="text-slate-600 text-[9px] font-bold mt-1.5">{pct.toFixed(1)}% dari total harta</p>
                              </div>
                            )}

                            <button onClick={() => setSelectedHeir(h)}
                              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:bg-white hover:text-slate-900 transition-all duration-300 text-[9px] font-black uppercase tracking-widest">
                              <Info size={13} /> Analisis Syariat
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Back button */}
                  <div className="text-center pt-4">
                    <button onClick={() => setStep(1)}
                      className="px-8 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-bold hover:bg-white/10 hover:text-white transition-all">
                      ← Hitung Ulang / Ubah Data
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedHeir && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedHeir(null)}>
            <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className="bg-[#111827] border border-white/10 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden">

              {/* Accent top bar */}
              <div className={`h-1.5 w-full ${selectedHeir.status === "Mewarisi" ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-red-500 to-rose-400"}`} />

              <div className="p-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedHeir.status === "Mewarisi" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {selectedHeir.status === "Mewarisi" ? <BadgeCheck size={36} /> : <ShieldAlert size={36} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter">{selectedHeir.nama}</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{selectedHeir.hubungan} • {selectedHeir.status}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-6">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Scale size={12} /> Analisis Syariat
                  </p>
                  <p className="text-slate-300 font-medium leading-relaxed">{selectedHeir.alasan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Porsi Syar'i</p>
                    <p className="text-3xl font-black text-white">{selectedHeir.jatahPersen}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl shadow-xl shadow-emerald-500/20">
                    <p className="text-[9px] font-bold text-emerald-100 uppercase tracking-widest mb-2">Nominal Akhir</p>
                    <p className="text-xl font-black text-white">Rp {selectedHeir.jatahNominal.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedHeir(null)}
                  className="mt-6 w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-white hover:bg-white/10 transition-all">
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
