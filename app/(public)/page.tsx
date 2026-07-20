"use client";

import Link from "next/link";
import { useState } from "react";

interface HeirsState {
  istri: boolean;
  ibu: boolean;
  anakLaki: boolean;
  anakPerempuan: boolean;
  saudara: boolean;
}

interface DistributionResult {
  name: string;
  fraction: string;
  percentage: number;
  amount: number;
  description: string;
  status: "Mewarisi" | "Terhijab";
}

export default function HomePage() {
  const [totalHarta, setTotalHarta] = useState<number>(1200000000); // 1.2 Miliar
  const [hukum, setHukum] = useState<"islam" | "adat" | "perdata">("islam");
  const [heirs, setHeirs] = useState<HeirsState>({
    istri: true,
    ibu: true,
    anakLaki: true,
    anakPerempuan: true,
    saudara: false,
  });

  const toggleHeir = (key: keyof HeirsState) => {
    setHeirs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getCalculatedResults = (): DistributionResult[] => {
    const results: DistributionResult[] = [];
    const hasChildren = heirs.anakLaki || heirs.anakPerempuan;

    if (hukum === "islam") {
      const isSaudaraBlocked = heirs.anakLaki;
      let istriShare = 0;
      let ibuShare = 0;
      let anakLakiShare = 0;
      let anakPerempuanShare = 0;
      let saudaraShare = 0;

      let istriFraction = "-";
      let ibuFraction = "-";

      if (heirs.istri) {
        istriShare = hasChildren ? 1/8 : 1/4;
        istriFraction = hasChildren ? "1/8" : "1/4";
      }

      if (heirs.ibu) {
        ibuShare = hasChildren ? 1/6 : 1/3;
        ibuFraction = hasChildren ? "1/6" : "1/3";
      }

      const remainder = 1 - istriShare - ibuShare;
      if (hasChildren) {
        if (heirs.anakLaki && heirs.anakPerempuan) {
          anakLakiShare = remainder * (2 / 3);
          anakPerempuanShare = remainder * (1 / 3);
        } else if (heirs.anakLaki) {
          anakLakiShare = remainder;
        } else if (heirs.anakPerempuan) {
          anakPerempuanShare = remainder;
        }
      } else if (heirs.saudara && !isSaudaraBlocked) {
        saudaraShare = remainder;
      }

      if (heirs.istri) {
        results.push({
          name: "Istri (Pasangan)",
          fraction: istriFraction,
          percentage: istriShare * 100,
          amount: totalHarta * istriShare,
          description: hasChildren ? "Mendapat 1/8 porsi karena ada keturunan (KHI Pasal 180)." : "Mendapat 1/4 porsi.",
          status: "Mewarisi"
        });
      }

      if (heirs.ibu) {
        results.push({
          name: "Ibu Kandung",
          fraction: ibuFraction,
          percentage: ibuShare * 100,
          amount: totalHarta * ibuShare,
          description: hasChildren ? "Mendapat 1/6 porsi karena ada keturunan (KHI Pasal 178)." : "Mendapat 1/3 porsi.",
          status: "Mewarisi"
        });
      }

      if (heirs.anakLaki) {
        results.push({
          name: "Anak Laki-Laki",
          fraction: heirs.anakPerempuan ? "Ashabah (2:1)" : "Ashabah (Sisa)",
          percentage: anakLakiShare * 100,
          amount: totalHarta * anakLakiShare,
          description: "Menerima sisa harta (Ashabah bin Nafsi/Ghayr).",
          status: "Mewarisi"
        });
      }

      if (heirs.anakPerempuan) {
        results.push({
          name: "Anak Perempuan",
          fraction: heirs.anakLaki ? "Ashabah (1:2)" : "Furudh/Ashabah",
          percentage: anakPerempuanShare * 100,
          amount: totalHarta * anakPerempuanShare,
          description: "Menerima porsi sesuai ketentuan KHI.",
          status: "Mewarisi"
        });
      }

      if (heirs.saudara) {
        results.push({
          name: "Saudara Kandung Laki-Laki",
          fraction: isSaudaraBlocked ? "0" : "Ashabah",
          percentage: isSaudaraBlocked ? 0 : saudaraShare * 100,
          amount: isSaudaraBlocked ? 0 : totalHarta * saudaraShare,
          description: isSaudaraBlocked ? "Terhijab Mahjub oleh adanya anak laki-laki." : "Menerima sisa harta.",
          status: isSaudaraBlocked ? "Terhijab" : "Mewarisi"
        });
      }
    } else if (hukum === "adat") {
      let gonoGini = heirs.istri ? totalHarta * 0.5 : 0;
      let sisaWaris = totalHarta - gonoGini;

      if (heirs.istri) {
        results.push({
          name: "Istri (Harta Gono-Gini)",
          fraction: "50%",
          percentage: 50,
          amount: gonoGini,
          description: "Hak 50% atas harta bersama perkawinan adat Jawa.",
          status: "Mewarisi"
        });
      }

      if (heirs.anakLaki) {
        let porsi = heirs.anakPerempuan ? 0.666 : 1.0;
        let amt = sisaWaris * porsi;
        results.push({
          name: "Anak Laki-Laki (Sepikul)",
          fraction: "2 Bagian",
          percentage: (amt / totalHarta) * 100,
          amount: amt,
          description: "Prinsip Sepikul Segendongan (2:1).",
          status: "Mewarisi"
        });
      }

      if (heirs.anakPerempuan) {
        let porsi = heirs.anakLaki ? 0.333 : 1.0;
        let amt = sisaWaris * porsi;
        results.push({
          name: "Anak Perempuan (Segendongan)",
          fraction: "1 Bagian",
          percentage: (amt / totalHarta) * 100,
          amount: amt,
          description: "Prinsip Sepikul Segendongan (1:2).",
          status: "Mewarisi"
        });
      }
    } else {
      let totalMembers = (heirs.istri ? 1 : 0) + (heirs.anakLaki ? 1 : 0) + (heirs.anakPerempuan ? 1 : 0);
      if (totalMembers > 0) {
        let share = 1 / totalMembers;
        if (heirs.istri) {
          results.push({
            name: "Istri (Pasangan)",
            fraction: `1/${totalMembers}`,
            percentage: share * 100,
            amount: totalHarta * share,
            description: "Golongan I KUHPerdata: Dibagi rata sama dengan anak.",
            status: "Mewarisi"
          });
        }
        if (heirs.anakLaki) {
          results.push({
            name: "Anak Laki-Laki",
            fraction: `1/${totalMembers}`,
            percentage: share * 100,
            amount: totalHarta * share,
            description: "Golongan I KUHPerdata: Dibagi rata tanpa beda gender.",
            status: "Mewarisi"
          });
        }
        if (heirs.anakPerempuan) {
          results.push({
            name: "Anak Perempuan",
            fraction: `1/${totalMembers}`,
            percentage: share * 100,
            amount: totalHarta * share,
            description: "Golongan I KUHPerdata: Dibagi rata tanpa beda gender.",
            status: "Mewarisi"
          });
        }
      }
    }

    return results;
  };

  const calculatedData = getCalculatedResults();

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div>
      
      {/* SECTION 1: COMPACT STANDARD HERO SECTION */}
      <section className="wp-hero-banner py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            
            {/* Left Headline Column */}
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark font-monospace px-3 py-2 mb-3 shadow-sm">
                <i className="bi bi-shield-check me-1"></i> PORTAL SYARIAT TERPADU
              </span>

              <h1 className="font-serif fw-bold text-white mb-3">
                Menjaga Keadilan & Kerukunan Keluarga Lewat Pembagian Waris Transparan
              </h1>

              <p className="lead text-light opacity-90 mb-4 leading-relaxed">
                Platform digital pertama yang mengintegrasikan kalkulasi pembagian harta waris secara otomatis berdasarkan 3 sistem hukum nasional: <strong>Hukum Islam (Faraid KHI)</strong>, <strong>Hukum Adat Jawa</strong>, dan <strong>KUHPerdata (BW)</strong>.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link href="/kalkulator" className="btn btn-warning text-dark btn-lg fw-bold px-4 shadow">
                  <i className="bi bi-calculator-fill me-2"></i> Hitung Faraid Sekarang
                </Link>
                <Link href="/syariah" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-journal-text me-2"></i> Rujukan Hukum Islam
                </Link>
              </div>

              <div className="row g-3 pt-3 border-top border-light border-opacity-25">
                <div className="col-4">
                  <div className="fw-bold text-warning fs-5"><i className="bi bi-check-circle-fill me-1"></i> 100% Presisi</div>
                  <div className="small text-white opacity-75">Sesuai KHI & Dalil</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-warning fs-5"><i className="bi bi-diagram-3-fill me-1"></i> 3 Hukum</div>
                  <div className="small text-white opacity-75">Islam, Adat & Perdata</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-warning fs-5"><i className="bi bi-file-earmark-pdf-fill me-1"></i> PDF Laporan</div>
                  <div className="small text-white opacity-75">Cetak Hasil Rincian</div>
                </div>
              </div>

            </div>

            {/* Right Floating Simulator Card */}
            <div className="col-lg-5">
              <div className="card wp-card border-0 shadow-lg p-4 bg-white text-dark">
                
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h5 className="font-serif fw-bold text-success m-0">
                    <i className="bi bi-calculator-fill me-2"></i>Simulator Faraid Cepat
                  </h5>
                  <span className="badge bg-success fs-7">Live Preview</span>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">Total Harta Bersih (Rp)</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light fw-bold">Rp</span>
                    <input 
                      type="number" 
                      className="form-control fw-bold"
                      value={totalHarta}
                      onChange={(e) => setTotalHarta(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">Ahli Waris Hidup</label>
                  <div className="row g-2">
                    {[
                      { key: "istri", label: "Istri" },
                      { key: "ibu", label: "Ibu" },
                      { key: "anakLaki", label: "Anak Laki" },
                      { key: "anakPerempuan", label: "Anak Perempuan" }
                    ].map(item => (
                      <div className="col-6" key={item.key}>
                        <div className="form-check form-switch bg-light p-1.5 rounded border">
                          <input 
                            className="form-check-input ms-0 me-1" 
                            type="checkbox" 
                            role="switch" 
                            id={`check-main-${item.key}`}
                            checked={heirs[item.key as keyof HeirsState]}
                            onChange={() => toggleHeir(item.key as any)}
                          />
                          <label className="form-check-label fs-8 fw-bold" htmlFor={`check-main-${item.key}`}>
                            {item.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-light p-2.5 rounded border mb-3">
                  <div className="fs-8 fw-bold text-dark mb-1">Hasil Alokasi Porsi:</div>
                  {calculatedData.map((row, idx) => (
                    <div className="d-flex justify-content-between align-items-center mb-1 fs-8" key={idx}>
                      <span className="text-secondary">{row.name}:</span>
                      <strong className="text-success">{formatRupiah(row.amount)}</strong>
                    </div>
                  ))}
                </div>

                <Link href="/kalkulator" className="btn btn-sm btn-success fw-bold w-100 shadow-sm">
                  Buka Kalkulator Selengkapnya <i className="bi bi-arrow-right ms-1"></i>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: 3 RUJUKAN HUKUM GRID */}
      <section className="py-5 bg-white border-bottom">
        <div className="container py-3">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="wp-badge-emerald badge px-3 py-2 mb-2 uppercase">Multidisiplin Hukum</span>
            <h2 className="font-serif fw-bold text-dark">3 Sistem Hukum Waris di Indonesia</h2>
            <p className="text-secondary small">
              SI-WARIS memfasilitasi penghitungan waris berdasarkan 3 sistem hukum yang diakui secara legal di Indonesia.
            </p>
          </div>

          <div className="row g-4">
            
            <div className="col-lg-4 col-md-6">
              <div className="card wp-card h-100 p-4 border-0 shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-success text-white rounded p-2.5">
                    <i className="bi bi-moon-stars fs-3"></i>
                  </div>
                  <div>
                    <h5 className="font-serif fw-bold m-0 text-dark">Hukum Islam (Faraid)</h5>
                    <span className="text-success small fw-bold">KHI Buku II Pasal 171-214</span>
                  </div>
                </div>
                <p className="small text-secondary leading-relaxed mb-4">
                  Berdasarkan ayat Al-Qur'an (Surah An-Nisa), Hadits Shahih, dan Kompilasi Hukum Islam. Menghitung bagian pasti (Dzawil Furudh) dan porsi sisa (Ashabah) secara presisi.
                </p>
                <Link href="/syariah" className="btn btn-outline-success btn-sm w-100 fw-bold mt-auto">
                  Pelajari Hukum Islam <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card wp-card h-100 p-4 border-0 shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-warning text-dark rounded p-2.5">
                    <i className="bi bi-bank fs-3"></i>
                  </div>
                  <div>
                    <h5 className="font-serif fw-bold m-0 text-dark">Hukum Adat Jawa</h5>
                    <span className="text-warning small fw-bold">Sepikul Segendongan & Dum-Duman</span>
                  </div>
                </div>
                <p className="small text-secondary leading-relaxed mb-4">
                  Berdasarkan tradisi waris masyarakat Jawa dengan pemisahan harta Gono-Gini (50%) untuk pasangan serta prinsip kesetaraan dan kerukunan keluarga.
                </p>
                <Link href="/adat-jawa" className="btn btn-outline-warning text-dark btn-sm w-100 fw-bold mt-auto">
                  Pelajari Adat Jawa <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card wp-card h-100 p-4 border-0 shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary text-white rounded p-2.5">
                    <i className="bi bi-balance-scale fs-3"></i>
                  </div>
                  <div>
                    <h5 className="font-serif fw-bold m-0 text-dark">Hukum Perdata (BW)</h5>
                    <span className="text-primary small fw-bold">KUHPerdata Pasal 830-1130</span>
                  </div>
                </div>
                <p className="small text-secondary leading-relaxed mb-4">
                  Berdasarkan Kitab Undang-Undang Hukum Perdata Barat (Burgelijk Wetboek) yang membagi derajat ahli waris ke dalam 4 Golongan tanpa pembedaan gender.
                </p>
                <Link href="/perdata" className="btn btn-outline-primary btn-sm w-100 fw-bold mt-auto">
                  Pelajari Hukum Perdata <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: CONTENT FEED & SIDEBAR */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="row g-4">
            
            <div className="col-lg-8">
              <h4 className="wp-widget-header mb-4">
                <i className="bi bi-journal-text text-success"></i> Panduan & Edukasi Syariat Terpopuler
              </h4>

              <div className="d-flex flex-column gap-3">
                <div className="card wp-card p-4 border-0 shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-success font-monospace">SYARIAT FARAID</span>
                    <span className="text-muted small"><i className="bi bi-clock me-1"></i> 5 Menit Baca</span>
                  </div>
                  <h4 className="font-serif fw-bold text-dark mb-2">
                    <Link href="/syariah" className="text-dark text-decoration-none hover:text-success">
                      Tata Cara Penyelesaian Kasus Aul & Radd dalam Kompilasi Hukum Islam (KHI)
                    </Link>
                  </h4>
                  <p className="small text-secondary leading-relaxed mb-3">
                    Penjelasan matematis bagaimana porsi ahli waris disesuaikan secara adil ketika jumlah porsi pasti melebihi total harta atau tersisa tanpa Ashabah...
                  </p>
                  <Link href="/syariah" className="small fw-bold text-success text-decoration-none">
                    Baca Selengkapnya <i className="bi bi-chevron-right ms-1"></i>
                  </Link>
                </div>

                <div className="card wp-card p-4 border-0 shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-warning text-dark font-monospace">TRADISI ADAT</span>
                    <span className="text-muted small"><i className="bi bi-clock me-1"></i> 4 Menit Baca</span>
                  </div>
                  <h4 className="font-serif fw-bold text-dark mb-2">
                    <Link href="/adat-jawa" className="text-dark text-decoration-none hover:text-warning">
                      Filosofi Sepikul Segendongan vs Dum-Duman Kerukunan Jawa
                    </Link>
                  </h4>
                  <p className="small text-secondary leading-relaxed mb-3">
                    Memahami makna spiritual di balik pembagian 2 bagian untuk anak laki-laki dan 1 bagian untuk anak perempuan dalam tradisi Jawa...
                  </p>
                  <Link href="/adat-jawa" className="small fw-bold text-warning text-decoration-none">
                    Baca Selengkapnya <i className="bi bi-chevron-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card wp-card p-4 mb-4 border-0 shadow-sm">
                <h5 className="wp-widget-header text-success">
                  <i className="bi bi-book-half"></i> Dalil Utama Al-Qur'an
                </h5>
                <ul className="list-unstyled small space-y-3 mb-0">
                  <li className="mb-2 pb-2 border-bottom">
                    <strong className="d-block text-dark">QS. An-Nisa: 11</strong>
                    <span className="text-secondary fs-8">Dasar pembagian hak anak (2:1) & bagian pasti orang tua.</span>
                  </li>
                  <li className="mb-2 pb-2 border-bottom">
                    <strong className="d-block text-dark">QS. An-Nisa: 12</strong>
                    <span className="text-secondary fs-8">Dasar porsi suami (1/2 atau 1/4) & istri (1/4 atau 1/8).</span>
                  </li>
                  <li>
                    <strong className="d-block text-dark">QS. An-Nisa: 176</strong>
                    <span className="text-secondary fs-8">Ketentuan kewarisan Kalalah & saudara kandung.</span>
                  </li>
                </ul>
              </div>

              <div className="card wp-card p-4 bg-dark text-white border-0 shadow">
                <h5 className="font-serif fw-bold text-warning mb-2">
                  <i className="bi bi-headset me-2"></i> Layanan Konsultasi
                </h5>
                <p className="small text-secondary mb-3">
                  Konsultasikan sengketa waris keluarga Anda dengan tim konsultan kami.
                </p>
                <Link href="/tentang" className="btn btn-warning text-dark btn-sm fw-bold w-100">
                  Hubungi Konsultan <i className="bi bi-telephone-fill ms-1"></i>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}