"use client";

import { useState } from "react";

export type HeatmapRow = { label: string; values: number[] };

export function Heatmap({
  rows,
  columns,
  height = 240,
}: {
  rows: HeatmapRow[];
  columns: string[];
  height?: number;
}) {
  const [hover, setHover] = useState<{
    r: number;
    c: number;
    v: number;
  } | null>(null);

  const max = Math.max(
    1,
    ...rows.flatMap((r) => r.values.filter((v) => Number.isFinite(v)))
  );

  return (
    <div className="relative" style={{ minHeight: height }}>
      <div className="overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: 4 }}>
          <thead>
            <tr>
              <th className="text-left font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 pb-1 pr-2 sticky left-0 bg-black/0">
                project
              </th>
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 pb-1"
                >
                  {c.split(" ")[0].slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.label}>
                <td className="font-mono text-[11px] text-white/70 whitespace-nowrap pr-2">
                  {row.label}
                </td>
                {row.values.map((v, c) => {
                  const intensity = max > 0 ? v / max : 0;
                  const bg =
                    v <= 0
                      ? "rgba(250,250,250,0.04)"
                      : `rgba(197, 247, 59, ${Math.max(0.08, intensity * 0.95)})`;
                  return (
                    <td
                      key={c}
                      onMouseEnter={() => setHover({ r, c, v })}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover({ r, c, v })}
                      onBlur={() => setHover(null)}
                      tabIndex={0}
                      title={`${row.label} · ${columns[c]}: ${v}`}
                      style={{ background: bg }}
                      className="h-7 w-7 rounded-sm cursor-default focus:outline-none focus:ring-1 focus:ring-lime"
                    >
                      <span className="sr-only">
                        {row.label} {columns[c]}: {v}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hover && (
        <div className="mt-3 font-mono text-[11px] text-white/65">
          // {rows[hover.r].label} · {columns[hover.c]}:{" "}
          <span className="text-lime">{hover.v}</span>
        </div>
      )}
    </div>
  );
}
