import { OverviewDashboard } from "@/components/dashboard/views/OverviewDashboard";
import { impactStats, journey, projects, timeSeriesData, timeSeriesMonths } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = false;

export default function HomePage() {
  const cumulative = timeSeriesData.reduce<
    { month: string; value: number }[]
  >((acc, d) => {
    const prev = acc[acc.length - 1]?.value ?? 0;
    const value =
      prev + d.kheti + d.triage + d.gurukul + d.ewaste + d.vidyut;
    acc.push({ month: d.month, value });
    return acc;
  }, []);
  const recent = [...journey]
    .reverse()
    .slice(0, 6)
    .map((m) => ({ id: m.id, date: m.date, title: m.title }));
  return (
    <OverviewDashboard
      projects={projects}
      impactStats={impactStats}
      timeSeries={cumulative}
      months={timeSeriesMonths}
      recentMilestones={recent}
    />
  );
}
