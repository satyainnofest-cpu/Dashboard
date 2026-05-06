"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const TOOLTIP = {
  background: "#0a0a0a",
  border: "1px solid #c5f73b",
  borderRadius: 8,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 11,
  color: "#fafafa",
} as const;

export default function DonutChart({
  data,
  height = 220,
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  return (
    <div className="relative" style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            contentStyle={TOOLTIP}
            cursor={{ fill: "rgba(197,247,59,0.06)" }}
          />
          <Pie
            data={data}
            dataKey="value"
            innerRadius="62%"
            outerRadius="92%"
            stroke="#0a0a0a"
            strokeWidth={2}
            isAnimationActive={false}
            paddingAngle={1}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <span className="text-3xl font-semibold tracking-[-0.03em] text-lime leading-none">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/45 mt-1">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
