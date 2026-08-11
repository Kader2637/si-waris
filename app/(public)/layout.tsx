"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Scale,
  Menu,
  X,
  Calculator,
  LogIn,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  Wrench,
  ShieldAlert,
  RefreshCw,
  Clock,
  Server,
} from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || document.documentElement.classList.contains("dark")) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const checkMaint = () => {
      const savedMaint = localStorage.getItem("setting_maintenanceMode");
      setIsMaintenance(savedMaint === "true");
    };

    checkMaint();
    window.addEventListener("storage", checkMaint);
    return () => window.removeEventListener("storage", checkMaint);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // MAINTENANCE MODE VIEW
  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-slate-100 font-sans antialiased flex flex-col justify-between hero-aurora">
        
        {/* TOP BAR IN MAINTENANCE MODE */}
        <header className="no-print fixed top-0 inset-x-0 z-50 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/65 dark:bg-[#151c2c]/70 backdrop-blur-xl shadow-2xs">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="shrink-0 flex items-center gap-2.5 no-underline">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0b6245] text-white shadow-2xs">
                <Scale className="size-4.5" />
              </span>
              <span className="leading-none">
                <span className="block text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans whitespace-nowrap">
                  E-<span className="text-[#ca9a28]">MAWARIST</span>
                </span>
                <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-[#64748b] font-mono whitespace-nowrap">
                  SYSTEM MAINTENANCE
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="grid size-8 place-items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-400 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-slate-500" />}
              </button>

              <Link
                href="/admin/dashboard"
                className="inline-flex h-8 whitespace-nowrap items-center justify-center gap-1.5 rounded-md border border-slate-200/90 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors no-underline backdrop-blur-sm"
              >
                <LogIn className="size-3.5 text-slate-500 dark:text-slate-400" /> Portal Admin
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN MAINTENANCE CARD CONTAINER */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-24 pb-12">
          <div className="w-full max-w-2xl text-center space-y-6">
            
            {/* Maintenance Hero Glass Card */}
            <div className="glass rounded-3xl p-8 sm:p-12 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden">
              
              {/* Top Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 shadow-2xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                </span>
                PEMELIHARAAN SISTEM BERLANGSUNG
              </div>

              {/* Icon Badge */}
              <div className="mx-auto size-20 rounded-3xl bg-gradient-to-tr from-[#0b6245]/20 to-[#ca9a28]/20 dark:from-[#0b6245]/40 dark:to-[#ca9a28]/40 border border-[#0b6245]/30 flex items-center justify-center shadow-lg">
                <Wrench className="size-10 text-[#0b6245] dark:text-emerald-400 animate-bounce" />
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Situs Web Sedang Dalam Pemeliharaan
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed font-normal">
                  Kami sedang melakukan peningkatan performa dan pembaruan rutin pada platform <strong className="text-[#0b6245] dark:text-emerald-400">E-MAWARIST</strong> untuk kenyamanan & ketepatan simulasi waris Anda.
                </p>
              </div>

              {/* Status Metrics Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-800/60 text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">STATUS SERVER</div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1.5">
                    <Server className="size-3.5" /> Maintenance Mode
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-800/60 text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">ESTIMASI SELESAI</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[#ca9a28]" /> Segera Membaik
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-800/60 text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">KEAMANAN DATA</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5" /> Aman 100%
                  </div>
                </div>
              </div>

              {/* Actions Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-bold rounded-full shadow-lg transition-all cursor-pointer"
                >
                  <RefreshCw className="size-4" /> Coba Muat Ulang Halaman
                </button>
                
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-full shadow-sm hover:bg-slate-50 transition-all no-underline"
                >
                  <LogIn className="size-4 text-slate-500" /> Masuk Portal Admin
                </Link>
              </div>

            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              &copy; {new Date().getFullYear()} E-MAWARIST Platform Waris Terpadu. Seluruh hak cipta dilindungi.
            </p>

          </div>
        </main>

      </div>
    );
  }

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/syariah", label: "Syariah" },
    { href: "/perdata", label: "Perdata" },
    { href: "/adat-jawa", label: "Adat Jawa" },
    { href: "/kalkulator", label: "Kalkulator Terpadu" },
    { href: "/tentang", label: "Tentang Kami" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-slate-100 font-sans antialiased">
      
      {/* PUBLIC NAVBAR TRANSLUCENT GLASS (AGAK TRANSPARAN DENGAN BACKDROP BLUR) */}
      <header className="no-print fixed top-0 inset-x-0 z-50 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/65 dark:bg-[#151c2c]/70 backdrop-blur-xl shadow-2xs transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          
          {/* Logo Badge & Brand Name */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5 no-underline">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0b6245] text-white shadow-2xs">
              <Scale className="size-4.5" />
            </span>
            <span className="leading-none">
              <span className="block text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans whitespace-nowrap">
                E-<span className="text-[#ca9a28]">MAWARIST</span>
              </span>
              <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-[#64748b] font-mono whitespace-nowrap">
                KALKULATOR WARIS
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all no-underline ${
                    isActive
                      ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-[#34d399] font-bold shadow-2xs ring-1 ring-[#0b6245]/20 dark:ring-[#34d399]/30"
                      : "text-[#64748b] dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="grid size-8 place-items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-400 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-slate-500" />}
            </button>

            <Link
              href="/admin/dashboard"
              className="hidden md:inline-flex h-8 whitespace-nowrap items-center justify-center gap-1.5 rounded-md border border-slate-200/90 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors no-underline backdrop-blur-sm"
            >
              <LogIn className="size-3.5 text-slate-500 dark:text-slate-400" /> Login Admin
            </Link>

            <Link
              href="/kalkulator"
              className="hidden sm:inline-flex h-8 whitespace-nowrap items-center justify-center gap-1.5 rounded-full bg-[#0b6245] px-3.5 text-xs font-medium text-white shadow-md hover:bg-[#084b34] transition-colors no-underline"
            >
              <Calculator className="size-3.5 text-white" /> Mulai Simulasi Waris
            </Link>

            {/* Mobile Drawer Button */}
            <button
              className="lg:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Buka menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#151c2c] px-4 py-4 space-y-3 backdrop-blur-md">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline ${
                      isActive
                        ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-[#34d399] font-bold border-l-4 border-[#0b6245] dark:border-[#34d399]"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/kalkulator"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#0b6245] text-white text-xs font-medium no-underline"
              >
                <Calculator className="size-3.5" /> Mulai Simulasi Waris
              </Link>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-xs font-medium no-underline"
              >
                <LogIn className="size-3.5" /> Login Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Body with top padding for fixed header */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* FOOTER WIDGET */}
      <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151c2c]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          
          <div>
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0b6245] text-white shadow-2xs">
                <Scale className="size-5" />
              </span>
              <span className="leading-none">
                <span className="block text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                  E-<span className="text-[#ca9a28]">MAWARIST</span>
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#64748b] font-mono">
                  KALKULATOR WARIS
                </span>
              </span>
            </Link>
            
            <p className="max-w-sm text-xs leading-relaxed text-[#64748b] dark:text-slate-400 font-normal">
              E-MAWARIST adalah sistem informasi dan kalkulator pembagian waris yang membantu masyarakat
              memahami hak waris berdasarkan Hukum Syariah (Faraidh), KUHPerdata, dan Hukum Adat Jawa secara
              transparan dan mudah dipahami.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 font-mono">Navigasi Utama</h3>
            <ul className="mt-4 space-y-2 text-xs text-[#64748b] dark:text-slate-400 font-normal">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#0b6245] transition-colors no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 font-mono">Kontak & Alamat</h3>
            <ul className="mt-4 space-y-3 text-xs text-[#64748b] dark:text-slate-400 font-normal">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#0b6245]" /> halo@e-mawarist.id
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#0b6245]" /> (021) 5555-1945
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#0b6245]" /> Jl. Kebon Sirih No. 17, Jakarta Pusat
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[11px] text-[#64748b] dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 font-normal">
            <p>&copy; {new Date().getFullYear()} E-MAWARIST. Seluruh hak cipta dilindungi.</p>
            <p>
              Hasil perhitungan bersifat simulasi edukatif — untuk kepastian hukum konsultasikan dengan
              ahli faraidh atau notaris.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
