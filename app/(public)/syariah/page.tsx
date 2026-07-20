"use client";

import Link from "next/link";
import { useState } from "react";

const AYAT_LIST = [
  {
    surah: "Surah An-Nisa' Ayat 11",
    sub: "Ketentuan Pembagian Hak Anak, Orang Tua, & Dasar 2:1",
    arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ...",
    translation: "Allah mensyariatkan (mewajibkan) kepadamu tentang (pembagian warisan untuk) anak-anakmu, (yaitu) bagian seorang anak laki-laki sama dengan bagian dua orang anak perempuan...",
    badge: "Utang & Wasiat Didahulukan",
    bg: "bg-success-subtle",
    border: "border-success"
  },
  {
    surah: "Surah An-Nisa' Ayat 12",
    sub: "Ketentuan Porsi Suami, Istri, & Kalalah (Tanpa Keturunan)",
    arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ...",
    translation: "Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh istri-istrimu, jika mereka tidak mempunyai anak...",
    badge: "Hak Pasangan Perkawinan",
    bg: "bg-warning-subtle",
    border: "border-warning"
  },
  {
    surah: "Surah An-Nisa' Ayat 176",
    sub: "Ketentuan Kewarisan Saudara Kandung & Kalalah",
    arabic: "يَسْتَفْتُونَكَ قُلِ اللَّهُ يُفْتِيكُمْ فِي الْكَلَالَةِ...",
    translation: "Minta fatwa kepadamu (tentang kalalah). Katakanlah: 'Allah memberi fatwa kepadamu tentang kalalah (orang yang meninggal tidak meninggalkan bapak dan tidak meninggalkan anak)'...",
    badge: "Jalur Saudara",
    bg: "bg-primary-subtle",
    border: "border-primary"
  }
];

const DZAWIL_FURUDH_TABLE = [
  { heir: "Suami", porsi: "1/2 atau 1/4", syarat: "1/2 jika almarhumah TIDAK punya anak; 1/4 jika punya anak.", khi: "KHI Pasal 179" },
  { heir: "Istri", porsi: "1/4 atau 1/8", syarat: "1/4 jika almarhum TIDAK punya anak; 1/8 jika punya anak.", khi: "KHI Pasal 180" },
  { heir: "Anak Perempuan", porsi: "1/2, 2/3, atau Ashabah", syarat: "1/2 jika tunggal; 2/3 jika 2+ orang; Ashabah (1:2) jika bersama anak laki-laki.", khi: "KHI Pasal 176" },
  { heir: "Ayah", porsi: "1/6 atau 1/6 + Ashabah", syarat: "1/6 jika ada anak; Ashabah jika tidak ada anak laki-laki.", khi: "KHI Pasal 177" },
  { heir: "Ibu", porsi: "1/6 atau 1/3", syarat: "1/6 jika ada anak/saudara 2+; 1/3 jika tidak ada anak/saudara.", khi: "KHI Pasal 178" },
  { heir: "Saudara Perempuan Sekandung", porsi: "1/2, 2/3, atau Ashabah", syarat: "1/2 jika tunggal kalalah; 2/3 jika 2+ orang; terhijab jika ada anak/ayah.", khi: "KHI Pasal 181" },
];

