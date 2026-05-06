"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function ProjectCard({ project }: { project: Project }) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      whileHover={
        reduce
          ? undefined
          : { scale: 1.005, rotate: 0.15 }
      }
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group bg-white border border-black/15 rounded-xl p-7 sm:p-12 hover:border-lime transition-colors"
      data-cursor
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
            {project.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip variant="solid">{project.domain}</Chip>
          {project.tech.slice(0, 3).map((t) => (
            <Chip key={t} variant="outline">
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime mb-3">
            // the problem
          </p>
          <p className="text-[15px] leading-[1.6] text-black/75 mb-5">
            {project.problem[0]}
          </p>
          <div className="border-l-2 border-lime pl-4">
            <p className="font-mono text-2xl font-semibold tracking-[-0.02em] text-black">
              {project.pullStat.value}
            </p>
            <p className="text-xs text-black/60 leading-snug mt-1">
              {project.pullStat.caption}
            </p>
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime mb-3">
            // the ai solution
          </p>
          <p className="text-[15px] leading-[1.6] text-black/75 mb-5">
            {project.solution[0]}
          </p>
          <ul className="space-y-2 text-[13px]">
            {project.solutionBullets.map((b) => (
              <li
                key={b.label}
                className="flex gap-2 items-start font-mono text-black/70"
              >
                <span className="text-lime mt-0.5">—</span>
                <span>
                  <span className="text-black">{b.label}:</span> {b.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime mb-3">
            // expected impact
          </p>
          <p className="text-[15px] leading-[1.6] text-black/75 mb-5">
            {project.impact[0]}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {project.metrics.slice(0, 4).map((m) => (
              <div
                key={m.label}
                className="border border-black/10 rounded-lg p-3"
              >
                <p className="text-2xl font-semibold tracking-[-0.02em] text-black">
                  {typeof m.value === "number" && m.value < 0
                    ? `${m.value}`
                    : m.value}
                  {m.unit && (
                    <span className="text-base text-black/60 ml-0.5">
                      {m.unit}
                    </span>
                  )}
                </p>
                <p className="text-[10px] uppercase tracking-[0.06em] font-mono text-black/50 mt-1">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-black/10">
        <div className="flex items-center gap-5 text-sm">
          {project.links.demo && (
            <a
              href={project.links.demo}
              className="inline-flex items-center gap-1.5 text-black hover:text-lime transition-colors"
              data-cursor
            >
              <ExternalLink size={14} /> Demo
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              className="inline-flex items-center gap-1.5 text-black hover:text-lime transition-colors"
              data-cursor
            >
              <GithubIcon size={14} /> GitHub
            </a>
          )}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          prefetch
          className="group/cta inline-flex items-center gap-2 font-mono text-sm text-black"
          data-cursor
        >
          Read case study
          <ArrowRight
            size={14}
            className="text-lime transition-transform group-hover/cta:translate-x-1"
          />
        </Link>
      </div>
    </motion.article>
  );
}
