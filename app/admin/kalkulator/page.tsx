"use client";

import { useState } from "react";
import { 
  Calculator, 
  Play, 
  Info, 
  Sparkles, 
  Zap, 
  Plus, 
  Trash2, 
  User, 
  Users,
  BadgeCheck,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateFaraid } from "@/lib/faraidLogic";

export default function KalkulatorPage() {
  const [gender, setGender] = useState("Laki-laki");
  const [harta, setHarta] = useState("");
  const [heirs, setHeirs] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);

  const addHeir = () => {
    setHeirs([...heirs, { nama: `Ahli Waris ${heirs.length + 1}`, hubungan: "" }]);
  };

  const removeHeir = (index: number) => {
    setHeirs(heirs.filter((_, i) => i !== index));
  };

  const updateHeir = (index: number, hubungan: string) => {
    const newHeirs = [...heirs];
    newHeirs[index].hubungan = hubungan;
    setHeirs(newHeirs);
  };

  const handleSimulate = () => {
    if (!harta || heirs.length === 0) return alert("Masukkan total harta dan minimal satu ahli waris.");
    
    const jenazahMock = {
      id: "sim-1",
      gender,
      hartaKotor: parseFloat(harta),
      utang: 0,
      wasiat: 0
    };

    const simulationResults = calculateFaraid(jenazahMock, heirs.map((h, i) => ({ id: `h-${i}`, nama: h.nama, hubungan: h.hubungan })));
    setResults(simulationResults);
  };

  const formatIDR = (val: string) => {
    const numberString = val.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
  };

  const HEIR_OPTIONS = {
    "Laki-laki": ["Istri", "Anak Laki-laki", "Anak Perempuan", "Ayah", "Ibu", "Saudara Laki-laki Sekandung", "Cucu Laki-laki"],
    "Perempuan": ["Suami", "Anak Laki-laki", "Anak Perempuan", "Ayah", "Ibu", "Saudara Perempuan Sekandung", "Cucu Laki-laki"],
  };

  return (
    <div className="space-y-12 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kalkulator Simulasi</h1>
          <p className="text-slate-500 mt-2 font-medium">Lakukan pengujian porsi waris secara instan tanpa masuk ke database.</p>
        </div>
        <button 
          onClick={handleSimulate}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 active:scale-95 flex items-center gap-3"
        >
          <Zap size={20} fill="currentColor" />
          <span>Mulai Simulasi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
          <div className="space-y-6">
             <div className="flex items-center gap-3 text-emerald-600 font-bold uppercase tracking-widest text-xs">
                <User size={18} />
                <span>Data Jenazah Simulasi</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase">Gender Almarhum</label>
                   <div className="flex gap-2">
                      {["Laki-laki", "Perempuan"].map(g => (
                        <button 
                          key={g}
                          onClick={() => { setGender(g); setHeirs([]); }}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${gender === g ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400"}`}
                        >
                          {g}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase">Total Harta Bersih</label>
                   <input 
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none font-bold text-slate-800"
                      placeholder="Masukkan Nominal..."
                      value={formatIDR(harta)}
                      onChange={(e) => setHarta(e.target.value.replace(/\./g, ""))}
                   />
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-center text-emerald-600 font-bold uppercase tracking-widest text-xs">
                <div className="flex items-center gap-3">
                   <Users size={18} />
                   <span>Daftar Ahli Waris</span>
                </div>
                <button 
                  onClick={addHeir}
                  className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                >
                   <Plus size={18} />
                </button>
             </div>
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {heirs.map((h, i) => (
                  <div key={i} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                     <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-emerald-600 font-black text-xs shadow-sm">{i+1}</span>
                     <select 
                       className="flex-1 bg-transparent outline-none font-bold text-slate-700 text-sm cursor-pointer"
                       value={h.hubungan}
                       onChange={(e) => updateHeir(i, e.target.value)}
                     >
                        <option value="">Pilih Hubungan...</option>
                        {HEIR_OPTIONS[gender as "Laki-laki" | "Perempuan"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                     </select>
                     <button onClick={() => removeHeir(i)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
                {heirs.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 font-bold uppercase text-xs tracking-widest">
                     Klik ikon + untuk tambah waris
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
           <AnimatePresence mode="wait">
              {results ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key="results"
                  className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden"
                >
                   <div className="relative z-10 flex justify-between items-center mb-10">
                      <div className="flex items-center gap-3 text-emerald-400 font-black uppercase text-xs tracking-widest">
                         <Calculator size={20} />
                         <span>Hasil Simulasi</span>
                      </div>
                      <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                         KPK: {results.kpk}
                      </div>
                   </div>

                   <div className="relative z-10 space-y-6">
                      {results.ahliWarisGetted.map((h: any, i: number) => (
                        <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h4 className="font-bold text-white text-lg">{h.hubungan}</h4>
                                 <p className="text-xs text-slate-400 font-medium mt-1">{h.alasan}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-emerald-400 font-black text-xl leading-none">{h.jatahPersen}</p>
                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Rp {h.jatahNominal.toLocaleString('id-ID')}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>

                   <button 
                     onClick={() => setResults(null)}
                     className="relative z-10 mt-10 w-full py-4 bg-white/10 border border-white/10 text-white rounded-2xl font-black hover:bg-white/20 transition text-xs uppercase tracking-widest"
                   >
                      Reset Simulasi
                   </button>
                   
                   <div className="absolute top-0 right-0 p-10 opacity-5 text-white">
                      <Sparkles size={120} />
                   </div>
                </motion.div>
              ) : (
                <div className="h-full bg-white p-16 rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center space-y-6">
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] text-slate-200">
                      <Calculator size={64} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Menunggu Simulasi</h3>
                      <p className="text-slate-400 font-medium max-w-[280px]">Hasil perhitungan instan Anda akan muncul di sini setelah simulasi dimulai.</p>
                   </div>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
