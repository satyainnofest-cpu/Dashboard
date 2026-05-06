"use client";

import {
  DashboardShell,
  PanelGrid,
} from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/Panel";
import { KPIGrid, type KPIProps } from "@/components/dashboard/KPITile";
import { ContactCards } from "@/components/contact/ContactCards";

export function ContactDashboard({
  email,
  github,
  linkedin,
  openTo,
  name,
}: {
  email: string;
  github: string;
  linkedin: string;
  openTo: string[];
  name: string;
}) {
  const kpis: KPIProps[] = [
    {
      label: "preferred channel",
      value: 1,
      suffix: " · email",
      delta: "fastest",
      deltaTone: "up",
      hint: "Direct, low-noise",
    },
    {
      label: "avg. response time",
      value: 24,
      suffix: "h",
      delta: "school days",
      deltaTone: "neutral",
      hint: "Slower on exam weeks",
    },
    {
      label: "open-to streams",
      value: openTo.length,
      delta: "active",
      deltaTone: "up",
      hint: "Collab, mentorship, ideas",
    },
    {
      label: "languages",
      value: 3,
      suffix: " · en/hi/kn",
      delta: "comfortable",
      deltaTone: "neutral",
      hint: "Working proficiency",
    },
  ];

  return (
    <DashboardShell
      eyebrow="// dashboard / contact"
      title="Contact directory"
      meta={
        <>
          <span>{name}</span>
          <span>·</span>
          <span>Bengaluru, India</span>
          <span>·</span>
          <span className="text-lime">accepting messages</span>
        </>
      }
    >
      <PanelGrid>
        <div className="col-span-12">
          <KPIGrid items={kpis} cols={4} />
        </div>

        <Panel
          title="Channels"
          subtitle="Click email to copy. GitHub fetches latest repo on hover."
          span={12}
          spanLg={12}
          bodyClassName="p-4"
        >
          <ContactCardsWrapper
            email={email}
            github={github}
            linkedin={linkedin}
          />
        </Panel>

        <Panel
          title="Open to"
          subtitle="Reasons to reach out"
          span={12}
          spanLg={8}
        >
          <ul className="space-y-3">
            {openTo.map((b, i) => (
              <li
                key={i}
                className="text-base text-white/85 leading-snug flex gap-3"
              >
                <span className="text-lime shrink-0 font-mono text-sm">
                  — {String(i + 1).padStart(2, "0")}
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Build credits"
          subtitle="What this site runs on"
          span={12}
          spanLg={4}
        >
          <ul className="space-y-1.5 font-mono text-[11px] text-white/65">
            <li>— next.js 16 (app router, ssg)</li>
            <li>— react 19.2 + react compiler</li>
            <li>— typescript / tailwind v4</li>
            <li>— framer motion · gsap · lenis</li>
            <li>— recharts (dynamic) · shiki</li>
            <li>— sonner · cmdk · lucide</li>
            <li>— deploy: vercel edge cdn</li>
          </ul>
          <p className="mt-5 pt-3 border-t border-white/10 font-mono text-[10px] text-white/35">
            © 2025 {name} · all data static · zero backend
          </p>
        </Panel>
      </PanelGrid>
    </DashboardShell>
  );
}

// Wrapper that retones the existing ContactCards (built for a light bg) to dark.
function ContactCardsWrapper({
  email,
  github,
  linkedin,
}: {
  email: string;
  github: string;
  linkedin: string;
}) {
  return (
    <div className="dashboard-contact-dark">
      <ContactCards email={email} github={github} linkedin={linkedin} />
    </div>
  );
}
