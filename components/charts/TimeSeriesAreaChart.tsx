"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SERIES = [
  { key: "kheti", color: "#c5f73b", opacity: 1 },
  { key: "triage", color: "#fafafa", opacity: 0.7 },
  { key: "gurukul", color: "#fafafa", opacity: 0.4 },
  { key: "ewaste", color: "#fafafa", opacity: 0.2 },
  { key: "vidyut", color: "#c5f73b", opacity: 0.5 },
] as const;

const NAMES: Record<string, string> = {
  kheti: "Kheti AI",
  triage: "Triage Saheli",
  gurukul: "Gurukul",
  ewaste: "E-Waste Mapper",
  vidyut: "Vidyut",
};

type Datum = {
  month: string;
  kheti: number;
  triage: number;
  gurukul: number;
  ewaste: number;
  vidyut: number;
};

const TOOLTIP = {
  background: "#0a0a0a",
  border: "1px solid #c5f73b",
  borderRadius: 8,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 11,
  color: "#fafafa",
  padding: "8px 10px",
} as const;

const AXIS_TICK = {
  fill: "rgba(250,250,250,0.45)",
  fontSize: 10,
  fontFamily: "var(--font-geist-mono)",
} as const;

export default function TimeSeriesAreaChart({
  data,
  hidden,
}: {
  data: Datum[];
  hidden: Set<string>;
}) {
  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient
                key={s.key}
                id={`grad-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={s.color}
                  stopOpacity={0.4 * s.opacity}
                />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="rgba(250,250,250,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "#c5f73b", strokeDasharray: "3 3" }}
            contentStyle={TOOLTIP}
            formatter={(v, k) => [String(v), NAMES[String(k)] ?? String(k)]}
          />
          {SERIES.map((s) =>
            hidden.has(s.key) ? null : (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stackId="1"
                stroke={s.color}
                strokeOpacity={s.opacity}
                strokeWidth={1.5}
                fill={`url(#grad-${s.key})`}
                isAnimationActive={false}
              />
            )
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
