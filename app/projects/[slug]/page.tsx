import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adjacentProjects, getProject, projects, site } from "@/lib/data";
import { ProjectDrilldown } from "@/components/dashboard/views/ProjectDrilldown";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: `${project.name} — ${project.tagline}`,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = adjacentProjects(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.tagline,
    about: project.domain,
    keywords: project.tech.join(", "),
    creator: { "@type": "Person", name: site.name },
    inLanguage: "en",
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProjectDrilldown project={project} prev={prev} next={next} />
    </>
  );
}
