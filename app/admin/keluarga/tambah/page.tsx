"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  Users, 
  Wallet, 
  ShieldCheck, 
  FileUp,
  Tag,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createKeluarga } from "@/app/actions/waris";

export default function TambahKeluargaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [hukum, setHukum] = useState<string>("Islam");
  const [potongGonoGini, setPotongGonoGini] = useState(false);
  const [metodeAdat, setMetodeAdat] = useState("SEPIKUL_SEGENDONGAN");

  const [jenazah, setJenazah] = useState({
    nama: "",
    nik: "",
    gender: "Laki-laki",
    keterangan: "",
    tanggalWafat: new Date().toISOString().split('T')[0],
  });

  const [ahliWaris, setAhliWaris] = useState<any[]>([]);

  const formatIDR = (val: string) => {
    const number = val.replace(/\D/g, "");
    return number ? new Intl.NumberFormat("id-ID").format(parseInt(number)) : "";
  };

  const parseNumber = (formatted: string) => {
    return parseInt(formatted.replace(/\D/g, "")) || 0;
  };


  const handleAddAhliWaris = () => {
    setAhliWaris([...ahliWaris, { 
      id: Math.random().toString(36).substring(7), // Temp ID for parent selection
      nama: "", 
      nik: "", 
      hubungan: "Anak Laki-laki", 
      statusHidup: true,
      parentId: "",
      file: null, 
      fileName: "" 
    }]);
  };

  const handleRemoveAhliWaris = (idx: number) => {
    setAhliWaris(ahliWaris.filter((_, i) => i !== idx));
  };

  const updateAhliWaris = (idx: number, field: string, value: any) => {
    const newArr = [...ahliWaris];
    newArr[idx][field] = value;
    setAhliWaris(newArr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nama", jenazah.nama);
    formData.append("nik", jenazah.nik);
    formData.append("gender", jenazah.gender);
    formData.append("keterangan", jenazah.keterangan);
    formData.append("tanggalWafat", jenazah.tanggalWafat);
    formData.append("hartaKotor", parseNumber(harta).toString());
    formData.append("utang", parseNumber(utang).toString());
    formData.append("wasiat", parseNumber(wasiat).toString());
    formData.append("hukum", hukum);
    formData.append("potongGonoGini", potongGonoGini.toString());
    formData.append("metodeAdat", metodeAdat);

    const cleanedAhliWaris = ahliWaris.map(({ file, ...rest }) => rest);
    formData.append("ahliWarisJson", JSON.stringify(cleanedAhliWaris));

    // Append files separately
    ahliWaris.forEach((heir, idx) => {
      if (heir.file) {
        formData.append(`file_${idx}`, heir.file);
      }
    });

    const res = await createKeluarga(formData);
    if (res.success) {
      router.push(`/admin/keluarga/${res.id}`);
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <Link href="/admin/keluarga" className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors text-slate-500">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Daftar Keluarga Baru</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Simulasi administrasi waris syariah profesional.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Identitas Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-10 text-emerald-600 font-black uppercase text-xs tracking-[0.2em]">
                <User size={18} />
                <span>Parameter & Identitas Almarhum</span>
             </div>

             <div className="mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Hukum Pembagian Yang Digunakan <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "Islam", label: "Hukum Islam", active: true },
                    { id: "Jawa", label: "Hukum Adat Jawa", active: true },
                    { id: "Perdata", label: "Hukum Perdata", active: false },
                  ].map(h => (
                    <button 
                      key={h.id}
                      type="button"
                      onClick={() => h.active && setHukum(h.id)}
                      className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs transition-all ${
                        hukum === h.id 
                          ? "bg-slate-900 text-white shadow-xl" 
                          : h.active 
                            ? "bg-white text-slate-400 border border-slate-200 hover:border-emerald-300" 
                            : "bg-white/50 text-slate-300 border border-slate-100 cursor-not-allowed"
                      }`}
                    >
                      <span>{h.label}</span>
                      {!h.active && <span className="text-[8px] bg-slate-100 text-slate-300 px-2 py-0.5 rounded">Soon</span>}
                    </button>
                  ))}
                </div>
             </div>

             {hukum === "Jawa" && (
                <div className="mb-10 p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <label className="text-xs font-black text-emerald-600 uppercase tracking-widest block mb-4">Metode Adat Jawa</label>
                    <div className="flex gap-4">
                      {[
                        { id: "SEPIKUL_SEGENDONGAN", label: "Sepikul Segendongan (2:1)", desc: "Laki-laki 2, Perempuan 1" },
                        { id: "KUM_KUM_KUPAT", label: "Kum Kum Kupat (1:1)", desc: "Pembagian Sama Rata" },
                      ].map(m => (
                        <button 
                          key={m.id}
                          type="button"
                          onClick={() => setMetodeAdat(m.id)}
                          className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${
                            metodeAdat === m.id ? "bg-white border-emerald-500 shadow-lg" : "bg-white/50 border-emerald-100 text-slate-400"
                          }`}
                        >
                          <p className="font-black text-xs text-slate-900">{m.label}</p>
                          <p className="text-[10px] font-medium opacity-60 mt-1">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-black text-xs text-slate-900">Harta Gono-Gini (50%)</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">Potong 50% untuk pasangan sebelum dibagi.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={potongGonoGini} onChange={e => setPotongGonoGini(e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Nomor NIK (Sesuai KTP)</label>
                  <input 
                    type="text" 
                    maxLength={16}
                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                    placeholder="Masukkan 16 digit NIK..."
                    value={jenazah.nik}
                    onChange={(e) => setJenazah({...jenazah, nik: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Nama Lengkap</label>
                   <input 
                    type="text" 
                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:bg-white transition-all"
                    value={jenazah.nama}
                    onChange={(e) => setJenazah({...jenazah, nama: e.target.value})}
                    placeholder="Masukkan Nama Lengkap..."
                   />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Gender</label>
                  <select 
                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:bg-white appearance-none"
                    value={jenazah.gender}
                    onChange={(e) => setJenazah({...jenazah, gender: e.target.value})}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-4">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Tanggal Wafat (Sesuai Akta)</label>
                   <input 
                    type="date" 
                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:bg-white transition-all"
                    value={jenazah.tanggalWafat}
                    onChange={(e) => setJenazah({...jenazah, tanggalWafat: e.target.value})}
                   />
                </div>
                <div className="md:col-span-2 space-y-4">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Status / Peran dalam Keluarga</label>
                   <div className="relative">
                     <Tag className="absolute left-5 top-5 text-slate-300" size={20} />
                     <select 
                      className="w-full p-5 pl-14 bg-slate-50 rounded-2xl border border-slate-100 font-black outline-none focus:bg-white appearance-none"
                      value={jenazah.keterangan}
                      onChange={(e) => setJenazah({...jenazah, keterangan: e.target.value})}
                     >
                       <option value="">-- Pilih Peran --</option>
                       <option value="Ayah">Ayah (Meninggal sebagai Bapak)</option>
                       <option value="Ibu">Ibu (Meninggal sebagai Mama/Ibu)</option>
                       <option value="Kakek">Kakek</option>
                       <option value="Nenek">Nenek</option>
                       <option value="Anak Laki-laki">Anak Laki-laki</option>
                       <option value="Anak Perempuan">Anak Perempuan</option>
                     </select>
                   </div>
                </div>
             </div>
          </div>

          {/* Ahli Waris Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-6">
               <div className="flex items-center gap-3 text-emerald-600 font-black uppercase text-xs tracking-widest">
                  <Users size={18} />
                  <span>Daftar Ahli Waris</span>
               </div>
               <button 
                type="button" 
                onClick={handleAddAhliWaris}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
               >
                 <Plus size={16} /> Tambah Anggota
               </button>
            </div>

            <div className="space-y-6">
               <AnimatePresence>
                 {ahliWaris.map((heir, idx) => (
                   <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    key={idx} 
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex flex-col md:flex-row gap-6 relative group"
                   >
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input 
                          type="text" 
                          placeholder="Nama Ahli Waris"
                          className="p-4 bg-slate-50 rounded-xl border border-slate-50 font-bold outline-none focus:bg-white focus:border-emerald-300 transition-all"
                          value={heir.nama}
                          onChange={(e) => updateAhliWaris(idx, "nama", e.target.value)}
                        />
                         <input 
                          type="text" 
                          placeholder="NIK (Opsional)"
                          className="p-4 bg-slate-50 rounded-xl border border-slate-50 font-bold outline-none focus:bg-white focus:border-emerald-300 transition-all"
                          value={heir.nik}
                          onChange={(e) => updateAhliWaris(idx, "nik", e.target.value)}
                        />
                        <select 
                          className="p-4 bg-slate-50 rounded-xl border border-slate-50 font-bold outline-none focus:bg-white"
                          value={heir.hubungan}
                          onChange={(e) => updateAhliWaris(idx, "hubungan", e.target.value)}
                        >
                          <option value="Suami">Suami</option>
                          <option value="Istri">Istri</option>
                          <option value="Anak Laki-laki">Anak Laki-laki</option>
                          <option value="Anak Perempuan">Anak Perempuan</option>
                          <option value="Cucu Laki-laki">Cucu Laki-laki</option>
                          <option value="Cucu Perempuan">Cucu Perempuan</option>
                          <option value="Ayah">Bapak</option>
                          <option value="Ibu">Ibu</option>
                          <option value="Saudara Laki-laki Sekandung">Saudara Laki-laki Sekandung</option>
                          <option value="Saudara Perempuan Sekandung">Saudara Perempuan Sekandung</option>
                        </select>
                     </div>
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:mt-0">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase">Status Hidup</label>
                           <select 
                            className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all ${heir.statusHidup ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"}`}
                            value={heir.statusHidup ? "Hidup" : "Meninggal"}
                            onChange={(e) => updateAhliWaris(idx, "statusHidup", e.target.value === "Hidup")}
                           >
                              <option value="Hidup">Masih Hidup</option>
                              <option value="Meninggal">Sudah Meninggal</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase">Anak Dari (Untuk Pengganti)</label>
                           <select 
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-xs outline-none focus:bg-white"
                            value={heir.parentId}
                            onChange={(e) => updateAhliWaris(idx, "parentId", e.target.value)}
                           >
                              <option value="">-- Bukan Pengganti --</option>
                              {ahliWaris.map((parent, pIdx) => (
                                pIdx !== idx && parent.statusHidup === false && (
                                  <option key={parent.id} value={parent.id}>{parent.nama || `Ahli Waris ${pIdx + 1}`}</option>
                                )
                              ))}
                           </select>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-emerald-100 transition-colors">
                           <FileUp size={16} /> {heir.fileName ? "File OK" : "Upload KTP"}
                           <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 if (file.size > 5 * 1024 * 1024) {
                                    alert("Ukuran file terlalu besar! Maksimal 5MB.");
                                    return;
                                 }
                                 updateAhliWaris(idx, "file", file);
                                 updateAhliWaris(idx, "fileName", file.name);
                               }
                            }}
                           />
                        </label>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveAhliWaris(idx)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-inner"
                        >
                          <Trash2 size={18} />
                        </button>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
               {ahliWaris.length === 0 && (
                 <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-white text-slate-300 font-bold uppercase tracking-widest text-xs">Belum ada ahli waris ditambahkan</div>
               )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border-b-8 border-b-emerald-600">
             <div className="relative z-10 flex items-center gap-3 mb-10 text-emerald-400 font-black uppercase text-xs tracking-widest">
                <Wallet size={18} />
                <span>Rincian Asset</span>
             </div>
             <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Harta (Mirkah)</label>
                   <div className="relative">
                      <span className="absolute left-5 top-5 text-slate-500 font-black">Rp</span>
                      <input 
                        className="w-full p-5 pl-12 bg-slate-800 rounded-2xl border border-slate-700 font-black outline-none focus:border-emerald-500 text-2xl transition-all"
                        value={harta}
                        onChange={(e) => setHarta(formatIDR(e.target.value))}
                        placeholder="0"
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Utang Almarhum</label>
                   <div className="relative">
                      <span className="absolute left-5 top-5 text-slate-500 font-black">Rp</span>
                      <input 
                        className="w-full p-5 pl-12 bg-slate-800 rounded-2xl border border-slate-700 font-black outline-none focus:border-red-400 transition-all"
                        value={utang}
                        onChange={(e) => setUtang(formatIDR(e.target.value))}
                        placeholder="0"
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wasiat (Max 1/3)</label>
                   <div className="relative">
                      <span className="absolute left-5 top-5 text-slate-500 font-black">Rp</span>
                      <input 
                        className="w-full p-5 pl-12 bg-slate-800 rounded-2xl border border-slate-700 font-black outline-none focus:border-blue-400 transition-all"
                        value={wasiat}
                        onChange={(e) => setWasiat(formatIDR(e.target.value))}
                        placeholder="0"
                      />
                   </div>
                </div>
             </div>
             {/* Decorative */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-x-12 -translate-y-12" />
          </div>

          <button 
            type="submit" 
            disabled={loading || !hukum}
            className="w-full py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black text-lg tracking-tight hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? <span className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent" /> : <Save size={24} />}
            <span>Finalisasikan Data Waris</span>
          </button>
        </div>
      </form>
    </div>
  );
}
