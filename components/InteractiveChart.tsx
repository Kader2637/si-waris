"use client";

import { useState } from "react";
import { PieChart as PieChartIcon } from "lucide-react";

interface DayStat {
  day: string;
  count: number;
  isToday: boolean;
}

interface HeirShareItem {
  nama: string;
  jatahNominal: number;
  jatahPersen: string;
}

interface InteractiveChartProps {
  // Option A: Weekly activity chart
  dayStats?: DayStat[];
  maxDayCount?: number;
  totalJenazah?: number;

  // Option B: Heir share breakdown chart
  title?: string;
  data?: HeirShareItem[];
}

const BAR_COLORS = [
  "bg-[#0b6245]",
  "bg-[#ca9a28]",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-[#084b34]",
  "bg-purple-600",
  "bg-rose-600",
];

export default function InteractiveChart({
  dayStats,
  maxDayCount,
  totalJenazah,
  title,
  data,
}: InteractiveChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // If rendering Heir Share Breakdown Chart (data prop provided)
  if (data && data.length > 0) {
    const totalNominal = data.reduce((acc, curr) => acc + curr.jatahNominal, 0);

    return (
      <div className="bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-base">
            <PieChartIcon className="size-5 text-[#0b6245] dark:text-emerald-400" /> {title || "Diagram Porsi Waris"}
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ee] dark:bg-emerald-950/50 text-[#0b6245] dark:text-emerald-400 font-mono">
            Total Tirkah: Rp {totalNominal.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Stacked Percentage Progress Bar */}
        <div className="h-6 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-1 gap-1">
          {data.map((item, idx) => {
            const pct = totalNominal > 0 ? (item.jatahNominal / totalNominal) * 100 : 0;
            const colorClass = BAR_COLORS[idx % BAR_COLORS.length];
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ width: `${pct}%` }}
                className={`h-full rounded-full transition-all cursor-pointer relative ${colorClass} ${
                  isHovered ? "opacity-100 scale-y-110 shadow-md" : "opacity-90 hover:opacity-100"
                }`}
              />
            );
          })}
        </div>

        {/* Legend List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((item, idx) => {
            const colorClass = BAR_COLORS[idx % BAR_COLORS.length];
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? "border-[#0b6245] dark:border-emerald-500 bg-[#e6f4ee]/60 dark:bg-emerald-500/15 shadow-2xs"
                    : "border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a]"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <span className={`size-3 rounded-full shrink-0 ${colorClass}`} />
                    {item.nama}
                  </span>
                  <span className="font-mono text-[#0b6245] dark:text-emerald-400 font-bold">{item.jatahPersen}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono mt-1 text-right">
                  Rp {item.jatahNominal.toLocaleString("id-ID")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If rendering Dashboard Weekly Activity Chart (dayStats provided)
  if (!dayStats || dayStats.length === 0) return null;

  const maxVal = maxDayCount || 1;

  return (
    <div className="space-y-4">
      {/* Interactive Hover / Click Status Header */}
      <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          {selectedDay
            ? `Hari terpilih: ${selectedDay}`
            : hoveredIdx !== null
            ? `Highlight: ${dayStats[hoveredIdx].day}`
            : "Arahkan kursor atau klik batang untuk melihat detail"}
        </span>
        <span className="font-mono font-bold text-[#0b6245] dark:text-emerald-400">
          {hoveredIdx !== null
            ? `${dayStats[hoveredIdx].count} Kasus`
            : `${totalJenazah || 0} Total Kasus`}
        </span>
      </div>

      {/* Dynamic Interactive Bars */}
      <div className="h-52 flex items-end justify-between gap-3 pt-8 border-b border-slate-100 dark:border-slate-800 px-2 select-none">
        {dayStats.map((b, idx) => {
          const isHovered = hoveredIdx === idx;
          const isSelected = selectedDay === b.day;
          const heightPct = Math.max((b.count / maxVal) * 100, b.count > 0 ? 30 : 12);

          return (
            <div
              key={b.day}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setSelectedDay(isSelected ? null : b.day)}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative"
            >
              {/* Tooltip Popup */}
              {(isHovered || isSelected) && (
                <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg z-20 font-mono whitespace-nowrap animate-rise flex items-center gap-1.5 border border-slate-700">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  {b.day}: {b.count} Kasus
                </div>
              )}

              {/* Bar Column */}
              <div
                className={`w-full max-w-[32px] rounded-t-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-[#ca9a28] shadow-md scale-105"
                    : isHovered
                    ? "bg-[#084b34] dark:bg-emerald-500 scale-105 shadow-md"
                    : b.isToday || b.count > 0
                    ? "bg-[#0b6245] dark:bg-emerald-600 hover:bg-[#084b34] dark:hover:bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {/* Day Label */}
              <span
                className={`text-xs font-semibold transition-colors ${
                  isSelected || isHovered
                    ? "text-[#0b6245] dark:text-emerald-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {b.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#0b6245] dark:bg-emerald-500" /> Hover / Klik Batang Grafik
        </span>
        <span className="font-mono text-slate-500 dark:text-slate-400">Database Real-time</span>
      </div>
    </div>
  );
}
