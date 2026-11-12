"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { applyTheme, useIsDark } from "@/lib/theme";
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
  ChevronDown,
  BookOpen,
  Building2,
} from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = useIsDark();
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Dropdown combobox states & refs
  const [hukumOpen, setHukumOpen] = useState(false);
  const [simulasiOpen, setSimulasiOpen] = useState(false);
  const hukumRef = useRef<HTMLDivElement>(null);
  const simulasiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hukumRef.current && !hukumRef.current.contains(event.target as Node)) {
        setHukumOpen(false);
      }
      if (simulasiRef.current && !simulasiRef.current.contains(event.target as Node)) {
        setSimulasiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkMaint = () => {
      const savedMaint = localStorage.getItem("setting_maintenanceMode");
      setIsMaintenance(savedMaint === "true");
    };

    checkMaint();
    window.addEventListener("storage", checkMaint);
    return () => {
      window.removeEventListener("storage", checkMaint);
    };
  }, []);

  const toggleDarkMode = () => {
    applyTheme(!isDark);
  };

  const isHukumActive = ["/syariah", "/perdata", "/adat-jawa"].includes(pathname);
  const isSimulasiActive = ["/konversi-harta", "/kalkulator"].includes(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-slate-100 font-sans antialiased">
      
      {/* PUBLIC NAVBAR TRANSLUCENT GLASS */}
      <header className="no-print fixed top-0 inset-x-0 z-50 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-[#0f1624]/85 backdrop-blur-xl shadow-xs transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left Brand / Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5 no-underline group">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#0b6245] text-white shadow-2xs group-hover:scale-105 transition-transform">
              <Scale className="size-4.5" />
            </span>
            <span className="leading-none">
              <span className="block text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans whitespace-nowrap">
                E-<span className="text-[#ca9a28]">MAWARIST</span>
              </span>
              <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-[#64748b] dark:text-slate-400 font-mono whitespace-nowrap">
                PERHITUNGAN WARIS
              </span>
            </span>
          </Link>

          {/* Center Desktop Navigation Links & Dropdowns */}
          <nav className="hidden lg:flex items-center gap-6">
            
            {/* 1. BERANDA */}
            <Link
              href="/"
              className={`text-sm font-medium transition-colors no-underline ${
                pathname === "/"
                  ? "text-[#0b6245] dark:text-[#34d399] font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Beranda
            </Link>

            {/* 2. COMBOBOX DROPDOWN: SISTEM HUKUM */}
            <div
              className="relative py-2"
              ref={hukumRef}
              onMouseEnter={() => {
                setHukumOpen(true);
                setSimulasiOpen(false);
              }}
              onMouseLeave={() => setHukumOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setHukumOpen(!hukumOpen);
                  setSimulasiOpen(false);
                }}
                className={`inline-flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer ${
                  isHukumActive
                    ? "text-[#0b6245] dark:text-[#34d399] font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Sistem Hukum</span>
                <ChevronDown className={`size-4 transition-transform duration-200 ${hukumOpen ? "rotate-180 text-[#0b6245]" : "opacity-60"}`} />
              </button>

              {hukumOpen && (
                <div className="absolute top-full left-0 mt-0 w-56 rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200/90 dark:border-slate-800 p-2 shadow-xl backdrop-blur-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/syariah"
                    onClick={() => setHukumOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold no-underline transition-colors ${
                      pathname === "/syariah"
                        ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-emerald-400 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>Hukum Syariah (Faraidh)</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono">Islam</span>
                  </Link>

                  <Link
                    href="/perdata"
                    onClick={() => setHukumOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold no-underline transition-colors ${
                      pathname === "/perdata"
                        ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-emerald-400 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>Hukum Perdata (BW)</span>
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-mono">KUHPd</span>
                  </Link>

                  <Link
                    href="/adat-jawa"
                    onClick={() => setHukumOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold no-underline transition-colors ${
                      pathname === "/adat-jawa"
                        ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-emerald-400 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>Hukum Adat Jawa</span>
                    <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono">Tradisi</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. COMBOBOX DROPDOWN: SIMULASI & TAKSIRAN */}
            <div
              className="relative py-2"
              ref={simulasiRef}
              onMouseEnter={() => {
                setSimulasiOpen(true);
                setHukumOpen(false);
              }}
              onMouseLeave={() => setSimulasiOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setSimulasiOpen(!simulasiOpen);
                  setHukumOpen(false);
                }}
                className={`inline-flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer ${
                  isSimulasiActive
                    ? "text-[#0b6245] dark:text-[#34d399] font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Simulasi & Taksiran</span>
                <ChevronDown className={`size-4 transition-transform duration-200 ${simulasiOpen ? "rotate-180 text-[#ca9a28]" : "opacity-60"}`} />
              </button>

              {simulasiOpen && (
                <div className="absolute top-full left-0 mt-0 w-64 rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200/90 dark:border-slate-800 p-2 shadow-xl backdrop-blur-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/konversi-harta"
                    onClick={() => setSimulasiOpen(false)}
                    className={`flex items-start gap-3 rounded-xl p-2.5 text-xs no-underline transition-colors ${
                      pathname === "/konversi-harta"
                        ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-emerald-400 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Building2 className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Konversi Harta (ZNT & PUPR)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Taksiran tanah, rumah, mobil, emas</div>
                    </div>
                  </Link>

                  <Link
                    href="/kalkulator"
                    onClick={() => setSimulasiOpen(false)}
                    className={`flex items-start gap-3 rounded-xl p-2.5 text-xs no-underline transition-colors ${
                      pathname === "/kalkulator"
                        ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-emerald-400 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Calculator className="size-4 text-[#0b6245] dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Perhitungan Terpadu</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Komparasi 3 hukum bersamaan</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. TENTANG KAMI */}
            <Link
              href="/tentang"
              className={`text-sm font-medium transition-colors no-underline ${
                pathname === "/tentang"
                  ? "text-[#0b6245] dark:text-[#34d399] font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Tentang Kami
            </Link>

          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="grid size-9 place-items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-slate-500" />}
            </button>

            <Link
              href="/admin/dashboard"
              className="hidden md:inline-flex h-9 whitespace-nowrap items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all no-underline"
            >
              <LogIn className="size-3.5 text-slate-500 dark:text-slate-400" /> Admin
            </Link>

            <Link
              href="/kalkulator"
              className="hidden sm:inline-flex h-9 whitespace-nowrap items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0b6245] to-emerald-700 px-4 text-xs font-bold text-white shadow-md shadow-[#0b6245]/20 hover:shadow-lg transition-all no-underline scale-102 hover:scale-105"
            >
              <Calculator className="size-3.5" /> Mulai Simulasi
            </Link>

            {/* Mobile Drawer Button */}
            <button
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Buka menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f1624]/95 px-4 py-4 space-y-4 backdrop-blur-xl shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all no-underline ${
                  pathname === "/" ? "bg-[#0b6245]/10 dark:bg-emerald-500/15 text-[#0b6245] dark:text-emerald-400 font-extrabold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Beranda
              </Link>

              <div className="pt-2">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0b6245] dark:text-emerald-400 font-mono">
                  Sistem Hukum
                </div>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/syariah"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 no-underline hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>• Hukum Syariah (Faraidh)</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">Islam</span>
                  </Link>
                  <Link
                    href="/perdata"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 no-underline hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>• Hukum Perdata (BW)</span>
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded">KUHPd</span>
                  </Link>
                  <Link
                    href="/adat-jawa"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 no-underline hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>• Hukum Adat Jawa</span>
                    <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">Tradisi</span>
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#ca9a28] dark:text-amber-400 font-mono">
                  Simulasi & Taksiran
                </div>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/konversi-harta"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 no-underline hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Building2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Konversi Harta (ZNT & PUPR)</span>
                  </Link>
                  <Link
                    href="/kalkulator"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 no-underline hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Calculator className="size-3.5 text-[#0b6245] dark:text-emerald-400" />
                    <span>Perhitungan Terpadu (3 Hukum)</span>
                  </Link>
                </div>
              </div>

              <Link
                href="/tentang"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 no-underline mt-2"
              >
                Tentang Kami
              </Link>

              <Link
                href="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 no-underline mt-1"
              >
                <LogIn className="size-3.5" /> Portal Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Body with top padding for fixed header */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* FOOTER WIDGET */}
      <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f1624]">
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
                <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#64748b] dark:text-slate-400 font-mono">
                  PERHITUNGAN WARIS
                </span>
              </span>
            </Link>
            
            <p className="max-w-sm text-xs leading-relaxed text-[#64748b] dark:text-slate-400 font-normal">
              E-MAWARIST adalah sistem informasi dan perhitungan pembagian waris yang membantu masyarakat
              memahami hak waris berdasarkan Hukum Syariah (Faraidh), KUHPerdata, dan Hukum Adat Jawa secara
              transparan dan mudah dipahami.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 font-mono">Navigasi Utama</h3>
            <ul className="mt-4 space-y-2 text-xs text-[#64748b] dark:text-slate-400 font-normal">
              {[
                { href: "/", label: "Beranda" },
                { href: "/syariah", label: "Hukum Syariah (Faraidh)" },
                { href: "/perdata", label: "Hukum Perdata (BW)" },
                { href: "/adat-jawa", label: "Hukum Adat Jawa" },
                { href: "/konversi-harta", label: "Konversi Harta (ZNT & PUPR)" },
                { href: "/kalkulator", label: "Perhitungan Terpadu" },
                { href: "/tentang", label: "Tentang Kami" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#0b6245] dark:hover:text-emerald-400 transition-colors no-underline">
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
                <Mail className="mt-0.5 size-4 shrink-0 text-[#0b6245] dark:text-emerald-400" /> halo@e-mawarist.id
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#0b6245] dark:text-emerald-400" /> (0341) 555-1945
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#0b6245] dark:text-emerald-400" /> Jl. Veteran No. 8, Ketawanggede, Lowokwaru, Kota Malang, Jawa Timur 65145
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
