"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Check, Plus, X } from "lucide-react";

export interface Select2Option {
  value: string;
  label: string;
  subtext?: string;
}

interface Select2Props {
  options: Select2Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function Select2({
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari pilihan...",
  allowCustom = false,
  className = "",
  disabled = false,
}: Select2Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update fixed popover position based on trigger button bounding rect
  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (open) {
      updateCoords();
      const handleScrollOrResize = () => updateCoords();
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [open]);

  // Close when clicking outside trigger or popover
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Selected Option Object
  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === value) || (value ? { value, label: value } : null);
  }, [options, value]);

  // Filtered Options
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.subtext && o.subtext.toLowerCase().includes(q))
    );
  }, [options, search]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearch("");
  };

  const handleAddCustom = () => {
    if (search.trim() && allowCustom) {
      onChange(search.trim());
      setOpen(false);
      setSearch("");
    }
  };

  const popoverContent = open && mounted ? (
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${Math.max(coords.width, 220)}px`,
        zIndex: 99999,
      }}
      className="rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200 dark:border-slate-700 shadow-2xl p-2 space-y-2 animate-in fade-in slide-in-from-top-2"
    >
      {/* SEARCH INPUT */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
        <input
          type="text"
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#0b6245] dark:focus:border-emerald-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* OPTIONS LIST */}
      <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#0b6245]/10 text-[#0b6245] dark:bg-[#0b6245]/30 dark:text-emerald-400 font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="font-semibold">{opt.label}</div>
                  {opt.subtext && <div className="text-[10px] text-slate-400 font-normal">{opt.subtext}</div>}
                </div>
                {isSelected && <Check className="size-3.5 text-[#0b6245] dark:text-emerald-400 shrink-0" />}
              </button>
            );
          })
        ) : allowCustom && search.trim() ? (
          <button
            type="button"
            onClick={handleAddCustom}
            className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-[#0b6245] dark:text-emerald-400 hover:bg-emerald-500/20 text-left transition-colors cursor-pointer"
          >
            <Plus className="size-4 shrink-0" />
            <span>Gunakan &quot;{search}&quot; (Input Mandiri)</span>
          </button>
        ) : (
          <div className="p-3 text-center text-xs text-slate-400">Tidak ada hasil ditemukan</div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {/* TRIGGER BUTTON */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
          disabled
            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
            : open
            ? "bg-white dark:bg-[#0f172a] border-[#0b6245] dark:border-emerald-500 ring-2 ring-[#0b6245]/20 dark:ring-emerald-500/20 text-slate-800 dark:text-slate-100 shadow-sm"
            : "bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600"
        }`}
      >
        <span className="truncate font-semibold">
          {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
        </span>
        <ChevronDown className={`size-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180 text-[#0b6245]" : ""}`} />
      </button>

      {/* RENDER POPOVER VIA PORTAL TO BODY */}
      {mounted && popoverContent ? createPortal(popoverContent, document.body) : null}
    </div>
  );
}
