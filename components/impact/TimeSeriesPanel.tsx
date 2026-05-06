"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TimeSeriesAreaChart = dynamic(
  () => import("@/components/charts/TimeSeriesAreaChart"),
  { ssr: false, loading: () => <div className="h-[360px]" aria-hidden /> }
);

type SeriesKey = "kheti" | "triage" | "gurukul" | "ewaste" | "vidyut";

type Datum = {
  month: string;
  kheti: number;
  triage: number;
  gurukul: number;
  ewaste: number;
  vidyut: number;
};

const SHORT_KEY: Record<string, SeriesKey> = {
  "kheti-ai": "kheti",
  "triage-saheli": "triage",
  gurukul: "gurukul",
  "e-waste-mapper": "ewaste",
  vidyut: "vidyut",
};

const COLORS: Record<string, string> = {
  kheti: "#c5f73b",
  triage: "rgba(250,250,250,0.7)",
  gurukul: "rgba(250,250,250,0.4)",
  ewaste: "rgba(250,250,250,0.2)",
  vidyut: "rgba(197, 247, 59, 0.5)",
};

export function TimeSeriesPanel({
  data,
  projects,
}: {
  data: Datum[];
  projects: { slug: string; name: string; domain: string }[];
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setHidden((curr) => {
      const next = new Set(curr);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section className="border border-white/10 rounded-xl p-5 sm:p-7 mb-24">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 mb-2">
            // cumulative reach over time
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            Per-project growth
          </h2>
        </div>
        <ul className="flex flex-wrap gap-2">
          {projects.map((p) => {
            const k = SHORT_KEY[p.slug];
            if (!k) return null;
            const off = hidden.has(k);
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => toggle(k)}
                  aria-pressed={!off}
                  className={cn(
                    "h-7 px-2.5 inline-flex items-center gap-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.08em] border transition-colors",
                    off
                      ? "border-white/15 text-white/40"
                      : "border-white/30 text-white"
                  )}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: COLORS[k] }}
                    aria-hidden
                  />
                  {p.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <TimeSeriesAreaChart data={data} hidden={hidden} />
    </section>
  );
}
