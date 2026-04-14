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
  const [selectedHeir, setSelectedHeir] = useState<any>(null);

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
    switch (status) {
      case "Gharrawain":
        return "Kasus 'Dua Bintang Terang' (Suami/Istri, Ibu, Bapak). Ibu mendapatkan 1/3 dari SISA harta setelah bagian pasangan diambil, agar porsi Bapak tetap 2x lipat Ibu.";
      case "Aul":
        return "Total porsi ahli waris melebihi harta yang tersedia. Nilai pembagi dinaikkan secara proporsional agar semua pihak tetap mendapatkan jatah.";
      case "Radd":
        return "Ada sisa harta tetapi tidak ada Ashabah. Sisa tersebut dikembalikan secara proporsional kepada Dzawil Furud selain Suami/Istri.";
      case "Normal":
        return "Seluruh harta terbagi habis secara tepat sesuai porsi masing-masing ahli waris.";
      default:
        return "Sesuai Kaidah Faraid: Tekan tombol kalkulasi untuk melihat hasil pembagian syar'i.";
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest text-sm">Sinkronisasi Database...</div>;
  if (!data) return <div className="p-20 text-center font-bold text-red-400">Data Keluarga tidak ditemukan.</div>;

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
        <div className="flex gap-4">
          <button onClick={handleCalculate} disabled={calculating} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 disabled:opacity-50">
            {calculating ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Zap size={20} fill="currentColor" />}
            <span>{data.logKalkulasi ? "Kalkulasi Ulang" : "Mulai Kalkulasi Faraid"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`p-8 rounded-[2.5rem] border shadow-2xl transition-all ${data.logKalkulasi ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-100'}`}>
             <div className="flex items-center gap-3 mb-6 font-black uppercase text-xs tracking-widest text-emerald-400">
                <Scale size={18} />
                <span>Kategori Masalah Syariat</span>
             </div>
             <div>
                <h3 className="text-3xl font-black mb-3">{data.logKalkulasi?.statusAulRadd || "Normal"}</h3>
                <p className="text-sm font-medium leading-relaxed opacity-70">
                   {getProblemDescription(data.logKalkulasi?.statusAulRadd)}
                </p>
             </div>
          </motion.div>

          {/* Profil Almarhum */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden relative border-b-8 border-b-emerald-500">
            <div className="relative z-10 flex items-center gap-3 mb-8 text-emerald-600 font-black uppercase text-xs tracking-widest">
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
                  <div className="bg-emerald-50 p-6 rounded-[2rem] text-emerald-700">
                    <p className="font-bold text-[10px] uppercase tracking-widest mb-1">Total Aset (Mirkah)</p>
                    <p className="font-black text-2xl">Rp {data.hartaKotor.toLocaleString('id-ID')}</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           {/* Ahli Waris Cards (Daftar Distribusi) */}
           <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hasil Distribusi Waris</h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest">
               <Users size={18} />
               <span>{data.ahliWaris.length} Orang Terdaftar</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {data.ahliWaris.map((heir: any, idx: number) => {
                const hasil = heir.hasil;
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={heir.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-emerald-300 transition-all border-b-4 border-b-slate-50 hover:border-b-emerald-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${hasil?.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600" : (hasil?.status === "Mahjub" ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-300")}`}>
                        {hasil?.status === "Mewarisi" ? <BadgeCheck size={32} /> : <ShieldAlert size={32} />}
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${hasil?.status === "Mewarisi" ? "bg-emerald-100 text-emerald-700" : (hasil?.status === "Mahjub" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-400")}`}>
                        {hasil?.status || "Pending"}
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
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Porsi Syar'i</p>
                               <span className="text-3xl font-black text-slate-900">{hasil.jatahPersen}</span>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Bagian Nominal</p>
                               <p className="text-lg font-black text-emerald-600">Rp {hasil.jatahNominal.toLocaleString('id-ID')}</p>
                            </div>
                         </div>
                         <button onClick={() => setSelectedHeir({ ...heir, ...hasil })} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                           <Info size={16} /> Detail Analisis Syarit
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
                 <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner ${selectedHeir.status === "Mewarisi" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {selectedHeir.status === "Mewarisi" ? <BadgeCheck size={40} /> : <ShieldAlert size={40} />}
                 </div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedHeir.nama}</h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-3">{selectedHeir.hubungan} • {selectedHeir.status}</p>
                 
                 <div className="mt-10 p-10 bg-slate-900 rounded-[2.5rem] text-left relative overflow-hidden ring-4 ring-emerald-500/10 text-white">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Hasil Analisis Syariat</p>
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
                          <a href={selectedHeir.fileKtpKk} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
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
                    <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-200">
                       <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Nominal Akhir</p>
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
