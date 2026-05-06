"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardShell, PanelGrid } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/Panel";
import { KPIGrid, type KPIProps } from "@/components/dashboard/KPITile";
import { type ImpactStat, type Project } from "@/lib/types";
import { site } from "@/lib/data";
import { StatusPill } from "@/components/ui/StatusPill";
import { Sparkline } from "@/components/charts/Sparkline";
import { DataTable, type Column } from "@/components/dashboard/DataTable";
import { formatNumber } from "@/lib/utils";

const SmallAreaChart = dynamic(
  () => import("@/components/charts/SmallAreaChart"),
  { ssr: false, loading: () => <div className="h-[200px]" aria-hidden /> }
);
const DonutChart = dynamic(
  () => import("@/components/charts/DonutChart"),
  { ssr: false, loading: () => <div className="h-[220px]" aria-hidden /> }
);
const HorizontalBarChart = dynamic(
  () => import("@/components/charts/HorizontalBarChart"),
  { ssr: false, loading: () => <div className="h-[240px]" aria-hidden /> }
);

const STATUS_ORDER: Project["status"][] = [
  "research",
  "prototype",
  "pilot",
  "shipped",
];

const DOMAIN_COLORS: Record<string, string> = {
  Climate: "#c5f73b",
  Health: "rgba(250,250,250,0.7)",
  Education: "rgba(250,250,250,0.45)",
  Community: "rgba(250,250,250,0.25)",
};

export function OverviewDashboard({
  projects,
  impactStats,
  timeSeries,
  months,
  recentMilestones,
}: {
  projects: Project[];
  impactStats: ImpactStat[];
  timeSeries: { month: string; value: number }[];
  months: string[];
  recentMilestones: { id: string; date: string; title: string }[];
}) {
  void months;

  const kpis: KPIProps[] = [
    {
      label: impactStats[0].label,
      value: impactStats[0].value,
      compact: true,
      delta: impactStats[0].delta,
      deltaTone: "up",
      spark: timeSeries.map((d) => d.value),
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
    for (const p of projects) {
      acc[p.domain] = (acc[p.domain] ?? 0) + p.domainShare;
    }
    return Object.entries(acc).map(([name, value]) => ({
      name,
      value,
      color: DOMAIN_COLORS[name] ?? "rgba(250,250,250,0.3)",
    }));
  })();

  const projectBars = projects
    .map((p) => ({
      label: p.name,
      value: p.monthly[p.monthly.length - 1] ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  const statusFunnel = STATUS_ORDER.map((status) => ({
    status,
    count: projects.filter((p) => p.status === status).length,
  }));
  const maxFunnel = Math.max(...statusFunnel.map((s) => s.count), 1);

  type Row = {
    id: string;
    name: string;
    domain: string;
    status: Project["status"];
    reach: number;
    accuracy: number | null;
    href: string;
    spark: number[];
  };

  const tableRows: Row[] = projects.map((p) => {
    const acc =
      p.metrics.find((m) => m.label.includes("accuracy"))?.value ?? null;
    return {
      id: p.slug,
      name: p.name,
      domain: p.domain,
      status: p.status,
      reach: p.monthly[p.monthly.length - 1] ?? 0,
      accuracy: typeof acc === "number" ? acc : null,
      href: `/projects/${p.slug}`,
      spark: p.monthly,
    };
  });

  const cols: Column<Row>[] = [
    {
      key: "name",
      label: "Project",
      render: (r) => (
        <span className="text-white group-hover:text-lime font-semibold">
          {r.name}
        </span>
      ),
      sort: (a, b) => a.name.localeCompare(b.name),
    },
    {
      key: "domain",
      label: "Domain",
      render: (r) => (
        <span className="font-mono text-[11px] text-white/70">{r.domain}</span>
      ),
      sort: (a, b) => a.domain.localeCompare(b.domain),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusPill status={r.status} />,
      sort: (a, b) =>
        STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
    },
    {
      key: "reach",
      label: "Reach",
      align: "right",
      render: (r) => (
        <span className="font-mono tabular-nums text-lime">
          {formatNumber(r.reach)}
        </span>
      ),
      sort: (a, b) => a.reach - b.reach,
    },
    {
      key: "acc",
      label: "Accuracy",
      align: "right",
      render: (r) => (
        <span className="font-mono tabular-nums">
          {r.accuracy != null ? `${r.accuracy}%` : "—"}
        </span>
      ),
      sort: (a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0),
    },
    {
      key: "spark",
      label: "Trend",
      align: "right",
      width: "100px",
      render: (r) => (
        <div className="inline-flex justify-end">
          <Sparkline values={r.spark} width={88} height={24} strokeWidth={1.2} />
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      eyebrow="// dashboard / overview"
      title={`${site.name.split(" ")[0]} · AI for Good`}
      meta={
        <>
          <span>refreshed {new Date().toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span>{projects.length} projects</span>
          <span>·</span>
          <span>4 domains</span>
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
          title="Cumulative reach"
          subtitle="People served across all projects, monthly"
          span={8}
          spanLg={8}
          badge={
            <span className="font-mono text-[10px] text-lime">
              ↑ 19% qoq
            </span>
          }
        >
          <SmallAreaChart data={timeSeries} height={260} />
        </Panel>

        <Panel
          title="Domain split"
          subtitle="Share of total impact"
          span={4}
          spanLg={4}
        >
          <DonutChart
            data={domainData}
            height={260}
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
                <span className="ml-auto text-white/40">
                  {(d.value * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Project comparison"
          subtitle="Latest reach by project"
          span={8}
          spanLg={8}
        >
          <HorizontalBarChart data={projectBars} height={220} unit="" />
        </Panel>

        <Panel title="Pipeline status" subtitle="Projects by maturity" span={4} spanLg={4}>
          <ul className="space-y-3 mt-1">
            {statusFunnel.map((s) => {
              const pct = (s.count / maxFunnel) * 100;
              return (
                <li key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/70">
                      {s.status}
                    </span>
                    <span className="font-mono text-[11px] text-lime tabular-nums">
                      {s.count}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-lime transition-[width]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 font-mono text-[10px] text-white/35 leading-snug">
            // funnel narrows toward shipped — that&apos;s deliberate. Two
            projects past pilot is the goal for FY26.
          </p>
        </Panel>

        <Panel
          title="Project register"
          subtitle="Click a row to drill down"
          span={8}
          spanLg={8}
          control={
            <Link
              href="/projects"
              prefetch
              className="font-mono text-[10px] text-lime inline-flex items-center gap-1 hover:underline"
            >
              all projects <ArrowUpRight size={11} />
            </Link>
          }
          bodyClassName="p-0"
        >
          <div className="px-2">
            <DataTable
              rows={tableRows}
              columns={cols}
              defaultSort={{ key: "reach", dir: "desc" }}
            />
          </div>
        </Panel>

        <Panel
          title="Recent activity"
          subtitle="Last 6 build milestones"
          span={4}
          spanLg={4}
        >
          <ul className="space-y-3.5">
            {recentMilestones.map((m) => (
              <li
                key={m.id}
                className="flex gap-3 pb-3 border-b border-white/5 last:border-b-0 last:pb-0"
              >
                <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-lime shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime">
                    {m.date}
                  </p>
                  <p className="text-[13px] text-white/85 leading-snug truncate">
                    {m.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </PanelGrid>
    </DashboardShell>
  );
}
