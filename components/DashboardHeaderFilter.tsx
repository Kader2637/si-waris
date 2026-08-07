"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Plus, Check } from "lucide-react";

export default function DashboardHeaderFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "semua";
  const currentRange = searchParams.get("range") || "semua";

  const [activeTab, setActiveTab] = useState(currentTab);
  const [rangeOpen, setRangeOpen] = useState(false);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabKey);
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  const handleRangeChange = (rangeKey: string) => {
    setRangeOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", rangeKey);
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  const rangeLabels: Record<string, string> = {
    today: "Hari Ini",
    "7days": "7 Hari Terakhir",
    "30days": "30 Hari Terakhir",
    semua: "Semua Waktu",
  };

  const selectedRangeLabel = rangeLabels[currentRange] || "Semua Waktu";

  return (
    <div className="animate-rise flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        
        {/* Interactive Tabs Header syncing URL SearchParams */}
        <div className="flex items-center gap-6 mt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => handleTabChange("terbaru")}
            className={`pb-2 transition-all cursor-pointer ${
              activeTab === "terbaru"
                ? "text-[#0b6245] dark:text-emerald-400 border-b-2 border-[#0b6245] dark:border-emerald-400 font-bold"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Terbaru (5 Kasus)
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("semua")}
            className={`pb-2 transition-all cursor-pointer ${
              activeTab === "semua"
                ? "text-[#0b6245] dark:text-emerald-400 border-b-2 border-[#0b6245] dark:border-emerald-400 font-bold"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Semua Data
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("realtime")}
            className={`pb-2 transition-all cursor-pointer ${
              activeTab === "realtime"
                ? "text-[#0b6245] dark:text-emerald-400 border-b-2 border-[#0b6245] dark:border-emerald-400 font-bold"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Kasus Selesai Dihitung
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Interactive Dropdown Range Selector syncing URL SearchParams */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRangeOpen(!rangeOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700/80 cursor-pointer transition-colors"
          >
            Rentang: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedRangeLabel}</span>
            <ChevronDown className={`size-3.5 text-slate-400 transition-transform ${rangeOpen ? "rotate-180" : ""}`} />
          </button>

          {rangeOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1 font-sans animate-rise">
              {[
                { key: "today", label: "Hari Ini" },
                { key: "7days", label: "7 Hari Terakhir" },
                { key: "30days", label: "30 Hari Terakhir" },
                { key: "semua", label: "Semua Waktu" },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => handleRangeChange(r.key)}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between cursor-pointer"
                >
                  <span>{r.label}</span>
                  {currentRange === r.key && <Check className="size-3.5 text-[#0b6245] dark:text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/admin/keluarga/tambah"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b6245] text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-[#084b34] transition-all no-underline"
        >
          <Plus className="size-4" /> Kasus Waris Baru
        </Link>
      </div>
    </div>
  );
}
