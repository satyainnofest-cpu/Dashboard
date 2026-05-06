"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/charts/Sparkline";
import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/utils";

export type KPIProps = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  spark?: number[];
  hint?: string;
  compact?: boolean;
};

export function KPITile({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  delta,
  deltaTone = "up",
  spark,
  hint,
  compact = false,
}: KPIProps) {
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
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="border border-white/10 rounded-lg p-4 bg-white/[0.015] hover:border-white/20 transition-colors flex flex-col justify-between gap-3 min-h-[148px]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/45">
          {label}
        </p>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-mono text-[10px] tabular-nums",
              deltaTone === "up"
                ? "text-lime"
                : deltaTone === "down"
                  ? "text-white/85"
                  : "text-white/45"
            )}
          >
            {deltaTone === "up" ? (
              <ArrowUpRight size={11} />
            ) : deltaTone === "down" ? (
              <ArrowDownRight size={11} />
            ) : null}
            {delta}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[0.9] text-lime">
          {prefix && <span className="text-white/55 mr-0.5">{prefix}</span>}
          <CountUp
            to={value}
            duration={1300}
            start={start}
            decimals={decimals}
            compact={compact}
          />
          {suffix && <span className="text-white/55 ml-0.5">{suffix}</span>}
        </p>
        {spark && spark.length > 1 && (
          <Sparkline values={spark} width={96} height={36} />
        )}
      </div>

      {hint && (
        <p className="font-mono text-[10px] text-white/35 leading-snug">
          {hint}
        </p>
      )}
    </div>
  );
}

export function KPIGrid({
  items,
  cols = 4,
}: {
  items: KPIProps[];
  cols?: 2 | 3 | 4 | 5 | 6;
}) {
  const gridClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : cols === 4
          ? "grid-cols-2 lg:grid-cols-4"
          : cols === 5
            ? "grid-cols-2 lg:grid-cols-5"
            : "grid-cols-2 lg:grid-cols-6";
  return (
    <div className={cn("grid gap-4", gridClass)}>
      {items.map((k) => (
        <KPITile key={k.label} {...k} />
      ))}
    </div>
  );
}
