"use client";

import dynamic from "next/dynamic";
import {
  DashboardShell,
  PanelGrid,
} from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/Panel";
import { KPIGrid, type KPIProps } from "@/components/dashboard/KPITile";
import { GanttStrip, type GanttItem } from "@/components/charts/GanttStrip";
import type { Mentor, Milestone, SkillAxis } from "@/lib/types";

const SkillsRadarChart = dynamic(
  () => import("@/components/charts/SkillsRadarChart"),
  { ssr: false, loading: () => <div className="h-[300px]" aria-hidden /> }
);

function parseJourneyDate(s: string): number {
  // formats: "2023 · sep" / "2025 · may"
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const [y, m] = s.split("·").map((x) => x.trim().toLowerCase());
  return new Date(Number(y), months[m] ?? 0, 1).getTime();
}

export function JourneyDashboard({
  milestones,
  skills,
  mentors,
  projectsCount,
}: {
  milestones: Milestone[];
  skills: SkillAxis[];
  mentors: Mentor[];
  projectsCount: number;
}) {
  const sortedMs = [...milestones].sort(
    (a, b) => parseJourneyDate(a.date) - parseJourneyDate(b.date)
  );
  const yearsBuilding = (() => {
    const first = parseJourneyDate(sortedMs[0]?.date ?? "2023 · sep");
    const last = parseJourneyDate(sortedMs[sortedMs.length - 1]?.date ?? "2025 · may");
    return Number(((last - first) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
  })();
  const lessons = sortedMs.filter((m) => m.body && m.body.length > 30).length;
  const expandable = sortedMs.filter((m) => m.links && m.links.length > 0).length;

  const kpis: KPIProps[] = [
    {
      label: "years building",
      value: yearsBuilding,
      decimals: 1,
      delta: "since first model",
      deltaTone: "neutral",
      hint: "From the very first MNIST notebook",
    },
    {
      label: "milestones logged",
      value: sortedMs.length,
      delta: "honest",
      deltaTone: "up",
      hint: "Includes failures, intentionally",
    },
    {
      label: "projects shipped",
      value: projectsCount,
      delta: "+2 ytd",
      deltaTone: "up",
      hint: "Across 4 AI-for-Good domains",
    },
    {
      label: "writeups w/ links",
      value: expandable,
      delta: "expandable",
      deltaTone: "neutral",
      hint: "Milestones with attached artifacts",
    },
  ];
  void lessons;

  const ganttItems: GanttItem[] = sortedMs.map((m, i, arr) => {
    const start = parseJourneyDate(m.date);
    const end =
      i + 1 < arr.length
        ? parseJourneyDate(arr[i + 1].date)
        : start + 1000 * 60 * 60 * 24 * 90;
    return {
      label: m.title,
      start,
      end,
      color: i % 2 === 0 ? "#c5f73b" : "rgba(250,250,250,0.85)",
    };
  });

  return (
    <DashboardShell
      eyebrow="// dashboard / journey"
      title="Builder profile"
      meta={
        <>
          <span>{sortedMs.length} milestones</span>
          <span>·</span>
          <span>{mentors.length} mentors</span>
          <span>·</span>
          <span className="text-lime">live</span>
        </>
      }
    >
      <PanelGrid>
        <div className="col-span-12">
          <KPIGrid items={kpis} cols={4} />
        </div>

        <Panel
          title="Build timeline"
          subtitle="Milestones, scaled to time"
          span={12}
          spanLg={12}
        >
          <GanttStrip items={ganttItems} />
        </Panel>

        <Panel
          title="Milestone log"
          subtitle="Chronological, honest"
          span={12}
          spanLg={8}
        >
          <ol className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {sortedMs.map((m, i) => (
              <li
                key={m.id}
                className="grid grid-cols-[44px_1fr] gap-3 pb-4 border-b border-white/5 last:border-b-0"
              >
                <span className="font-mono text-[10px] text-white/35 tabular-nums pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-[-0.01em]">
                      {m.title}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime shrink-0">
                      {m.date}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-snug mt-1">
                    {m.short}
                  </p>
                  <p className="text-[13px] text-white/55 leading-relaxed mt-2">
                    {m.body}
                  </p>
                  {m.links && m.links.length > 0 && (
                    <ul className="mt-2 flex gap-3">
                      {m.links.map((l) => (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            className="font-mono text-[10px] text-lime hover:underline"
                          >
                            {l.label} →
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          title="Skills (self-rated)"
          subtitle="0–100, calibrated against shipped work"
          span={12}
          spanLg={4}
        >
          <SkillsRadarChart data={skills} />
        </Panel>

        <Panel
          title="Mentors"
          subtitle="People who let me bother them"
          span={12}
          spanLg={12}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mentors.map((m) => (
              <li
                key={m.name}
                className="border border-white/10 rounded-lg p-4 hover:border-lime transition-colors"
              >
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="mt-1 text-xs text-white/55 leading-snug">
                  {m.attribution}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </PanelGrid>
    </DashboardShell>
  );
}
