"use client";

import { useState } from "react";
import { Calculator, Zap, Plus, Trash2, Users, BadgeCheck, Scale, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";

export default function KalkulatorPage() {
  const [gender, setGender] = useState("Laki-laki");
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [heirs, setHeirs] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [hukum, setHukum] = useState<string>("Islam");
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT">("SEPIKUL_SEGENDONGAN");
  const [potongGonoGini, setPotongGonoGini] = useState(false);

  const addHeir = () => setHeirs([...heirs, { nama: `Ahli Waris ${heirs.length + 1}`, hubungan: "" }]);
  const removeHeir = (i: number) => setHeirs(heirs.filter((_, idx) => idx !== i));
  const updateHeir = (i: number, hubungan: string) => { const n = [...heirs]; n[i].hubungan = hubungan; setHeirs(n); };

  const handleSimulate = () => {
    if (!harta || heirs.length === 0) return alert("Masukkan total harta dan minimal satu ahli waris.");
    const jenazahMock = { id: "sim-1", gender, hartaKotor: parseFloat(harta), utang: parseFloat(utang || "0"), wasiat: parseFloat(wasiat || "0"), potongGonoGini };
    const formattedHeirs = heirs.map((h, i) => ({ id: `h-${i}`, nama: h.nama, hubungan: h.hubungan, statusHidup: true }));
    if (hukum === "Jawa") {
      const result = calculateAdatJawa(jenazahMock, formattedHeirs, metodeAdat);
      setResults({ ...result, ahliWarisGetted: result.results, kpk: null, statusAulRadd: "Normal" });
    } else {
      setResults(calculateFaraid(jenazahMock, formattedHeirs as any));
    }
  };

  const formatIDR = (val: string) => {
    const n = val.replace(/[^,\d]/g, "").toString();
    const split = n.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) { rupiah += (sisa ? "." : "") + ribuan.join("."); }
    return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  };

  const HEIR_OPTIONS: Record<string, string[]> = {
    "Laki-laki": ["Istri", "Anak Laki-laki", "Anak Perempuan", "Ayah", "Ibu", "Saudara Laki-laki Sekandung", "Cucu Laki-laki"],
    "Perempuan": ["Suami", "Anak Laki-laki", "Anak Perempuan", "Ayah", "Ibu", "Saudara Perempuan Sekandung", "Cucu Laki-laki"],
  };

  const hartaBersih = Math.max(0, parseFloat(harta || "0") - parseFloat(utang || "0") - parseFloat(wasiat || "0"));

  return (
    <div className="pb-32 px-6 lg:px-10 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-14">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Kalkulator Simulasi</h1>
        <p className="text-slate-400 mt-3 font-medium text-lg">Pengujian porsi waris instan tanpa masuk database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ══════ LEFT: INPUT ══════ */}
        <div className="space-y-10">

          {/* Section 1: Hukum */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">① Pilih Sistem Hukum</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { id: "Islam", label: "Hukum Islam", emoji: "☪️", active: true },
                { id: "Jawa", label: "Adat Jawa", emoji: "🏛️", active: true },
                { id: "Perdata", label: "Perdata", emoji: "⚖️", active: false },
              ].map(h => (
                <button key={h.id} onClick={() => h.active && setHukum(h.id)}
                  className={`relative p-6 rounded-[2rem] text-center transition-all border-2 ${hukum === h.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xl"
                      : h.active
                        ? "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                        : "bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed opacity-50"
                    }`}>
                  <span className="text-3xl block mb-3">{h.emoji}</span>
                  <span className="text-[11px] font-black block uppercase tracking-widest">{h.label}</span>
                  {!h.active && <span className="absolute top-2 right-2 text-[8px] bg-slate-200 text-slate-400 px-2 py-0.5 rounded-lg">Soon</span>}
                  {hukum === h.id && <BadgeCheck size={18} className="absolute top-3 right-3 text-emerald-400" />}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {hukum === "Jawa" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] mt-2 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metode Pembagian</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "SEPIKUL_SEGENDONGAN", label: "Sepikul Segendongan", desc: "L:2 · P:1" },
                        { id: "KUM_KUM_KUPAT", label: "Kum Kum Kupat", desc: "Sama Rata 1:1" }
                      ].map(m => (
                        <button key={m.id} onClick={() => setMetodeAdat(m.id as any)}
                          className={`p-5 rounded-2xl border-2 text-left transition-all ${metodeAdat === m.id
                              ? "bg-slate-900 border-slate-900 text-white shadow-xl"
                              : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                            }`}>
                          <p className="font-black text-sm">{m.label}</p>
                          <p className={`text-[11px] mt-1 font-bold ${metodeAdat === m.id ? "text-slate-400" : "text-slate-400"}`}>{m.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-black text-sm text-slate-800">Gono-Gini (50%)</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Potong 50% untuk pasangan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={potongGonoGini} onChange={e => setPotongGonoGini(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section 2: Data Pewaris & Harta */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10 space-y-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">② Data Pewaris & Harta</p>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Gender Almarhum</label>
              <div className="grid grid-cols-2 gap-3">
                {["Laki-laki", "Perempuan"].map(g => (
                  <button key={g} onClick={() => { setGender(g); setHeirs([]); }}
                    className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${gender === g
                        ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                      }`}>
                    {g === "Laki-laki" ? "♂ " : "♀ "}{g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Harta Kotor", val: harta, set: setHarta, ph: "0" },
                { label: "Total Utang", val: utang, set: setUtang, ph: "0" },
                { label: "Wasiat", val: wasiat, set: setWasiat, ph: "0" },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{f.label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs">Rp</span>
                    <input type="text"
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 rounded-2xl outline-none font-black text-slate-900 text-base border border-slate-100 focus:border-slate-900 focus:ring-4 focus:ring-slate-100/50 transition-all"
                      placeholder={f.ph} value={formatIDR(f.val)}
                      onChange={(e) => f.set(e.target.value.replace(/\./g, ""))}
                    />
                  </div>
                </div>
              ))}
            </div>

            {harta && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Harta Bersih (Mirkah)</p>
                  <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">Harta − Utang − Wasiat</p>
                </div>
                <p className="text-3xl font-black text-white tracking-tighter">Rp {formatIDR(String(hartaBersih))}</p>
              </motion.div>
            )}
          </div>

          {/* Section 3: Ahli Waris */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
            <div className="flex justify-between items-center mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">③ Daftar Ahli Waris</p>
              <button onClick={addHeir}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                <Plus size={16} /> Tambah
              </button>
            </div>

            <div className="space-y-4">
              {heirs.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 items-center bg-slate-50 p-4 rounded-[2rem] border border-slate-100 group hover:border-slate-300 transition-all">
                  <span className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl font-black text-sm shadow-lg">{i + 1}</span>
                  <div className="flex-1 relative">
                    <select
                      className="w-full bg-white px-6 py-3.5 rounded-2xl outline-none font-black text-slate-800 text-sm cursor-pointer border border-slate-100 focus:border-slate-900 focus:ring-4 focus:ring-slate-100/50 transition-all appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center' }}
                      value={h.hubungan} onChange={(e) => updateHeir(i, e.target.value)}>
                      <option value="">Pilih Hubungan...</option>
                      {HEIR_OPTIONS[gender].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <button onClick={() => removeHeir(i)} className="w-10 h-10 flex items-center justify-center text-slate-300 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
              {heirs.length === 0 && (
                <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[3.5rem]">
                  <Users size={48} className="text-slate-100 mx-auto mb-4" />
                  <p className="text-slate-300 font-black text-sm uppercase tracking-widest">Belum ada ahli waris ditambahkan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════ RIGHT: RESULTS ══════ */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="results"
                className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <p className="font-black text-white text-2xl tracking-tighter">Hasil Simulasi</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">
                        {hukum === "Jawa" ? metodeAdat.replace(/_/g, ' ') : "Faraid Engine"} • {results.statusAulRadd}
                      </p>
                    </div>
                    {results.kpk && (
                      <span className="px-4 py-2 bg-white/10 text-white rounded-xl text-[11px] font-black uppercase tracking-widest border border-white/10">
                        KPK: {results.kpk}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {results.ahliWarisGetted.map((h: any, i: number) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-black text-white text-lg">{h.hubungan}</h4>
                            <p className="text-[11px] text-slate-500 font-bold mt-2 leading-relaxed max-w-[240px] opacity-80 group-hover:opacity-100 transition-opacity">{h.alasan}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-emerald-400 font-black text-2xl tracking-tighter leading-none">{h.jatahPersen}</p>
                            <p className="text-[11px] text-slate-500 font-black mt-2 tracking-tighter">Rp {h.jatahNominal?.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button onClick={() => setResults(null)}
                    className="mt-10 w-full py-4 bg-white/10 border border-white/10 text-white rounded-2xl font-black hover:bg-white/20 transition text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Reset Perhitungan
                  </button>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white"><Sparkles size={160} /></div>
              </motion.div>
            ) : (
              <div className="bg-white p-20 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center min-h-[450px]">
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="p-10 bg-slate-50 rounded-[2.5rem] text-slate-200 mb-8 border border-slate-100 shadow-inner">
                  <Calculator size={64} strokeWidth={1} />
                </motion.div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-3">Menunggu Input</h3>
                <p className="text-slate-400 font-medium text-base max-w-[280px] leading-relaxed">Silakan isi parameter di panel kiri lalu klik tombol simulasi di bawah.</p>
              </div>
            )}
          </AnimatePresence>

          {/* ── Simulasi Button: NOW CLEARLY BELOW THE CARD ── */}
          <motion.div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSimulate}
              disabled={!harta || heirs.length === 0 || !hukum}
              className="group w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed border-b-8 border-slate-950 hover:border-emerald-700"
            >
              <Zap size={28} fill="currentColor" />
              Mulai Simulasi Waris
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <p className="text-center text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-5">Hasil simulasi tidak akan disimpan ke database</p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
