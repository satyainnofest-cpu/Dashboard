"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardShell, PanelGrid } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/Panel";
import { KPIGrid, type KPIProps } from "@/components/dashboard/KPITile";
import {
  ClearButton,
  SlicerChip,
  SlicerLabel,
  SlicerSearch,
  SlicerSeparator,
} from "@/components/dashboard/Slicers";
import type { Domain, Project, ProjectStatus } from "@/lib/types";
import { StatusPill } from "@/components/ui/StatusPill";
import { Sparkline } from "@/components/charts/Sparkline";
import { DataTable, type Column } from "@/components/dashboard/DataTable";
import { Heatmap } from "@/components/charts/Heatmap";
import { formatNumber } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const HorizontalBarChart = dynamic(
  () => import("@/components/charts/HorizontalBarChart"),
  { ssr: false, loading: () => <div className="h-[260px]" aria-hidden /> }
);
const DonutChart = dynamic(() => import("@/components/charts/DonutChart"), {
  ssr: false,
  loading: () => <div className="h-[220px]" aria-hidden />,
});

const DOMAINS: Domain[] = ["Climate", "Education", "Health", "Community"];
const STATUSES: ProjectStatus[] = [
  "research",
  "prototype",
  "pilot",
  "shipped",
];
const STATUS_ORDER: ProjectStatus[] = [
  "research",
  "prototype",
  "pilot",
  "shipped",
];

const DOMAIN_COLORS: Record<Domain, string> = {
  Climate: "#c5f73b",
  Health: "rgba(250,250,250,0.7)",
  Education: "rgba(250,250,250,0.45)",
  Community: "rgba(250,250,250,0.25)",
};

