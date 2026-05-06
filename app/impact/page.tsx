import type { Metadata } from "next";
import { Suspense } from "react";
import {
  impactStats,
  projects,
  timeSeriesData,
  timeSeriesMonths,
} from "@/lib/data";
import { ImpactDashboardView } from "@/components/dashboard/views/ImpactDashboardView";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Impact",
  description:
    "Impact dashboard with KPIs, time-series, what-if simulator, and methodology.",
};

export default function ImpactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ImpactDashboardView
        projects={projects}
        impactStats={impactStats}
        timeSeries={timeSeriesData}
        months={timeSeriesMonths}
      />
    </Suspense>
  );
}
