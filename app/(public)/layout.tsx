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
} from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || document.documentElement.classList.contains("dark")) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
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

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/syariah", label: "Syariah" },
    { href: "/perdata", label: "Perdata" },
    { href: "/adat-jawa", label: "Adat Jawa" },
    { href: "/kalkulator", label: "Kalkulator Terpadu" },
    { href: "/tentang", label: "Tentang Kami" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased">

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
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors no-underline ${isActive
                      ? "bg-[#dcfce7]/90 text-[#0b6245] font-semibold dark:bg-[#0b6245]/20 dark:text-emerald-400 font-bold"
                      : "text-[#64748b] dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800 hover:text-slate-900"
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
              className="grid size-8 place-items-center text-slate-500 hover:text-slate-900 dark:hover:bg-slate-800 rounded-md hover:bg-slate-100/70 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-slate-500" />}
            </button>

            <Link
              href="/admin/dashboard"
              className="hidden md:inline-flex h-8 whitespace-nowrap items-center justify-center gap-1.5 rounded-md border border-slate-200/90 dark:border-slate-700 bg-white/80 dark:bg-slate-800 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 transition-colors no-underline backdrop-blur-sm"
            >
              <LogIn className="size-3.5 text-slate-500" /> Login Admin
            </Link>

            <Link
              href="/kalkulator"
              className="hidden sm:inline-flex h-8 whitespace-nowrap items-center justify-center gap-1.5 rounded-full bg-[#0b6245] px-3.5 text-xs font-medium text-white shadow-md hover:bg-[#084b34] transition-colors no-underline"
            >
              <Calculator className="size-3.5" /> Mulai Simulasi Waris
            </Link>

            {/* Mobile Drawer Button */}
            <button
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Buka menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/95 dark:bg-[#151c2c] px-4 py-4 space-y-3 backdrop-blur-md">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline ${isActive
                        ? "bg-[#dcfce7] text-[#0b6245]"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900"
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
              E-Mawarist adalah sistem informasi dan kalkulator pembagian waris yang membantu masyarakat
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
                <Mail className="mt-0.5 size-4 shrink-0 text-[#0b6245]" /> halo@E-Mawarist.id
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
            <p>&copy; {new Date().getFullYear()} E-Mawarist. Seluruh hak cipta dilindungi.</p>
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
