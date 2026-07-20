"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdatJawaPage() {
  const [totalHarta, setTotalHarta] = useState<number>(1000000000); // 1 Miliar
  const [potongGonoGini, setPotongGonoGini] = useState<boolean>(true);
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL" | "DUMDUMAN">("SEPIKUL");

  // Calculation logic for Adat Jawa
  const gonoGiniAmount = potongGonoGini ? totalHarta * 0.5 : 0;
  const sisaWaris = totalHarta - gonoGiniAmount;

  let porsiLaki = 0;
  let porsiPerempuan = 0;

  if (metodeAdat === "SEPIKUL") {
    // 2 : 1
    porsiLaki = sisaWaris * (2 / 3);
    porsiPerempuan = sisaWaris * (1 / 3);
  } else {
    // 1 : 1
    porsiLaki = sisaWaris * 0.5;
    porsiPerempuan = sisaWaris * 0.5;
  }

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="pb-5">
      
      {/* 1. ELEGANT HERO HEADER (Dark Slate Theme with Gold Accent) */}
      <section className="wp-hero-banner py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark font-monospace px-3 py-2 mb-3 shadow-sm">
                <i className="bi bi-bank me-1"></i> RUJUKAN HUKUM ADAT NUSANTARA
              </span>
              <h1 className="display-4 font-serif fw-bold text-white mb-3">
                Hukum Adat Jawa (Sepikul Segendongan & Dum-Duman)
              </h1>
              <p className="lead text-light opacity-90 mb-4 leading-relaxed">
                Sistem pembagian harta waris tradisional masyarakat Jawa yang mengedepankan asas <strong>Gono-Gini (50% Harta Bersama)</strong>, kerukunan persaudaraan, serta keseimbangan peran kewajiban sosial antar keturunan.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/kalkulator" className="btn btn-warning text-dark btn-lg fw-bold px-4 shadow">
                  <i className="bi bi-calculator-fill me-2"></i> Hitung Adat Jawa
                </Link>
                <a href="#simulator-adat" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-sliders me-2"></i> Simulasi Timbangan Adat
                </a>
              </div>
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="card wp-card p-4 bg-white text-dark shadow-lg border-0">
                <div className="display-3 text-warning mb-2"><i className="bi bi-bank"></i></div>
                <h5 className="font-serif fw-bold text-dark mb-2">Asas Kerukunan Jawa</h5>
                <p className="small text-secondary m-0">
                  "Mangan Ora Mangan Kumpul — Warisan diderum berdasarkan musyawarah mufakat tanpa memutus tali silaturahmi."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE ADAT SIMULATOR */}
      <section className="py-5 bg-white" id="simulator-adat">
        <div className="container py-3">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge bg-warning text-dark font-monospace px-3 py-2 mb-2 uppercase">Kalkulasi Timbangan</span>
            <h2 className="font-serif fw-bold text-dark">Simulasi Timbangan Pembagian Adat Jawa</h2>
            <p className="text-secondary small">
              Tentukan nilai harta dan pilih metode adat untuk melihat pemotongan Harta Gono-Gini dan porsi keturunan.
            </p>
          </div>

          <div className="row g-4">
            
            {/* Control Column */}
            <div className="col-lg-5">
              <div className="card wp-card p-4 border border-light shadow-sm">
                <h5 className="wp-widget-header text-dark">
                  <i className="bi bi-sliders text-warning"></i> Parameter Adat Jawa
                </h5>

                {/* Harta Input */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Total Harta Waris Kotor (Rp)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light fw-bold">Rp</span>
                    <input 
                      type="number" 
                      className="form-control fw-bold"
                      value={totalHarta}
                      onChange={(e) => setTotalHarta(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Switch Gono Gini */}
                <div className="form-check form-switch mb-4 bg-light p-3 rounded border">
                  <input 
                    className="form-check-input ms-0 me-2" 
                    type="checkbox" 
                    role="switch" 
                    id="switchGonoGiniPage"
                    checked={potongGonoGini}
                    onChange={(e) => setPotongGonoGini(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold text-dark" htmlFor="switchGonoGiniPage">
                    Potong 50% Harta Gono-Gini untuk Pasangan Hidup
                  </label>
                </div>

                {/* Method selector */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Pilih Metode Pembagian Adat</label>
                  <div className="d-flex flex-column gap-2">
                    <button 
                      type="button" 
                      className={`btn p-3 text-start ${metodeAdat === "SEPIKUL" ? "btn-warning fw-bold text-dark" : "btn-outline-secondary"}`}
                      onClick={() => setMetodeAdat("SEPIKUL")}
                    >
                      <div className="fw-bold">Sepikul Segendongan (2 : 1)</div>
                      <div className="small opacity-75">Anak laki-laki 2 porsi, anak perempuan 1 porsi (proporsional beban).</div>
                    </button>

                    <button 
                      type="button" 
                      className={`btn p-3 text-start ${metodeAdat === "DUMDUMAN" ? "btn-warning fw-bold text-dark" : "btn-outline-secondary"}`}
                      onClick={() => setMetodeAdat("DUMDUMAN")}
                    >
                      <div className="fw-bold">Dum-Duman Kerukunan (1 : 1)</div>
                      <div className="small opacity-75">Sama rata antara anak laki-laki dan perempuan demi menjaga kerukunan.</div>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Display Column */}
            <div className="col-lg-7">
              <div className="card wp-card p-4 h-100 border-0 bg-light shadow-sm">
                
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h5 className="font-serif fw-bold text-dark m-0">
                    <i className="bi bi-pie-chart-fill text-warning me-2"></i>Rincian Alokasi Timbangan
                  </h5>
                  <span className="badge bg-dark text-warning font-monospace fs-7">
                    Total: {formatIDR(totalHarta)}
                  </span>
                </div>

                {potongGonoGini && (
                  <div className="alert alert-warning mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong className="d-block text-dark">Hak Pasangan (Harta Gono-Gini 50%):</strong>
                        <span className="small text-secondary">Dipisahkan otomatis sebelum pembagian ke anak.</span>
                      </div>
                      <span className="fs-5 fw-bold text-dark">{formatIDR(gonoGiniAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-white rounded border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">Anak Laki-Laki ({metodeAdat === "SEPIKUL" ? "Sepikul - 2 Bagian" : "1 Bagian"}):</span>
                      <strong className="text-success fs-5">{formatIDR(porsiLaki)}</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-warning" style={{ width: `${(porsiLaki / totalHarta) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">Anak Perempuan ({metodeAdat === "SEPIKUL" ? "Segendongan - 1 Bagian" : "1 Bagian"}):</span>
                      <strong className="text-success fs-5">{formatIDR(porsiPerempuan)}</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-warning" style={{ width: `${(porsiPerempuan / totalHarta) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-top text-end">
                  <Link href="/kalkulator" className="btn btn-warning text-dark fw-bold">
                    Lanjut ke Kalkulator Lengkap <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FILOSOFI PRINSIP ADAT */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="font-serif fw-bold text-dark">Filosofi Utama Hukum Adat Jawa</h2>
            <p className="text-secondary small">
              Prinsip-prinsip sosial budaya yang melandasi pembagian harta waris di tanah Jawa.
            </p>
          </div>

          <div className="row g-4">
            
            <div className="col-md-6">
              <div className="card wp-card p-4 h-100 border-top border-4 border-warning">
                <span className="badge bg-warning text-dark font-monospace mb-2 align-self-start">PRINSIP 1</span>
                <h4 className="font-serif fw-bold text-dark mb-2">Sepikul Segendongan (Rasio 2 : 1)</h4>
                <p className="small text-secondary leading-relaxed">
                  Laki-laki memikul beban tanggung jawab ekonomi keluarga (memikul tempat tidur/kebutuhan rumah tangga), sedangkan perempuan menggendong bakul belanjaan. Rasio 2:1 mencerminkan keseimbangan beban sosial yang harus dipikul anak laki-laki.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card wp-card p-4 h-100 border-top border-4 border-warning">
                <span className="badge bg-warning text-dark font-monospace mb-2 align-self-start">PRINSIP 2</span>
                <h4 className="font-serif fw-bold text-dark mb-2">Dum-Duman Kerukunan (Rasio 1 : 1)</h4>
                <p className="small text-secondary leading-relaxed">
                  Pemerataan harta secara sama rata tanpa membedakan gender anak, yang disepakati melalui musyawarah mufakat keluarga. Ditujukan khusus untuk mencegah bibit perselisihan dan menjaga tali silaturahmi saudara kandung.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
