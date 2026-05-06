"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { impactStats, timeSeriesData } from "@/lib/data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CountUp } from "@/components/ui/CountUp";

const SmallAreaChart = dynamic(
  () => import("@/components/charts/SmallAreaChart"),
  {
    ssr: false,
    loading: () => <div className="h-[180px]" aria-hidden />,
  }
);

const cumulative = (() => {
  let total = 0;
  return timeSeriesData.map((d) => {
    total += d.kheti + d.triage + d.gurukul + d.ewaste + d.vidyut;
    return { month: d.month, value: total };
  });
})();

export function ImpactTeaser() {
  const ref = useRef<HTMLElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStart(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-black text-white py-24 sm:py-32"
      data-theme="dark"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <SectionLabel tone="dark" className="mb-5">
              // 01 — impact
            </SectionLabel>
            <h2 className="font-semibold tracking-[-0.04em] text-[clamp(40px,6vw,88px)] leading-[0.98]">
              The numbers that matter<span className="text-lime">.</span>
            </h2>
          </div>
          <Link
            href="/impact"
            className="group inline-flex items-center gap-2 font-mono text-sm text-lime"
            data-cursor
          >
            See full dashboard
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 mb-20">
          {impactStats.map((s) => (
            <div key={s.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-3">
                {s.label}
              </p>
              <div className="text-[clamp(48px,7vw,96px)] font-semibold tracking-[-0.04em] leading-none text-lime">
                {s.unit === "$" && <span className="text-white/60 mr-0.5">$</span>}
                <CountUp to={s.value} duration={1600} start={start} />
                {s.unit && s.unit !== "$" && (
                  <span className="text-white/60 ml-1">{s.unit}</span>
                )}
              </div>
              <p className="mt-3 font-mono text-[11px] text-lime/80">{s.delta}</p>
              <p className="mt-2 text-sm text-white/60 max-w-[28ch]">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <div className="border border-white/10 rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/40">
              // cumulative reach over time
            </p>
            <p className="font-mono text-[11px] text-lime">all projects</p>
          </div>
          <SmallAreaChart data={cumulative} height={220} />
        </div>
      </div>
    </section>
  );
}
