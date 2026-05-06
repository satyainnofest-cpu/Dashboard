"use client";

import { useMemo, useState } from "react";

export type GanttItem = {
  label: string;
  start: number; // ms epoch
  end: number; // ms epoch
  domain?: string;
  color?: string;
};

export function GanttStrip({
  items,
  height,
}: {
  items: GanttItem[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const { min, max, ticks } = useMemo(() => {
    const min = Math.min(...items.map((i) => i.start));
    const max = Math.max(...items.map((i) => i.end));
    const span = max - min;
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const t = min + (span * i) / (tickCount - 1);
      return { t, x: (i / (tickCount - 1)) * 100 };
    });
    return { min, max, ticks };
  }, [items]);

  const fmt = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleDateString("en", { month: "short", year: "2-digit" });
  };

  const pct = (ms: number) => ((ms - min) / Math.max(1, max - min)) * 100;
  const rowH = 28;
  const totalH = height ?? items.length * (rowH + 4) + 40;

  return (
    <div style={{ height: totalH }} className="w-full">
      <div className="relative w-full h-full">
        {/* Grid lines */}
        <div className="absolute inset-x-0 top-0 bottom-6 flex pointer-events-none">
          {ticks.map((t, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-white/5"
              style={{ left: `${t.x}%` }}
            />
          ))}
        </div>
        {/* Bars */}
        <div className="relative w-full" style={{ height: totalH - 24 }}>
          {items.map((it, i) => {
            const left = pct(it.start);
            const width = Math.max(2, pct(it.end) - left);
            const isHover = hover === i;
            return (
              <div
                key={i}
                className="absolute flex items-center"
                style={{
                  top: i * (rowH + 4),
                  left: `${left}%`,
                  width: `${width}%`,
                  height: rowH,
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="h-full w-full rounded-md flex items-center px-2.5 transition-all border"
                  style={{
                    background: it.color ?? "rgba(197, 247, 59, 0.85)",
                    borderColor: isHover ? "#fafafa" : "transparent",
                  }}
                >
                  <span className="font-mono text-[10px] truncate text-black uppercase tracking-[0.05em]">
                    {it.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        {/* X-axis labels */}
        <div className="absolute inset-x-0 bottom-0 h-6 flex">
          {ticks.map((t, i) => (
            <span
              key={i}
              className="absolute font-mono text-[10px] text-white/40 -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${t.x}%` }}
            >
              {fmt(t.t)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
