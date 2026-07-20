"use client";

import Link from "next/link";

export default function TentangPage() {
  return (
    <div className="pb-5">
      
      {/* 1. HERO HEADER */}
      <section className="wp-hero-banner py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark font-monospace px-3 py-2 mb-3 shadow-sm">
                <i className="bi bi-info-circle-fill me-1"></i> TENTANG SI-WARIS
              </span>
              <h1 className="display-4 font-serif fw-bold text-white mb-3">
                Pelopor Sistem Informasi Waris Multi-Hukum Indonesia
              </h1>
              <p className="lead text-light opacity-90 mb-4 leading-relaxed">
                SI-WARIS hadir sebagai solusi digital terpadu untuk membantu masyarakat Indonesia menghitung, memetakan, dan menyelesaikan pembagian harta waris secara adil, transparan, serta berkepastian hukum.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/kalkulator" className="btn btn-warning text-dark btn-lg fw-bold px-4 shadow">
                  <i className="bi bi-calculator-fill me-2"></i> Coba Kalkulator Waris
                </Link>
                <Link href="/syariah" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-book-half me-2"></i> Baca Panduan Hukum
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="card wp-card p-4 bg-white text-dark shadow-lg border-0">
                <div className="display-3 text-success mb-2"><i className="bi bi-shield-check"></i></div>
                <h5 className="font-serif fw-bold text-dark mb-2">Resmi & Terverifikasi</h5>
                <p className="small text-secondary m-0">
                  "Menjaga kerukunan keluarga Indonesia melalui prinsip syariat yang adil dan transparan."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 PILAR UTAMA SI-WARIS */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="wp-badge-emerald badge px-3 py-2 mb-2 uppercase">Fondasi Platform</span>
            <h2 className="font-serif fw-bold text-dark">4 Pilar Utama SI-WARIS</h2>
            <p className="text-secondary small">
              Komitmen kami dalam menyajikan platform kalkulasi waris tepercaya di Indonesia.
            </p>
          </div>

          <div className="row g-4">
            
            <div className="col-md-3 col-sm-6">
              <div className="card wp-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="bg-success-subtle text-success rounded-circle p-3 mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                  <i className="bi bi-moon-stars fs-3"></i>
                </div>
                <h5 className="font-serif fw-bold text-dark mb-2">Syariat Otentik</h5>
                <p className="small text-secondary leading-relaxed">
                  Berdasarkan Surah An-Nisa (11, 12, 176), Hadits Shahih, dan Kompilasi Hukum Islam (KHI).
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="card wp-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="bg-warning-subtle text-warning-emphasis rounded-circle p-3 mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                  <i className="bi bi-calculator fs-3"></i>
                </div>
                <h5 className="font-serif fw-bold text-dark mb-2">Presisi Algoritma</h5>
                <p className="small text-secondary leading-relaxed">
                  Penyelesaian matematis otomatis untuk kasus kompleks Aul, Radd, dan Gharrawain.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="card wp-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="bg-primary-subtle text-primary rounded-circle p-3 mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                  <i className="bi bi-bank fs-3"></i>
                </div>
                <h5 className="font-serif fw-bold text-dark mb-2">Multidisiplin Hukum</h5>
                <p className="small text-secondary leading-relaxed">
                  Mendukung 3 rujukan hukum resmi: Islam (Faraid), Adat Jawa, dan Perdata (BW).
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="card wp-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="bg-info-subtle text-info-emphasis rounded-circle p-3 mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                  <i className="bi bi-file-earmark-pdf fs-3"></i>
                </div>
                <h5 className="font-serif fw-bold text-dark mb-2">Cetak PDF Resmi</h5>
                <p className="small text-secondary leading-relaxed">
                  Laporan pembagian waris dapat langsung diunduh dalam bentuk PDF resmi.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. VISI & MISI */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-success font-monospace px-3 py-2 mb-2">VISI & MISI</span>
              <h2 className="font-serif fw-bold text-dark mb-3">Mencegah Sengketa Waris Melalui Transparansi Digital</h2>
              <p className="small text-secondary leading-relaxed mb-3">
                Sengketa harta waris kerap menjadi pemicu keretakan hubungan keluarga di Indonesia karena minimnya pemahaman hukum serta ketidakjelasan porsi pembagian.
              </p>
              <p className="small text-secondary leading-relaxed mb-4">
                SI-WARIS hadir sebagai alat bantu independen yang memberikan kepastian angka dan dalil secara terbuka, sehingga seluruh ahli waris dapat bermusyawarah dalam iklim yang damai dan berkeadilan.
              </p>
              <Link href="/kalkulator" className="btn btn-success fw-bold px-4">
                Coba Simulasi Waris <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="card wp-card p-4 bg-dark text-white border-0 shadow">
                <h4 className="font-serif fw-bold text-warning mb-3">
                  <i className="bi bi-envelope-open-fill me-2"></i> Hubungi Tim Pengelola
                </h4>
                <p className="small text-secondary mb-3">
                  Untuk pertanyaan seputar kerjasama, integrasi lembaga, atau konsultasi hukum syariat:
                </p>
                <ul className="list-unstyled small text-secondary space-y-2 mb-4">
                  <li><i className="bi bi-envelope text-warning me-2"></i> kontak@siwaris.id</li>
                  <li><i className="bi bi-telephone text-warning me-2"></i> +62 812-3456-7890</li>
                  <li><i className="bi bi-geo-alt text-warning me-2"></i> Jakarta & Yogyakarta, Indonesia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
