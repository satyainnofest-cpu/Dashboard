"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  DashboardShell,
  PanelGrid,
} from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/Panel";
import { KPIGrid, type KPIProps } from "@/components/dashboard/KPITile";
import {
  SlicerChip,
  SlicerLabel,
} from "@/components/dashboard/Slicers";
import { Heatmap } from "@/components/charts/Heatmap";
import type { Domain, ImpactStat, Project } from "@/lib/types";

const TimeSeriesAreaChart = dynamic(
  () => import("@/components/charts/TimeSeriesAreaChart"),
  { ssr: false, loading: () => <div className="h-[320px]" aria-hidden /> }
);
const DonutChart = dynamic(
  () => import("@/components/charts/DonutChart"),
  { ssr: false, loading: () => <div className="h-[260px]" aria-hidden /> }
);
const HorizontalBarChart = dynamic(
  () => import("@/components/charts/HorizontalBarChart"),
  { ssr: false, loading: () => <div className="h-[260px]" aria-hidden /> }
);

const WhatIfSimulator = dynamic(
  () => import("@/components/impact/WhatIfSimulator").then((m) => m.WhatIfSimulator),
  { ssr: false, loading: () => <div className="h-[480px]" aria-hidden /> }
);

const DOMAIN_COLORS: Record<Domain, string> = {
  Climate: "#c5f73b",
  Health: "rgba(250,250,250,0.7)",
  Education: "rgba(250,250,250,0.45)",
  Community: "rgba(250,250,250,0.25)",
};

const SHORT_KEY: Record<string, "kheti" | "triage" | "gurukul" | "ewaste" | "vidyut"> = {
  "kheti-ai": "kheti",
  "triage-saheli": "triage",
  gurukul: "gurukul",
  "e-waste-mapper": "ewaste",
  vidyut: "vidyut",
};

export function ImpactDashboardView({
  projects,
  impactStats,
  timeSeries,
  months,
}: {
  projects: Project[];
  impactStats: ImpactStat[];
  timeSeries: {
    month: string;
    kheti: number;
    triage: number;
    gurukul: number;
    ewaste: number;
    vidyut: number;
  }[];
  months: string[];
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (k: string) =>
    setHidden((s) => {
      const next = new Set(s);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const kpis: KPIProps[] = [
    {
      label: impactStats[0].label,
      value: impactStats[0].value,
      compact: true,
      delta: impactStats[0].delta,
      deltaTone: "up",
      spark: timeSeries.map((d) => d.kheti + d.triage + d.gurukul + d.ewaste + d.vidyut),
      hint: impactStats[0].description,
    },
    {
      label: impactStats[1].label,
      value: impactStats[1].value,
      suffix: impactStats[1].unit,
      delta: impactStats[1].delta,
      deltaTone: "up",
      spark: [88, 90, 91, 92, 92, 93, 94, 94, 94, 94, 94, 94],
      hint: impactStats[1].description,
    },
    {
      label: impactStats[2].label,
      value: impactStats[2].value,
      delta: impactStats[2].delta,
      deltaTone: "up",
      spark: [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
      hint: impactStats[2].description,
    },
    {
      label: impactStats[3].label,
      value: impactStats[3].value,
      prefix: impactStats[3].unit,
      delta: impactStats[3].delta,
      deltaTone: "neutral",
      hint: impactStats[3].description,
    },
  ];

  const domainData = (() => {
    const acc: Record<string, number> = {};
    for (const p of projects) acc[p.domain] = (acc[p.domain] ?? 0) + p.domainShare;
    const total = Object.values(acc).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(acc).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
      color: DOMAIN_COLORS[name as Domain],
    }));
  })();

  const projectBars = projects
    .map((p) => ({
      label: p.name,
      value: p.monthly[p.monthly.length - 1] ?? 0,
      color: DOMAIN_COLORS[p.domain],
    }))
    .sort((a, b) => b.value - a.value);

  const heatRows = projects.map((p) => ({
    label: p.name,
    values: p.monthly,
  }));

  const totalReach = projects.reduce(
    (a, p) => a + p.reachBaseline,
    0
  );

  return (
    <DashboardShell
      eyebrow="// dashboard / impact"
      title="Impact"
      meta={
        <>
          <span>5 projects · 12 months</span>
          <span>·</span>
          <span className="text-lime">all-actuals + projections</span>
        </>
      }
      slicers={
        <>
          <SlicerLabel>show series</SlicerLabel>
          {projects.map((p) => {
            const k = SHORT_KEY[p.slug];
            const off = hidden.has(k);
            return (
              <SlicerChip
                key={p.slug}
                active={!off}
                onClick={() => toggle(k)}
              >
                {p.name}
              </SlicerChip>
            );
          })}
        </>
      }
    >
      <PanelGrid>
        <div className="col-span-12">
          <KPIGrid items={kpis} cols={4} />
        </div>

        <Panel
          title="Cumulative reach over time"
          subtitle="Stacked, per project"
          span={12}
          spanLg={8}
        >
          <TimeSeriesAreaChart data={timeSeries} hidden={hidden} />
        </Panel>

        <Panel
          title="Domain share"
          subtitle="Where impact lives"
          span={12}
          spanLg={4}
        >
          <DonutChart
            data={domainData}
            height={300}
            centerLabel="domains"
            centerValue={String(domainData.length)}
          />
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {domainData.map((d) => (
              <li
                key={d.name}
                className="flex items-center gap-2 font-mono text-[10px] text-white/70 truncate"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ background: d.color }}
                  aria-hidden
                />
                <span className="truncate">{d.name}</span>
                <span className="ml-auto text-white/40">{d.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Project comparison"
          subtitle="Latest reach by project"
          span={12}
          spanLg={6}
        >
          <HorizontalBarChart data={projectBars} height={260} />
        </Panel>

        <Panel
          title="Reach intensity heatmap"
          subtitle="Monthly reach by project"
          span={12}
          spanLg={6}
        >
          <Heatmap rows={heatRows} columns={months} />
        </Panel>

        <Panel
          title="What-if simulator"
          subtitle="Drag the sliders; everything updates live"
          span={12}
          spanLg={12}
          bodyClassName="p-0"
        >
          <div className="p-4">
            <WhatIfSimulator
              baselineReach={totalReach}
              projects={projects.map((p) => ({
                slug: p.slug,
                name: p.name,
                reach: p.reachBaseline,
              }))}
            />
          </div>
        </Panel>

        <Panel
          title="Methodology"
          subtitle="How we count what we count"
          span={12}
          spanLg={12}
        >
          <p className="text-[13px] text-white/75 leading-relaxed max-w-3xl">
            Actuals come from pilot logs (model accuracy on held-out data,
            consultations recorded by ASHAs, reports submitted by citizens).
            Projected reach in the simulator scales the &quot;people directly
            served&quot; baseline by the chosen multiplier and applies a small
            accuracy improvement curve. Cost-per-person amortizes a fixed
            engineering overhead across the scaled reach. None of these
            projections is a commitment — they exist to make trade-offs
            between accuracy, deployment time, and reach visible.
          </p>
        </Panel>
      </PanelGrid>
    </DashboardShell>
  );
}