export default function SyariahPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTable = DZAWIL_FURUDH_TABLE.filter(item => 
    item.heir.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.syarat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-5">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="wp-hero-banner py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark font-monospace px-3 py-2 mb-3 shadow-sm">
                <i className="bi bi-moon-stars-fill me-1"></i> RUJUKAN UTAMA SYARIAT ISLAM
              </span>
              <h1 className="display-4 font-serif fw-bold text-white mb-3">
                Hukum Waris Islam (Faraid & Kompilasi Hukum Islam)
              </h1>
              <p className="lead text-light opacity-90 mb-4 leading-relaxed">
                Panduan resmi pembagian harta waris berdasarkan Al-Qur'an (Surah An-Nisa), Hadits Shahih Nabi Muhammad SAW, serta rujukan resmi Instruksi Presiden No. 1 Tahun 1991 tentang Kompilasi Hukum Islam (KHI) Buku II.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/kalkulator" className="btn btn-warning text-dark btn-lg fw-bold px-4 shadow">
                  <i className="bi bi-calculator-fill me-2"></i> Hitung Faraid Otomatis
                </Link>
                <a href="#dalil-quran" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-book-half me-2"></i> Pelajari Dalil Al-Qur'an
                </a>
              </div>
            </div>

            {/* Right Card Hero - Responsive Bismillah Typography */}
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="card wp-card p-4 bg-white text-dark shadow-lg overflow-hidden border-0">
                <div className="fs-2 text-success font-serif mb-2 fw-bold text-break" style={{ letterSpacing: "normal" }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <h5 className="font-serif fw-bold text-dark mb-2">Keadilan Syariat</h5>
                <p className="small text-secondary m-0 leading-relaxed">
                  "Pembagian harta waris dalam Islam diatur langsung oleh Allah SWT tanpa intervensi hawa nafsu manusia."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DALIL AL-QUR'AN SECTION */}
      <section className="py-5 bg-white" id="dalil-quran">
        <div className="container py-3">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="wp-badge-emerald badge px-3 py-2 mb-2 uppercase">Landasan Otentik</span>
            <h2 className="font-serif fw-bold text-dark">Ayat-Ayat Al-Qur'an Pembagian Waris</h2>
            <p className="text-secondary small">
              Tiga ayat utama dalam Surah An-Nisa yang menjadi fondasi matematis seluruh algoritma Faraid di SI-WARIS.
            </p>
          </div>

          <div className="row g-4">
            {AYAT_LIST.map((ayat, idx) => (
              <div className="col-lg-4 col-md-6" key={idx}>
                <div className="card wp-card h-100 p-4 border-0 shadow-sm overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-success font-monospace">{ayat.badge}</span>
                    <span className="text-muted small"><i className="bi bi-bookmark-star-fill text-warning me-1"></i> An-Nisa</span>
                  </div>

                  <h5 className="font-serif fw-bold text-dark mb-1">{ayat.surah}</h5>
                  <p className="text-success small fw-bold mb-3">{ayat.sub}</p>

                  <div className="p-3 bg-light rounded-3 mb-3 border font-serif text-end fs-5 leading-loose text-dark text-break overflow-hidden" dir="rtl" style={{ wordBreak: "break-word" }}>
                    {ayat.arabic}
                  </div>

                  <p className="small text-secondary leading-relaxed mb-0">
                    "{ayat.translation}"
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. TABEL DZAWIL FURUDH (KHI BUKU II) */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <span className="wp-badge-gold badge px-3 py-2 mb-1 uppercase">KHI Buku II (Pasal 171 - 214)</span>
              <h2 className="font-serif fw-bold text-dark m-0">Tabel Porsi Hak Pasti (Dzawil Furudh)</h2>
            </div>
            
            {/* Search Filter Box */}
            <div className="input-group" style={{ maxWidth: "320px" }}>
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input 
                type="text" 
                className="form-control form-control-sm"
                placeholder="Cari ahli waris (Istri, Ayah, dll)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="card wp-card border-0 shadow-sm p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "20%" }}>Ahli Waris</th>
                    <th style={{ width: "18%" }}>Porsi Bagian</th>
                    <th>Syarat & Ketentuan Pembagian</th>
                    <th style={{ width: "18%" }}>Pasal KHI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTable.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong className="text-dark fs-6 d-block">{row.heir}</strong>
                        <span className="badge bg-success-subtle text-success fs-8">Dzawil Furudh</span>
                      </td>
                      <td>
                        <span className="badge bg-success fs-6 fw-bold">{row.porsi}</span>
                      </td>
                      <td className="small text-secondary leading-relaxed">
                        {row.syarat}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border font-monospace">{row.khi}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 4. KASUS KHUSUS (AUL, RADD, GHARRAWAIN) */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="font-serif fw-bold text-dark">Kasus Khusus Faraid (Ijtihad Sahabat & KHI)</h2>
            <p className="text-secondary small">
              Kaidah khusus yang otomatis diselesaikan oleh algoritma SI-WARIS ketika terjadi kondisi matematis kompleks.
            </p>
          </div>

          <div className="row g-4">
            
            <div className="col-md-4">
              <div className="card wp-card p-4 h-100 border-0 shadow-sm overflow-hidden">
                <span className="badge bg-warning text-dark font-monospace mb-2 align-self-start">KASUS AUL</span>
                <h5 className="font-serif fw-bold text-dark mb-2">Aul (Penyebut Membesar)</h5>
                <p className="small text-secondary leading-relaxed mb-0">
                  Terjadi jika total pembilang porsi pasti MELEBIHI penyebut (total harta &gt; 100%). Angka penyebut dinaikkan secara otomatis agar seluruh ahli waris menerima pengurangan proporsional secara adil.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card wp-card p-4 h-100 border-0 shadow-sm overflow-hidden">
                <span className="badge bg-info text-dark font-monospace mb-2 align-self-start">KASUS RADD</span>
                <h5 className="font-serif fw-bold text-dark mb-2">Radd (Sisa Pengembalian)</h5>
                <p className="small text-secondary leading-relaxed mb-0">
                  Terjadi jika masih ADA sisa harta setelah dibagikan tetapi TIDAK ADA ahli waris jalur Ashabah (penerima sisa). Sisa dikembalikan secara proporsional kepada Dzawil Furudh selain pasangan.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card wp-card p-4 h-100 border-0 shadow-sm overflow-hidden">
                <span className="badge bg-primary font-monospace mb-2 align-self-start">GHARRAWAIN</span>
                <h5 className="font-serif fw-bold text-dark mb-2">Gharrawain (Umar bin Khattab)</h5>
                <p className="small text-secondary leading-relaxed mb-0">
                  Terjadi jika ahli waris HANYA terdiri dari Suami/Istri, Ibu, dan Ayah. Ibu menerima 1/3 dari SISA setelah porsi pasangan diambil, agar porsi Ayah tetap 2x lipat dari porsi Ibu.
                </p>
              </div>
            </div>

          </div>

          <div className="text-center mt-5">
            <Link href="/kalkulator" className="btn btn-success btn-lg fw-bold px-5 shadow">
              <i className="bi bi-calculator-fill me-2"></i> Uji Kalkulator Faraid Sekarang
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
