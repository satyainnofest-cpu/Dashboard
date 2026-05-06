"use client";

import { useMemo, useState } from "react";
import type { Domain, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOMAIN_COLORS: Record<Domain, string> = {
  Climate: "#c5f73b",
  Health: "rgba(250,250,250,0.7)",
  Education: "rgba(250,250,250,0.4)",
  Community: "rgba(250,250,250,0.2)",
};

export function DomainBreakdown({ projects }: { projects: Project[] }) {
  const [hover, setHover] = useState<Domain | null>(null);

  const segments = useMemo(() => {
    const totals = new Map<Domain, { share: number; projects: Project[] }>();
    (Object.keys(DOMAIN_COLORS) as Domain[]).forEach((d) =>
      totals.set(d, { share: 0, projects: [] })
    );
    for (const p of projects) {
      const t = totals.get(p.domain);
      if (t) {
        t.share += p.domainShare;
        t.projects.push(p);
      }
    }
    const sum = Array.from(totals.values()).reduce(
      (a, b) => a + b.share,
      0
    );
    return (Object.keys(DOMAIN_COLORS) as Domain[]).map((d) => {
      const t = totals.get(d)!;
      return {
        domain: d,
        share: sum ? t.share / sum : 0,
        projects: t.projects,
      };
    });
  }, [projects]);

  return (
    <section className="mb-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 mb-3">
        // breakdown
      </p>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] mb-6">
        Where the impact lives
      </h2>

      <div
        className="flex w-full h-14 rounded-xl overflow-hidden border border-white/10"
        role="img"
        aria-label="Impact share by domain"
      >
        {segments.map((s) => (
          <div
            key={s.domain}
            onMouseEnter={() => setHover(s.domain)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(s.domain)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            className={cn(
              "h-full transition-all",
              hover && hover !== s.domain && "opacity-40"
            )}
            style={{
              width: `${s.share * 100}%`,
              background: DOMAIN_COLORS[s.domain],
            }}
          >
            <span className="sr-only">
              {s.domain}: {(s.share * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {segments.map((s) => (
          <li
            key={s.domain}
            className={cn(
              "border rounded-xl p-4 transition-all cursor-pointer",
              hover === s.domain
                ? "border-lime"
                : "border-white/10 hover:border-white/30"
            )}
            onMouseEnter={() => setHover(s.domain)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: DOMAIN_COLORS[s.domain] }}
                aria-hidden
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
                {s.domain}
              </span>
            </div>
            <p className="text-3xl font-semibold tracking-[-0.02em] text-lime">
              {(s.share * 100).toFixed(0)}
              <span className="text-base text-white/55">%</span>
            </p>
            <p className="mt-1 text-[11px] text-white/50 leading-snug">
              {s.projects.map((p) => p.name).join(" · ") || "—"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
