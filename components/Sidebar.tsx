"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard Overview", icon: "bi-grid-1x2" },
  { href: "/admin/keluarga", label: "Data Keluarga", icon: "bi-people" },
  { href: "/admin/arsip", label: "Arsip Digital", icon: "bi-folder" },
  { href: "/admin/laporan", label: "Laporan & Rekap", icon: "bi-file-bar-graph" },
  { href: "/admin/kalkulator", label: "Kalkulator Cepat", icon: "bi-calculator" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-4 d-lg-none"
          onClick={onCloseMobile}
        ></div>
      )}

      <aside className={`saas-sidebar d-flex flex-column shrink-0 ${mobileOpen ? "d-flex position-fixed top-0 start-0 z-5 h-100 shadow-lg" : "d-none d-lg-flex"}`}>
        
        {/* Top SaaS Brand Header (Indigo Icon + SI-WARIS Text) */}
        <div className="p-4 d-flex align-items-center justify-content-between">
          <Link href="/admin/dashboard" className="d-flex align-items-center gap-3 text-decoration-none">
            <div className="saas-brand-icon">
              <i className="bi bi-diagram-3-fill"></i>
            </div>
            <div>
              <div className="fw-bold text-dark font-serif tracking-wider fs-5 leading-none">SI-WARIS</div>
              <div className="text-secondary fs-8 font-monospace">Admin Portal</div>
            </div>
          </Link>

          {onCloseMobile && (
            <button className="btn btn-sm text-secondary d-lg-none p-0 border-0" onClick={onCloseMobile}>
              <i className="bi bi-x-lg fs-5"></i>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="py-2 flex-fill overflow-y-auto px-3">
          <div className="px-3 pb-2 text-muted fs-8 font-monospace text-uppercase tracking-wider">
            Menu Utama
          </div>

          <nav className="nav flex-column gap-1">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom SaaS Promo Widget Pill */}
        <div className="p-3 mt-auto">
          <div className="bg-light p-3 rounded-4 border text-center">
            <div className="bg-indigo-subtle text-indigo rounded-circle p-2.5 mx-auto mb-2 d-inline-flex">
              <i className="bi bi-shield-check fs-4 text-primary"></i>
            </div>
            <div className="fw-bold text-dark fs-8 mb-1">Portal Waris Multi-Hukum</div>
            <div className="text-secondary fs-8 mb-3">Islam, Adat & Perdata</div>
            <Link href="/" className="btn btn-sm btn-primary w-100 fw-bold rounded-pill" style={{ fontSize: "0.78rem" }}>
              Buka Portal Publik
            </Link>
          </div>
        </div>

      </aside>
    </>
  );
}
