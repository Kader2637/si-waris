"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 35) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHukumSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(val);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light overflow-x-hidden">
      
      {/* Topbar Syariat Announcement (Scrolls away naturally) */}
      <div className="wp-topbar py-2 px-3">
        <div className="container d-flex align-items-center justify-content-between gap-3 text-nowrap">
          
          {/* Left Badge */}
          <div className="d-flex align-items-center gap-2 shrink-0 text-nowrap">
            <span className="wp-ticker-label text-nowrap">
              <i className="bi bi-moon-stars-fill me-1 text-warning"></i> PORTAL SYARIAT
            </span>
          </div>

          {/* Middle Quote Text */}
          <div className="wp-ticker-container flex-fill mx-2 text-nowrap">
            <div className="wp-ticker-track text-light small text-nowrap">
              <i className="bi bi-quote text-warning me-1"></i> 
              Surah An-Nisa: 11 — <em>"Allah mensyariatkan bagimu tentang (pembagian pusaka untuk) anak-anakmu..."</em>
            </div>
          </div>

          {/* Right Date & Admin Panel */}
          <div className="d-none d-lg-flex align-items-center gap-3 small shrink-0 text-nowrap">
            <span className="text-light text-nowrap"><i className="bi bi-calendar-check me-1 text-warning"></i> 20 Muharram 1448 H</span>
            <span className="text-secondary opacity-50">|</span>
            <Link href="/admin/dashboard" className="btn btn-sm btn-outline-warning py-1 px-2.5 fs-8 fw-bold text-nowrap">
              <i className="bi bi-speedometer2 me-1"></i> Portal Admin
            </Link>
          </div>

        </div>
      </div>

      {/* MAIN NAVBAR MENU (FIXED TOP WHEN SCROLLED) */}
      <nav className={`navbar navbar-expand-lg wp-navbar transition-all ${isFixed ? "position-fixed top-0 start-0 w-100 shadow-md z-3" : ""}`}>
        <div className="container">
          
          {/* Clean Text Brand Logo */}
          <Link href="/" className="navbar-brand py-0">
            <div className="wp-brand-title">SI-WARIS</div>
            <div className="wp-brand-tagline d-none d-lg-block">
              Sistem Informasi Waris Multi-Hukum
            </div>
          </Link>

          {/* Toggler Mobile */}
          <button 
            className="navbar-toggler border-0 shadow-none p-1" 
            type="button" 
            onClick={() => setNavbarOpen(!navbarOpen)}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-3 text-dark"></i>
          </button>

          {/* Navigation Links & Mobile Drawer */}
          <div className={`collapse navbar-collapse ${navbarOpen ? "show py-3" : ""}`}>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
              
              {/* Beranda */}
              <li className="nav-item">
                <Link href="/" className={`nav-link wp-nav-link ${pathname === "/" ? "active" : ""}`} onClick={() => setNavbarOpen(false)}>
                  <i className="bi bi-house-door-fill me-1"></i> Beranda
                </Link>
              </li>

              {/* CLEAN MINIMAL DROPDOWN HUKUM */}
              <li 
                className="nav-item dropdown position-relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button 
                  type="button"
                  className={`nav-link wp-nav-link dropdown-toggle border-0 bg-transparent ${["/syariah", "/adat-jawa", "/perdata"].includes(pathname) ? "active" : ""}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <i className="bi bi-balance-scale me-1"></i> Rujukan Hukum
                </button>

                {dropdownOpen && (
                  <div className="position-absolute top-100 start-0 pt-1 z-3">
                    <ul className="dropdown-menu show shadow border-0 rounded-3 p-1.5 m-0" style={{ minWidth: "220px" }}>
                      <li>
                        <Link 
                          href="/syariah" 
                          onClick={() => { setDropdownOpen(false); setNavbarOpen(false); }}
                          className={`dropdown-item rounded-2 py-2 fw-bold small ${pathname === "/syariah" ? "bg-success text-white" : "text-dark"}`}
                        >
                          <i className="bi bi-moon-stars me-2 text-success"></i> Hukum Islam (Faraid)
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/adat-jawa" 
                          onClick={() => { setDropdownOpen(false); setNavbarOpen(false); }}
                          className={`dropdown-item rounded-2 py-2 fw-bold small ${pathname === "/adat-jawa" ? "bg-warning text-dark" : "text-dark"}`}
                        >
                          <i className="bi bi-bank me-2 text-warning"></i> Hukum Adat Jawa
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/perdata" 
                          onClick={() => { setDropdownOpen(false); setNavbarOpen(false); }}
                          className={`dropdown-item rounded-2 py-2 fw-bold small ${pathname === "/perdata" ? "bg-primary text-white" : "text-dark"}`}
                        >
                          <i className="bi bi-book-half me-2 text-primary"></i> Hukum Perdata (BW)
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              {/* Quick Select Option Fallback for mobile */}
              <li className="nav-item d-lg-none my-2">
                <select 
                  className="form-select form-select-sm fw-bold border-success text-success" 
                  onChange={handleHukumSelect}
                  value={["/syariah", "/adat-jawa", "/perdata"].includes(pathname) ? pathname : ""}
                >
                  <option value="">-- Pilih Rujukan Hukum --</option>
                  <option value="/syariah">Hukum Islam (Faraid KHI)</option>
                  <option value="/adat-jawa">Hukum Adat Jawa</option>
                  <option value="/perdata">Hukum Perdata (BW)</option>
                </select>
              </li>

              {/* Kalkulator */}
              <li className="nav-item">
                <Link href="/kalkulator" className={`nav-link wp-nav-link ${pathname === "/kalkulator" ? "active" : ""}`} onClick={() => setNavbarOpen(false)}>
                  <i className="bi bi-calculator-fill me-1"></i> Kalkulator Faraid
                </Link>
              </li>

              {/* Tentang */}
              <li className="nav-item">
                <Link href="/tentang" className={`nav-link wp-nav-link ${pathname === "/tentang" ? "active" : ""}`} onClick={() => setNavbarOpen(false)}>
                  <i className="bi bi-info-circle-fill me-1"></i> Tentang Kami
                </Link>
              </li>

            </ul>

            {/* Header Right Action CTA + Mobile Admin Login Button */}
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 mt-3 mt-lg-0">
              
              {/* Mobile Only: Admin Login Button */}
              <Link 
                href="/admin/dashboard" 
                className="btn btn-outline-dark fw-bold px-3 py-1.5 d-lg-none text-center"
                onClick={() => setNavbarOpen(false)}
              >
                <i className="bi bi-speedometer2 me-1"></i> Masuk Admin Portal
              </Link>

              {/* Hitung Waris Button */}
              <Link 
                href="/kalkulator" 
                className="btn btn-success fw-bold px-3 py-1.5 shadow-sm d-flex align-items-center justify-content-center gap-1.5" 
                onClick={() => setNavbarOpen(false)}
                title="Hitung Waris"
              >
                <i className="bi bi-calculator-fill fs-6"></i>
                <span className="d-none d-sm-inline">Hitung Waris</span>
              </Link>
            </div>

          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-fill">
        {children}
      </main>

      {/* Multi-Column Footer Widget */}
      <footer className="wp-footer pt-5 pb-3 mt-auto">
        <div className="container">
          <div className="row g-4 mb-4">
            
            {/* Widget 1: Portal Description */}
            <div className="col-lg-4 col-md-6">
              <h5 className="m-0 text-white font-serif mb-3">SI-WARIS PORTAL</h5>
              <p className="small text-secondary leading-relaxed mb-3">
                Portal Informasi & Sistem Kalkulasi Waris Terpadu Nasional berdasarkan 3 Landasan Hukum: Hukum Islam (Faraid KHI), Hukum Adat Jawa (Sepikul Segendongan), dan Hukum Perdata Nasional (BW).
              </p>
              <div className="d-flex gap-2">
                <span className="badge bg-success"><i className="bi bi-shield-check me-1"></i> KHI Syariat Resmi</span>
                <span className="badge bg-warning text-dark"><i className="bi bi-bank me-1"></i> Adat & Perdata</span>
              </div>
            </div>

            {/* Widget 2: Navigasi Portal */}
            <div className="col-lg-2 col-md-6">
              <h5 className="mb-3">Navigasi</h5>
              <ul className="list-unstyled small space-y-2">
                <li className="mb-2"><Link href="/"><i className="bi bi-chevron-right me-1 text-warning"></i> Beranda Utama</Link></li>
                <li className="mb-2"><Link href="/kalkulator"><i className="bi bi-chevron-right me-1 text-warning"></i> Kalkulator Faraid</Link></li>
                <li className="mb-2"><Link href="/syariah"><i className="bi bi-chevron-right me-1 text-warning"></i> Panduan Syariat</Link></li>
                <li className="mb-2"><Link href="/adat-jawa"><i className="bi bi-chevron-right me-1 text-warning"></i> Hukum Adat Jawa</Link></li>
                <li className="mb-2"><Link href="/perdata"><i className="bi bi-chevron-right me-1 text-warning"></i> Hukum Perdata</Link></li>
              </ul>
            </div>

            {/* Widget 3: Landasan Hukum */}
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-3">Landasan Syariat</h5>
              <ul className="list-unstyled small">
                <li className="mb-2 text-secondary"><i className="bi bi-book-half me-1 text-success"></i> QS. An-Nisa Ayat 11, 12, 176</li>
                <li className="mb-2 text-secondary"><i className="bi bi-journal-bookmark me-1 text-success"></i> Kompilasi Hukum Islam (KHI)</li>
                <li className="mb-2 text-secondary"><i className="bi bi-award me-1 text-success"></i> Hadits Bukhari & Muslim Faraid</li>
                <li className="mb-2 text-secondary"><i className="bi bi-balance-scale me-1 text-success"></i> Yurisprudensi Mahkamah Agung</li>
              </ul>
            </div>

            {/* Widget 4: Portal Pengelola */}
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-3">Portal Pengelola</h5>
              <p className="small text-secondary mb-3">
                Akses dashboard administrator untuk mengelola data keluarga, kasus sengketa, dan laporan faraid.
              </p>
              <Link href="/admin/dashboard" className="btn btn-warning text-dark btn-sm w-100 font-weight-bold">
                <i className="bi bi-speedometer2 me-1"></i> Masuk Admin Panel
              </Link>
            </div>

          </div>

          <hr className="border-secondary opacity-25" />

          <div className="d-flex flex-wrap justify-content-between align-items-center small text-secondary py-2">
            <div>
              © {new Date().getFullYear()} <strong>SI-WARIS</strong> — Portal Syariat & Kalkulator Waris Multi-Hukum Indonesia.
            </div>
            <div className="d-flex gap-3">
              <Link href="/tentang" className="text-secondary text-decoration-none">Tentang Kami</Link>
              <Link href="/syariah" className="text-secondary text-decoration-none">Dalil Syariat</Link>
              <Link href="/admin/dashboard" className="text-secondary text-decoration-none">Admin Panel</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
