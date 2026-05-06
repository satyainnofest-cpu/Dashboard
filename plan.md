# AI for Good — Portfolio Dashboard Plan (v2)

> Hackathon build. **Multi-page** Next.js dashboard. No backend. Theme: **Impact through Innovation**.
> v2 adds: real multi-page architecture, deep interactivity (filters, search, sliders, command palette), and aggressive performance budgets.

---

## 1. Project Vision

A bold, editorial-modern, **multi-page** portfolio for a **Grade 9 student from India** presenting under the **"AI for Good — Impact through Innovation"** theme. Each project is framed in three beats — **Problem → AI Solution → Expected Impact** — and gets its own deep-dive page so judges can spend real time with the work.

The site looks like Linear / Vercel / Anthropic — strong type, asymmetric layouts, scroll-driven motion, exactly three colors. But it also *feels* like a real product: filters work, sliders update charts live, Cmd+K opens a search palette, page transitions are silky.

---

## 2. Narrative & Tone

- **Tagline:** *Impact through Innovation*
- **Sub-narrative:** *AI in the hands of a 14-year-old can still move the needle on real problems — climate, education, healthcare, community.*
- **Tone:** Confident, optimistic, technical, grounded in honest data. Projected metrics are clearly labeled as projected.

---

## 3. Tech Stack (no backend, performance-first)

| Layer | Pick | Why |
|---|---|---|
| Framework | **Next.js 15** App Router, full SSG | Static = fastest. Route-based code-splitting for free. |
| Language | **TypeScript** | Catches errors fast in a sprint |
| Styling | **Tailwind CSS v4** | Atomic, fastest iteration |
| Component motion | **Framer Motion** | Best DX for state-driven motion + layout animations + AnimatePresence |
| Scroll choreography | **GSAP + ScrollTrigger** | For orchestrated scroll sequences (timeline draw-in, hero) |
| Page transitions | **Framer Motion AnimatePresence** + Next.js `template.tsx` | Smooth route-to-route transitions |
| Smooth scroll | **Lenis** | Buttery feel, pairs with GSAP |
| Charts | **Recharts** | Declarative, themeable, light bundle |
| Command palette | **cmdk** (`cmdk` npm pkg) | Battle-tested, ~3KB, accessible |
| Toasts | **sonner** | ~4KB, beautiful, accessible |
| Icons | **Lucide React** | Tree-shakeable |
| Fonts | **Geist Sans + Geist Mono** via `next/font` | Self-hosted, zero FOUT |
| Analytics | **Vercel Analytics** + **Speed Insights** | Privacy-respecting, free |
| Deploy | **Vercel** | One click, Edge CDN, Image Optimization |

**Why both Framer Motion AND GSAP?** Framer Motion owns component state + layout animations (filtering, sorting, page transitions). GSAP owns multi-element scroll choreography (timeline draw, hero word-by-word, parallax). Use each where it's best.

---

## 4. Design System

### Strict 3-color discipline

| Token | Hex | Use |
|---|---|---|
| `--white` | `#FAFAFA` | Light section bg, type on dark |
| `--black` | `#0A0A0A` | Dark section bg, type on light |
| `--lime` | `#C5F73B` | CTAs, underlines, data points, key words |

**Rules:**
- Lime is sparing — one or two accents per viewport max
- No grays — use opacity (`text-black/60`, `text-white/70`)
- No gradients except an optional subtle radial behind the home hero

### Typography

- **Display:** Geist Sans, weight 600–700, tracking `-0.04em`, size `clamp(48px, 8vw, 120px)`
- **Body:** Geist Sans 400, 18–20px, line-height 1.6
- **Mono:** Geist Mono — section labels, tags, numbers, stat readouts

### Layout & motion principles

- 12-col grid baseline; sections break it on purpose
- Sections alternate light/dark within pages for rhythm
- Every page has *one* hero animation on load
- Hover states are subtle and instant (~120ms)
- Page transitions feel like the site, not like a reload (300–500ms)
- Always respect `prefers-reduced-motion`

---

## 5. Multi-Page Architecture

### Routes

```
/                    Home — hero + impact teaser + 3 featured projects + CTA
/projects            All projects with live filtering + search + sort
/projects/[slug]     Deep dive — full Problem/Solution/Impact + tech + gallery + demo
/impact              Interactive dashboard — charts, what-if sliders, full metrics
/journey             Timeline + about + skills radar
/contact             Big contact CTA page
```

