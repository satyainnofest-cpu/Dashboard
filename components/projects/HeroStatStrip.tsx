"use client";

import { useEffect, useRef, useState } from "react";
import type { Metric } from "@/lib/types";
import { CountUp } from "@/components/ui/CountUp";

export function HeroStatStrip({ metrics }: { metrics: Metric[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStart(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-black text-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-8">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-3">
              {m.label}
            </p>
            <p className="text-[clamp(48px,7vw,88px)] font-semibold tracking-[-0.04em] leading-none">
              <span className="text-lime">
                {m.value < 0 && "−"}
                <CountUp
                  to={Math.abs(m.value)}
                  start={start}
                  duration={1500}
                  decimals={Number.isInteger(m.value) ? 0 : 1}
                />
                {m.unit && <span className="text-white/60 ml-1">{m.unit}</span>}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
