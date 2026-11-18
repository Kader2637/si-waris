"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { applyTheme, useIsDark } from "@/lib/theme";
import {
  Grid,
  Users,
  FolderSymlink,
  BarChart3,
  Calculator,
  BookOpen,
  Settings,
  Scale,
  Sparkles,
  Moon,
  Sun,
  Building2,
} from "lucide-react";

const NAV_MENU = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Grid },
  { href: "/admin/keluarga", label: "Data Keluarga", icon: Users },
  { href: "/admin/arsip", label: "Arsip Digital", icon: FolderSymlink, badge: "PDF" },
  { href: "/admin/laporan", label: "Laporan & Analytics", icon: BarChart3 },
];

const NAV_TOOLS = [
  { href: "/admin/konversi-harta", label: "Konversi & Database", icon: Building2, badge: "ZNT" },
  { href: "/admin/kalkulator", label: "Perhitungan Cepat", icon: Calculator },
  { href: "/admin/panduan", label: "Panduan Hukum", icon: BookOpen },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const isDark = useIsDark();

  const toggleDarkMode = () => {
    applyTheme(!isDark);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* FIXED PINNED SIDEBAR (STAYS PINNED ON SCROLL) */}
      <aside
        className={`print:hidden w-64 min-w-64 bg-white dark:bg-[#0f1624] text-slate-700 dark:text-slate-300 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 left-0 transition-all duration-300 z-50 overflow-y-auto ${
          mobileOpen ? "fixed inset-y-0 left-0 shadow-2xl flex" : "hidden lg:flex"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white dark:bg-[#0f1624] z-10">
          <Link href="/admin/dashboard" className="flex items-center gap-3 no-underline">
            <span className="grid size-9 place-items-center rounded-xl bg-[#0b6245] text-white shadow-sm">
              <Scale className="size-5" />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                E-<span className="text-[#ca9a28]">MAWARIST</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b] dark:text-slate-400 font-mono">
                ADMIN PORTAL
              </span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="py-6 flex-1 px-4 space-y-6">
          
          {/* MENU Group */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
              MENU
            </p>
            <nav className="space-y-1">
              {NAV_MENU.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all no-underline ${
                      isActive
                        ? "bg-[#e6f4ee] text-[#0b6245] dark:bg-emerald-500/15 dark:text-emerald-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon className={`size-4 ${isActive ? "text-[#0b6245] dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-rose-500 text-white rounded-md uppercase">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SUPPORT Group (Renamed from PERKAKAS) */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
              SUPPORT
            </p>
            <nav className="space-y-1">
              {NAV_TOOLS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all no-underline ${
                      isActive
                        ? "bg-[#e6f4ee] text-[#0b6245] dark:bg-emerald-500/15 dark:text-emerald-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon className={`size-4 ${isActive ? "text-[#0b6245] dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Bottom Functional Dark Mode Toggle Widget */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#131b2b] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-slate-500 dark:text-slate-400" />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDark ? "bg-[#0b6245] dark:bg-emerald-500" : "bg-slate-300"}`}>
              <div className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform ${isDark ? "translate-x-4" : "translate-x-0"}`} />
            </div>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-xs transition-all no-underline"
          >
            <Sparkles className="size-3.5 text-[#ca9a28]" /> Web Utama
          </Link>
        </div>

      </aside>
    </>
  );
}
