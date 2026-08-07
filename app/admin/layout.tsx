"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getKeluargaList } from "@/app/actions/waris";
import { Search, Bell, Plus, Menu, Moon, Sun, X, FolderX, Eye, ArrowRight } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Live search debounced fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setShowDropdown(true);
      try {
        const res = await getKeluargaList(searchQuery.trim(), "Semua", 1, 5);
        setSearchResults(res.data || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      setShowDropdown(false);
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
          
          <div className="flex items-center gap-4 relative">
            <button 
              type="button" 
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu className="size-5" />
            </button>

            {/* Functional Quick Search Bar with Live Results & ⌘K hotkey */}
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3.5 py-2 w-72 lg:w-80 focus-within:ring-2 focus-within:ring-[#0b6245]/20 focus-within:border-[#0b6245] transition-all">
                <Search className="size-4 text-slate-400 me-2.5 shrink-0" />
                <input 
                  ref={inputRef}
                  type="text" 
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none" 
                  placeholder="Cari data pewaris, NIK, atau kasus... (Tekan Enter)" 
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim()) setShowDropdown(true);
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs">⌘K</kbd>
                )}
              </form>

              {/* LIVE SEARCH DROPDOWN MODAL */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 mt-2 w-80 lg:w-96 bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
                    <span>Hasil Pencarian Live</span>
                    {searchLoading && (
                      <span className="inline-block size-3 border-2 border-[#0b6245] border-t-transparent rounded-full animate-spin"></span>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                    {searchLoading ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Mencari data...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={`/admin/keluarga/${item.id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors no-underline group"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0b6245]">
                              {item.nama}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              NIK: {item.nik || "-"} • Hukum: {item.hukum}
                            </div>
                          </div>
                          <Eye className="size-4 text-slate-400 group-hover:text-[#0b6245]" />
                        </Link>
                      ))
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 mx-auto flex items-center justify-center">
                          <FolderX className="size-5" />
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Data Tidak Ditemukan
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          Tidak ada pewaris atau NIK yang sesuai dengan "<span className="font-semibold text-slate-700 dark:text-slate-300">{searchQuery}</span>".
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full py-2 px-3 text-xs font-semibold text-[#0b6245] hover:bg-[#e6f4ee] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Buka Semua Hasil di Halaman Kelola Data <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
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
