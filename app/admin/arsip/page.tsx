"use client";

import { useEffect, useState } from "react";
import { FileStack, Clock, Search, Eye, Calendar, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getArsipList } from "@/app/actions/waris";
import { Filter } from "lucide-react";

export default function ArsipPage() {
  const [arsip, setArsip] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterHukum, setFilterHukum] = useState("Semua");

  useEffect(() => {
    const fetchArsip = async () => {
      const data = await getArsipList();
      setArsip(data);
      setLoading(false);
    };
    fetchArsip();
  }, []);

  const filteredArsip = arsip.filter(item => {
    const matchSearch = search === "" || 
      item.nama?.toLowerCase().includes(search.toLowerCase()) || 
      item.nik?.toLowerCase().includes(search.toLowerCase());
    const matchHukum = filterHukum === "Semua" || item.hukum === filterHukum;
    return matchSearch && matchHukum;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Arsip Digital</h1>
          <p className="text-slate-500 mt-2 font-medium">Riwayat perhitungan waris yang telah difinalisasi dalam database.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter size={16} className="text-slate-400" />
          {["Semua", "Islam", "Jawa", "Perdata"].map(h => (
            <button
              key={h}
              onClick={() => setFilterHukum(h)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                filterHukum === h
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {h === "Jawa" ? "Adat Jawa" : h}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 animate-pulse text-slate-300 font-bold uppercase tracking-widest">
           Memeriksa Data...
        </div>
      ) : filteredArsip.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredArsip.map((item, idx) => (
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
                   <div className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${item.hukum === "Jawa" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : `KPK: ${item.logKalkulasi?.kpk || '-'}`}
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
                      <span className="text-slate-400">Metode</span>
                      <span className={`font-black uppercase text-xs tracking-widest ${item.hukum === "Jawa" ? "text-amber-600" : "text-emerald-600"}`}>
                        {item.hukum === "Jawa" ? (item.logKalkulasi?.metodeAdat?.replace(/_/g, ' ') || 'Menunggu') : (item.logKalkulasi?.statusAulRadd || 'Normal')}
                      </span>
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
