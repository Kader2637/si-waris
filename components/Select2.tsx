"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  searchPlaceholder = "Cari atau ketik...",
  allowCustom = true,
  className = "",
  disabled = false,
}: Select2Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (search.trim()) {
      onChange(search.trim());
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <div className={`relative ${open ? "z-50" : "z-10"} ${className}`} ref={containerRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
          disabled
            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-400 cursor-not-allowed"
            : open
            ? "bg-white dark:bg-slate-900 border-[#0b6245] ring-2 ring-[#0b6245]/20 shadow-sm"
            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400"
        }`}
      >
        <span className="truncate font-semibold">
          {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
        </span>
        <ChevronDown className={`size-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180 text-[#0b6245]" : ""}`} />
      </button>

      {/* DROPDOWN POPOVER WITH SEARCH (SELECT2 STYLE) */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 shadow-2xl z-[9999] p-2 space-y-2 animate-in fade-in slide-in-from-top-2">
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#0b6245]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
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
      )}
    </div>
  );
}
