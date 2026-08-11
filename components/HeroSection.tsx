"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  BookOpen,
  Scale,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Search,
  CheckCircle2,
  PieChart,
  ChevronRight,
  Sliders,
  RefreshCw,
  Users,
  Coins,
  FileDown,
  Layers,
  HelpCircle,
} from "lucide-react";

// Preset scenarios for instant interactive studio comparison
const PRESET_SCENARIOS = [
  {
    id: "keluarga_inti",
    label: "Keluarga Inti (Suami, Ibu, 2 Anak Perempuan)",
    asset: 1500000000,
    syariah: [
      { name: "Suami", fraction: "1/4", percent: 25, color: "#10b981" },
      { name: "Ibu", fraction: "1/6", percent: 16.67, color: "#f59e0b" },
      { name: "2 Anak Perempuan", fraction: "7/12", percent: 58.33, color: "#6366f1" },
    ],
    perdata: [
      { name: "Suami (Gol I)", fraction: "1/3", percent: 33.33, color: "#0284c7" },
      { name: "Anak 1", fraction: "1/3", percent: 33.33, color: "#0d9488" },
      { name: "Anak 2", fraction: "1/3", percent: 33.34, color: "#8b5cf6" },
    ],
    adat: [
      { name: "Harta Gono-Gini Suami", fraction: "50%", percent: 50, color: "#0284c7" },
      { name: "Anak Perempuan 1", fraction: "1/2 Sisa", percent: 25, color: "#10b981" },
      { name: "Anak Perempuan 2", fraction: "1/2 Sisa", percent: 25, color: "#f59e0b" },
    ],
  },
  {
    id: "orangtua_anak",
    label: "Istri & 1 Anak Laki-Laki + 1 Anak Perempuan",
    asset: 2400000000,
    syariah: [
      { name: "Istri", fraction: "1/8", percent: 12.5, color: "#10b981" },
      { name: "Anak Laki-Laki", fraction: "7/12 (2/3 Sisa)", percent: 58.33, color: "#6366f1" },
      { name: "Anak Perempuan", fraction: "7/24 (1/3 Sisa)", percent: 29.17, color: "#f59e0b" },
    ],
    perdata: [
      { name: "Istri (Gol I)", fraction: "1/3", percent: 33.33, color: "#0284c7" },
      { name: "Anak Laki-Laki", fraction: "1/3", percent: 33.33, color: "#0d9488" },
      { name: "Anak Perempuan", fraction: "1/3", percent: 33.34, color: "#8b5cf6" },
    ],
    adat: [
      { name: "Harta Gono-Gini Istri", fraction: "50%", percent: 50, color: "#0284c7" },
      { name: "Anak Laki (Sepikul)", fraction: "2/3 Sisa", percent: 33.33, color: "#10b981" },
      { name: "Anak Perempuan (Segendongan)", fraction: "1/3 Sisa", percent: 16.67, color: "#f59e0b" },
    ],
  },
  {
    id: "tanpa_anak",
    label: "Pasangan Tanpa Anak (Suami, Ayah, Ibu)",
    asset: 900000000,
    syariah: [
      { name: "Suami", fraction: "1/2", percent: 50, color: "#10b981" },
      { name: "Ibu", fraction: "1/3 (Gharrawain)", percent: 16.67, color: "#f59e0b" },
      { name: "Ayah", fraction: "Ashabah (Sisa)", percent: 33.33, color: "#6366f1" },
    ],
    perdata: [
      { name: "Suami (Gol I)", fraction: "1/2", percent: 50, color: "#0284c7" },
      { name: "Ayah & Ibu (Gol II)", fraction: "1/2", percent: 50, color: "#8b5cf6" },
    ],
    adat: [
      { name: "Harta Gono-Gini Suami", fraction: "50%", percent: 50, color: "#0284c7" },
      { name: "Keluarga Pewaris", fraction: "Musyawarah", percent: 50, color: "#10b981" },
    ],
  },
];

