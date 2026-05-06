import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredSlugs, projects } from "@/lib/data";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function FeaturedProjects() {
  const featured = featuredSlugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter(Boolean) as typeof projects;

  return (
    <section className="bg-white py-24 sm:py-32" data-theme="light">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <SectionLabel tone="light" className="mb-5">
              // 02 — featured
            </SectionLabel>
            <h2 className="font-semibold tracking-[-0.04em] text-[clamp(40px,6vw,88px)] leading-[0.98]">
              Built with intent<span className="text-lime">.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-black/70">
              Three of the five — picked because each tackles a problem I&apos;ve
              actually been in the room for.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/projects"
            prefetch
            className="group inline-flex items-center gap-2 font-mono text-sm text-black"
            data-cursor
          >
            View all 5 projects
            <ArrowRight
              size={14}
              className="text-lime transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
