"use client";

import { useEffect, useRef, useState } from "react";
import type { ImpactStat } from "@/lib/types";
import { CountUp } from "@/components/ui/CountUp";

export function ImpactKPIRow({ stats }: { stats: ImpactStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
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
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20"
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="border border-white/15 rounded-xl p-7 bg-transparent"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-4">
            {s.label}
          </p>
          <p className="text-[clamp(48px,7vw,96px)] font-semibold tracking-[-0.04em] leading-none text-lime">
            {s.unit === "$" && (
              <span className="text-white/55 mr-0.5">$</span>
            )}
            <CountUp to={s.value} duration={1500} start={start} compact />
            {s.unit && s.unit !== "$" && (
              <span className="text-white/55 ml-1">{s.unit}</span>
            )}
          </p>
          <p className="mt-3 font-mono text-[11px] text-lime/85">↑ {s.delta}</p>
          <p className="mt-2 text-sm text-white/60 leading-snug">
            {s.description}
          </p>
        </div>
      ))}
    </div>
  );
}
