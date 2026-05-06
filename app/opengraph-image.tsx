import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Aarav Sharma — AI for Good";

export default function Image() {
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
          // portfolio.aiforgood
        </div>
        <div
          style={{
            marginTop: "auto",
            fontSize: 110,
            lineHeight: 1.0,
            fontWeight: 700,
            letterSpacing: -4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Aarav Sharma</span>
          <span>
            is building <span style={{ color: "#c5f73b" }}>AI for Good.</span>
          </span>
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 14,
            color: "rgba(250,250,250,0.55)",
            fontSize: 22,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#c5f73b" }}>—</span>
          <span>grade 9 · india · impact through innovation</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
