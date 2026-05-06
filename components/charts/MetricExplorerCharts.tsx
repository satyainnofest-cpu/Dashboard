"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

const AXIS_TICK = {
  fill: "rgba(250,250,250,0.45)",
  fontSize: 10,
  fontFamily: "var(--font-geist-mono)",
} as const;

export function ProjectedBarChart({
  data,
}: {
  data: { metric: string; current: number; projected: number }[];
}) {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(250,250,250,0.05)" vertical={false} />
          <XAxis dataKey="metric" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            cursor={{ fill: "rgba(197, 247, 59, 0.06)" }}
            contentStyle={TOOLTIP}
          />
          <Bar
            dataKey="current"
            fill="rgba(250,250,250,0.35)"
            radius={[4, 4, 0, 0]}
          />
          <Bar dataKey="projected" fill="#c5f73b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CostCurveChart({
  data,
}: {
  data: { scale: number; cost: number }[];
}) {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(250,250,250,0.05)" vertical={false} />
          <XAxis
            dataKey="scale"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            cursor={{ stroke: "#c5f73b", strokeDasharray: "3 3" }}
            contentStyle={TOOLTIP}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#c5f73b"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
