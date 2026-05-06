"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import type { Metric } from "@/lib/types";
import { Slider } from "@/components/ui/Slider";
import { CountUp } from "@/components/ui/CountUp";
import { formatNumber, clamp } from "@/lib/utils";

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

export function MetricExplorer({
  baseline,
  metricsBase,
}: {
  baseline: number;
  metricsBase: Metric[];
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const initial = clamp(Number(sp.get("scale") ?? 1), 1, 100);
  const [scale, setScale] = useState<number>(initial);

  // sync url with rAF throttling
  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (scale === 1) params.delete("scale");
    else params.set("scale", String(scale));
    const q = params.toString();
    const t = setTimeout(() => {
      router.replace(q ? `?${q}` : "?", { scroll: false });
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const projectedReach = Math.round(baseline * scale);

  const barData = useMemo(
    () =>
      metricsBase.slice(0, 4).map((m) => {
        const v = Math.abs(m.value);
        // Only project the first metric (reach) by scale; keep others honest
        const isReach =
          m.label.includes("farmer") ||
          m.label.includes("ASHA") ||
          m.label.includes("student") ||
          m.label.includes("school") ||
          m.label.includes("report") ||
          m.label.includes("reach") ||
          m.label.includes("consultation");
        const projected = isReach ? v * scale : v * (1 + (scale - 1) * 0.05);
        return {
          metric:
            m.label.length > 14 ? m.label.slice(0, 14) + "…" : m.label,
          current: Math.round(v),
          projected: Math.round(projected),
        };
      }),
    [metricsBase, scale]
  );

  const curveData = useMemo(() => {
    // Cost-per-person model: $0 fixed cloud, ~$1.20 per device,
    // amortizes across scaled reach.
    const points = [];
    for (let s = 1; s <= 100; s += 5) {
      const reach = Math.max(1, baseline * s);
      const cost = 1.2 + 250 / reach; // dev overhead amortized
      points.push({ scale: s, cost: Number(cost.toFixed(2)) });
    }
    return points;
  }, [baseline]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-3">
            // projection
          </p>
          <p className="text-[clamp(48px,9vw,120px)] font-semibold tracking-[-0.04em] leading-none text-lime">
            <CountUp
              to={projectedReach}
              start={true}
              duration={500}
              compact={projectedReach > 9999}
            />
          </p>
          <p className="mt-2 text-white/60 text-sm font-mono">
            // projected reach: people at {scale}× current deployment
          </p>
        </div>
        <button
          type="button"
          onClick={() => setScale(1)}
          className="self-start lg:self-auto inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/20 hover:border-lime hover:text-lime transition-colors font-mono text-xs uppercase tracking-[0.1em]"
          data-cursor
        >
          <RotateCcw size={12} /> reset
        </button>
      </div>

      <div className="border border-white/10 rounded-xl p-6 sm:p-8 mb-10">
        <div className="flex items-center justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-[0.1em] text-white/60">
            scale
          </label>
          <span className="font-mono text-xl text-lime tabular-nums">
            {scale}×
          </span>
        </div>
        <Slider
          min={1}
          max={100}
          step={1}
          value={scale}
          onChange={setScale}
          ariaLabel="Deployment scale"
          tone="dark"
        />
        <div className="flex justify-between mt-2 font-mono text-[10px] text-white/40">
          <span>1×</span>
          <span>50×</span>
          <span>100×</span>
        </div>
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
            amortizes as reach grows
          </p>
          <CostCurveChart data={curveData} />
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30 mt-6">
        // these are projections, not commitments. baseline:{" "}
        {formatNumber(baseline)} people.
      </p>
    </div>
  );
}
