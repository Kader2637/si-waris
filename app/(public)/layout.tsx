"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Menu, X, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
        ? "bg-white/95 backdrop-blur-2xl border-slate-100 shadow-sm shadow-slate-200/50 h-20"
        : "bg-transparent border-transparent h-24"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
              <Scale size={20} className="text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900">E-MAWARITS</span>
              <p className="text-[9px] font-bold uppercase tracking-widest -mt-0.5 text-emerald-600">Sistem Informasi Waris</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 relative">
            {navLinks.map((link, idx) => (
              link.dropdown ? (
                <div key={idx} className="relative group">
                  <button className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 transition-all">
                    {link.label} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-50">
                    {link.dropdown.map(dItem => (
                      <Link key={dItem.label} href={dItem.href} className="px-4 py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        {dItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.href} href={link.href!}
                  className={`relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${pathname === link.href
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}>
                  {link.label}
                  {pathname === link.href && (
                    <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              )
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

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 px-6 py-6 space-y-2 shadow-xl">
              {navLinks.map((link, idx) => (
                link.dropdown ? (
                  <div key={idx} className="space-y-1">
                    <p className="px-5 py-2 font-black text-xs text-slate-400 uppercase tracking-widest">{link.label}</p>
                    {link.dropdown.map(dItem => (
                      <Link key={dItem.label} href={dItem.href} onClick={() => setMobileOpen(false)}
                        className="block px-5 py-4 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 pl-8">
                        {dItem.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href!} onClick={() => setMobileOpen(false)}
                    className={`block px-5 py-4 rounded-2xl font-bold text-sm transition-all ${pathname === link.href ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                    {link.label}
                  </Link>
                )
              ))}
              <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                className="block mt-4 px-5 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm text-center">
                Panel Admin →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">{children}</main>
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
                <span className="font-black text-2xl tracking-tight">E-MAWARITS</span>
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest -mt-0.5">Sistem Informasi Waris Multi-Hukum</p>
              </div>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              Solusi digital terpadu untuk kalkulasi waris yang mendukung Syariat Islam, Adat Jawa, dan Hukum Perdata Nasional — memberikan keadilan yang akurat, transparan, dan terpercaya.
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
              {navLinks.map((l, idx) => (
                l.dropdown ? (
                  <div key={`group-${idx}`} className="space-y-3 pt-2">
                    {l.dropdown.map((sub, i) => (
                      <Link key={`sub-${i}`} href={sub.href} className="block text-slate-400 hover:text-emerald-400 font-medium transition-colors text-sm">{sub.label}</Link>
                    ))}
                  </div>
                ) : (
                  <Link key={`link-${idx}`} href={l.href!} className="block text-slate-400 hover:text-emerald-400 font-medium transition-colors text-sm">{l.label}</Link>
                )
              ))}
              <Link href="/admin/dashboard" className="block text-slate-400 hover:text-emerald-400 font-medium transition-colors text-sm">Panel Admin</Link>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-6">Referensi Hukum</h4>
            <div className="space-y-3 text-slate-400 font-medium text-sm">
              <p>• An-Nisa: 11-12, 176</p>
              <p>• Hadist Shahih Bukhari</p>
              <p>• Kompilasi Hukum Islam (KHI)</p>
              <p>• Hukum Adat Jawa Sepikul Segendongan</p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} E-MAWARITS — Dibangun untuk keadilan distribusi waris Islam & Adat.</p>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Faraid • KHI • Adat Jawa</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
