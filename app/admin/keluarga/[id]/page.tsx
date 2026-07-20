"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getKeluargaById, processFaraid } from "@/app/actions/waris";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export default function DetailKeluargaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterWaris, setFilterWaris] = useState("Semua");
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
    toast.loading("Memproses kalkulasi waris...", { id: "calc" });
    await processFaraid(id);
    await fetchData();
    setCalculating(false);
    toast.success("Kalkulasi selesai!", { id: "calc" });
  };

  const downloadPDF = () => {
    if (!data || !data.logKalkulasi) return toast.error("Jalankan kalkulasi terlebih dahulu.");

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(20);
    doc.text("LAPORAN ARSIP PEMBAGIAN WARIS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Keluarga: ${data.nama} | Database ID: ${data.id.substring(0, 8)}`, 105, 27, { align: "center" });
    doc.line(20, 32, 190, 32);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${data.nama}`, 20, 42);
    doc.text(`NIK: ${data.nik || "-"}`, 20, 48);
    doc.text(`Jenis Kelamin: ${data.gender}`, 20, 54);
    doc.text(`Dasar Hukum: ${data.hukum === "Islam" ? "Hukum Islam (Faraid KHI)" : "Adat Jawa"}`, 20, 60);

    doc.text(`Harta Kotor: Rp ${data.hartaKotor.toLocaleString("id-ID")}`, 120, 42);
    doc.text(`Utang & Wasiat: Rp ${(data.utang + data.wasiat).toLocaleString("id-ID")}`, 120, 48);
    doc.text(`Harta Bersih: Rp ${data.logKalkulasi.totalHartaBersih.toLocaleString("id-ID")}`, 120, 54);

    autoTable(doc, {
      startY: 68,
      head: [['NO', 'AHLI WARIS', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'ALASAN HUKUM']],
      body: data.ahliWaris.map((h: any, i: number) => [
        i + 1,
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.hasil?.status || "Mahjub",
        h.hasil?.jatahPersen || "0%",
        `Rp ${(h.hasil?.jatahNominal || 0).toLocaleString("id-ID")}`,
        h.hasil?.alasan || "Terhalang (Mahjub)."
      ]),
      headStyles: { fillColor: [15, 81, 50], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`arsip-waris-${data.nama}.pdf`);
  };

  if (loading) return <div className="p-5 text-center text-muted">Memuat detail keluarga...</div>;
  if (!data) return <div className="p-5 text-center text-danger">Data keluarga tidak ditemukan.</div>;

  return (
    <div>
      
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 border-bottom pb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="font-serif fw-bold text-dark m-0">{data.nama}</h2>
            <span className="badge bg-success">{data.hukum}</span>
          </div>
          <p className="text-secondary small m-0">NIK: {data.nik || "-"} • Ditambahkan {new Date(data.createdAt).toLocaleDateString('id-ID')}</p>
        </div>

        <div className="d-flex gap-2">
          <Link href="/admin/keluarga" className="btn btn-outline-secondary btn-sm fw-bold">
            <i className="bi bi-arrow-left me-1"></i> Kembali
          </Link>
          <button className="btn btn-danger btn-sm fw-bold" onClick={downloadPDF} disabled={!data.logKalkulasi}>
            <i className="bi bi-file-earmark-pdf-fill me-1"></i> Unduh PDF
          </button>
          <button className="btn btn-success btn-sm fw-bold" onClick={handleCalculate} disabled={calculating}>
            <i className="bi bi-calculator-fill me-1"></i> {data.ahliWaris.some((h: any) => h.hasil) ? "Hitung Ulang" : "Mulai Kalkulasi"}
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        
        {/* Info Card 1 */}
        <div className="col-md-4">
          <div className="card wp-card p-3">
            <h6 className="wp-widget-header text-success mb-2">
              <i className="bi bi-person-fill"></i> Identitas Pewaris
            </h6>
            <div className="small mb-1"><strong>Nama:</strong> {data.nama}</div>
            <div className="small mb-1"><strong>NIK:</strong> {data.nik || "-"}</div>
            <div className="small mb-1"><strong>Jenis Kelamin:</strong> {data.gender}</div>
            <div className="small mb-1"><strong>Meninggal Sebagai:</strong> {data.keterangan || "-"}</div>
          </div>
        </div>

        {/* Info Card 2 */}
        <div className="col-md-4">
          <div className="card wp-card p-3">
            <h6 className="wp-widget-header text-warning mb-2">
              <i className="bi bi-wallet2"></i> Ringkasan Keuangan
            </h6>
            <div className="small mb-1"><strong>Harta Kotor:</strong> Rp {data.hartaKotor.toLocaleString('id-ID')}</div>
            <div className="small mb-1"><strong>Utang:</strong> Rp {data.utang.toLocaleString('id-ID')}</div>
            <div className="small mb-1"><strong>Wasiat:</strong> Rp {data.wasiat.toLocaleString('id-ID')}</div>
            <div className="small fw-bold text-success mt-2 pt-2 border-top">
              Harta Bersih: Rp {data.logKalkulasi?.totalHartaBersih ? data.logKalkulasi.totalHartaBersih.toLocaleString('id-ID') : (data.hartaKotor - data.utang - data.wasiat).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Info Card 3 */}
        <div className="col-md-4">
          <div className="card wp-card p-3 bg-dark text-white border-0">
            <h6 className="font-serif fw-bold text-warning mb-2">
              <i className="bi bi-shield-check me-1"></i> Status Kasus
            </h6>
            <div className="fs-5 fw-bold text-white mb-1">
              {data.hukum === "Jawa" 
                ? (data.logKalkulasi?.metodeAdat?.replace(/_/g, ' ') || "Belum Dihitung") 
                : (data.logKalkulasi?.statusAulRadd || "Normal")}
            </div>
            <p className="small text-secondary m-0">
              {data.logKalkulasi ? "Kalkulasi berhasil disinkronkan dengan database." : "Tekan Mulai Kalkulasi untuk memproses."}
            </p>
          </div>
        </div>

      </div>

      {/* Tabel Ahli Waris Detail */}
      <div className="card wp-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="wp-widget-header m-0">
            <i className="bi bi-people-fill text-success"></i> Silsilah Ahli Waris ({data.ahliWaris.length})
          </h5>
          <div className="btn-group">
            {["Semua", "Mewarisi", "Mahjub"].map(f => (
              <button 
                key={f}
                className={`btn btn-sm ${filterWaris === f ? "btn-dark fw-bold" : "btn-outline-secondary"}`}
                onClick={() => setFilterWaris(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Nama Ahli Waris</th>
                <th>Hubungan</th>
                <th>Status</th>
                <th>Porsi</th>
                <th>Nominal Rupiah</th>
                <th>Alasan Hukum / KHI</th>
              </tr>
            </thead>
            <tbody>
              {data.ahliWaris
                .filter((h: any) => filterWaris === "Semua" || (filterWaris === "Mewarisi" ? h.hasil?.status === "Mewarisi" : h.hasil?.status !== "Mewarisi"))
                .map((h: any, idx: number) => (
                  <tr key={idx} className={h.hasil?.status === "Mahjub" ? "table-danger opacity-75" : ""}>
                    <td className="fw-bold">{idx + 1}</td>
                    <td><strong className="text-dark">{h.nama || "-"}</strong></td>
                    <td><span className="badge bg-secondary">{h.hubungan}</span></td>
                    <td>
                      <span className={`badge ${h.hasil?.status === "Mewarisi" ? "bg-success" : "bg-danger"}`}>
                        {h.hasil?.status || "Mahjub"}
                      </span>
                    </td>
                    <td><span className="badge bg-light text-dark border">{h.hasil?.jatahPersen || "0%"}</span></td>
                    <td className="fw-bold text-success">Rp {(h.hasil?.jatahNominal || 0).toLocaleString('id-ID')}</td>
                    <td className="text-secondary">{h.hasil?.alasan || "Terhalang (Mahjub)."}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
