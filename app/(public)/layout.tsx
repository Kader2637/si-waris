"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/syariah", label: "Dalil Syar'i" },
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-2xl border-b ${scrolled ? "border-slate-100 shadow-sm shadow-slate-200/50" : "border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
              <Scale size={20} className="text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900">SI-WARIS</span>
              <p className="text-[9px] font-bold uppercase tracking-widest -mt-0.5 text-emerald-600">Sistem Informasi Waris</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  pathname === link.href
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}>
                {link.label}
                {pathname === link.href && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/kalkulator"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-50">
              <Sparkles size={14} /> Kalkulator Gratis
            </Link>
            <Link href="/admin/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all duration-300 shadow-lg group">
              Panel Admin <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all active:scale-95">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 px-6 py-6 space-y-2 shadow-xl">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`block px-5 py-4 rounded-2xl font-bold text-sm transition-all ${pathname === link.href ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                  {link.label}
                </Link>
              ))}
              <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                className="block mt-4 px-5 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm text-center">
                Panel Admin →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 10% 50%, rgba(5,150,105,0.15) 0%, transparent 50%)" }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
                <Scale size={22} />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight">SI-WARIS</span>
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest -mt-0.5">Sistem Informasi Waris Islam</p>
              </div>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              Sistem kalkulasi dan administrasi waris Islam berstandar syariah — akurat, transparan, dan mudah digunakan.
            </p>
            <div className="flex gap-4 mt-8">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-400">Next.js 15</div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-400">PostgreSQL</div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-400">Prisma ORM</div>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-6">Menu</h4>
            <div className="space-y-3">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="block text-slate-400 hover:text-emerald-400 font-medium transition-colors text-sm">{l.label}</Link>
              ))}
              <Link href="/admin/dashboard" className="block text-slate-400 hover:text-emerald-400 font-medium transition-colors text-sm">Panel Admin</Link>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-6">Referensi Syariat</h4>
            <div className="space-y-3 text-slate-400 font-medium text-sm">
              <p>• An-Nisa: 11-12, 176</p>
              <p>• Hadist Shahih Bukhari</p>
              <p>• Ijtihad Umar & Ali ra.</p>
              <p>• KHI Indonesia</p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} SI-WARIS — Dibangun untuk keadilan distribusi waris Islam.</p>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Berstandar Faraid • KHI • Al-Qur'an</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
