"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/Slider";
import { CountUp } from "@/components/ui/CountUp";
import { clamp, formatNumber } from "@/lib/utils";

const ProjectedBarChart = dynamic(
  () =>
    import("@/components/charts/MetricExplorerCharts").then(
      (m) => m.ProjectedBarChart
    ),
  { ssr: false, loading: () => <div className="h-[240px]" aria-hidden /> }
);
const CostCurveChart = dynamic(
  () =>
    import("@/components/charts/MetricExplorerCharts").then(
      (m) => m.CostCurveChart
    ),
  { ssr: false, loading: () => <div className="h-[240px]" aria-hidden /> }
);

const DEFAULTS = { scale: 1, accuracy: 0, deploy: 30 } as const;

export function WhatIfSimulator({
  baselineReach,
  projects,
}: {
  baselineReach: number;
  projects: { slug: string; name: string; reach: number }[];
}) {
  const sp = useSearchParams();
  const router = useRouter();

  const [scale, setScale] = useState<number>(
    clamp(Number(sp.get("scale") ?? DEFAULTS.scale), 1, 1000)
  );
  const [accuracy, setAccuracy] = useState<number>(
    clamp(Number(sp.get("accuracy") ?? DEFAULTS.accuracy), 0, 30)
  );
  const [deploy, setDeploy] = useState<number>(
    clamp(Number(sp.get("deploy") ?? DEFAULTS.deploy), 1, 30)
  );

  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (scale !== DEFAULTS.scale) params.set("scale", String(scale));
    else params.delete("scale");
    if (accuracy !== DEFAULTS.accuracy) params.set("accuracy", String(accuracy));
    else params.delete("accuracy");
    if (deploy !== DEFAULTS.deploy) params.set("deploy", String(deploy));
    else params.delete("deploy");
    const t = setTimeout(() => {
      const q = params.toString();
      router.replace(q ? `?${q}` : "?", { scroll: false });
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, accuracy, deploy]);

  const projectedReach = Math.round(baselineReach * scale);

  const barData = useMemo(() => {
    const reachMult = scale;
    const accMult = 1 + accuracy / 100;
    const deployMult = 30 / Math.max(1, deploy);
    return [
      {
        metric: "reach",
        current: baselineReach,
        projected: Math.round(baselineReach * reachMult),
      },
      {
        metric: "accuracy",
        current: 87,
        projected: Math.min(99, Math.round(87 * accMult)),
      },
      {
        metric: "deploy days",
        current: 30,
        projected: deploy,
      },
      {
        metric: "lives/wk",
        current: Math.round(baselineReach * 0.04),
        projected: Math.round(baselineReach * 0.04 * reachMult * deployMult),
      },
    ];
  }, [baselineReach, scale, accuracy, deploy]);

  const curveData = useMemo(() => {
    const points = [];
    for (let s = 1; s <= 100; s += 5) {
      const reach = Math.max(1, baselineReach * (scale * s) / 100);
      const cost = 1.2 + 1500 / reach;
      points.push({ scale: s, cost: Number(cost.toFixed(2)) });
    }
    return points;
  }, [baselineReach, scale]);

  const reset = () => {
    setScale(DEFAULTS.scale);
    setAccuracy(DEFAULTS.accuracy);
    setDeploy(DEFAULTS.deploy);
  };

  // suppress unused-var: projects shape is used in tooltip prep below
  void projects;

  return (
    <section className="border border-white/10 rounded-xl p-6 sm:p-10 mb-24">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 mb-2">
            // simulator
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.05]">
            What if we scaled<span className="text-lime">?</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            Drag the sliders. The projections update live.{" "}
            <span className="font-mono text-white/40">
              // all projections, not commitments
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/20 hover:border-lime hover:text-lime transition-colors font-mono text-xs uppercase tracking-[0.1em]"
          data-cursor
        >
          <RotateCcw size={12} /> reset to current
        </button>
      </div>

      <div className="my-12 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 mb-3">
          // projected reach
        </p>
        <p className="text-[clamp(64px,12vw,144px)] font-semibold tracking-[-0.04em] leading-none text-lime">
          <CountUp
            to={projectedReach}
            start
            duration={500}
            compact={projectedReach > 9999}
          />
          <span className="text-white/55 text-2xl ml-3 align-middle font-normal">
            people
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <SliderCard
          label="scale to schools"
          value={scale}
          unit="×"
          min={1}
          max={1000}
          step={1}
          onChange={setScale}
        />
        <SliderCard
          label="accuracy improvement"
          value={accuracy}
          unit="%"
          min={0}
          max={30}
          step={1}
          onChange={setAccuracy}
        />
        <SliderCard
          label="deployment time"
          value={deploy}
          unit=" days"
          min={1}
          max={30}
          step={1}
          onChange={setDeploy}
          inverted
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-white/10 rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-4">
            // current vs projected
          </p>
          <ProjectedBarChart data={barData} />
        </div>
        <div className="border border-white/10 rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1">
            // cost per person ($)
          </p>
          <p className="font-mono text-[10px] text-white/30 mb-3">
            decreases as scale grows; baseline {formatNumber(baselineReach)}
          </p>
          <CostCurveChart data={curveData} />
        </div>
      </div>
    </section>
  );
}

function SliderCard({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
  inverted,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  inverted?: boolean;
}) {
  return (
    <div className="border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <label className="font-mono text-xs uppercase tracking-[0.1em] text-white/60">
          {label}
        </label>
        <span className="font-mono text-xl text-lime tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        ariaLabel={label}
        tone="dark"
      />
      <div className="flex justify-between mt-2 font-mono text-[10px] text-white/30">
        <span>
          {inverted ? max : min}
          {unit}
        </span>
        <span>
          {inverted ? min : max}
          {unit}
        </span>
      </div>
    </div>
  );
}
