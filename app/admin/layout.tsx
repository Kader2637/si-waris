"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="d-flex min-vh-100 bg-light">
      
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Wrapper */}
      <div className="d-flex flex-column flex-fill min-w-0 overflow-x-hidden">
        
        {/* Top SaaS Bar Header */}
        <header className="saas-topbar d-flex justify-content-between align-items-center sticky-top z-3">
          
          <div className="d-flex align-items-center gap-3">
            <button 
              type="button" 
              className="btn btn-sm text-secondary d-lg-none p-0 border-0" 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              <i className="bi bi-list fs-4"></i>
            </button>

            <h5 className="font-serif fw-bold text-dark m-0 d-none d-sm-block">
              Ikhtisar Statistik Waris
            </h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            
            <Link href="/" className="btn btn-sm btn-light border rounded-pill px-3 font-weight-bold text-dark d-none d-md-flex align-items-center gap-1.5" style={{ fontSize: "0.82rem" }}>
              <i className="bi bi-globe text-primary"></i> Website Utama
            </Link>

            <div className="position-relative cursor-pointer text-secondary">
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </div>

            <div className="d-flex align-items-center gap-2 ps-2 border-start">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: "34px", height: "34px", fontSize: "13px" }}>
                A
              </div>
              <div className="d-none d-md-block text-start leading-tight">
                <div className="fw-bold text-dark fs-8">Admin Portal</div>
                <div className="text-secondary fs-8">admin@siwaris.id</div>
              </div>
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="saas-content flex-fill">
          {children}
        </main>

      </div>

    </div>
  );
}
