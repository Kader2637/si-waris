"use client";

import { useEffect, useState } from "react";
import { FileStack, Clock, Search, Eye, Calendar, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getArsipList } from "@/app/actions/waris";

export default function ArsipPage() {
  const [arsip, setArsip] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArsip = async () => {
      const data = await getArsipList();
      setArsip(data);
      setLoading(false);
    };
    fetchArsip();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Arsip Digital</h1>
          <p className="text-slate-500 mt-2 font-medium">Riwayat perhitungan waris yang telah difinalisasi dalam database.</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 animate-pulse text-slate-300 font-bold uppercase tracking-widest">
           Mengakses Brankas Digital...
        </div>
      ) : arsip.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {arsip.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-emerald-200 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <FileStack size={24} />
                   </div>
                   <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-widest">
                      KPK: {item.logKalkulasi?.kpk}
                   </div>
                </div>

                <h3 className="text-xl font-black text-slate-800">{item.nama}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 mb-6">{item.nik}</p>

                <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400">Total Distribusi</span>
                      <span className="font-black text-slate-800">Rp {item.logKalkulasi?.totalHartaBersih.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400">Status Syar'i</span>
                      <span className="font-black text-emerald-600 uppercase text-xs tracking-widest">{item.logKalkulasi?.statusAulRadd}</span>
                   </div>
                </div>

                <Link 
                  href={`/admin/keluarga/${item.id}`}
                  className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-900 hover:text-white transition-all font-black text-xs uppercase tracking-widest"
                >
                  <Eye size={16} /> Buka Laporan Lengkap
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
          <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                <FileStack size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Ruang Arsip Kosong</h3>
              <p className="text-slate-400 mt-2 max-w-sm font-medium">Lakukan kalkulasi waris pada menu Data Keluarga untuk mengarsipkan data.</p>
          </div>
        </div>
      )}
    </div>
  );
}
