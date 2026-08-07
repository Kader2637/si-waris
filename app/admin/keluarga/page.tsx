"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getKeluargaList, deleteKeluarga } from "@/app/actions/waris";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight, FolderX, RefreshCw } from "lucide-react";

function KeluargaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [hukumFilter, setHukumFilter] = useState("Semua");
  const [families, setFamilies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Sync state if URL search query changes
  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearchTerm(q);
  }, [searchParams]);

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
    setPage(1);
  }, [searchTerm, hukumFilter]);

  const handleResetSearch = () => {
    setSearchTerm("");
    setHukumFilter("Semua");
    router.push("/admin/keluarga");
  };

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
    <div className="space-y-6 text-[#0f172a] font-sans">
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Hapus Data Keluarga?"
        message="Tindakan ini tidak dapat dibatalkan. Data identitas dan hasil kalkulasi waris akan dihapus permanen."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Data Keluarga & Waris</h1>
          <p className="text-slate-500 text-xs mt-1">
            {searchTerm 
              ? `Hasil pencarian untuk kata kunci "${searchTerm}"` 
              : "Manajemen data pewaris, silsilah keluarga, & laporan hasil kalkulasi."}
          </p>
        </div>
        <Link 
          href="/admin/keluarga/tambah" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-xs transition-all no-underline"
        >
          <Plus className="size-4" /> Tambah Kasus Baru
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus-within:ring-2 focus-within:ring-[#0b6245]/20 focus-within:border-[#0b6245] transition-all">
          <Search className="size-4 text-slate-400 me-2.5 shrink-0" />
          <input 
            type="text" 
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            placeholder="Cari nama keluarga atau NIK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto overflow-x-auto">
          {["Semua", "Islam", "Jawa", "Perdata"].map((h) => (
            <button
              key={h}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                hukumFilter === h 
                  ? "bg-[#0b6245] text-white shadow-xs font-semibold" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
              onClick={() => setHukumFilter(h)}
            >
              {h === "Semua" ? "Semua Hukum" : h}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Nama Pewaris</th>
                <th className="px-5 py-4 whitespace-nowrap">NIK</th>
                <th className="px-5 py-4 whitespace-nowrap">Sistem Hukum</th>
                <th className="px-5 py-4 whitespace-nowrap">Status Kalkulasi</th>
                <th className="px-5 py-4 whitespace-nowrap">Total Harta Kotor</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-xs">
                    <span className="inline-block size-5 border-2 border-[#0b6245] border-t-transparent rounded-full animate-spin me-2"></span>
                    Memuat data keluarga...
                  </td>
                </tr>
              ) : families.length > 0 ? (
                families.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <strong className="text-slate-900 block font-semibold text-sm">{item.nama}</strong>
                      <span className="text-slate-400 text-[11px]">Jenis Kelamin: {item.gender}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 whitespace-nowrap">{item.nik || "-"}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.hukum === "Jawa" 
                          ? "bg-amber-100 text-amber-800" 
                          : item.hukum === "Perdata" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : "Faraid Islam"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        item.hasilWaris?.length > 0 
                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {item.hasilWaris?.length > 0 ? "Sudah Dihitung" : "Draft Input"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0b6245] whitespace-nowrap">
                      Rp {item.hartaKotor.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex gap-2">
                        <Link 
                          href={`/admin/keluarga/${item.id}`} 
                          className="size-8 rounded-lg bg-emerald-50 hover:bg-[#0b6245] text-[#0b6245] hover:text-white flex items-center justify-center transition-all no-underline shadow-2xs"
                          title="Lihat Detail"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <button 
                          className="size-8 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center transition-all border-0 cursor-pointer shadow-2xs"
                          onClick={() => setDeleteId(item.id)}
                          title="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="size-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                        <FolderX className="size-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">Data Tidak Ditemukan</h4>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                          {searchTerm 
                            ? `Tidak ada data pewaris atau NIK yang sesuai dengan kata kunci "${searchTerm}".` 
                            : "Belum ada data keluarga yang tersimpan di sistem."}
                        </p>
                      </div>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={handleResetSearch}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                        >
                          <RefreshCw className="size-3.5" /> Reset Pencarian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Halaman {page} dari {totalPages}</span>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 font-medium transition-colors shadow-2xs flex items-center gap-1 cursor-pointer" 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" /> Sebelumnya
            </button>
            <button 
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 font-medium transition-colors shadow-2xs flex items-center gap-1 cursor-pointer" 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Berikutnya <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function KeluargaPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-400">
        <span className="inline-block size-5 border-2 border-[#0b6245] border-t-transparent rounded-full animate-spin me-2"></span>
        Memuat halaman...
      </div>
    }>
      <KeluargaContent />
    </Suspense>
  );
}
