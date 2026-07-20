"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    setPage(1);
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
    <div>
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Hapus Data Keluarga?"
        message="Tindakan ini tidak dapat dibatalkan. Data identitas dan hasil kalkulasi waris akan dihapus permanen."
      />

      {/* Header Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 border-bottom pb-3">
        <div>
          <h2 className="font-serif fw-bold text-dark m-0">Kelola Data Keluarga</h2>
          <p className="text-secondary small m-0">Manajemen data pewaris, silsilah keluarga, & laporan waris.</p>
        </div>
        <Link href="/admin/keluarga/tambah" className="btn btn-success fw-bold">
          <i className="bi bi-plus-lg me-1"></i> Tambah Keluarga Baru
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="card wp-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-lg-6">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input 
                type="text" 
                className="form-control"
                placeholder="Cari nama keluarga atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-6 d-flex justify-content-lg-end">
            <div className="btn-group w-100 w-lg-auto" role="group">
              {["Semua", "Islam", "Jawa", "Perdata"].map((h) => (
                <button
                  key={h}
                  className={`btn btn-sm ${hukumFilter === h ? "btn-dark fw-bold" : "btn-outline-secondary"}`}
                  onClick={() => setHukumFilter(h)}
                >
                  {h === "Semua" ? "Semua Hukum" : h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WP-Admin Data Table */}
      <div className="card wp-card p-0 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0 small">
            <thead className="table-dark">
              <tr>
                <th>Nama Pewaris</th>
                <th>NIK</th>
                <th>Sistem Hukum</th>
                <th>Status Kalkulasi</th>
                <th>Total Aset Kotor</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    Memuat data keluarga...
                  </td>
                </tr>
              ) : families.length > 0 ? (
                families.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong className="text-dark d-block">{item.nama}</strong>
                      <span className="text-muted fs-8">Jenis Kelamin: {item.gender}</span>
                    </td>
                    <td className="font-monospace text-secondary">{item.nik || "-"}</td>
                    <td>
                      <span className={`badge ${item.hukum === "Jawa" ? "bg-warning text-dark" : item.hukum === "Perdata" ? "bg-primary" : "bg-success"}`}>
                        {item.hukum === "Jawa" ? "Adat Jawa" : item.hukum === "Perdata" ? "Perdata" : "Faraid Islam"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.hasilWaris?.length > 0 ? "bg-success" : "bg-secondary"}`}>
                        {item.hasilWaris?.length > 0 ? "Sudah Dihitung" : "Draft Input"}
                      </span>
                    </td>
                    <td className="fw-bold text-success">
                      Rp {item.hartaKotor.toLocaleString('id-ID')}
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        <Link href={`/admin/keluarga/${item.id}`} className="btn btn-sm btn-outline-success">
                          <i className="bi bi-eye-fill"></i>
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(item.id)}>
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    Tidak ada data keluarga yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center small">
          <span className="text-muted">Halaman {page} dari {totalPages}</span>
          <div className="btn-group">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <i className="bi bi-chevron-left me-1"></i> Sebelumnya
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Berikutnya <i className="bi bi-chevron-right ms-1"></i>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
