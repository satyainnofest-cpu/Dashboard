import type { Metadata } from "next";
import { Suspense } from "react";
import { projects, timeSeriesMonths } from "@/lib/data";
import { ProjectsDashboard } from "@/components/dashboard/views/ProjectsDashboard";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Project explorer dashboard — slicers, KPIs, reach heatmap, sortable register.",
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ProjectsDashboard projects={projects} months={timeSeriesMonths} />
    </Suspense>
  );
}
