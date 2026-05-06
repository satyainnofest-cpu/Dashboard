"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOOLTIP = {
  background: "#0a0a0a",
  border: "1px solid #c5f73b",
  borderRadius: 8,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 11,
  color: "#fafafa",
} as const;

const AXIS = {
  fill: "rgba(250,250,250,0.55)",
  fontSize: 11,
  fontFamily: "var(--font-geist-mono)",
} as const;

export default function HorizontalBarChart({
  data,
  height = 240,
  highlightKey,
  unit = "",
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  highlightKey?: string;
  unit?: string;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="rgba(250,250,250,0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ ...AXIS, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={AXIS}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={TOOLTIP}
            cursor={{ fill: "rgba(197,247,59,0.06)" }}
            formatter={(v) => [`${v}${unit}`, ""]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.color ??
                  (highlightKey === d.label
                    ? "#c5f73b"
                    : i === 0
                      ? "#c5f73b"
                      : `rgba(250,250,250,${0.7 - i * 0.1})`)
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
