"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye, Edit, Trash2, FileText, Calendar, User, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getKeluargaList, deleteKeluarga } from "@/app/actions/waris";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function KeluargaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hukumFilter, setHukumFilter] = useState("Semua");
  const [families, setFamilies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchFamilies = async () => {
    setLoading(true);
    const result = await getKeluargaList(searchTerm, hukumFilter, page);
    setFamilies(result.data);
    setTotalPages(result.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchFamilies();
  }, [searchTerm, hukumFilter, page]);

  useEffect(() => {
    setPage(1); // Reset page when search or filter changes
  }, [searchTerm, hukumFilter]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteKeluarga(deleteId);
      toast.success("Data keluarga berhasil dihapus");
      fetchFamilies();
    } catch (err) {
      toast.error("Gagal menghapus data");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Hapus Data Keluarga?"
        message="Tindakan ini tidak dapat dibatalkan. Seluruh data identitas dan hasil kalkulasi waris untuk keluarga ini akan dihapus permanen dari sistem."
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Keluarga & Jenazah</h1>
          <p className="text-slate-500 mt-1 font-medium text-xs">Baitul Maal: Manajemen distribusi waris syariah</p>
        </div>
        <Link 
          href="/admin/keluarga/tambah" 
          className="group relative bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-emerald-200 active:scale-95"
        >
          <div className="bg-white/20 p-1 rounded-md group-hover:rotate-90 transition-transform duration-300">
            <Plus size={16} className="text-white" />
          </div>
          <span className="font-bold text-xs">Daftar Keluarga Baru</span>
        </Link>
      </div>

      {/* Modern Search & Filter Section */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 flex items-center gap-3 transition-focus-within:border-emerald-300">
          <div className="pl-4 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Cari nama keluarga atau nomor NIK..."
            className="flex-1 py-2.5 bg-transparent outline-none text-slate-850 font-bold placeholder:text-slate-300 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 flex items-center gap-1.5">
          {[
            { id: "Semua", label: "Semua" },
            { id: "Islam", label: "Islam" },
            { id: "Jawa", label: "Adat Jawa" },
            { id: "Perdata", label: "Perdata" },
          ].map(h => (
            <button 
              key={h.id}
              onClick={() => setHukumFilter(h.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                hukumFilter === h.id 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {h.id === "Semua" ? "Semua Hukum" : `Hukum ${h.label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
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
                className="group relative bg-white border border-slate-100 rounded-2xl p-6 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-emerald-200/25 transition-all duration-500 hover:-translate-y-1.5 border-b-4 border-b-slate-100 hover:border-b-emerald-500 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-full translate-x-8 -translate-y-8 group-hover:bg-emerald-50 transition-colors duration-500" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "p-2.5 rounded-xl shadow-inner",
                      item.gender === "Laki-laki" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                    )}>
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        item.hasilWaris?.length > 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {item.hasilWaris?.length > 0 ? "Sudah Dihitung" : "Pending"}
                      </div>
                      <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[7px] font-black uppercase tracking-widest">
                        {item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Hukum Perdata" : "Hukum Islam"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors duration-300">
                      {item.nama}
                    </h3>
                    <p className="text-slate-400 font-mono text-xs mt-0.5">{item.nik}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50/50 p-3 rounded-xl group-hover:bg-white transition-colors duration-300">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">
                        <TrendingUp size={10} /> Total Aset
                      </div>
                      <div className="font-black text-slate-900 leading-none truncate text-sm">
                        Rp {item.hartaKotor.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-xl group-hover:bg-white transition-colors duration-300">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">
                        <Calendar size={10} /> Tgl Wafat
                      </div>
                      <div className="font-black text-slate-800 leading-none text-[10px]">
                        {item.tanggalWafat ? new Date(item.tanggalWafat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-2">
                       <div className="flex -space-x-2">
                         {item.ahliWaris.slice(0, 3).map((_: any, i: number) => (
                           <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-200" />
                         ))}
                         {item.ahliWaris.length > 3 && (
                           <div className="w-6 h-6 rounded-full border border-white bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-600">
                             +{item.ahliWaris.length - 3}
                           </div>
                         )}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/keluarga/${item.id}`}
                        className="p-2 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all duration-300 shadow-sm"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        onClick={() => setDeleteId(item.id)}
                        className="p-2 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-300 shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl bg-white">
              <FileText className="mx-auto mb-3 opacity-10" size={60} />
              <p className="text-lg font-bold text-slate-300">Ups! Tidak ada data keluarga yang ditemukan</p>
              <p className="mt-1 font-medium text-xs">Coba gunakan kata kunci pencarian yang berbeda.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Section */}
      {!loading && families.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-8 pb-12">
          <button 
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-slate-100 rounded-xl font-bold text-xs text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Halaman Sebelumnya
          </button>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-slate-100 font-bold text-xs text-slate-900 shadow-sm">
            <span className="text-emerald-600">{page}</span>
            <span className="text-slate-300">/</span>
            <span>{totalPages}</span>
          </div>
          <button 
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-slate-100 rounded-xl font-bold text-xs text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Halaman Berikutnya
          </button>
        </div>
      )}
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
