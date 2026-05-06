import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";
import { StatusPill } from "@/components/ui/StatusPill";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HeroStatStrip } from "@/components/projects/HeroStatStrip";
import { MetricExplorer } from "@/components/projects/MetricExplorer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { TechFlow } from "@/components/projects/TechFlow";
import { SectionNav } from "@/components/projects/SectionNav";

const SECTION_IDS = [
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "impact", label: "Impact" },
  { id: "build", label: "Behind the build" },
];

export function ProjectDetailLayout({
  project,
  prev,
  next,
}: {
  project: Project;
  prev?: Project;
  next?: Project;
}) {
  return (
    <article className="bg-white text-black">
      {/* Header */}
      <header className="pt-32 pb-16 sm:pt-36 sm:pb-20 bg-white">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/40 mb-8">
            //{" "}
            <Link href="/projects" prefetch className="hover:text-lime">
              projects
            </Link>{" "}
            / {project.slug}
          </p>
          <h1 className="font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(48px,10vw,120px)]">
            {project.name}
          </h1>
          <p className="mt-5 max-w-3xl text-xl sm:text-2xl text-black/65 leading-[1.4]">
            {project.tagline}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Chip variant="solid">{project.domain}</Chip>
            <StatusPill status={project.status} />
            {project.tech.map((t) => (
              <Chip key={t} variant="outline">
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </header>

      {/* Hero stat strip */}
      <HeroStatStrip metrics={project.metrics.slice(0, 3)} />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24">
        <SectionNav sections={SECTION_IDS} />

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-16">
          <div className="space-y-24 sm:space-y-32 max-w-3xl">
            {/* Problem */}
            <section id="problem" className="scroll-mt-24">
              <SectionLabel tone="light" className="mb-4">
                // the problem
              </SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] mb-8">
                Why this exists.
              </h2>
              <div className="space-y-5 text-[18px] leading-[1.7] text-black/80">
                {project.problem.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <aside className="mt-10 border-l-2 border-lime pl-5 max-w-md">
                <p className="font-mono text-3xl font-semibold tracking-[-0.02em]">
                  {project.pullStat.value}
                </p>
                <p className="text-sm text-black/65 mt-1">
                  {project.pullStat.caption}
                </p>
                <p className="font-mono text-[11px] text-black/40 mt-2">
                  source: {project.pullStat.source}
                </p>
              </aside>
              {project.quote && (
                <blockquote className="mt-12 max-w-2xl">
                  <p className="font-mono text-2xl sm:text-3xl tracking-[-0.01em] text-black leading-[1.3]">
                    <span className="text-lime mr-1">“</span>
                    {project.quote.text}
                    <span className="text-lime ml-1">”</span>
                  </p>
                  <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-black/45">
                    — {project.quote.attribution}
                  </footer>
                </blockquote>
              )}
            </section>

            {/* Solution */}
            <section id="solution" className="scroll-mt-24">
              <SectionLabel tone="light" className="mb-4">
                // the ai solution
              </SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] mb-8">
                How it actually works.
              </h2>
              <div className="space-y-5 text-[18px] leading-[1.7] text-black/80">
                {project.solution.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-10">
                <TechFlow bullets={project.solutionBullets} />
              </div>

              <div className="mt-10">
                <CodeBlock
                  filename={project.codeSnippet.filename}
                  language={project.codeSnippet.language}
                  code={project.codeSnippet.code}
                />
              </div>
            </section>

            {/* Impact */}
            <section
              id="impact"
              className="scroll-mt-24 -mx-5 sm:-mx-8 px-5 sm:px-8 py-16 sm:py-20 bg-black text-white rounded-none"
            >
              <SectionLabel tone="dark" className="mb-4">
                // expected impact
              </SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] mb-8">
                What this could do at scale.
              </h2>
              <div className="space-y-5 text-[18px] leading-[1.7] text-white/75 max-w-2xl">
                {project.impact.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="mt-12">
                <MetricExplorer
                  baseline={project.reachBaseline}
                  metricsBase={project.metrics}
                />
              </div>
            </section>

            {/* Behind the build */}
            <section id="build" className="scroll-mt-24">
              <SectionLabel tone="light" className="mb-4">
                // behind the build
              </SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] mb-10">
                The story isn&apos;t the model.
              </h2>
              <div className="grid md:grid-cols-3 gap-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-black/40 mb-4">
                    timeline
                  </p>
                  <ul className="space-y-5">
                    {project.buildTimeline.map((m) => (
                      <li
                        key={m.title}
                        className="border-l border-black/15 pl-4"
                      >
                        <p className="font-mono text-[11px] text-lime uppercase tracking-[0.1em]">
                          {m.date}
                        </p>
                        <p className="text-sm font-semibold mt-0.5">
                          {m.title}
                        </p>
                        <p className="text-sm text-black/65 mt-1 leading-snug">
                          {m.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-black/40 mb-4">
                    tools
                  </p>
                  <ul className="space-y-1.5">
                    {project.toolsUsed.map((t) => (
                      <li
                        key={t}
                        className="text-sm font-mono text-black/75"
                      >
                        — {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-black/40 mb-4">
                    lessons
                  </p>
                  <ul className="space-y-3">
                    {project.lessonsLearned.map((l, i) => (
                      <li
                        key={i}
                        className="text-sm text-black/80 leading-relaxed"
                      >
                        <span className="text-lime mr-2">—</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
          <div aria-hidden className="hidden lg:block" />
        </div>
      </div>

      {/* Prev / Next */}
      <nav
        className="mt-24 sm:mt-32 border-t border-black/10 grid grid-cols-1 md:grid-cols-2"
        aria-label="Adjacent projects"
      >
        {prev && (
          <Link
            href={`/projects/${prev.slug}`}
            prefetch
            className="group p-8 sm:p-12 border-b md:border-b-0 md:border-r border-black/10 hover:border-lime transition-all hover:bg-lime/5"
            data-cursor
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/40 mb-4 inline-flex items-center gap-2">
              <ArrowLeft size={12} /> previous
            </p>
            <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
              {prev.name}
            </p>
            <p className="mt-2 text-sm text-black/60">{prev.tagline}</p>
          </Link>
        )}
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            prefetch
            className="group p-8 sm:p-12 hover:border-lime transition-all hover:bg-lime/5 md:text-right"
            data-cursor
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/40 mb-4 inline-flex items-center gap-2 md:flex-row-reverse">
              next <ArrowRight size={12} />
            </p>
            <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
              {next.name}
            </p>
            <p className="mt-2 text-sm text-black/60">{next.tagline}</p>
          </Link>
        )}
      </nav>
    </article>
  );
}
