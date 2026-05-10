"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Wallet, 
  Download, 
  Play, 
  ShieldAlert, 
  BadgeCheck, 
  Users, 
  Info,
  Scale,
  Zap,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getKeluargaById, processFaraid } from "@/app/actions/waris";

export default function DetailKeluargaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterWaris, setFilterWaris] = useState("Semua");
  const [selectedHeir, setSelectedHeir] = useState<any>(null);
  const [hukum, setHukum] = useState<string>("Islam");

  useEffect(() => {
    if (data?.hukum) setHukum(data.hukum);
  }, [data]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getKeluargaById(id);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCalculate = async () => {
    setCalculating(true);
    await processFaraid(id);
    await fetchData();
    setCalculating(false);
  };

  const getProblemDescription = (status: string) => {
    if (data?.hukum === "Jawa") {
      const metode = data.logKalkulasi?.metodeAdat;
      if (metode === "SEPIKUL_SEGENDONGAN") {
        return "Alasan Pemilihan Metode (Sepikul Segendongan): Diterapkan karena musyawarah keluarga sepakat memakai tradisi proporsional Jawa asli. Laki-laki memikul beban tanggung jawab yang lebih berat sehingga mendapat 2 porsi, sedangkan perempuan menggendong sehingga mendapat 1 porsi.";
      } else if (metode === "KUM_KUM_KUPAT") {
        return "Alasan Pemilihan Metode (Kum-Kum Kupat): Diterapkan karena musyawarah keluarga sepakat untuk mengesampingkan perbedaan gender demi asas kerukunan 'mangan ora mangan kumpul'. Semua harta keturunan dibagi sama rata (1:1) untuk mencegah konflik.";
      }
      return data.ahliWaris.some((h: any) => h.hasil) 
        ? `Sesuai Hukum Adat Jawa (${metode?.replace(/_/g, ' ') || '-'}).`
        : "Sesuai Hukum Adat Jawa: Tekan tombol kalkulasi untuk memulai perhitungan berbasis kesepakatan adat.";
    }

    switch (status) {
      case "Gharrawain":
        return "Alasan Terdeteksi (Gharrawain): Terjadi karena susunan ahli waris yang tersisa HANYA terdiri dari Suami/Istri, Ibu, dan Bapak. Aturan khusus ijtihad Umar bin Khattab ra. diaktifkan agar porsi Bapak tetap 2x lipat dari porsi Ibu (Ibu mendapat 1/3 dari SISA harta).";
      case "Aul":
        return "Alasan Terdeteksi (Aul): Terjadi karena total persentase hak pasti (Furud) dari para ahli waris MELEBIHI 100% dari total harta. Sistem otomatis menaikkan angka penyebut secara proporsional agar harta tidak minus dan semua pihak tetap terakomodasi.";
      case "Radd":
        return "Alasan Terdeteksi (Radd): Terjadi karena masih ADA SISA harta setelah dibagikan, namun TIDAK ADA ahli waris jalur laki-laki (Ashabah) yang hidup untuk mengambilnya. Sisa tersebut dikembalikan (di-radd) proporsional kepada ahli waris yang ada selain suami/istri.";
      case "Normal":
        return "Alasan Terdeteksi (Normal): Perhitungan berjalan mulus tanpa kendala. Hal ini karena total jatah ahli waris pas 100%, atau sisa harta langsung terdistribusi habis kepada ahli waris Ashabah (penerima sisa).";
      default:
        return "Sesuai Kaidah Faraid: Tekan tombol kalkulasi untuk mendeteksi status dan melihat hasil pembagian syar'i.";
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest text-sm">Sinkronisasi Database...</div>;
  if (!data) return <div className="p-20 text-center font-bold text-red-400">Data Keluarga tidak ditemukan.</div>;

  const isJawa = data.hukum === "Jawa";
  const theme = isJawa 
    ? { primary: "amber", bg: "bg-amber-600", text: "text-amber-600", border: "border-amber-500", light: "bg-amber-50", shadow: "shadow-amber-200" }
    : { primary: "emerald", bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-500", light: "bg-emerald-50", shadow: "shadow-emerald-200" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-6">
          <Link href="/admin/keluarga" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{data.nama}</h1>
            <p className="text-slate-500 font-medium">Verified NIK: {data.nik} • Ditambahkan {new Date(data.createdAt).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">Metode Pembagian</label>
            <div className="flex gap-2">
              {[
                { id: "Islam", label: "Islam" },
                { id: "Jawa", label: "Adat Jawa" },
                { id: "Perdata", label: "Perdata" },
              ].map(h => {
                const isSelectedLaw = data.hukum === h.id || (h.id === "Islam" && !data.hukum);
                return (
                  <button 
                    key={h.id}
                    disabled={!isSelectedLaw}
                    className={`px-4 py-3 rounded-xl font-bold text-[11px] transition-all flex items-center gap-2 whitespace-nowrap ${
                      isSelectedLaw
                        ? "bg-slate-900 text-white shadow-lg cursor-default" 
                        : "bg-slate-50 text-slate-200 border border-slate-50 cursor-not-allowed opacity-40"
                    }`}
                  >
                    {h.label}
                    {h.id === "Perdata" && <span className="text-[8px] opacity-50 italic">Soon</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={handleCalculate} disabled={calculating || !hukum} className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 ${theme.bg} text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-xl ${theme.shadow} active:scale-95 disabled:opacity-50`}>
            {calculating ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Zap size={20} fill="currentColor" />}
            <span>{data.ahliWaris.some((h: any) => h.hasil) ? "Kalkulasi Ulang" : "Mulai Kalkulasi Waris"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`p-8 rounded-[2.5rem] border shadow-2xl transition-all ${data.ahliWaris.some((h: any) => h.hasil) ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-100'}`}>
             <div className={`flex items-center gap-3 mb-6 font-black uppercase text-xs tracking-widest ${theme.text}`}>
                <Scale size={18} />
                <span>{data.hukum === "Jawa" ? "Kategori Masalah Adat" : "Kategori Masalah Syariat"}</span>
             </div>
             <div>
                <h3 className="text-3xl font-black mb-3">
                  {data?.hukum === "Jawa" 
                    ? (data.logKalkulasi?.metodeAdat === "SEPIKUL_SEGENDONGAN" ? "Sepikul Segendongan" : data.logKalkulasi?.metodeAdat === "KUM_KUM_KUPAT" ? "Kum-Kum Kupat" : "Belum Dikalkulasi") 
                    : (data.logKalkulasi?.statusAulRadd || "Normal")}
                </h3>
                <p className="text-sm font-medium leading-relaxed opacity-70">
                   {getProblemDescription(data.logKalkulasi?.statusAulRadd)}
                </p>
             </div>
          </motion.div>

          {/* Profil Almarhum */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden relative border-b-8 ${theme.border}`}>
            <div className={`relative z-10 flex items-center gap-3 mb-8 ${theme.text} font-black uppercase text-xs tracking-widest`}>
              <User size={16} strokeWidth={3} />
              <span>Identitas Jenazah</span>
            </div>
            <div className="relative z-10 space-y-6">
               <div className="bg-slate-50 p-6 rounded-3xl">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                     <Tag size={12} /> Status / Peran
                  </div>
                  <p className="font-black text-slate-900 text-lg leading-snug">Meninggal sebagai {data.keterangan || "-"}</p>
               </div>
               <div className="flex justify-between items-center px-4">
                 <span className="text-slate-400 font-bold text-[10px] uppercase">Gender</span>
                 <span className="font-black text-slate-800">{data.gender}</span>
               </div>
               <div className="flex justify-between items-center px-4">
                 <span className="text-slate-400 font-bold text-[10px] uppercase whitespace-nowrap">Waktu Wafat</span>
                 <span className="font-black text-slate-800 text-right">
                   {data.tanggalWafat ? new Date(data.tanggalWafat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                 </span>
               </div>
                <div className="pt-6 border-t border-slate-50">
                   <div className={`${theme.light} p-6 rounded-[2rem] ${theme.text}`}>
                     <p className="font-bold text-[10px] uppercase tracking-widest mb-1">Total Aset (Mirkah)</p>
                     <p className="font-black text-2xl">Rp {data.hartaKotor.toLocaleString('id-ID')}</p>
                   </div>
                </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           {/* Ahli Waris Cards (Daftar Distribusi) */}
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 px-4 gap-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hasil Distribusi Waris</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-100">
                 <Users size={18} />
                 <span>{data.ahliWaris.length} Orang</span>
              </div>
              <select 
                className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 text-xs font-black uppercase tracking-widest outline-none focus:border-emerald-500 cursor-pointer text-slate-600"
                value={filterWaris}
                onChange={(e) => setFilterWaris(e.target.value)}
              >
                <option value="Semua">Semua Ahli Waris</option>
                <option value="Menerima">Menerima Bagian</option>
                <option value="Tidak Menerima">Tidak Menerima</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(data.ahliWaris || [])
                .filter((h: any) => {
                  if (filterWaris === "Menerima") return h.hasil?.jatahNominal > 0;
                  if (filterWaris === "Tidak Menerima") return !h.hasil || h.hasil?.jatahNominal === 0;
                  return true;
                })
                .sort((a: any, b: any) => {
                  const nominalA = a.hasil?.jatahNominal || 0;
                  const nominalB = b.hasil?.jatahNominal || 0;
                  return nominalB - nominalA;
                })
                .map((heir: any, idx: number) => {
                 const hasil = heir.hasil;
                 const statusMewarisi = hasil?.status === "Mewarisi";
                 const statusMahjub = hasil?.status === "Mahjub" || hasil?.status === "Tidak Mewarisi";

                 return (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={heir.id} className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-${theme.primary}-300 transition-all border-b-4 border-b-slate-50 hover:border-b-${theme.primary}-500`}>
                     <div className="flex justify-between items-start mb-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${statusMewarisi ? theme.light + " " + theme.text : (statusMahjub ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-300")}`}>
                         {statusMewarisi ? <BadgeCheck size={32} /> : <ShieldAlert size={32} />}
                       </div>
                       <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${statusMewarisi ? "bg-emerald-100 text-emerald-700" : (statusMahjub ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-400")}`}>
                         {hasil?.status || "Belum Dihitung"}
                       </div>
                     </div>

                    <div className="mb-6">
                      <h4 className="text-xl font-black text-slate-800 tracking-tighter">{heir.nama}</h4>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{heir.hubungan}</p>
                    </div>

                    {hasil ? (
                      <div className="pt-6 border-t border-slate-50 space-y-6">
                         <div className="flex justify-between items-end">
                            <div>
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{data.hukum === "Jawa" ? "Porsi Adat" : "Porsi Syar'i"}</p>
                               <span className="text-3xl font-black text-slate-900">{hasil.jatahPersen}</span>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Bagian Nominal</p>
                               <p className={`text-lg font-black ${theme.text}`}>Rp {hasil.jatahNominal.toLocaleString('id-ID')}</p>
                            </div>
                         </div>
                         <button onClick={() => setSelectedHeir({ ...heir, ...hasil })} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                           <Info size={16} /> Detail Analisis
                         </button>
                      </div>
                    ) : (
                      <div className="py-4 text-center italic text-slate-300 text-[10px] font-black uppercase tracking-widest border-t border-slate-50 pt-10">Menunggu Kalkulasi</div>
                    )}
                  </motion.div>
                );
             })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedHeir && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-10 lg:p-14 text-center">
                 <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner ${selectedHeir.status === "Mewarisi" ? theme.light + " " + theme.text : "bg-red-50 text-red-500"}`}>
                    {selectedHeir.status === "Mewarisi" ? <BadgeCheck size={40} /> : <ShieldAlert size={40} />}
                 </div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedHeir.nama}</h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-3">{selectedHeir.hubungan} • {selectedHeir.status}</p>
                 
                 <div className="mt-10 p-10 bg-slate-900 rounded-[2.5rem] text-left relative overflow-hidden ring-4 ring-slate-800 text-white">
                    <p className={`text-[10px] font-black ${theme.text} uppercase tracking-[0.2em] mb-4`}>
                      {data.hukum === "Jawa" ? "Hasil Analisis Adat Jawa" : "Hasil Analisis Syariat"}
                    </p>
                    <p className="font-medium leading-relaxed italic text-lg opacity-90">{selectedHeir.alasan}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identitas NIK</p>
                       <p className="text-lg font-black text-slate-900">{selectedHeir.nik || '-'}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Berkas Lampiran</p>
                       {selectedHeir.fileKtpKk?.startsWith('http') ? (
                          <a href={selectedHeir.fileKtpKk} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${theme.text} hover:opacity-80 transition-colors`}>
                            <Download size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Lihat Dokumen</span>
                          </a>
                       ) : (
                          <p className="text-xs font-black text-slate-700 truncate">{selectedHeir.fileKtpKk || 'Tidak Ada Dokumen'}</p>
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Porsi Bagian</p>
                       <p className="text-2xl font-black text-slate-900 uppercase">{selectedHeir.jatahPersen}</p>
                    </div>
                    <div className={`${theme.bg} p-6 rounded-3xl text-white shadow-xl ${theme.shadow}`}>
                       <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Nominal Akhir</p>
                       <p className="text-xl font-black">Rp {selectedHeir.jatahNominal.toLocaleString('id-ID')}</p>
                    </div>
                 </div>

                 <button onClick={() => setSelectedHeir(null)} className="mt-12 w-full py-5 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all active:scale-95">Tutup Detail Analisis</button>
              </div>
           </motion.div>
        </div>
      )}
    </motion.div>
  );
}
