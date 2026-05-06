import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";
import { StatusPill } from "@/components/ui/StatusPill";

export function ProjectListItem({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      prefetch
      className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border border-black/10 rounded-xl p-5 hover:border-lime transition-colors bg-white"
      data-cursor
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-2xl font-semibold tracking-[-0.02em]">
            {project.name}
          </h3>
          <StatusPill status={project.status} />
          <Chip variant="solid">{project.domain}</Chip>
        </div>
        <p className="text-sm text-black/65 line-clamp-2">{project.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <Chip key={t} variant="outline">
              {t}
            </Chip>
          ))}
        </div>
      </div>
      <div className="font-mono text-xs text-black/50 inline-flex items-center gap-2 self-start sm:self-auto">
        Read case study
        <ArrowRight
          size={13}
          className="text-lime transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
