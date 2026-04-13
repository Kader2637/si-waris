"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye, Edit, Trash2, FileText, Calendar, User, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getKeluargaList, deleteKeluarga } from "@/app/actions/waris";

export default function KeluargaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFamilies = async () => {
    setLoading(true);
    const data = await getKeluargaList(searchTerm);
    setFamilies(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFamilies();
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await deleteKeluarga(id);
      fetchFamilies();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Keluarga & Jenazah</h1>
          <p className="text-slate-500 mt-2 font-medium">Baitul Maal: Manajemen distribusi waris syariah</p>
        </div>
        <Link 
          href="/admin/keluarga/tambah" 
          className="group relative bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-xl shadow-emerald-200 active:scale-95"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
            <Plus size={20} className="text-white" />
          </div>
          <span className="font-bold">Daftar Keluarga Baru</span>
        </Link>
      </div>

      {/* Modern Search Section */}
      <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4 transition-focus-within:border-emerald-300">
        <div className="pl-6 text-slate-400">
          <Search size={22} />
        </div>
        <input
          type="text"
          placeholder="Cari nama keluarga atau nomor NIK..."
          className="flex-1 py-4 bg-transparent outline-none text-slate-800 font-semibold placeholder:text-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="pr-4 hidden md:block">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-4 border-l border-slate-100">
            Search Engine
          </span>
        </div>
      </div>

      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-[2.5rem]" />
            ))
          ) : families.length > 0 ? (
            families.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-200/40 transition-all duration-500 hover:-translate-y-2 border-b-4 border-b-slate-100 hover:border-b-emerald-500 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-emerald-50 transition-colors duration-500" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "p-3 rounded-2xl shadow-inner",
                      item.gender === "Laki-laki" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                    )}>
                      <User size={28} strokeWidth={2.5} />
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      item.logKalkulasi ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {item.logKalkulasi ? "Sudah Dihitung" : "Pending"}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors duration-300">
                      {item.nama}
                    </h3>
                    <p className="text-slate-400 font-mono text-sm mt-1">{item.nik}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 p-4 rounded-2xl group-hover:bg-white transition-colors duration-300">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <TrendingUp size={12} /> Total Aset
                      </div>
                      <div className="font-black text-slate-900 leading-none truncate">
                        Rp {item.hartaKotor.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl group-hover:bg-white transition-colors duration-300">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <Calendar size={12} /> Tgl Wafat
                      </div>
                      <div className="font-black text-slate-800 leading-none text-[11px]">
                        {item.tanggalWafat ? new Date(item.tanggalWafat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-2">
                       <div className="flex -space-x-3">
                         {item.ahliWaris.slice(0, 3).map((_: any, i: number) => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                         ))}
                         {item.ahliWaris.length > 3 && (
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                             +{item.ahliWaris.length - 3}
                           </div>
                         )}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/admin/keluarga/${item.id}`}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                      >
                        <Eye size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[3rem] bg-white">
              <FileText className="mx-auto mb-4 opacity-10" size={80} />
              <p className="text-xl font-bold text-slate-300">Ups! Tidak ada data keluarga yang ditemukan</p>
              <p className="mt-2 font-medium">Coba gunakan kata kunci pencarian yang berbeda.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
