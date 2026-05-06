"use client";

import dynamic from "next/dynamic";
import type { SkillAxis } from "@/lib/types";

const SkillsRadarChart = dynamic(
  () => import("@/components/charts/SkillsRadarChart"),
  { ssr: false, loading: () => <div className="h-[320px]" aria-hidden /> }
);

export function SkillsRadar({ data }: { data: SkillAxis[] }) {
  return (
    <div className="border border-white/10 rounded-xl p-5">
      <SkillsRadarChart data={data} />
    </div>
  );
}
