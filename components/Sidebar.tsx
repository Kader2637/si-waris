"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Settings,
  LogOut,
  FileStack,
  BookOpen,
  Calculator,
  PieChart,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/keluarga', label: 'Data Keluarga', icon: Users },
  { href: '/admin/arsip', label: 'Arsip Perhitungan', icon: FileStack },
  { href: '/admin/laporan', label: 'Laporan Multi-Hukum', icon: PieChart },
  { href: '/admin/panduan', label: 'Panduan Sistem', icon: BookOpen },
  { href: '/admin/kalkulator', label: 'Kalkulator Cepat', icon: Calculator },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 shadow-sm z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="E-Mawarits Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">E-MAWARITS</h1>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div
        className={cn(
          "w-72 h-screen bg-white text-slate-900 flex flex-col fixed left-0 top-0 border-r border-slate-100 shadow-2xl shadow-slate-200/50 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-8 pb-6 flex items-center justify-between lg:block">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="E-Mawarits Logo" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">E-MAWARITS</h1>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-none mt-1 text-emerald-600">Admin Panel</p>
            </div>
          </div>

          {/* Close button for mobile inside sidebar */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden",
                  isActive ? "text-emerald-700 bg-emerald-50/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"
                )}>
                  <item.icon size={20} />
                </div>
                <span className="font-semibold text-sm tracking-tight">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition text-sm font-semibold">
            <Settings size={20} />
            <span>Pengaturan</span>
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-300 text-sm font-semibold group">
            <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
              <LogOut size={18} />
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
