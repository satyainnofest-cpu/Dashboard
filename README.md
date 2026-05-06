# AI for Good — Portfolio

A multi-page Next.js portfolio for **Aarav Sharma**, a Grade 9 student in Bengaluru, presenting AI-for-Good projects under the theme *Impact through Innovation*.

The site is editorial in feel (Linear / Vercel / Anthropic) but **product** in behaviour: every filter works, every slider updates charts live, `Cmd+K` opens a search palette, page transitions are smooth, and Lighthouse stays in the high 90s.

## Stack

- Next.js 16 (App Router, Turbopack, React 19.2 + React Compiler)
- TypeScript, Tailwind CSS v4
- Framer Motion (component & layout animation)
- GSAP + ScrollTrigger (timeline scroll choreography, on demand)
- Lenis (smooth scroll)
- Recharts (dashboards, dynamically imported per route)
- shiki (syntax highlight, dynamically imported only on project detail pages)
- cmdk (`Cmd+K` palette)
- sonner (toasts)
- Lucide React + a small set of inline brand SVGs
- Vercel Analytics + Speed Insights
- Geist Sans + Geist Mono via `next/font/google` (self-hosted)

## Routes

```
/                    Home — hero, impact teaser, featured projects, manifesto, CTA
/projects            All projects with filters, search, sort, grid/list toggle, URL sync
/projects/[slug]     Deep dive — Problem / AI Solution / Expected Impact + Metric Explorer
/impact              Interactive dashboard with What-If sliders, time-series, breakdown
/journey             Vertical timeline + skills radar + mentors
/contact             Email-copy, GitHub live-fetch, LinkedIn
/sitemap.xml         All routes (incl. project slugs)
/robots.txt
/opengraph-image                       1200×630 root
/projects/[slug]/opengraph-image/[id]  per-project OG
```

All routes are statically generated (`export const dynamic = "force-static"`).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, all routes SSG
npm run start
npm run lint
```

## Editing content

All content lives in **`lib/data.ts`** — the single source of truth. Edit:

- `site` — name, age, location, mission, contact strings
- `projects` — slug, name, problem, solution, impact, tech, code snippet, gallery, metrics, monthly time series
- `impactStats`, `journey`, `skillsRadar`, `mentors`, `marqueeKeywords`, `openTo`

No prop-drilling, no client fetches; every page reads from this file.

## Design discipline

- **3 colours only**: white `#FAFAFA`, black `#0A0A0A`, lime `#C5F73B`. Hierarchy via opacity (`text-black/60`, `text-white/40`), never grays. Lime is sparing — one or two accents per viewport.
- **Typography**: Geist Sans display 600/700, tracking `-0.04em`. Geist Mono for labels, tags, numbers.
- **Motion**: Framer Motion for state-driven UI (filters, sliders, page transitions). GSAP only where multi-element scroll choreography earns it (timeline, hero spotlight). Lenis globally for smooth scroll.
- **Accessibility**: `prefers-reduced-motion` collapses every animation to opacity (or off), focus-visible lime outlines, skip-to-content link, AA contrast (lime is never used as body copy on white), aria-labels on chips, sliders, charts.

## Performance

Server Components by default; client islands only for interactive widgets.
Heavy libraries (Recharts, GSAP, shiki) are loaded via `next/dynamic({ ssr: false })` from the routes that actually need them:

| Library | Routes that ship it |
|---|---|
| Recharts | `/`, `/impact`, `/projects/[slug]`, `/journey` |
| GSAP + ScrollTrigger | `/`, `/journey` |
| shiki | `/projects/[slug]` |
| cmdk | global (~3 KB) |

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new). Defaults work — every route is static and edge-cached. No environment variables required.

## Notes

- The persona is plausibly invented; replace `lib/data.ts → site` with real details before shipping publicly.
- The `/contact` GitHub card live-fetches the public GitHub API for the latest repo on hover and gracefully falls back to "View profile →" if the username isn't real.
