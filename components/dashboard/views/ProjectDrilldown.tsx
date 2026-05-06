import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import {
  DashboardShell,
  PanelGrid,
} from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/Panel";
import { KPIGrid, type KPIProps } from "@/components/dashboard/KPITile";
import { GanttStrip, type GanttItem } from "@/components/charts/GanttStrip";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Sparkline } from "@/components/charts/Sparkline";
import { StatusPill } from "@/components/ui/StatusPill";
import { Chip } from "@/components/ui/Chip";
import { TechFlow } from "@/components/projects/TechFlow";
import { MetricExplorer } from "@/components/projects/MetricExplorer";

function parseStartedAt(s: string): number {
  const [y, m] = s.split("-").map(Number);
  return new Date(y || 2024, (m || 1) - 1, 1).getTime();
}

function parseTimelineDate(s: string): number {
  const [m, y] = s.split(" ");
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  return new Date(Number(y), months[m] ?? 0, 1).getTime();
}

const PROJECT_PALETTE = [
  "#c5f73b",
  "rgba(250,250,250,0.85)",
  "rgba(197, 247, 59, 0.65)",
  "rgba(250,250,250,0.55)",
  "rgba(197, 247, 59, 0.4)",
];

export function ProjectDrilldown({
  project,
  prev,
  next,
}: {
  project: Project;
  prev?: Project;
  next?: Project;
}) {
  const m = project.metrics.slice(0, 4);
  const reachLatest = project.monthly[project.monthly.length - 1] ?? 0;
  const reachPrev = project.monthly[project.monthly.length - 2] ?? 0;
  const monthlyDelta = reachLatest - reachPrev;

  const kpis: KPIProps[] = m.map((mm, i) => ({
    label: mm.label,
    value: typeof mm.value === "number" ? Math.abs(mm.value) : 0,
    suffix: mm.unit,
    delta:
      i === 0
        ? `${monthlyDelta >= 0 ? "+" : ""}${monthlyDelta} mom`
        : "actual",
    deltaTone: i === 0 ? (monthlyDelta >= 0 ? "up" : "down") : "neutral",
    spark: i === 0 ? project.monthly : undefined,
    hint: i === 0 ? "Reach trend, last 12 months" : undefined,
  }));

  const ganttItems: GanttItem[] = project.buildTimeline.map((t, i, arr) => {
    const start = parseTimelineDate(t.date);
    const end =
      i + 1 < arr.length
        ? parseTimelineDate(arr[i + 1].date)
        : start + 1000 * 60 * 60 * 24 * 60;
    return {
      label: t.title,
      start,
      end,
      color: PROJECT_PALETTE[i % PROJECT_PALETTE.length],
    };
  });

  void parseStartedAt;

  return (
    <DashboardShell
      eyebrow={`// dashboard / projects / ${project.slug}`}
      title={project.name}
      meta={
        <>
          <Chip variant="solid">{project.domain}</Chip>
          <StatusPill status={project.status} />
          <span>started {project.startedAt}</span>
          <span>·</span>
          <span>{project.tech.length} techs</span>
        </>
      }
    >
      <PanelGrid>
        <div className="col-span-12">
          <KPIGrid items={kpis} cols={4} />
        </div>

        <Panel
          title="Tagline"
          subtitle="The one-liner"
          span={8}
          spanLg={8}
        >
          <p className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] leading-[1.2] text-white">
            {project.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <Chip key={t} variant="outline">
                {t}
              </Chip>
            ))}
          </div>
        </Panel>

        <Panel
          title="Pull stat"
          subtitle="Why the problem matters"
          span={4}
          spanLg={4}
        >
          <p className="font-mono text-4xl font-semibold tracking-[-0.03em] text-lime leading-none">
            {project.pullStat.value}
          </p>
          <p className="text-sm text-white/75 mt-3 leading-snug">
            {project.pullStat.caption}
          </p>
          <p className="font-mono text-[10px] text-white/35 mt-3">
            source: {project.pullStat.source}
          </p>
        </Panel>

        <Panel
          title="The problem"
          subtitle="Field context, plainly stated"
          span={6}
          spanLg={6}
        >
          <div className="space-y-3 text-[14px] leading-[1.65] text-white/80 max-h-[420px] overflow-y-auto pr-1">
            {project.problem.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Panel>

        <Panel
          title="The AI solution"
          subtitle="What ships"
          span={6}
          spanLg={6}
        >
          <div className="space-y-3 text-[14px] leading-[1.65] text-white/80 max-h-[420px] overflow-y-auto pr-1">
            {project.solution.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Panel>

        <Panel
          title="Tech stack flow"
          subtitle="Data → model → deployment"
          span={12}
          spanLg={12}
        >
          <TechFlowDark bullets={project.solutionBullets} />
        </Panel>

        <Panel
          title="Reach over time"
          subtitle="People served per month"
          span={4}
          spanLg={4}
        >
          <Sparkline
            values={project.monthly}
            width={300}
            height={120}
            strokeWidth={2}
            className="w-full"
          />
          <div className="mt-3 flex items-end justify-between font-mono text-[10px] text-white/55">
            <span>start</span>
            <span className="text-lime tabular-nums">
              {reachLatest} now
            </span>
          </div>
        </Panel>

        <Panel
          title="Build timeline"
          subtitle="Milestones, scaled to time"
          span={8}
          spanLg={8}
        >
          {ganttItems.length ? (
            <GanttStrip items={ganttItems} />
          ) : (
            <p className="font-mono text-xs text-white/40 py-6">// no milestones</p>
          )}
        </Panel>

        <Panel
          title="Code"
          subtitle={project.codeSnippet.filename}
          span={7}
          spanLg={7}
          bodyClassName="p-0"
        >
          <div className="p-3">
            <CodeBlock
              filename={project.codeSnippet.filename}
              language={project.codeSnippet.language}
              code={project.codeSnippet.code}
            />
          </div>
        </Panel>

        <Panel
          title="Lessons learned"
          subtitle="Three honest takeaways"
          span={5}
          spanLg={5}
        >
          <ul className="space-y-3.5">
            {project.lessonsLearned.map((l, i) => (
              <li
                key={i}
                className="text-sm text-white/85 leading-relaxed flex gap-2"
              >
                <span className="text-lime shrink-0">— {String(i + 1).padStart(2, "0")}</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-2">
              tools
            </p>
            <p className="font-mono text-[11px] text-white/70 leading-snug">
              {project.toolsUsed.join(" · ")}
            </p>
          </div>
        </Panel>

        {project.quote && (
          <Panel
            title="Voice from the field"
            subtitle="A real user, quoted"
            span={12}
            spanLg={12}
          >
            <blockquote className="text-xl sm:text-2xl font-medium tracking-[-0.01em] leading-[1.35] text-white">
              <span className="text-lime mr-1">“</span>
              {project.quote.text}
              <span className="text-lime ml-1">”</span>
            </blockquote>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-white/45">
              — {project.quote.attribution}
            </p>
          </Panel>
        )}

        <Panel
          title="Metric explorer"
          subtitle="Drag to project at scale; live updates"
          span={12}
          spanLg={12}
        >
          <MetricExplorer
            baseline={project.reachBaseline}
            metricsBase={project.metrics}
          />
        </Panel>

        <Panel
          title="Adjacent projects"
          subtitle="Cycle through the register"
          span={12}
          spanLg={12}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prev && (
              <Link
                href={`/projects/${prev.slug}`}
                prefetch
                className="group flex items-center justify-between gap-3 border border-white/10 hover:border-lime rounded-lg p-4 transition-colors"
                data-cursor
              >
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1.5 inline-flex items-center gap-1.5">
                    <ArrowLeft size={11} /> previous
                  </p>
                  <p className="text-base font-semibold truncate">
                    {prev.name}
                  </p>
                  <p className="text-xs text-white/55 truncate">{prev.tagline}</p>
                </div>
              </Link>
            )}
            {next && (
              <Link
                href={`/projects/${next.slug}`}
                prefetch
                className="group flex items-center justify-between gap-3 border border-white/10 hover:border-lime rounded-lg p-4 transition-colors md:text-right"
                data-cursor
              >
                <div className="min-w-0 md:order-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1.5 inline-flex items-center gap-1.5 md:flex-row-reverse">
                    next <ArrowRight size={11} />
                  </p>
                  <p className="text-base font-semibold truncate">
                    {next.name}
                  </p>
                  <p className="text-xs text-white/55 truncate">{next.tagline}</p>
                </div>
              </Link>
            )}
          </div>
        </Panel>
      </PanelGrid>
    </DashboardShell>
  );
}

// Wrap TechFlow with a dark variant — the original is light-styled. Re-style inline.
function TechFlowDark({
  bullets,
}: {
  bullets: { label: string; value: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-3 min-w-max">
        {bullets.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="border border-white/15 rounded-lg p-3 min-w-[200px] bg-white/[0.02]">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime mb-1">
                {b.label}
              </p>
              <p className="text-sm text-white">{b.value}</p>
            </div>
            {i < bullets.length - 1 && (
              <span className="text-lime shrink-0" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Suppress a lint warning if TechFlow re-export is unused elsewhere.
void TechFlow;
