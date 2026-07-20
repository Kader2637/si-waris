"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getArsipList } from "@/app/actions/waris";

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
    <div>
      
      {/* Header Title */}
      <div className="card wp-card p-4 mb-4 border-0 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h2 className="font-serif fw-bold text-dark m-0">Arsip Digital Perhitungan</h2>
            <p className="text-secondary small m-0">Riwayat laporan waris yang telah difinalisasi di database.</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card wp-card p-3 mb-4 border-0 shadow-sm">
        <div className="row g-2 align-items-center">
          <div className="col-lg-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Cari nama atau NIK..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-6 d-flex justify-content-lg-end">
            <div className="btn-group btn-group-sm">
              {["Semua", "Islam", "Jawa", "Perdata"].map(h => (
                <button
                  key={h}
                  className={`btn ${filterHukum === h ? "btn-dark fw-bold" : "btn-outline-secondary"}`}
                  onClick={() => setFilterHukum(h)}
                >
                  {h === "Jawa" ? "Adat Jawa" : h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid (Clean, Zero Top Borders) */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            Memuat arsip digital...
          </div>
        ) : filteredArsip.length > 0 ? (
          filteredArsip.map((item) => (
            <div className="col-lg-4 col-md-6" key={item.id}>
              <div className="card wp-card h-100 p-4 border-0 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-success font-monospace">{item.hukum}</span>
                  <span className="badge bg-light text-dark border fs-8 font-monospace">
                    {item.hukum === "Jawa" ? (item.logKalkulasi?.metodeAdat?.replace(/_/g, ' ') || 'Menunggu') : (item.logKalkulasi?.statusAulRadd || 'Normal')}
                  </span>
                </div>
                <h5 className="font-serif fw-bold text-dark mb-1">{item.nama}</h5>
                <p className="small text-muted font-monospace mb-3">NIK: {item.nik || "-"}</p>

                <div className="bg-light p-3 rounded-3 border mb-3 small">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Harta Bersih:</span>
                    <strong className="text-success">Rp {item.logKalkulasi?.totalHartaBersih?.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Ahli Waris:</span>
                    <strong className="text-dark">{item.ahliWaris?.length || 0} Orang</strong>
                  </div>
                </div>

                <Link href={`/admin/keluarga/${item.id}`} className="btn btn-outline-primary btn-sm w-100 fw-bold mt-auto rounded-pill">
                  <i className="bi bi-file-earmark-text me-1"></i> Buka Laporan Lengkap
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 text-muted card wp-card border-0 shadow-sm">
            Belum ada arsip perhitungan yang tersimpan.
          </div>
        )}
      </div>

    </div>
  );
}
