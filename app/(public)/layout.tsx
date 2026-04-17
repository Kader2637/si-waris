"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Menu, X, ChevronRight, Sparkles, Instagram, Twitter, Facebook, Mail } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-white selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-500">
              <Scale size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-2xl tracking-tighter text-slate-900">E-MAWARITS</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] -mt-1 text-emerald-600">Faraid Engine</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`relative px-6 py-2.5 rounded-xl font-black text-[13px] uppercase tracking-wider transition-all duration-300 ${pathname === link.href
                    ? "text-white bg-slate-900 shadow-lg shadow-slate-900/20"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
                  }`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/admin/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-500 transition-all duration-300 shadow-xl shadow-emerald-600/20 group active:scale-95">
              Panel Admin <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-3 bg-slate-100 text-slate-900 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden fixed inset-x-0 top-[100px] mx-6 p-8 bg-white border border-slate-100 rounded-[3rem] shadow-2xl z-50 space-y-3"
            >
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`block px-8 py-5 rounded-[2rem] font-black text-sm transition-all uppercase tracking-widest ${pathname === link.href ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "text-slate-600 hover:bg-slate-50"}`}>
                  {link.label}
                </Link>
              ))}
              <hr className="my-6 border-slate-100" />
              <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                className="block px-8 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm text-center uppercase tracking-widest shadow-xl shadow-emerald-600/20">
                Dashboard Admin
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-emerald-900/50">
                  <Scale size={28} />
                </div>
                <div>
                  <span className="font-black text-3xl tracking-tighter">E-MAWARITS</span>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] -mt-1">Sistem Informasi Waris</p>
                </div>
              </Link>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10 text-lg">
                Solusi digital terpercaya untuk pengelolaan dan perhitungan waris Islam yang adil, transparan, dan akurat.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-emerald-500 mb-8">Platform</h4>
              <div className="space-y-4">
                {navLinks.map(l => (
                  <Link key={l.href} href={l.href} className="block text-slate-400 hover:text-white font-black transition-colors text-sm uppercase tracking-widest">{l.label}</Link>
                ))}
                <Link href="/admin/dashboard" className="block text-slate-400 hover:text-white font-black transition-colors text-sm uppercase tracking-widest">Dashboard</Link>
              </div>
            </div>

            <div>
              <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-emerald-500 mb-8">Referensi</h4>
              <div className="space-y-4 text-slate-400 font-black text-[11px] uppercase tracking-widest">
                <p className="hover:text-white transition-colors cursor-default">An-Nisa: 11-12, 176</p>
                <p className="hover:text-white transition-colors cursor-default">Shahih Bukhari</p>
                <p className="hover:text-white transition-colors cursor-default">Ijtihad Sahabat</p>
                <p className="hover:text-white transition-colors cursor-default">KHI Indonesia</p>
              </div>
            </div>

            <div>
              <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-emerald-500 mb-8">Teknologi</h4>
              <div className="space-y-4 text-slate-400 font-black text-[11px] uppercase tracking-widest">
                <p className="hover:text-white transition-colors cursor-default">Next.js 15</p>
                <p className="hover:text-white transition-colors cursor-default">PostgreSQL</p>
                <p className="hover:text-white transition-colors cursor-default">Prisma ORM</p>
                <p className="hover:text-white transition-colors cursor-default">Tailwind v4</p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 text-sm font-black uppercase tracking-widest">
              © {new Date().getFullYear()} E-MAWARITS — Made for Justice.
            </p>
            <div className="flex gap-10">
              <Link href="#" className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Syarat & Ketentuan</Link>
              <Link href="#" className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Kebijakan Privasi</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
