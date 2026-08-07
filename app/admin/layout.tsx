"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, Bell, Plus, Menu, Moon, Sun, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || document.documentElement.classList.contains("dark")) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // ⌘K / Ctrl+K keyboard shortcut listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/keluarga?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
      
      {/* Sidebar Component (Fixed Sticky Left) */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar Fixed/Sticky Translucent Glass */}
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#151c2c]/75 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 px-4 md:px-8 h-16 flex items-center justify-between shadow-2xs transition-colors">
          
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu className="size-5" />
            </button>

            {/* Functional Quick Search Bar with ⌘K hotkey */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3.5 py-2 w-72 lg:w-80 focus-within:ring-2 focus-within:ring-[#0b6245]/20 focus-within:border-[#0b6245] transition-all">
              <Search className="size-4 text-slate-400 me-2.5 shrink-0" />
              <input 
                ref={inputRef}
                type="text" 
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none" 
                placeholder="Cari data pewaris, NIK, atau kasus... (Tekan Enter)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs">⌘K</kbd>
              )}
            </form>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-slate-500" />}
            </button>

            {/* CTA Button */}
            <Link 
              href="/admin/keluarga/tambah" 
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-sm transition-all no-underline"
            >
              <Plus className="size-4" /> Kasus Waris Baru
            </Link>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
              <Bell className="size-4.5" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            {/* User Profile Card */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="size-9 bg-[#0b6245] text-white font-bold rounded-full flex items-center justify-center text-sm shadow-xs">
                A
              </div>
              <div className="hidden md:block text-left leading-tight">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Admin Utama</div>
                <div className="text-slate-400 text-[11px] font-mono">admin@siwaris.id</div>
              </div>
            </div>

          </div>

        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 md:p-8 bg-[#f8fafc] dark:bg-[#0b0f19] space-y-6">
          {children}
        </main>

      </div>

    </div>
  );
}
