import { ImageResponse } from "next/og";
import { getProject, projects } from "@/lib/data";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AI for Good — project case study";

export function generateImageMetadata() {
  return projects.map((p) => ({
    id: p.slug,
    alt: `${p.name} — ${p.tagline}`,
    contentType: "image/png",
    size,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#0a0a0a",
            color: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
          }}
        >
          Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            color: "rgba(250,250,250,0.4)",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          // ai for good · {project.domain.toLowerCase()}
        </div>
        <div
          style={{
            marginTop: "auto",
            fontSize: 96,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: -3,
            display: "flex",
          }}
        >
          {project.name}
          <span style={{ color: "#c5f73b" }}>.</span>
        </div>
        <div
          style={{
            color: "rgba(250,250,250,0.65)",
            fontSize: 30,
            lineHeight: 1.3,
            marginTop: 18,
            maxWidth: 980,
            display: "flex",
          }}
        >
          {project.tagline}
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 14,
            color: "rgba(250,250,250,0.55)",
            fontSize: 20,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#c5f73b" }}>—</span>
          <span>aarav sharma · grade 9 · india</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
