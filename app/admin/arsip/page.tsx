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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Arsip Digital</h1>
          <p className="text-slate-500 mt-1 font-medium text-xs">Riwayat perhitungan waris yang telah difinalisasi dalam database.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-md shadow-slate-100/55 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg font-bold text-xs text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter size={14} className="text-slate-400" />
          {["Semua", "Islam", "Jawa", "Perdata"].map(h => (
            <button
              key={h}
              onClick={() => setFilterHukum(h)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                filterHukum === h
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {h === "Jawa" ? "Adat Jawa" : h}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 animate-pulse text-slate-300 font-bold uppercase tracking-widest text-xs">
           Memeriksa Data...
        </div>
      ) : filteredArsip.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredArsip.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 group hover:border-emerald-200 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                       <FileStack size={18} />
                    </div>
                    <div className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${item.hukum === "Jawa" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                       {item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : `KPK: ${item.logKalkulasi?.kpk || '-'}`}
                    </div>
                </div>

                <h3 className="text-base font-black text-slate-800">{item.nama}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 mb-4">{item.nik}</p>

                <div className="space-y-2 text-xs">
                   <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-400">Total Distribusi</span>
                      <span className="font-bold text-slate-800">Rp {item.logKalkulasi?.totalHartaBersih.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-400">Metode</span>
                      <span className={`font-bold uppercase text-[10px] tracking-widest ${item.hukum === "Jawa" ? "text-amber-600" : "text-emerald-600"}`}>
                        {item.hukum === "Jawa" ? (item.logKalkulasi?.metodeAdat?.replace(/_/g, ' ') || 'Menunggu') : (item.logKalkulasi?.statusAulRadd || 'Normal')}
                      </span>
                   </div>
                </div>

                <Link 
                  href={`/admin/keluarga/${item.id}`}
                  className="mt-6 w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest"
                >
                  <Eye size={14} /> Buka Laporan Lengkap
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 p-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-250 mb-4 shadow-inner">
                <FileStack size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-800">Ruang Arsip Kosong</h3>
              <p className="text-slate-400 mt-1 max-w-xs font-medium text-xs">Lakukan kalkulasi waris pada menu Data Keluarga untuk mengarsipkan data.</p>
          </div>
        </div>
      )}
    </div>
  );
}
