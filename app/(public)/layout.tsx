"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, ChevronDown, Calculator, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  {
    label: "Hukum",
    dropdown: [
      { href: "/syariah", label: "Hukum Islam (Dalil Syar'i)" },
      { href: "/adat-jawa", label: "Hukum Adat Jawa" },
      { href: "/perdata", label: "Hukum Perdata" }
    ]
  },
  { href: "/kalkulator", label: "Kalkulator" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      (window as any)._activeUtterance = null;
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 text-slate-900">
      
      {/* Dynamic Navbar (Flat at top, Floating Capsule on scroll) */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 w-full max-w-7xl mx-auto">
        <nav className={`w-full transition-all duration-350 backdrop-blur-xl ${scrolled
          ? "rounded-full border border-slate-200 bg-white/90 shadow-md h-16 mt-4 px-6 md:px-8"
          : "rounded-none border-b border-transparent bg-transparent h-20 px-4"}`}>
          <div className="h-full flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img src="/logo.png" alt="E-Mawarits Logo" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-black text-lg tracking-tight text-slate-900 leading-none block">E-MAWARITS</span>
                <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 -mt-0.5">Sistem Kalkulasi Waris</p>
              </div>
            </Link>

            {/* Middle Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, idx) => (
                link.dropdown ? (
                  <div key={idx} className="relative group">
                    <button className="px-4 py-2 rounded-full font-bold text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 flex items-center gap-1 transition-all">
                      {link.label} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-50">
                      {link.dropdown.map(dItem => (
                        <Link key={dItem.label} href={dItem.href} className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl transition-all">
                          {dItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href!}
                    className={`relative px-4 py-2 rounded-full font-bold text-xs transition-all duration-300 ${pathname === link.href
                      ? "text-slate-900 bg-white border border-slate-200/50 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                      }`}>
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right Buttons / Status (Inspired by strata52.com) */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/60 border border-slate-200/30 text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>Sistem Online</span>
              </div>
              <Link href="/admin/dashboard"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-950 text-white rounded-full font-bold text-xs hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md">
                Login
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 bg-slate-100/80 text-slate-650 rounded-full border border-slate-200/30 transition-all active:scale-95">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Floating Mobile Dropdown Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="lg:hidden bg-white/95 backdrop-blur-xl border border-slate-250/50 p-6 space-y-4 shadow-2xl rounded-3xl absolute top-[calc(100%+8px)] left-0 w-full overflow-hidden"
              >
                {navLinks.map((link, idx) => (
                  link.dropdown ? (
                    <div key={idx} className="space-y-1">
                      <p className="px-4 py-1 font-black text-[9px] text-slate-400 uppercase tracking-widest">{link.label}</p>
                      {link.dropdown.map(dItem => (
                        <Link key={dItem.label} href={dItem.href} onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 rounded-xl font-bold text-xs text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 pl-6 transition-colors">
                          {dItem.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link key={link.href} href={link.href!} onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3.5 rounded-xl font-bold text-xs transition-all ${pathname === link.href ? "bg-slate-950 text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}>
                      {link.label}
                    </Link>
                  )
                ))}
                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/kalkulator" onClick={() => setMobileOpen(false)}
                    className="block w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs text-center shadow-sm">
                    Mulai Kalkulasi
                  </Link>
                  <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                    className="block w-full py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-xs text-center shadow-sm">
                    Login Admin
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      <main className="flex-1">{children}</main>
      
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 z-10">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="E-Mawarits Logo" className="w-9 h-9 object-contain" />
              <div>
                <span className="font-black text-lg tracking-tight text-white leading-none block">E-MAWARITS</span>
                <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 -mt-0.5">Sistem Informasi Waris</p>
              </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed text-xs max-w-xs">
              Membantu keluarga menghitung dan mendistribusikan warisan secara adil, cepat, dan transparan sesuai dasar hukum Islam, adat, dan perdata.
            </p>
          </div>

          {/* Layanan */}
          <div className="md:col-span-2">
            <h4 className="font-extrabold text-xs text-white tracking-wider mb-5">Layanan</h4>
            <div className="space-y-3">
              <Link href="/kalkulator" className="block text-slate-500 hover:text-emerald-400 font-bold transition-colors text-xs">Kalkulator Faraid</Link>
              <span className="block text-slate-600 font-bold text-xs cursor-default">Waris Adat Jawa</span>
              <span className="block text-slate-600 font-bold text-xs cursor-default">Rujukan Perdata</span>
              <span className="block text-slate-600 font-bold text-xs cursor-default">Konsultasi Sengketa</span>
            </div>
          </div>

          {/* Rujukan */}
          <div className="md:col-span-2">
            <h4 className="font-extrabold text-xs text-white tracking-wider mb-5">Rujukan</h4>
            <div className="space-y-3">
              <Link href="/syariah" className="block text-slate-500 hover:text-emerald-400 font-bold transition-colors text-xs">Dalil Syar'i</Link>
              <Link href="/adat-jawa" className="block text-slate-500 hover:text-emerald-400 font-bold transition-colors text-xs">Tradisi Adat</Link>
              <Link href="/perdata" className="block text-slate-500 hover:text-emerald-400 font-bold transition-colors text-xs">Pasal KUHPerdata</Link>
              <span className="block text-slate-600 font-bold text-xs cursor-default">Studi Kasus</span>
            </div>
          </div>

          {/* Lembaga */}
          <div className="md:col-span-2">
            <h4 className="font-extrabold text-xs text-white tracking-wider mb-5">Lembaga</h4>
            <div className="space-y-3">
              <Link href="/tentang" className="block text-slate-500 hover:text-emerald-400 font-bold transition-colors text-xs">Tentang Kami</Link>
              <span className="block text-slate-600 font-bold text-xs cursor-default">Tim Pengembang</span>
              <span className="block text-slate-600 font-bold text-xs cursor-default">Kontak Hubung</span>
            </div>
          </div>

          {/* Contact Us */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-white tracking-wider mb-5">Hubungi Kami</h4>
            <div className="space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-400">(+62) 812-3456-7890</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold text-slate-400">Jl. Warisan Adil No. 52, Jakarta Selatan, Indonesia</span>
              </div>
            </div>
          </div>

        </div>

        {/* Big Background Outlined Word */}
        <div className="absolute bottom-[-1rem] md:bottom-[-2rem] left-1/2 -translate-x-1/2 text-[8rem] md:text-[14rem] font-black text-transparent select-none pointer-events-none opacity-[0.03] uppercase tracking-[0.05em] font-sans z-0" style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)" }}>
          WARIS
        </div>

        <div className="relative border-t border-slate-900 z-10 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
            <p className="text-slate-600">© {new Date().getFullYear()} E-MAWARITS. Hak Cipta Dilindungi.</p>
            <div className="flex gap-6 text-slate-600">
              <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
              <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
