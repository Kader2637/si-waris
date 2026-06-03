"use client";

import { useState } from "react";
// ... (imports will be handled in next step if needed)

const premiumStyles = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .premium-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
  }
  .input-focus-effect:focus-within {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    border-color: #10b981;
  }
`;
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  Users, 
  Wallet, 
  CheckCircle2,
  ShieldCheck,
  FileUp,
  Tag,
  Calendar,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createKeluarga } from "@/app/actions/waris";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function TambahKeluargaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [hukum, setHukum] = useState<string>("Islam");
  const [potongGonoGini, setPotongGonoGini] = useState(false);
  const [metodeAdat, setMetodeAdat] = useState("SEPIKUL_SEGENDONGAN");
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const [jenazah, setJenazah] = useState({
    nama: "",
    nik: "",
    gender: "Laki-laki",
    keterangan: "",
    tanggalWafat: new Date().toISOString().split('T')[0],
  });

  const [ahliWaris, setAhliWaris] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  const formatIDR = (val: string) => {
    const number = val.replace(/\D/g, "");
    return number ? new Intl.NumberFormat("id-ID").format(parseInt(number)) : "";
  };

  const parseNumber = (formatted: string) => {
    return parseInt(formatted.replace(/\D/g, "")) || 0;
  };


  const handleAddAhliWaris = () => {
    setAhliWaris([...ahliWaris, { 
      id: Math.random().toString(36).substring(7),
      nama: "", 
      nik: "", 
      hubungan: "Anak Laki-laki", 
      statusHidup: true,
      parentId: "",
      file: null, 
      fileName: "" 
    }]);
  };

  const confirmRemoveHeir = () => {
    if (removeIndex === null) return;
    setAhliWaris(ahliWaris.filter((_, i) => i !== removeIndex));
    setRemoveIndex(null);
    toast.success("Anggota keluarga dihapus dari daftar");
  };

  const updateAhliWaris = (idx: number, field: string, value: any) => {
    const newArr = [...ahliWaris];
    newArr[idx] = { ...newArr[idx], [field]: value };
    setAhliWaris(newArr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validasi
    const newErrors: any = {};
    if (!jenazah.nama) newErrors.nama = "Nama almarhum wajib diisi";
    if (!jenazah.nik || jenazah.nik.length < 16) newErrors.nik = "NIK wajib 16 digit";
    if (!jenazah.keterangan) newErrors.keterangan = "Peran dalam keluarga wajib dipilih";
    if (ahliWaris.length === 0) {
      toast.error("Minimal harus ada 1 ahli waris");
      return;
    }

    ahliWaris.forEach((h, i) => {
      if (!h.nama) {
        if (!newErrors.ahliWaris) newErrors.ahliWaris = [];
        newErrors.ahliWaris[i] = "Nama ahli waris wajib diisi";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Mohon lengkapi semua data yang wajib diisi");
      return;
    }

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
      toast.success("Data keluarga berhasil disimpan!");
      router.push(`/admin/keluarga/${res.id}`);
    } else {
      toast.error(`Gagal: ${res.error}`, {
        duration: 5000,
        style: {
          background: '#fff',
          color: '#ef4444',
          border: '1px solid #fee2e2',
          fontWeight: 'bold',
        }
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <ConfirmModal 
        isOpen={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        onConfirm={confirmRemoveHeir}
        title="Hapus Anggota Keluarga?"
        message="Anda akan menghapus anggota ini dari daftar perhitungan. Data yang sudah diisi akan hilang."
        confirmText="Hapus"
      />
      <style dangerouslySetInnerHTML={{ __html: premiumStyles }} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/keluarga" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm hover:shadow-md hover:-translate-x-1 transition-all text-slate-400 hover:text-emerald-600">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Daftar Keluarga Baru</h1>
            <p className="text-slate-500 mt-0.5 font-medium text-xs italic opacity-60">Sistem Administrasi Waris Syariah Terintegrasi</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
           <ShieldCheck size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">Akses Administrator</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Identitas Section */}
          <div className="premium-card p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
                   <User size={18} />
                </div>
                <div>
                   <h2 className="text-lg font-black text-slate-900 leading-none">Identitas Almarhum</h2>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Parameter & Informasi Dasar</p>
                </div>
             </div>

             <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Hukum Pembagian Yang Digunakan <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "Islam", label: "Hukum Islam", active: true },
                    { id: "Jawa", label: "Hukum Adat Jawa", active: true },
                    { id: "Perdata", label: "Hukum Perdata", active: false },
                  ].map(h => (
                    <button 
                      key={h.id}
                      type="button"
                      onClick={() => h.active && setHukum(h.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-black text-xs transition-all ${
                        hukum === h.id 
                          ? "bg-slate-900 text-white shadow-md" 
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
                <div className="mb-6 p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-3">Metode Adat Jawa</label>
                    <div className="flex gap-3">
                      {[
                        { id: "SEPIKUL_SEGENDONGAN", label: "Sepikul Segendongan (2:1)", desc: "Laki-laki 2, Perempuan 1" },
                        { id: "KUM_KUM_KUPAT", label: "Kum Kum Kupat (1:1)", desc: "Pembagian Sama Rata" },
                      ].map(m => (
                        <button 
                          key={m.id}
                          type="button"
                          onClick={() => setMetodeAdat(m.id)}
                          className={`flex-1 p-3 rounded-xl border transition-all text-left ${
                            metodeAdat === m.id ? "bg-white border-emerald-500 shadow-md" : "bg-white/50 border-emerald-100 text-slate-400"
                          }`}
                        >
                          <p className="font-bold text-xs text-slate-900">{m.label}</p>
                          <p className="text-[9px] font-medium opacity-60 mt-0.5">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-xs text-slate-900">Harta Gono-Gini (50%)</p>
                      <p className="text-[9px] text-slate-500 font-medium mt-0.5">Potong 50% untuk pasangan sebelum dibagi.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={potongGonoGini} onChange={e => setPotongGonoGini(e.target.checked)} />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nomor NIK (Sesuai KTP) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    maxLength={16}
                    className={`w-full p-3 bg-slate-50 rounded-xl border font-bold text-sm transition-all ${errors.nik ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-emerald-500 focus:bg-white outline-none'}`}
                    placeholder="Masukkan 16 digit NIK..."
                    value={jenazah.nik}
                    onChange={(e) => setJenazah({...jenazah, nik: e.target.value})}
                  />
                  {errors.nik && <p className="text-[9px] text-red-500 font-bold ml-2 mt-1">{errors.nik}</p>}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nama Lengkap <span className="text-red-500">*</span></label>
                   <input 
                    type="text" 
                    className={`w-full p-3 bg-slate-50 rounded-xl border font-bold text-sm outline-none transition-all ${errors.nama ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:bg-white'}`}
                    value={jenazah.nama}
                    onChange={(e) => setJenazah({...jenazah, nama: e.target.value})}
                    placeholder="Masukkan Nama Lengkap..."
                   />
                   {errors.nama && <p className="text-[9px] text-red-500 font-bold ml-2 mt-1">{errors.nama}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Gender</label>
                  <select 
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-sm outline-none focus:bg-white appearance-none"
                    value={jenazah.gender}
                    onChange={(e) => setJenazah({...jenazah, gender: e.target.value})}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tanggal Wafat (Sesuai Akta)</label>
                   <input 
                    type="date" 
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-sm outline-none focus:bg-white transition-all"
                    value={jenazah.tanggalWafat}
                    onChange={(e) => setJenazah({...jenazah, tanggalWafat: e.target.value})}
                   />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Status / Peran dalam Keluarga <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-3.5 text-slate-300 animate-pulse" size={16} />
                      <select 
                       className={`w-full p-3 pl-10 rounded-xl border font-bold text-sm outline-none transition-all appearance-none ${errors.keterangan ? 'border-red-500 bg-red-50' : 'bg-slate-50 border-slate-100 focus:bg-white'}`}
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
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                    {errors.keterangan && <p className="text-[9px] text-red-500 font-bold ml-2 mt-0.5">{errors.keterangan}</p>}
                 </div>
              </div>
          </div>

          {/* Ahli Waris Section */}
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <Users size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Daftar Ahli Waris</h2>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                       {ahliWaris.length} Anggota Keluarga
                     </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddAhliWaris}
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-slate-200 active:scale-95 w-full sm:w-auto"
                >
                  <div className="bg-white/20 p-1 rounded-md group-hover:rotate-90 transition-transform">
                     <Plus size={12} />
                  </div>
                  <span>Tambah Anggota</span>
                </button>
             </div>

             <div className="space-y-4">
                <AnimatePresence>
                  {ahliWaris.map((heir, idx) => (
                    <div key={heir.id} className="flex flex-col md:flex-row items-center gap-3 w-full group/row">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-md shadow-slate-200/20 grid grid-cols-1 md:grid-cols-10 gap-4 items-start relative group hover:border-emerald-200 transition-all"
                      >
                        <div className="md:col-span-3 space-y-1.5">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Nama Ahli Waris</label>
                           <input 
                             type="text" 
                             placeholder="Masukkan Nama..."
                             className={`w-full h-10 p-3 rounded-xl border font-bold outline-none transition-all text-xs ${errors.ahliWaris?.[idx] ? 'border-red-500 bg-red-50' : 'bg-slate-50 border-slate-50 focus:bg-white focus:border-emerald-300'}`}
                             value={heir.nama}
                             onChange={(e) => updateAhliWaris(idx, "nama", e.target.value)}
                           />
                           {errors.ahliWaris?.[idx] && <p className="text-[8px] text-red-500 font-bold ml-1 mt-0.5">{errors.ahliWaris[idx]}</p>}
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-1">NIK (Opsional)</label>
                           <input 
                             type="text" 
                             placeholder="NIK..."
                             className="w-full h-10 p-3 bg-slate-50 rounded-xl border border-slate-50 font-bold outline-none focus:bg-white focus:border-emerald-300 transition-all text-xs"
                             value={heir.nik}
                             onChange={(e) => updateAhliWaris(idx, "nik", e.target.value)}
                           />
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Hubungan Keluarga</label>
                           <div className="relative">
                             <select 
                               className="w-full h-10 p-3 bg-slate-50 rounded-xl border border-slate-50 font-bold outline-none focus:bg-white focus:border-emerald-300 transition-all text-xs appearance-none pr-8"
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
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                           </div>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Status Hidup</label>
                           <div className="relative">
                             <select 
                              className={`w-full h-10 p-3 rounded-xl border font-bold text-xs outline-none transition-all appearance-none pr-8 ${heir.statusHidup ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"}`}
                              value={heir.statusHidup ? "Hidup" : "Meninggal"}
                              onChange={(e) => updateAhliWaris(idx, "statusHidup", e.target.value === "Hidup")}
                             >
                                <option value="Hidup">Masih Hidup</option>
                                <option value="Meninggal">Sudah Meninggal</option>
                             </select>
                             <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${heir.statusHidup ? "text-emerald-400" : "text-red-400"}`} size={14} />
                           </div>
                        </div>
                      </motion.div>

                      <div className="flex md:flex-col gap-2">
                         <label 
                          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer shadow-sm ${heir.fileName ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:bg-emerald-50 hover:text-emerald-600'}`} 
                          title={heir.fileName ? `File: ${heir.fileName}` : "Upload KTP (Opsional)"}
                         >
                            {heir.fileName ? <CheckCircle2 size={16} /> : <FileUp size={16} />}
                            <input 
                             type="file" 
                             accept="image/*,application/pdf"
                             className="hidden" 
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                                 if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                       toast.error("Ukuran file terlalu besar! Maksimal 5MB.");
                                       return;
                                    }
                                    toast.success(`Berkas ${file.name} terpilih`);
                                    updateAhliWaris(idx, "file", file);
                                    updateAhliWaris(idx, "fileName", file.name);
                                  }
                             }}
                            />
                         </label>
                         <button 
                           type="button" 
                           onClick={() => setRemoveIndex(idx)}
                           className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 rounded-xl border border-slate-100 shadow-sm hover:bg-red-50 hover:text-red-500 transition-all"
                           title="Hapus Anggota"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
                {ahliWaris.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center border-2 border-dashed border-slate-50 rounded-2xl bg-slate-50/30 flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md mb-4 text-slate-200">
                       <Users size={24} />
                    </div>
                    <p className="text-base font-black text-slate-300 uppercase tracking-widest">Belum ada ahli waris</p>
                    <p className="text-slate-400 mt-1 font-medium text-xs">Klik tombol di atas untuk menambahkan anggota keluarga.</p>
                  </motion.div>
                )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 h-fit">
          <div className="premium-card bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group border-b-4 border-b-emerald-600">
             <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                   <Wallet size={16} />
                </div>
                <div>
                   <h3 className="font-black text-xs uppercase tracking-widest">Rincian Asset</h3>
                   <p className="text-[9px] text-slate-550 font-bold uppercase tracking-widest">Kalkulasi Otomatis</p>
                </div>
             </div>
             
             <div className="relative z-10 space-y-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Total Harta (Mirkah)</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">Rp</span>
                      <input 
                        className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 font-bold text-sm outline-none focus:border-emerald-500 focus:bg-white/10 transition-all text-emerald-400"
                        value={harta}
                        onChange={(e) => setHarta(formatIDR(e.target.value))}
                        placeholder="0"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Total Utang Almarhum</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">Rp</span>
                      <input 
                        className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 font-bold text-sm outline-none focus:border-red-400 focus:bg-white/10 transition-all text-red-400"
                        value={utang}
                        onChange={(e) => setUtang(formatIDR(e.target.value))}
                        placeholder="0"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Wasiat (Max 1/3)</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">Rp</span>
                      <input 
                        className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 font-bold text-sm outline-none focus:border-blue-400 focus:bg-white/10 transition-all text-blue-400"
                        value={wasiat}
                        onChange={(e) => setWasiat(formatIDR(e.target.value))}
                        placeholder="0"
                      />
                   </div>
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-x-6 -translate-y-6" />
             <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/5 rounded-full translate-x-6 translate-y-6" />
          </div>

          <button 
            type="submit" 
            disabled={loading || !hukum}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm tracking-tight hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 flex flex-col items-center justify-center gap-0.5 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mb-2" />
            ) : (
              <div className="flex items-center gap-3">
                <Save size={24} className="group-hover:scale-110 transition-transform" />
                <span>Simpan & Kalkulasi</span>
              </div>
            )}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Finalisasi Data Waris</span>
          </button>
        </div>
      </form>
    </div>
  );
}
