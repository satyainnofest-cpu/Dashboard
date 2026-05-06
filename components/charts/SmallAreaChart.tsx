"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = { month: string; value: number };

export default function SmallAreaChart({
  data,
  height = 180,
}: {
  data: Datum[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="lime-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c5f73b" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#c5f73b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{
              fill: "rgba(250,250,250,0.4)",
              fontSize: 10,
              fontFamily: "var(--font-geist-mono)",
            }}
            axisLine={{ stroke: "rgba(250,250,250,0.1)" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "#0a0a0a",
              border: "1px solid #c5f73b",
              borderRadius: 8,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              color: "#fafafa",
            }}
            cursor={{ stroke: "#c5f73b", strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#c5f73b"
            strokeWidth={2}
            fill="url(#lime-fade)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
