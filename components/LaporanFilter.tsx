"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Filter,
  Printer,
  RotateCcw,
  ChevronDown,
  Scale,
} from "lucide-react";

interface LaporanFilterProps {
  currentRange: string;
  currentHukum: string;
  totalFilteredCases: number;
}

export default function LaporanFilter({
  currentRange,
  currentHukum,
  totalFilteredCases,
}: LaporanFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rangeOpen, setRangeOpen] = useState(false);
  const [hukumOpen, setHukumOpen] = useState(false);

  const rangeLabels: Record<string, string> = {
    semua: "Semua Waktu",
    today: "Hari Ini",
    "7days": "7 Hari Terakhir",
    "30days": "30 Hari Terakhir",
    this_year: "Tahun Ini",
  };

  const hukumLabels: Record<string, string> = {
    semua: "Semua Sistem Hukum",
    Islam: "Syariah (Faraidh)",
    Jawa: "Hukum Adat Jawa",
    Perdata: "KUHPerdata",
  };

  const handleRangeSelect = (val: string) => {
    setRangeOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (val === "semua") {
      params.delete("range");
    } else {
      params.set("range", val);
    }
    router.push(`/admin/laporan?${params.toString()}`);
  };

  const handleHukumSelect = (val: string) => {
    setHukumOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (val === "semua") {
      params.delete("hukum");
    } else {
      params.set("hukum", val);
    }
    router.push(`/admin/laporan?${params.toString()}`);
  };

  const handleReset = () => {
    setRangeOpen(false);
    setHukumOpen(false);
    router.push("/admin/laporan");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const isFiltered = currentRange !== "semua" || currentHukum !== "semua";

  return (
    <div className="print:hidden bg-white dark:bg-[#131b2b] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRangeOpen(!rangeOpen);
                setHukumOpen(false);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shadow-2xs"
            >
              <Calendar className="size-3.5 text-[#0b6245] dark:text-emerald-400" />
              <span>Periode:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {rangeLabels[currentRange] || "Semua Waktu"}
              </span>
              <ChevronDown
                className={`size-3 text-slate-400 transition-transform ${
                  rangeOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {rangeOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setRangeOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-40 py-1 text-xs overflow-hidden">
                  {Object.entries(rangeLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleRangeSelect(key)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer ${
                        currentRange === key
                          ? "font-bold text-[#0b6245] dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{label}</span>
                      {currentRange === key && (
                        <span className="size-1.5 rounded-full bg-[#0b6245] dark:bg-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Hukum Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setHukumOpen(!hukumOpen);
                setRangeOpen(false);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shadow-2xs"
            >
              <Scale className="size-3.5 text-[#ca9a28] dark:text-amber-400" />
              <span>Sistem Hukum:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {hukumLabels[currentHukum] || "Semua"}
              </span>
              <ChevronDown
                className={`size-3 text-slate-400 transition-transform ${
                  hukumOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {hukumOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setHukumOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-40 py-1 text-xs overflow-hidden">
                  {Object.entries(hukumLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleHukumSelect(key)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer ${
                        currentHukum === key
                          ? "font-bold text-[#ca9a28] dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{label}</span>
                      {currentHukum === key && (
                        <span className="size-1.5 rounded-full bg-[#ca9a28] dark:bg-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset filter button */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Reset Filter"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Right: Print / Export actions */}
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Ditemukan:{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {totalFilteredCases} Kasus
            </span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b6245] hover:bg-[#084b34] text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Printer className="size-3.5" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