### Why multi-page (not one giant scroll)

- **Faster first paint.** Each page ships only its own JS bundle. Home loads in <1s.
- **Better SEO.** Each project has its own URL, OG image, and meta — shareable on its own.
- **Better UX for judges.** They can deep-link directly to a project to revisit during scoring.
- **Real interactivity room.** A dedicated `/impact` page can host sliders + charts without competing with hero animation budget.
- **Cleaner story.** Each page has one clear job. No "where do I scroll to find X" confusion.

### Page transitions (the glue)

Use a `app/template.tsx` with Framer Motion `AnimatePresence`. Transition is:
- Outgoing page: fade out + scale 0.98 (200ms)
- Lime sweep across viewport (200ms, optional, only on first navigation per session)
- Incoming page: fade in + scale 1 (300ms)

This makes a multi-page site feel "appy" instead of like a static site.

---

## 6. Page-by-Page Spec

### `/` — Home (light hero, alternating)

**Sections:**
1. **Hero** — name + "is building" + "AI for Good." (lime) + mission line + mono grade tag + scrolling marquee + scroll cue. *On load:* word-by-word reveal.
2. **Impact teaser** (dark) — 4 animated count-up stats + a tiny area chart. CTA: *See full dashboard →* linking to `/impact`.
3. **Featured projects** (light) — 3 of the projects, full ProjectCard treatment. CTA: *View all projects →*.
4. **Manifesto** (dark) — oversized pull quote with lime punchline.
5. **CTA** (light) — "Let's build the future." + contact links.

**Interactivity:**
- Cursor-following lime spotlight on hero (a soft 200px radial that tracks the cursor at low opacity, desktop only)
- Marquee speed responds to scroll velocity (faster as you scroll faster)
- Project cards have a subtle hover tilt (Framer Motion 3D transform, ~3deg)
- Click any nav link → smooth page transition

---

### `/projects` — All Projects (light)

**Layout:**
- Hero strip: small mono label, h1 "Projects." (lime period), subhead
- **Filter bar** (sticky as user scrolls):
  - Domain filters: All · Climate · Education · Health · Community (chips, click to toggle)
  - Search input: live-filters by name, tech, or keyword in problem/solution
  - Sort: Recent · Most Impact · Alphabetical
  - View toggle: Grid · List
- **Project grid/list:** filtered + animated with Framer Motion `<motion.div layout>` so cards animate to new positions when filters change
- Each tile shows: name, domain chip, tech chips, 2-line problem teaser, "Read case study →"

**Interactivity (the meat):**
- **Live filter chips** — click to add/remove, multi-select OK, Framer Motion layout animates the grid
- **Live search** — debounced 150ms, highlights matched text in tile previews
- **Sort toggle** — re-orders with layout animation
- **Grid ↔ List toggle** — same data, different layout, animated transition
- **Active filter readout** — mono text below the bar shows what's filtered + a "clear all" link
- **No-results state** — playful empty state with lime mascot/illustration

**Performance:**
- All filtering is client-side (data is static, ~5 projects), zero network calls
- Search uses simple lowercased substring match — no fuzzy lib needed for 5 items
- Filter state persists in URL (`?domain=climate&sort=impact`) so judges can share filtered views

---

### `/projects/[slug]` — Project Deep Dive (light → mixed)

**Long-form case study layout:**

1. **Header strip (light):**
   - Mono breadcrumb: `// projects / [slug]`
   - Project name (h1, display)
   - Domain chip + tech chips
   - Status pill: "shipped" / "pilot" / "prototype" / "in research"

2. **Hero stat strip (dark):** 3 big stats — e.g. *1,200* people reached · *94%* model accuracy · *$0* cost to deploy. Animated count-ups.

3. **The Problem (light):**
   - Mono label + h2
   - Long-form copy (3–5 paragraphs)
   - Pull stat with source citation
   - Optional: a quote from a real person affected (with attribution)

4. **The AI Solution (light):**
   - Mono label + h2
   - Long-form copy
   - **Tech stack diagram** — mini visual showing data → model → output, lime-accented
   - **Code snippet block** (syntax-highlighted, dark, mono) showing one key piece
   - **Demo embed** if available (iframe or video)

