import type { Metadata } from "next";
import { journey, mentors, projects, skillsRadar } from "@/lib/data";
import { JourneyDashboard } from "@/components/dashboard/views/JourneyDashboard";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Journey",
  description:
    "Builder profile dashboard — milestones, gantt timeline, skills radar, mentors.",
};

export default function JourneyPage() {
  return (
    <JourneyDashboard
      milestones={journey}
      skills={skillsRadar}
      mentors={mentors}
      projectsCount={projects.length}
    />
  );
}
