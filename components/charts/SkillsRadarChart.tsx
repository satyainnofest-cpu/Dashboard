"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SkillAxis } from "@/lib/types";

const TOOLTIP = {
  background: "#0a0a0a",
  border: "1px solid #c5f73b",
  borderRadius: 8,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 11,
  color: "#fafafa",
} as const;

export default function SkillsRadarChart({ data }: { data: SkillAxis[] }) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="rgba(250,250,250,0.15)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{
              fill: "rgba(250,250,250,0.7)",
              fontSize: 11,
              fontFamily: "var(--font-geist-mono)",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            dataKey="value"
            stroke="#c5f73b"
            strokeWidth={2}
            fill="#c5f73b"
            fillOpacity={0.3}
            isAnimationActive={false}
          />
          <Tooltip contentStyle={TOOLTIP} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