5. **Expected Impact (dark):**
   - Mono label + h2
   - Long-form copy
   - **Interactive metric explorer** (the wow moment):
     - A slider for "scale" (1× → 100×)
     - As you drag, charts and numbers update live to show *projected* impact at that scale
     - Honestly labeled as projection
   - Recharts viz: projected vs achieved bar comparison

6. **Behind the build (light):** 3-column grid:
   - Timeline of build (1 week, 1 month, etc.)
   - Tools used (with logos)
   - Lessons learned (3 bullets)

7. **Next/Prev project nav (light):** at the bottom, two big lime arrows linking to adjacent projects.

**Interactivity:**
- Scale slider with live-updating charts (centerpiece)
- Image gallery — click to lightbox, keyboard nav (arrows, esc)
- Code snippet has a "copy" button with toast feedback
- Sticky in-page section nav on the right (desktop only)

**Per-project SEO:**
- Each route generates its own:
  - `<title>`, `<meta description>`
  - OG image via `app/projects/[slug]/opengraph-image.tsx`
  - JSON-LD structured data (`CreativeWork` schema)

---

### `/impact` — Interactive Dashboard (dark)

The page that earns its name. A **live, interactive impact dashboard.**

**Layout:**

1. **Header:** mono label + h1 "Impact." (lime period) + one-liner: *Real numbers from real projects. Drag the sliders to see what's possible at scale.*

2. **Top KPI row:** 4 huge counters with delta indicators (lime ↑) showing change since last quarter.

3. **Time-series chart (Recharts):**
   - X-axis: months
   - Y-axis: cumulative people reached
   - Multiple series, one per project, color-coded with lime + opacity variants
   - **Hover anywhere shows a crosshair tooltip** with exact values
   - **Toggle series on/off** by clicking legend chips

4. **What-if simulator (the showpiece):**
   - 3 sliders:
     - "If I scale to N schools" (1 → 1000)
     - "If accuracy improves by X%" (0 → 30%)
     - "If deployment time drops to Y days" (30 → 1)
   - As any slider moves, two charts and a big projected-impact number update live
   - A "reset" button restores default state
   - State persists in URL so judges can share a specific projection

5. **Domain breakdown:** Recharts stacked bar showing impact split by Climate / Health / Education / Community, interactive on hover.

6. **Methodology footer:** small mono block explaining how impact is calculated, what "projected" means.

**Interactivity:**
- Sliders update charts in real time (no debounce — 60fps)
- Tooltip crosshairs on all charts
- Series toggle on legend click
- URL state for shareable views

**Why this page wins:**
Most student portfolios *list* impact. This one lets judges *play* with it. That's the difference between "I built a thing" and "I understand the system."

---

### `/journey` — Timeline + About (dark)

1. **Hero:** mono label + h1 "Two years. A lot of attempts." + one-liner.
2. **Vertical timeline:** 8–10 milestones, line draws on scroll (GSAP), each milestone clickable.
3. **Click a milestone → inline expand:** shows a longer story (3–5 sentences), photos if any, links/repos. Other expanded milestones collapse. Smooth height animation (Framer Motion).
4. **Skills radar:** Recharts RadarChart — ML / Web / Hardware / Research / Design / Communication. Hover an axis for context tooltip.
5. **A short "about" block:** one paragraph + a portrait (optional, lime overlay treatment).
6. **Mentors / inspirations:** small grid of 3–6 names with one-line attributions.

**Interactivity:**
- Click-to-expand timeline items (only one expanded at a time)
- Skill radar tooltips
- Optional: hold a key (e.g., `T`) to autoscroll the timeline at reading pace

---

### `/contact` — Big CTA (light)

1. **Massive type:** "Let's build the future." (lime "future.")
2. **Three contact cards:**
   - **Email** — click to copy, lime checkmark + "copied!" toast on success
   - **GitHub** — opens in new tab, hover shows latest repo name
   - **LinkedIn** — opens in new tab
3. **A short "what I'd love to hear from you about" block:** 3 bullet points (collaborations, mentorship, ideas).
4. **Footer with build credits.**

**Interactivity:**
- Copy email to clipboard with toast feedback
- Hover GitHub card → fetches latest public repo via GitHub's public API and shows it (cached, no auth needed) — *optional, falls back to static if API fails*

---

## 7. Global Interactivity (works on every page)

