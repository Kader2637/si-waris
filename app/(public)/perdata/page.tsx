"use client";

import Link from "next/link";
import { useState } from "react";

const GOLONGAN_LIST = [
  {
    id: "gol1",
    golongan: "GOLONGAN I",
    title: "Suami / Istri & Anak-Anak Keturunan Direct",
    badge: "Prioritas Utama",
    desc: "Suami atau istri yang hidup terlama beserta anak-anak dan keturunan mereka. Semua anggota dalam Golongan I membagi harta waris dalam jumlah porsi bagian SAMA RATA tanpa membedakan gender anak laki-laki atau perempuan.",
    pasal: "KUHPerdata Pasal 852",
    bg: "border-primary",
    icon: "bi-people-fill"
  },
  {
    id: "gol2",
    golongan: "GOLONGAN II",
    title: "Orang Tua & Saudara Kandung (Jika Tanpa Anak)",
    badge: "Golongan Kedua",
    desc: "Jika jenazah tidak memiliki suami/istri dan keturunan, harta waris jatuh kepada orang tua (Ayah & Ibu) serta saudara-saudara kandung almarhum beserta keturunannya.",
    pasal: "KUHPerdata Pasal 854",
    bg: "border-info",
    icon: "bi-person-hearts"
  },
  {
    id: "gol3",
    golongan: "GOLONGAN III",
    title: "Kakek, Nenek, & Leluhur Garis Lurus Ke Atas",
    badge: "Golongan Ketiga",
    desc: "Jika tidak ada keturunan, suami/istri, maupun saudara kandung, maka warisan dibagi 2 setengah bagian (kloefing) untuk garis keturunan Ayah dan garis keturunan Ibu ke atas (Kakek/Nenek).",
    pasal: "KUHPerdata Pasal 853",
    bg: "border-warning",
    icon: "bi-bank"
  },
  {
    id: "gol4",
    golongan: "GOLONGAN IV",
    title: "Paman, Bibi, & Kerabat Sampingan (s.d Derajat Ke-6)",
    badge: "Golongan Terakhir",
    desc: "Kerabat menyamping sampai derajat ke-6 (Paman, Bibi, Sepupu). Jika seluruh Golongan I, II, III tidak ada, Golongan IV berhak menerima warisan.",
    pasal: "KUHPerdata Pasal 861",
    bg: "border-secondary",
    icon: "bi-diagram-3-fill"
  }
];