export default function HeroSection() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("keluarga_inti");
  const [assetInput, setAssetInput] = useState<number>(1500000000);
  const [activeTabSystem, setActiveTabSystem] = useState<"all" | "syariah" | "perdata" | "adat">("all");

  const currentScenario = PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="relative bg-[#f8fafc] dark:bg-[#070a11] text-slate-900 dark:text-slate-100 pt-24 sm:pt-32 pb-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden">
      
      {/* Background Decorative Tech Canvas & Ambient Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#0b6245]/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HERO BRAND HEADER */}
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-12">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0b6245]/30 dark:border-emerald-500/30 bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 backdrop-blur-md shadow-xs">
            <Sparkles className="size-3.5 text-[#0b6245] dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              WARIS STUDIO COMMAND CENTER 2026
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] text-slate-900 dark:text-white">
            Studio Simulasi Waris{" "}
            <span className="bg-gradient-to-r from-[#0b6245] via-emerald-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300 bg-clip-text text-transparent">
              Multisistem Indonesia.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Bandingkan hasil pembagian harta secara bersandingan antar Hukum Syariah (Faraidh), KUHPerdata, dan Adat Jawa secara realtime.
          </p>

          {/* Direct Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/kalkulator"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0b6245] dark:bg-emerald-500 hover:bg-[#084b34] dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-base rounded-2xl shadow-xl shadow-emerald-900/20 hover:-translate-y-0.5 transition-all no-underline cursor-pointer"
            >
              <Calculator className="size-5" />
              <span>Buka Kalkulator Terpadu</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/syariah"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-sm font-bold rounded-2xl shadow-2xs transition-all no-underline cursor-pointer"
            >
              <BookOpen className="size-4 text-[#ca9a28]" />
              <span>Panduan Hukum Waris</span>
            </Link>
          </div>

        </div>

        {/* INNOVATIVE INTERACTIVE COMMAND STUDIO CANVAS */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
          
          {/* STUDIO CONTROL BAR */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center pb-6 border-b border-slate-200/80 dark:border-slate-800">
            
            {/* Scenario Quick Selector Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
                <Users className="size-4 text-[#0b6245] dark:text-emerald-400" /> Pilih Skenario Keluarga:
              </label>
              <div className="flex flex-col gap-1.5">
                {PRESET_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setSelectedScenarioId(sc.id);
                      setAssetInput(sc.asset);
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                      selectedScenarioId === sc.id
                        ? "bg-[#0b6245] dark:bg-emerald-500 text-white dark:text-slate-950 border-[#0b6245] dark:border-emerald-500 shadow-md"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span>{sc.label}</span>
                    <span className="font-mono text-[11px] opacity-90">{formatRupiah(sc.asset)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Currency Slider & Mode Filter */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <Sliders className="size-4 text-[#ca9a28]" /> Atur Total Harta Bersih:
                </span>
                <span className="text-[#0b6245] dark:text-emerald-400 font-extrabold text-base">{formatRupiah(assetInput)}</span>
              </div>

              <input
                type="range"
                min={300000000}
                max={5000000000}
                step={100000000}
                value={assetInput}
                onChange={(e) => setAssetInput(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0b6245] dark:accent-emerald-400"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">Tampilkan Hukum:</span>
                <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl">
                  {(["all", "syariah", "perdata", "adat"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveTabSystem(m)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                        activeTabSystem === m
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {m === "all" ? "Semua (3 In 1)" : m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* DYNAMIC STUDIO COMPARISON MATRIX GRID */}
          <div className={`grid gap-6 ${activeTabSystem === "all" ? "md:grid-cols-3" : "grid-cols-1"}`}>
            
            {/* PILLAR 1: SYARIAH (FARAIDH) */}
            {(activeTabSystem === "all" || activeTabSystem === "syariah") && (
              <div className="rounded-2xl border border-emerald-500/30 dark:border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b6245] dark:text-emerald-400 font-mono">
                      ☪️ HUKUM SYARIAH
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Al-Qur'an &amp; KHI</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Porsi Pasti
                  </span>
                </div>

                <div className="space-y-3">
                  {currentScenario.syariah.map((item) => {
                    const val = (assetInput * item.percent) / 100;
                    return (
                      <div key={item.name} className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span>{item.name}</span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-400">{item.fraction}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percent}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400">{item.percent}%</span>
                          <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(val)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PILLAR 2: KUHPERDATA (BW) */}
            {(activeTabSystem === "all" || activeTabSystem === "perdata") && (
              <div className="rounded-2xl border border-sky-500/30 dark:border-sky-500/30 bg-sky-500/5 dark:bg-sky-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 font-mono">
                      ⚖️ KUHPERDATA (BW)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Sistem Golongan</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
                    Bagian Sama Rata
                  </span>
                </div>

                <div className="space-y-3">
                  {currentScenario.perdata.map((item) => {
                    const val = (assetInput * item.percent) / 100;
                    return (
                      <div key={item.name} className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span>{item.name}</span>
                          <span className="font-mono text-sky-700 dark:text-sky-400">{item.fraction}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${item.percent}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400">{item.percent}%</span>
                          <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(val)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PILLAR 3: HUKUM ADAT JAWA */}
            {(activeTabSystem === "all" || activeTabSystem === "adat") && (
              <div className="rounded-2xl border border-amber-500/30 dark:border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
                      🌾 ADAT JAWA
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Sepikul Segendongan</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    Gono-Gini 50%
                  </span>
                </div>

                <div className="space-y-3">
                  {currentScenario.adat.map((item) => {
                    const val = (assetInput * item.percent) / 100;
                    return (
                      <div key={item.name} className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span>{item.name}</span>
                          <span className="font-mono text-amber-700 dark:text-amber-400">{item.fraction}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.percent}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400">{item.percent}%</span>
                          <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(val)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* STUDIO FOOTER ACTION */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <CheckCircle2 className="size-4 text-[#0b6245] dark:text-emerald-400 shrink-0" />
              <span>Simulasi otomatis memperhitungkan utang, biaya pengurusan jenazah, &amp; wasiat (max 1/3)</span>
            </div>

            <Link
              href="/kalkulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b6245] dark:bg-emerald-500 hover:bg-[#084b34] dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all no-underline cursor-pointer"
            >
              <span>Mulai Perhitungan Keluarga Anda</span>
              <ChevronRight className="size-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