- **Cmd+K command palette** (cmdk lib):
  - Quick nav to any page
  - Quick jump to any project
  - Toggle reduce-motion on the fly
  - Copy email
- **Custom cursor** (desktop only): 12px black dot, grows to 32px lime ring on interactive hover
- **Scroll progress bar** at top of viewport, lime
- **Toast system** (sonner) for copy actions, filter applied confirmations, etc.
- **Keyboard shortcuts:**
  - `g h` → home, `g p` → projects, `g i` → impact, `g j` → journey, `g c` → contact
  - `?` opens a modal listing shortcuts
  - `Esc` closes any modal/lightbox
- **Page transitions:** AnimatePresence on `app/template.tsx`

---

## 8. Performance Budgets (aggressive)

| Metric | Target | How |
|---|---|---|
| First Contentful Paint | < 0.8s | SSG, no client JS for hero text |
| Largest Contentful Paint | < 1.2s | Type-only above the fold, no images |
| Time to Interactive | < 1.5s | Server Components default |
| Cumulative Layout Shift | < 0.05 | Reserve space, fonts via next/font |
| Total Blocking Time | < 100ms | Code-split heavy components |
| First-load JS per route | < 130 KB | Dynamic imports for charts, GSAP, cmdk |
| Lighthouse Performance | ≥ 95 | All of the above |
| Lighthouse Accessibility | ≥ 95 | Semantic HTML, contrast, keyboard nav |

### Performance tactics

1. **Server Components by default.** Only opt into Client Components for things that need interactivity (filter bar, sliders, command palette). Hero text is server-rendered HTML.

2. **Dynamic imports for heavy stuff:**
   ```ts
   const ImpactChart = dynamic(() => import('@/components/ImpactChart'), {
     loading: () => <ChartSkeleton />,
     ssr: false,
   });
   ```
   Chart libs and GSAP only load on pages that use them.

3. **Route prefetching:** `<Link prefetch>` (default in Next 15) — when a user hovers a nav link, the next page's JS is already in cache. Page transitions feel instant.

4. **Static Generation everywhere.** All routes are SSG. `generateStaticParams` for `/projects/[slug]`. Zero server runtime.

5. **`next/image` with proper sizing** for any images. AVIF + WebP fallback. `priority` only on the home hero (none, if hero is type-only).

6. **`next/font` for Geist** — self-hosted, zero CLS, no FOUT.

7. **Tree-shake icons.** Import only the Lucide icons you use. No barrel imports.

8. **Recharts only on `/impact` and project detail pages.** Don't ship it on `/contact`.

9. **Lenis is ~6KB.** Fine globally. Initialize in a Client Component in `app/layout.tsx`.

10. **GSAP** — only load on pages that need ScrollTrigger (home, journey, project detail). Use `next/dynamic` to scope it.

11. **Edge caching:** Vercel does this automatically for SSG.

12. **Defer Vercel Analytics + Speed Insights** — they load after interactive.

13. **No external scripts.** No Google Fonts, no jQuery, no third-party widgets.

14. **Preload Lottie/heavy assets** only on the route that uses them.

---

## 9. Component Inventory

```
components/
├── layout/
│   ├── Nav.tsx               // sticky, lime hover underlines, scroll progress bar
│   ├── Footer.tsx
│   ├── PageTransition.tsx    // Framer Motion wrapper for app/template.tsx
│   ├── SmoothScroll.tsx      // Lenis wrapper
│   ├── CommandMenu.tsx       // cmdk-powered Cmd+K palette
│   ├── Cursor.tsx            // custom dot cursor (desktop only)
│   └── KeyboardShortcuts.tsx // global hotkey listener
├── sections/
│   ├── Hero.tsx
│   ├── ImpactTeaser.tsx
│   ├── FeaturedProjects.tsx
│   ├── Manifesto.tsx
│   └── ContactCTA.tsx
├── projects/
│   ├── ProjectCard.tsx       // for /projects grid
│   ├── ProjectListItem.tsx   // for /projects list view
│   ├── FilterBar.tsx
│   ├── SearchInput.tsx
│   ├── EmptyState.tsx
│   └── ProjectDetailLayout.tsx
├── impact/
│   ├── KPICard.tsx
│   ├── TimeSeriesChart.tsx
│   ├── WhatIfSlider.tsx
│   ├── DomainBreakdown.tsx
│   └── MetricExplorer.tsx
├── journey/
│   ├── Timeline.tsx
│   ├── TimelineItem.tsx
│   └── SkillsRadar.tsx
├── ui/
│   ├── Button.tsx
│   ├── Chip.tsx
│   ├── StatCounter.tsx
│   ├── SectionLabel.tsx
│   ├── Reveal.tsx
│   ├── Marquee.tsx
│   ├── CodeBlock.tsx
│   └── Lightbox.tsx
└── icons/
```

