"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";
import Link from "next/link";

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

export default function KalkulatorPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [namaJenazah, setNamaJenazah] = useState("");
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);
  const [hasil, setHasil] = useState<any>(null);
  const [selectedHeir, setSelectedHeir] = useState<any>(null);
  const [hukum, setHukum] = useState<string>("Islam");
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT">("SEPIKUL_SEGENDONGAN");
  const [potongGonoGini, setPotongGonoGini] = useState(false);

  const addHeir = (hubungan: string = "Anak Laki-laki") => {
    setAhliWaris([...ahliWaris, { nama: "", hubungan }]);
  };

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
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(20);
    doc.text("LAPORAN PEMBAGIAN WARIS SI-WARIS", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("SI-WARIS | Sistem Informasi & Kalkulator Waris Multi-Hukum", 105, 27, { align: "center" });
    doc.line(20, 32, 190, 32);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${namaJenazah || "-"}`, 20, 42);
    doc.text(`Jenis Kelamin: ${gender}`, 20, 48);
    doc.text(`Dasar Hukum: ${hukum === "Islam" ? "Syariat Islam (Faraid KHI)" : "Adat Jawa"}`, 20, 54);
    doc.text(`Tanggal Cetak: ${date}`, 20, 60);

    doc.text(`Harta Kotor: Rp ${parseNum(harta).toLocaleString("id-ID")}`, 120, 42);
    doc.text(`Utang & Wasiat: Rp ${(parseNum(utang) + parseNum(wasiat)).toLocaleString("id-ID")}`, 120, 48);
    doc.text(`Harta Bersih (Mirkah): Rp ${hasil.hartaBersih.toLocaleString("id-ID")}`, 120, 54);

    autoTable(doc, {
      startY: 68,
      head: [['NO', 'AHLI WARIS', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'KETERANGAN HUKUM']],
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

    doc.save(`laporan-waris-${namaJenazah || "keluarga"}.pdf`);
  };

  const hartaBersih = parseNum(harta) - parseNum(utang) - parseNum(wasiat);

  return (
    <div className="py-5 bg-light">
      <div className="container">

        {/* Header Title */}
        <div className="text-center mb-4">
          <span className="wp-badge-emerald badge px-3 py-2 mb-2 uppercase">Kalkulator Multi-Hukum</span>
          <h1 className="font-serif fw-bold text-dark">Kalkulator Waris SI-WARIS</h1>
          <p className="text-secondary small">Hitung porsi pembagian waris keluarga berdasarkan Faraid Islam & Adat Jawa secara presisi.</p>
        </div>

        {/* Wizard Steps Nav Pills (Horizontal Scroll & Text-Nowrap on Mobile) */}
        <div className="card wp-card p-2 p-md-3 mb-4 overflow-x-auto">
          <ul className="nav nav-pills flex-nowrap small fw-bold text-nowrap">
            <li className="nav-item shrink-0">
              <button 
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`nav-link border-0 text-nowrap py-2 px-3 ${currentStep === 1 ? "active bg-success text-white" : currentStep > 1 ? "text-success bg-success-subtle" : "text-muted"}`}
              >
                1. Hukum & Pewaris
              </button>
            </li>
            <li className="nav-item shrink-0 ms-1 ms-md-2">
              <button 
                type="button"
                onClick={() => currentStep > 1 && setCurrentStep(2)}
                className={`nav-link border-0 text-nowrap py-2 px-3 ${currentStep === 2 ? "active bg-success text-white" : currentStep > 2 ? "text-success bg-success-subtle" : "text-muted"}`}
              >
                2. Harta & Utang
              </button>
            </li>
            <li className="nav-item shrink-0 ms-1 ms-md-2">
              <button 
                type="button"
                onClick={() => currentStep > 2 && setCurrentStep(3)}
                className={`nav-link border-0 text-nowrap py-2 px-3 ${currentStep === 3 ? "active bg-success text-white" : currentStep > 3 ? "text-success bg-success-subtle" : "text-muted"}`}
              >
                3. Ahli Waris
              </button>
            </li>
            <li className="nav-item shrink-0 ms-1 ms-md-2">
              <button 
                type="button"
                onClick={() => currentStep > 3 && setCurrentStep(4)}
                className={`nav-link border-0 text-nowrap py-2 px-3 ${currentStep === 4 ? "active bg-success text-white" : "text-muted"}`}
              >
                4. Hasil Distribusi
              </button>
            </li>
          </ul>
        </div>

        {/* STEP 1: HUKUM & PEWARIS */}
        {currentStep === 1 && (
          <div className="card wp-card p-4">
            <h5 className="wp-widget-header mb-4">
              <i className="bi bi-person-badge text-success"></i> Langkah 1: Pilih Hukum & Identitas Pewaris
            </h5>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Sistem Hukum Pembagian</label>
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className={`card p-3 cursor-pointer ${hukum === "Islam" ? "border-success bg-success bg-opacity-10" : "border"}`}
                    onClick={() => setHukum("Islam")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-success"><i className="bi bi-moon-stars me-1"></i> Hukum Islam (Faraid)</strong>
                      {hukum === "Islam" && <i className="bi bi-check-circle-fill text-success fs-5"></i>}
                    </div>
                    <span className="small text-secondary">Pembagian porsi pasti berdasarkan KHI, Al-Qur'an & Hadits.</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className={`card p-3 cursor-pointer ${hukum === "Jawa" ? "border-warning bg-warning bg-opacity-10" : "border"}`}
                    onClick={() => setHukum("Jawa")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-warning text-dark"><i className="bi bi-bank me-1"></i> Hukum Adat Jawa</strong>
                      {hukum === "Jawa" && <i className="bi bi-check-circle-fill text-warning fs-5"></i>}
                    </div>
                    <span className="small text-secondary">Sepikul Segendongan (2:1) / Dum-Duman Kerukunan.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">Nama Almarhum / Almarhumah</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Almarhum Budi"
                  value={namaJenazah}
                  onChange={(e) => setNamaJenazah(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">Jenis Kelamin Pewaris</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success fw-bold px-4 py-2"
                disabled={!namaJenazah}
                onClick={() => setCurrentStep(2)}
              >
                Lanjut ke Parameter Harta <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: HARTA & UTANG */}
        {currentStep === 2 && (
          <div className="card wp-card p-4">
            <h5 className="wp-widget-header mb-4">
              <i className="bi bi-wallet2 text-success"></i> Langkah 2: Parameter Harta & Utang
            </h5>

            {hukum === "Jawa" && (
              <div className="alert alert-warning mb-4">
                <h6 className="fw-bold"><i className="bi bi-bank me-1"></i> Opsi Adat Jawa</h6>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Metode Pembagian Adat</label>
                  <select
                    className="form-select form-select-sm"
                    value={metodeAdat}
                    onChange={(e) => setMetodeAdat(e.target.value as any)}
                  >
                    <option value="SEPIKUL_SEGENDONGAN">Sepikul Segendongan (2:1)</option>
                    <option value="KUM_KUM_KUPAT">Dum-Duman / Kum-Kum Kupat (1:1 Sama Rata)</option>
                  </select>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="gonoGiniSwitch"
                    checked={potongGonoGini}
                    onChange={(e) => setPotongGonoGini(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold" htmlFor="gonoGiniSwitch">
                    Potong Harta Gono-Gini (50%) untuk Pasangan Hidup Terlama
                  </label>
                </div>
              </div>
            )}

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted">Total Harta Kotor (Rp)</label>
                <input
                  type="text"
                  className="form-control fw-bold"
                  placeholder="0"
                  value={harta}
                  onChange={(e) => setHarta(formatIDR(e.target.value))}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted">Total Utang & Tajhiz (Rp)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0"
                  value={utang}
                  onChange={(e) => setUtang(formatIDR(e.target.value))}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted">Total Wasiat (Rp)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0"
                  value={wasiat}
                  onChange={(e) => setWasiat(formatIDR(e.target.value))}
                />
              </div>
            </div>

            <div className="alert alert-success d-flex justify-content-between align-items-center mb-4">
              <span><i className="bi bi-info-circle me-1"></i> Estimasi Harta Bersih Terhitung (Mirkah):</span>
              <strong className="fs-5">Rp {Math.max(0, hartaBersih).toLocaleString("id-ID")}</strong>
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-outline-secondary fw-bold" onClick={() => setCurrentStep(1)}>
                <i className="bi bi-arrow-left me-1"></i> Kembali
              </button>
              <button
                className="btn btn-success fw-bold px-4 py-2"
                disabled={parseNum(harta) <= 0}
                onClick={() => setCurrentStep(3)}
              >
                Lanjut Ahli Waris <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AHLI WARIS */}
        {currentStep === 3 && (
          <div className="card wp-card p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
              <h5 className="wp-widget-header m-0">
                <i className="bi bi-people-fill text-success"></i> Langkah 3: Daftar Silsilah Ahli Waris
              </h5>
              <button className="btn btn-sm btn-outline-success fw-bold align-self-start align-self-md-auto" onClick={() => addHeir()}>
                <i className="bi bi-plus-circle me-1"></i> Tambah Ahli Waris
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-3">
              <span className="small font-monospace text-muted d-block d-md-inline mb-2 mb-md-0 me-2">Pintasan Cepat:</span>
              <div className="d-flex flex-wrap gap-1">
                {["Istri", "Suami", "Anak Laki-laki", "Anak Perempuan", "Ayah", "Ibu"].map((h) => (
                  <button
                    key={h}
                    className="btn btn-sm btn-light border font-weight-bold"
                    onClick={() => addHeir(h)}
                  >
                    + {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic List */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle small">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "50px" }}>No</th>
                    <th>Nama Ahli Waris</th>
                    <th>Hubungan Keluarga</th>
                    <th style={{ width: "80px" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {ahliWaris.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        Belum ada ahli waris. Gunakan pintasan cepat di atas atau tombol Tambah.
                      </td>
                    </tr>
                  ) : (
                    ahliWaris.map((h, idx) => (
                      <tr key={idx}>
                        <td className="text-center fw-bold">{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Nama Ahli Waris"
                            value={h.nama}
                            onChange={(e) => updateHeir(idx, "nama", e.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={h.hubungan}
                            onChange={(e) => updateHeir(idx, "hubungan", e.target.value)}
                          >
                            {HUBUNGAN_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeHeir(idx)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-outline-secondary fw-bold" onClick={() => setCurrentStep(2)}>
                <i className="bi bi-arrow-left me-1"></i> Kembali
              </button>
              <button
                className="btn btn-success fw-bold px-4 py-2"
                disabled={ahliWaris.length === 0}
                onClick={handleHitung}
              >
                <i className="bi bi-calculator me-1"></i> Hitung Distribusi Waris
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: HASIL DISTRIBUSI */}
        {currentStep === 4 && hasil && (
          <div className="card wp-card p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4 pb-3 border-bottom">
              <div>
                <span className="badge bg-success font-monospace mb-1">KASUS: {hasil.statusAulRadd}</span>
                <h4 className="font-serif fw-bold text-dark m-0">Laporan Hasil Perhitungan Waris</h4>
              </div>
              <button className="btn btn-danger btn-sm fw-bold align-self-start align-self-md-auto" onClick={downloadPDF}>
                <i className="bi bi-file-earmark-pdf-fill me-1"></i> Unduh PDF Laporan
              </button>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="card bg-light p-3 border">
                  <div className="small text-muted mb-1">Identitas Pewaris</div>
                  <div className="fw-bold text-dark">{namaJenazah || "Almarhum"} ({gender})</div>
                  <div className="small text-secondary">Dasar Hukum: {hukum === "Islam" ? "Syariat Islam (Faraid KHI)" : "Adat Jawa"}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card bg-success text-white p-3 border-0">
                  <div className="small opacity-75 mb-1">Harta Bersih Dibagikan (Mirkah)</div>
                  <div className="fs-4 fw-bold">Rp {Math.max(0, hasil.hartaBersih).toLocaleString("id-ID")}</div>
                </div>
              </div>
            </div>

            <div className="table-responsive mb-4">
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
                  {hasil.ahliWarisGetted.map((h: any, idx: number) => (
                    <tr key={idx} className={h.status === "Terhijab" ? "table-danger opacity-75" : ""}>
                      <td className="fw-bold">{idx + 1}</td>
                      <td>
                        <strong className="d-block text-dark">{h.nama || "-"}</strong>
                        <span className="text-muted fs-8">{h.hubungan}</span>
                      </td>
                      <td>
                        <span className={`badge ${h.status === "Mewarisi" ? "bg-success" : "bg-danger"}`}>
                          {h.status}
                        </span>
                      </td>
                      <td><span className="badge bg-secondary">{h.jatahPersen}</span></td>
                      <td className="fw-bold text-success">Rp {h.jatahNominal.toLocaleString("id-ID")}</td>
                      <td className="text-secondary">{h.alasan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-outline-secondary fw-bold" onClick={() => setCurrentStep(3)}>
                <i className="bi bi-pencil-square me-1"></i> Edit Data Ahli Waris
              </button>
              <Link href="/" className="btn btn-success fw-bold">
                Selesai & Kembali ke Beranda <i className="bi bi-house-fill ms-1"></i>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
