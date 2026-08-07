"use client";

import { useState } from "react";

interface DayStat {
  day: string;
  count: number;
  isToday: boolean;
}

interface InteractiveChartProps {
  dayStats: DayStat[];
  maxDayCount: number;
  totalJenazah: number;
}

export default function InteractiveChart({
  dayStats,
  maxDayCount,
  totalJenazah,
}: InteractiveChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Interactive Hover / Click Status Header */}
      <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
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
            : `${totalJenazah} Total Kasus`}
        </span>
      </div>

      {/* Dynamic Interactive Bars */}
      <div className="h-52 flex items-end justify-between gap-3 pt-8 border-b border-slate-100 dark:border-slate-800 px-2 select-none">
        {dayStats.map((b, idx) => {
          const isHovered = hoveredIdx === idx;
          const isSelected = selectedDay === b.day;
          const heightPct = Math.max((b.count / maxDayCount) * 100, b.count > 0 ? 30 : 12);

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
                    ? "bg-[#084b34] scale-105 shadow-md"
                    : b.isToday || b.count > 0
                    ? "bg-[#0b6245] hover:bg-[#084b34]"
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {/* Day Label */}
              <span
                className={`text-xs font-semibold transition-colors ${
                  isSelected || isHovered
                    ? "text-[#0b6245] dark:text-emerald-400 font-bold"
                    : "text-slate-400"
                }`}
              >
                {b.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#0b6245]" /> Hover / Klik Batang Grafik
        </span>
        <span className="font-mono text-slate-400">Database Real-time</span>
      </div>
    </div>
  );
}