---

## 10. Data Layer

All content lives in `lib/data.ts` — single source of truth.

```ts
export const site = { name, age, location, mission, tagline, ... };
export const projects: Project[] = [
  { slug, name, domain, status, tech, problem, solution, impact, links, gallery, ... },
  ...
];
export const impactStats: Stat[] = [...];
export const timeSeriesData = [...];
export const journey: Milestone[] = [...];
export const skills: SkillRadar = {...};
export const contact = { email, github, linkedin, twitter };
```

Edit `data.ts`, every page updates. No prop-drilling, no client fetches.

---

## 11. Build Order (hackathon time, ~9 hours)

| # | Task | Time |
|---|---|---|
| 1 | Scaffold + Tailwind v4 + fonts + Lenis + design tokens + Nav + page transition shell | 45 min |
| 2 | `/` Home page — hero, impact teaser, featured projects, manifesto, CTA | 90 min |
| 3 | `/projects` — filter bar, search, sort, grid/list toggle, layout animations | 90 min |
| 4 | `/projects/[slug]` — full case study layout + metric explorer slider | 120 min |
| 5 | `/impact` — KPIs, time-series chart, what-if simulator, domain breakdown | 90 min |
| 6 | `/journey` — timeline + skills radar | 60 min |
| 7 | `/contact` — copy-to-clipboard + GitHub fetch | 30 min |
| 8 | Cmd+K command palette + keyboard shortcuts + cursor + toast system | 60 min |
| 9 | Performance pass (dynamic imports, audit bundle, fix Lighthouse) | 60 min |
| 10 | Mobile responsive pass | 60 min |
| 11 | OG images + favicon + JSON-LD + sitemap + README + deploy | 45 min |

**Total: ~9 hours.** A focused two-day hackathon fits this comfortably.

---

## 12. Differentiators (what wins judging)

1. **Real multi-page app, not a scroll-essay.** Routing, prefetching, page transitions — feels like a product.
2. **`/impact` lets judges interact with your impact**, not just read it. What-if sliders are memorable.
3. **Cmd+K** signals "I think about UX." Most students don't ship this.
4. **Lighthouse 95+** signals engineering rigor.
5. **Per-project deep dives with their own URLs** mean a judge can share your project to a colleague mid-judging.
6. **3-color discipline** keeps the visual signal-to-noise extreme.
7. **Honest projected metrics** with clear labeling = trust.
8. **Page transitions + cursor + scroll progress + filter animations** = polish saturation.

---

## 13. Stretch Goals (only if time)

- **PWA support** — installable, offline read of the home page
- **Blog/notes** at `/notes` — short markdown posts on what you've learned
- **Live GitHub repo embed** on each project page (latest commit, star count)
- **Press kit** at `/press` — downloadable bio, photo, logos
- **Resume PDF download** generated from `data.ts` (use `@react-pdf/renderer`)
- **Easter egg** — Konami code triggers a hidden lime-on-black "thanks for looking closely" page

Ignore these unless the main 11 ship clean.

---

## 14. File Structure (target)

```
ai-for-good-portfolio/
├── app/
│   ├── layout.tsx              // root layout, fonts, Lenis, Nav, CommandMenu
│   ├── template.tsx            // page transition wrapper
│   ├── page.tsx                // /
│   ├── projects/
│   │   ├── page.tsx            // /projects
│   │   └── [slug]/
│   │       ├── page.tsx        // /projects/[slug]
│   │       └── opengraph-image.tsx
│   ├── impact/page.tsx
│   ├── journey/page.tsx
│   ├── contact/page.tsx
│   ├── globals.css
│   ├── opengraph-image.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
├── lib/
│   ├── data.ts                 // ALL content
│   ├── utils.ts
│   └── analytics.ts
├── public/
│   ├── favicon.ico
│   └── images/
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