export default function PerdataPage() {
  const [activeTab, setActiveTab] = useState("gol1");

  const currentGol = GOLONGAN_LIST.find(g => g.id === activeTab) || GOLONGAN_LIST[0];

  return (
    <div className="pb-5">
      
      {/* 1. ELEGANT HERO HEADER */}
      <section className="wp-hero-banner py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge bg-primary text-white font-monospace px-3 py-2 mb-3 shadow-sm">
                <i className="bi bi-balance-scale me-1"></i> RUJUKAN HUKUM PERDATA NASIONAL
              </span>
              <h1 className="display-4 font-serif fw-bold text-white mb-3">
                Hukum Perdata Waris (BW / Kitab Undang-Undang Hukum Perdata)
              </h1>
              <p className="lead text-light opacity-90 mb-4 leading-relaxed">
                Panduan pembagian waris berdasarkan Kitab Undang-Undang Hukum Perdata Barat (Burgelijk Wetboek) yang mengelompokkan kedudukan ahli waris ke dalam <strong>4 Golongan Derajat Kerabat</strong> tanpa pembedaan gender.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/kalkulator" className="btn btn-primary btn-lg fw-bold px-4 shadow">
                  <i className="bi bi-calculator-fill me-2"></i> Hitung Perdata (BW)
                </Link>
                <a href="#visualizer-golongan" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-diagram-3 me-2"></i> Visualisasi 4 Golongan
                </a>
              </div>
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="card wp-card p-4 bg-white text-dark shadow-lg border-0">
                <div className="display-3 text-primary mb-2"><i className="bi bi-balance-scale"></i></div>
                <h5 className="font-serif fw-bold text-dark mb-2">Asas Persamaan Hak</h5>
                <p className="small text-secondary m-0">
                  "KUHPerdata Pasal 852 menjamin bagian yang sama antara anak laki-laki dan perempuan tanpa pembedaan gender."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUALIZER 4 GOLONGAN WARIS */}
      <section className="py-5 bg-white" id="visualizer-golongan">
        <div className="container py-3">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge bg-primary px-3 py-2 mb-2 uppercase">Hirarki Kedudukan</span>
            <h2 className="font-serif fw-bold text-dark">Visualisasi 4 Golongan Ahli Waris KUHPerdata</h2>
            <p className="text-secondary small">
              Klik tiap tab golongan di bawah ini untuk mempelajari urutan prioritas penerima warisan.
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="d-flex justify-content-center mb-4">
            <div className="nav nav-pills gap-2 bg-light p-2 rounded-3 border" role="tablist">
              {GOLONGAN_LIST.map(g => (
                <button
                  key={g.id}
                  className={`nav-link fw-bold px-3 py-2 ${activeTab === g.id ? "active bg-primary shadow-sm" : "text-dark"}`}
                  onClick={() => setActiveTab(g.id)}
                >
                  {g.golongan}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content Card */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`card wp-card p-4 p-lg-5 border-top border-5 ${currentGol.bg} shadow-sm`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-primary font-monospace fs-7">{currentGol.badge}</span>
                  <span className="badge bg-light text-dark border font-monospace">{currentGol.pasal}</span>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary text-white rounded p-3">
                    <i className={`bi ${currentGol.icon} fs-2`}></i>
                  </div>
                  <div>
                    <span className="text-primary fw-bold small uppercase">{currentGol.golongan}</span>
                    <h3 className="font-serif fw-bold text-dark m-0">{currentGol.title}</h3>
                  </div>
                </div>

                <p className="lead fs-6 text-secondary leading-relaxed mb-4">
                  {currentGol.desc}
                </p>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="small text-muted"><i className="bi bi-info-circle me-1"></i> Golongan sebelumnya menutup keberadaan golongan di bawahnya.</span>
                  <Link href="/kalkulator" className="btn btn-primary btn-sm fw-bold">
                    Hitung Kasus Perdata <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. LEGITIME PORTIE (HAK MUTLAK PERDATA) */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge bg-danger font-monospace px-3 py-2 mb-2">PASAL 913 KUHPERDATA</span>
              <h2 className="font-serif fw-bold text-dark mb-3">Legitime Portie (Bagian Hak Mutlak)</h2>
              <p className="small text-secondary leading-relaxed mb-3">
                <strong>Legitime Portie</strong> adalah bagian dari harta peninggalan yang harus diberikan kepada para ahli waris dalam garis lurus menurut undang-undang, yang terhadapnya almarhum tidak berhak menetapkan sesuatu (baik secara hibah maupun wasiat).
              </p>
              <ul className="small text-secondary space-y-2 mb-4">
                <li><i className="bi bi-check-circle-fill text-primary me-2"></i> 1 Anak Legitimasi: 1/2 dari porsi menurut undang-undang.</li>
                <li><i className="bi bi-check-circle-fill text-primary me-2"></i> 2 Anak Legitimasi: 2/3 dari porsi menurut undang-undang.</li>
                <li><i className="bi bi-check-circle-fill text-primary me-2"></i> 3+ Anak Legitimasi: 3/4 dari porsi menurut undang-undang.</li>
              </ul>
              <Link href="/kalkulator" className="btn btn-primary fw-bold px-4">
                Simulasi Legitime Portie <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="card wp-card p-4 bg-dark text-white border-0 shadow">
                <h5 className="font-serif fw-bold text-warning mb-3">
                  <i className="bi bi-shield-lock-fill me-2"></i> Perlindungan Hukum Ahli Waris
                </h5>
                <p className="small text-secondary mb-3">
                  Dengan aturan Legitime Portie, pewaris TIDAK BISA menghabiskan seluruh harta warisan untuk hibah/wasiat pihak luar dan mengabaikan hak anak-anak kandungnya.
                </p>
                <div className="p-3 bg-white bg-opacity-10 rounded border border-white border-opacity-10 text-warning small">
                  "Wasiat yang melanggar batas Legitime Portie dapat dibatalkan demi hukum (Inkorting)."
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