export function ProjectsDashboard({
  projects,
  months,
}: {
  projects: Project[];
  months: string[];
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const initialDomains = useMemo<Domain[]>(() => {
    const raw = sp.get("domain");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .map((s) => DOMAINS.find((d) => d.toLowerCase() === s))
      .filter(Boolean) as Domain[];
  }, [sp]);
  const initialStatuses = useMemo<ProjectStatus[]>(() => {
    const raw = sp.get("status");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .map((s) => STATUSES.find((d) => d === s))
      .filter(Boolean) as ProjectStatus[];
  }, [sp]);

  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [statuses, setStatuses] = useState<ProjectStatus[]>(initialStatuses);
  const [search, setSearch] = useState(sp.get("search") ?? "");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const params = new URLSearchParams();
    if (domains.length)
      params.set("domain", domains.map((d) => d.toLowerCase()).join(","));
    if (statuses.length) params.set("status", statuses.join(","));
    if (deferredSearch) params.set("search", deferredSearch);
    const q = params.toString();
    router.replace(q ? `?${q}` : "?", { scroll: false });
  }, [domains, statuses, deferredSearch, router]);

  const toggleDomain = (d: Domain) =>
    setDomains((curr) =>
      curr.includes(d) ? curr.filter((x) => x !== d) : [...curr, d]
    );
  const toggleStatus = (s: ProjectStatus) =>
    setStatuses((curr) =>
      curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]
    );
  const clearAll = () => {
    setDomains([]);
    setStatuses([]);
    setSearch("");
  };

  const filtered = useMemo(() => {
    const q = deferredSearch.toLowerCase().trim();
    return projects.filter((p) => {
      if (domains.length > 0 && !domains.includes(p.domain)) return false;
      if (statuses.length > 0 && !statuses.includes(p.status)) return false;
      if (!q) return true;
      const hay = [
        p.name,
        p.tagline,
        p.domain,
        ...p.tech,
        p.problem.join(" "),
        p.solution.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [projects, domains, statuses, deferredSearch]);

  const totalReach = filtered.reduce(
    (a, p) => a + (p.monthly[p.monthly.length - 1] ?? 0),
    0
  );
  const distinctDomains = new Set(filtered.map((p) => p.domain)).size;
  const distinctTech = new Set(filtered.flatMap((p) => p.tech)).size;

  const kpis: KPIProps[] = [
    {
      label: "projects matching",
      value: filtered.length,
      delta: `${projects.length} total`,
      deltaTone: "neutral",
      hint: "After active filters",
    },
    {
      label: "combined reach",
      value: totalReach,
      compact: true,
      delta: "↑ live",
      deltaTone: "up",
      hint: "Sum of latest-month reach",
    },
    {
      label: "domains",
      value: distinctDomains,
      delta: `of ${DOMAINS.length}`,
      deltaTone: "neutral",
      hint: "Distinct in selection",
    },
    {
      label: "techs used",
      value: distinctTech,
      delta: "stack",
      deltaTone: "neutral",
      hint: "Unique tools across selection",
    },
  ];

  const bars = filtered
    .map((p) => ({
      label: p.name,
      value: p.monthly[p.monthly.length - 1] ?? 0,
      color: DOMAIN_COLORS[p.domain],
    }))
    .sort((a, b) => b.value - a.value);

  const domainCounts = (() => {
    const acc: Record<string, number> = {};
    for (const p of filtered) acc[p.domain] = (acc[p.domain] ?? 0) + 1;
    return Object.entries(acc).map(([name, value]) => ({
      name,
      value,
      color: DOMAIN_COLORS[name as Domain],
    }));
  })();

  const heatRows = filtered.map((p) => ({
    label: p.name,
    values: p.monthly,
  }));

  type Row = {
    id: string;
    name: string;
    domain: Domain;
    status: ProjectStatus;
    tech: string[];
    started: string;
    reach: number;
    accuracy: number | null;
    href: string;
    spark: number[];
  };
  const rows: Row[] = filtered.map((p) => ({
    id: p.slug,
    name: p.name,
    domain: p.domain,
    status: p.status,
    tech: p.tech,
    started: p.startedAt,
    reach: p.monthly[p.monthly.length - 1] ?? 0,
    accuracy:
      (p.metrics.find((m) => m.label.includes("accuracy"))?.value as
        | number
        | undefined) ?? null,
    href: `/projects/${p.slug}`,
    spark: p.monthly,
  }));

  const cols: Column<Row>[] = [
    {
      key: "name",
      label: "Project",
      render: (r) => <span className="font-semibold">{r.name}</span>,
      sort: (a, b) => a.name.localeCompare(b.name),
    },
    {
      key: "domain",
      label: "Domain",
      render: (r) => (
        <span className="font-mono text-[11px] text-white/75">{r.domain}</span>
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
      key: "tech",
      label: "Stack",
      render: (r) => (
        <span className="font-mono text-[11px] text-white/55 truncate inline-block max-w-[260px] align-middle">
          {r.tech.slice(0, 4).join(" · ")}
          {r.tech.length > 4 ? " · …" : ""}
        </span>
      ),
    },
    {
      key: "started",
      label: "Started",
      render: (r) => (
        <span className="font-mono text-[11px] text-white/55">{r.started}</span>
      ),
      sort: (a, b) => a.started.localeCompare(b.started),
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
      width: "110px",
      render: (r) => (
        <div className="inline-flex justify-end">
          <Sparkline values={r.spark} width={92} height={24} strokeWidth={1.2} />
        </div>
      ),
    },
  ];

  const hasFilters =
    domains.length > 0 || statuses.length > 0 || !!search;

  return (
    <DashboardShell
      eyebrow="// dashboard / projects"
      title="Project explorer"
      meta={
        <>
          <span>
            {filtered.length}/{projects.length} matching
          </span>
          <span>·</span>
          <span>{distinctDomains} domains</span>
          <span>·</span>
          <span className="text-lime">filters live</span>
        </>
      }
      slicers={
        <>
          <SlicerLabel>domain</SlicerLabel>
          {DOMAINS.map((d) => (
            <SlicerChip
              key={d}
              active={domains.includes(d)}
              onClick={() => toggleDomain(d)}
            >
              {d}
            </SlicerChip>
          ))}
          <SlicerSeparator />
          <SlicerLabel>status</SlicerLabel>
          {STATUSES.map((s) => (
            <SlicerChip
              key={s}
              active={statuses.includes(s)}
              onClick={() => toggleStatus(s)}
            >
              {s}
            </SlicerChip>
          ))}
          <SlicerSeparator />
          <SlicerSearch
            value={search}
            onChange={setSearch}
            placeholder="Search name, tech, keyword…"
          />
          <ClearButton show={hasFilters} onClick={clearAll} />
        </>
      }
    >
      <PanelGrid>
        <div className="col-span-12">
          <KPIGrid items={kpis} cols={4} />
        </div>

        <Panel
          title="Reach by project"
          subtitle="Latest-month people served"
          span={8}
          spanLg={8}
        >
          {bars.length ? (
            <HorizontalBarChart data={bars} height={Math.max(160, bars.length * 44)} />
          ) : (
            <p className="font-mono text-xs text-white/40 py-6">
              // no projects match
            </p>
          )}
        </Panel>

        <Panel title="Domain mix" subtitle="Count per domain" span={4} spanLg={4}>
          {domainCounts.length ? (
            <DonutChart
              data={domainCounts}
              height={220}
              centerLabel="domains"
              centerValue={String(domainCounts.length)}
            />
          ) : (
            <p className="font-mono text-xs text-white/40 py-6">
              // no projects match
            </p>
          )}
        </Panel>

        <Panel
          title="Reach heatmap"
          subtitle="Monthly reach intensity by project"
          span={12}
          spanLg={12}
        >
          {heatRows.length ? (
            <Heatmap rows={heatRows} columns={months} />
          ) : (
            <p className="font-mono text-xs text-white/40 py-6">
              // no projects match
            </p>
          )}
        </Panel>

        <Panel
          title="Project register"
          subtitle="Sortable; click row to drill down"
          span={12}
          spanLg={12}
          control={
            <Link
              href="/impact"
              prefetch
              className="font-mono text-[10px] text-lime inline-flex items-center gap-1 hover:underline"
            >
              impact dashboard <ArrowUpRight size={11} />
            </Link>
          }
          bodyClassName="p-0"
        >
          <div className="px-2">
            <DataTable
              rows={rows}
              columns={cols}
              defaultSort={{ key: "reach", dir: "desc" }}
            />
          </div>
        </Panel>
      </PanelGrid>
    </DashboardShell>
  );
}
