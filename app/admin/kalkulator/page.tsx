"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";

const HUBUNGAN_OPTIONS = [
  "Suami", "Istri",
  "Anak Laki-laki", "Anak Perempuan",
  "Cucu Laki-laki", "Cucu Perempuan",
  "Ayah", "Ibu", "Kakek", "Nenek",
  "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung",
  "Saudara Laki-laki Seibu", "Saudara Perempuan Seibu",
];

const formatIDR = (val: string) => {
  const n = val.replace(/\D/g, "");
  return n ? new Intl.NumberFormat("id-ID").format(parseInt(n)) : "";
};

const parseNum = (v: string) => parseInt(v.replace(/\D/g, "")) || 0;

export default function AdminKalkulatorPage() {
  const [namaJenazah, setNamaJenazah] = useState("");
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);
  const [hasil, setHasil] = useState<any>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [hukum, setHukum] = useState<string>("Islam");
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT">("SEPIKUL_SEGENDONGAN");
  const [potongGonoGini, setPotongGonoGini] = useState(false);

  const addHeir = () => setAhliWaris([...ahliWaris, { nama: "", hubungan: "Anak Laki-laki" }]);
  const removeHeir = (i: number) => setAhliWaris(ahliWaris.filter((_, idx) => idx !== i));
  const updateHeir = (i: number, field: string, value: string) => {
    const arr = [...ahliWaris];
    arr[i] = { ...arr[i], [field]: value };
    setAhliWaris(arr);
  };

  const handleHitung = () => {
    const jenazah = { id: "temp", gender, hartaKotor: parseNum(harta), utang: parseNum(utang), wasiat: parseNum(wasiat), potongGonoGini };
    const warisList = ahliWaris.map((h, i) => ({ id: `heir-${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));

    if (hukum === "Jawa") {
      const result = calculateAdatJawa(jenazah, warisList, metodeAdat);
      setHasil({
        ...result,
        ahliWarisGetted: result.results,
        kpk: null,
        statusAulRadd: metodeAdat === "SEPIKUL_SEGENDONGAN" ? "Sepikul Segendongan" : "Kum-Kum Kupat"
      });
    } else {
      setHasil(calculateFaraid(jenazah as any, warisList as any));
    }
    setStep(2);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(20);
    doc.text("LAPORAN PEMBAGIAN WARIS ADMIN", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("SI-WARIS WP-Admin Simulation Engine", 105, 27, { align: "center" });
    doc.line(20, 32, 190, 32);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${namaJenazah || "-"}`, 20, 42);
    doc.text(`Jenis Kelamin: ${gender}`, 20, 48);
    doc.text(`Dasar Hukum: ${hukum === "Islam" ? "Syariat Islam (Faraid)" : "Adat Jawa"}`, 20, 54);

    doc.text(`Harta Bersih: Rp ${hasil.hartaBersih.toLocaleString("id-ID")}`, 120, 42);

    autoTable(doc, {
      startY: 65,
      head: [['NO', 'AHLI WARIS', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'ALASAN HUKUM']],
      body: hasil.ahliWarisGetted.map((h: any, i: number) => [
        i + 1,
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.status,
        h.jatahPersen,
        `Rp ${h.jatahNominal.toLocaleString("id-ID")}`,
        h.alasan
      ]),
      headStyles: { fillColor: [15, 81, 50], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`kalkulasi-admin-${namaJenazah || "kasus"}.pdf`);
  };

  const hartaBersih = parseNum(harta) - parseNum(utang) - parseNum(wasiat);

  return (
    <div>
      
      {/* Header Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 border-bottom pb-3">
        <div>
          <h2 className="font-serif fw-bold text-dark m-0">Kalkulator Cepat Admin</h2>
          <p className="text-secondary small m-0">Pengujian kalkulasi waris cepat tanpa perlu menyimpan data ke database.</p>
        </div>
        {step === 2 && (
          <button className="btn btn-outline-secondary btn-sm fw-bold" onClick={() => setStep(1)}>
            <i className="bi bi-pencil-square me-1"></i> Edit Parameter
          </button>
        )}
      </div>

      {step === 1 ? (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card wp-card p-4 mb-4">
              <h5 className="wp-widget-header mb-3">
                <i className="bi bi-sliders text-success"></i> Parameter Perhitungan Cepat
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Pilih Sistem Hukum</label>
                <div className="btn-group w-100">
                  <button 
                    className={`btn btn-sm ${hukum === "Islam" ? "btn-success fw-bold" : "btn-outline-secondary"}`}
                    onClick={() => setHukum("Islam")}
                  >
                    Hukum Islam (Faraid)
                  </button>
                  <button 
                    className={`btn btn-sm ${hukum === "Jawa" ? "btn-warning text-dark fw-bold" : "btn-outline-secondary"}`}
                    onClick={() => setHukum("Jawa")}
                  >
                    Hukum Adat Jawa
                  </button>
                </div>
              </div>

              {hukum === "Jawa" && (
                <div className="alert alert-warning mb-3">
                  <label className="form-label small fw-bold">Metode Adat Jawa</label>
                  <select 
                    className="form-select form-select-sm mb-2"
                    value={metodeAdat}
                    onChange={(e) => setMetodeAdat(e.target.value as any)}
                  >
                    <option value="SEPIKUL_SEGENDONGAN">Sepikul Segendongan (2:1)</option>
                    <option value="KUM_KUM_KUPAT">Dum-Duman (1:1 Sama Rata)</option>
                  </select>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="gonoSwitchAdmin"
                      checked={potongGonoGini}
                      onChange={(e) => setPotongGonoGini(e.target.checked)}
                    />
                    <label className="form-check-label small fw-bold" htmlFor="gonoSwitchAdmin">
                      Potong Gono-Gini 50% untuk Pasangan
                    </label>
                  </div>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nama Pewaris (Opsional)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Contoh: Almarhum Budi"
                    value={namaJenazah}
                    onChange={(e) => setNamaJenazah(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Jenis Kelamin</label>
                  <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted">Harta Kotor (Rp)</label>
                  <input type="text" className="form-control fw-bold" value={harta} onChange={(e) => setHarta(formatIDR(e.target.value))} placeholder="0" />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted">Utang (Rp)</label>
                  <input type="text" className="form-control" value={utang} onChange={(e) => setUtang(formatIDR(e.target.value))} placeholder="0" />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted">Wasiat (Rp)</label>
                  <input type="text" className="form-control" value={wasiat} onChange={(e) => setWasiat(formatIDR(e.target.value))} placeholder="0" />
                </div>
              </div>
            </div>

            <div className="card wp-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="wp-widget-header m-0">
                  <i className="bi bi-people-fill text-success"></i> Silsilah Ahli Waris ({ahliWaris.length})
                </h5>
                <button className="btn btn-sm btn-outline-success fw-bold" onClick={addHeir}>
                  <i className="bi bi-plus-circle me-1"></i> Tambah Ahli Waris
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle small">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40px" }}>No</th>
                      <th>Nama</th>
                      <th>Hubungan Keluarga</th>
                      <th style={{ width: "60px" }}>Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ahliWaris.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-3">Belum ada ahli waris. Klik Tambah Ahli Waris.</td>
                      </tr>
                    ) : (
                      ahliWaris.map((h, i) => (
                        <tr key={i}>
                          <td className="text-center fw-bold">{i + 1}</td>
                          <td>
                            <input 
                              type="text" 
                              className="form-control form-control-sm"
                              placeholder="Nama..."
                              value={h.nama}
                              onChange={(e) => updateHeir(i, "nama", e.target.value)}
                            />
                          </td>
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              value={h.hubungan}
                              onChange={(e) => updateHeir(i, "hubungan", e.target.value)}
                            >
                              {HUBUNGAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeHeir(i)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card wp-card p-4">
              <h5 className="wp-widget-header text-success mb-3">
                <i className="bi bi-pie-chart"></i> Ringkasan Parameter
              </h5>

              <div className="alert alert-success small mb-3">
                <div className="text-muted">Estimasi Harta Bersih:</div>
                <strong className="fs-5 text-success">Rp {Math.max(0, hartaBersih).toLocaleString("id-ID")}</strong>
              </div>

              <button 
                className="btn btn-success w-100 font-weight-bold py-2 shadow"
                disabled={!harta || ahliWaris.length === 0}
                onClick={handleHitung}
              >
                <i className="bi bi-calculator-fill me-1"></i> Hitung Hasil Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card wp-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-success font-monospace mb-1">STATUS: {hasil.statusAulRadd}</span>
              <h4 className="font-serif fw-bold text-dark m-0">Hasil Kalkulasi Cepat</h4>
            </div>
            <button className="btn btn-danger btn-sm fw-bold" onClick={downloadPDF}>
              <i className="bi bi-file-earmark-pdf-fill me-1"></i> Cetak PDF
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle small">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Ahli Waris</th>
                  <th>Status</th>
                  <th>Porsi</th>
                  <th>Nominal Rupiah</th>
                  <th>Alasan Hukum / KHI</th>
                </tr>
              </thead>
              <tbody>
                {hasil.ahliWarisGetted.map((h: any, i: number) => (
                  <tr key={i} className={h.status === "Terhijab" ? "table-danger opacity-75" : ""}>
                    <td className="fw-bold">{i + 1}</td>
                    <td><strong className="text-dark">{h.nama || "-"}</strong> ({h.hubungan})</td>
                    <td><span className={`badge ${h.status === "Mewarisi" ? "bg-success" : "bg-danger"}`}>{h.status}</span></td>
                    <td><span className="badge bg-secondary">{h.jatahPersen}</span></td>
                    <td className="fw-bold text-success">Rp {h.jatahNominal.toLocaleString("id-ID")}</td>
                    <td className="text-secondary">{h.alasan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
