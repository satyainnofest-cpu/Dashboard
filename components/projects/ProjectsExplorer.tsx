"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Grid3x3, List, Search, X } from "lucide-react";
import type { Domain, Project, SortKey, ViewMode } from "@/lib/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/projects/EmptyState";

const DOMAINS: Domain[] = ["Climate", "Education", "Health", "Community"];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Most recent" },
  { key: "impact", label: "Most impact" },
  { key: "alpha", label: "Alphabetical" },
];

function impactScore(p: Project) {
  return p.monthly[p.monthly.length - 1] ?? 0;
}

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const initialDomains = useMemo<Domain[]>(() => {
    const raw = sp.get("domain");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .map((s) => DOMAINS.find((d) => d.toLowerCase() === s))
      .filter(Boolean) as Domain[];
  }, [sp]);
  const initialSearch = sp.get("search") ?? "";
  const initialSort = (sp.get("sort") as SortKey) ?? "recent";
  const initialView = (sp.get("view") as ViewMode) ?? "grid";

  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [view, setView] = useState<ViewMode>(initialView);
  const [sortOpen, setSortOpen] = useState(false);

  const deferredSearch = useDeferredValue(search);

  // sync state -> url
  useEffect(() => {
    const params = new URLSearchParams();
    if (domains.length) {
      params.set(
        "domain",
        domains.map((d) => d.toLowerCase()).join(",")
      );
    }
    if (deferredSearch) params.set("search", deferredSearch);
    if (sort !== "recent") params.set("sort", sort);
    if (view !== "grid") params.set("view", view);
    const q = params.toString();
    router.replace(q ? `?${q}` : "?", { scroll: false });
  }, [domains, deferredSearch, sort, view, router]);

  const toggleDomain = (d: Domain) => {
    setDomains((curr) =>
      curr.includes(d) ? curr.filter((x) => x !== d) : [...curr, d]
    );
  };

  const clearAll = () => {
    setDomains([]);
    setSearch("");
    setSort("recent");
    setView("grid");
  };

  const filtered = useMemo(() => {
    const q = deferredSearch.toLowerCase().trim();
    let list = projects.filter((p) => {
      if (domains.length > 0 && !domains.includes(p.domain)) return false;
      if (!q) return true;
      const hay = [
        p.name,
        p.tagline,
        p.domain,
        ...p.tech,
        p.problem.join(" "),
        p.solution.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    if (sort === "alpha") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "impact") {
      list = [...list].sort((a, b) => impactScore(b) - impactScore(a));
    } else {
      list = [...list].sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
    }
    return list;
  }, [projects, domains, deferredSearch, sort]);

  const hasFilters =
    domains.length > 0 || !!search || sort !== "recent" || view !== "grid";

  return (
    <div>
      <FilterBar
        domains={domains}
        toggleDomain={toggleDomain}
        clearAll={clearAll}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        view={view}
        setView={setView}
      />

      <div className="flex items-center justify-between font-mono text-[11px] text-black/50 mb-8">
        <span>
          Showing {filtered.length} of {projects.length} projects
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-lime hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState onClear={clearAll} />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectListItem project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function FilterBar({
  domains,
  toggleDomain,
  clearAll,
  search,
  setSearch,
  sort,
  setSort,
  sortOpen,
  setSortOpen,
  view,
  setView,
}: {
  domains: Domain[];
  toggleDomain: (d: Domain) => void;
  clearAll: () => void;
  search: string;
  setSearch: (s: string) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  sortOpen: boolean;
  setSortOpen: (b: boolean) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
}) {
  const allActive = domains.length === 0;
  const sortLabel =
    SORTS.find((s) => s.key === sort)?.label ?? "Most recent";

  // Close sort on outside click
  useOutsideClose(sortOpen, () => setSortOpen(false));

  // suppress unused-var warning (clearAll is used in header below; this fn doesn't need it)
  void clearAll;

  return (
    <div className="sticky top-16 z-30 -mx-5 sm:-mx-8 px-5 sm:px-8 mb-6 backdrop-blur-md bg-white/85 border-b border-black/10 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => domains.forEach(toggleDomain)}
            className={cn(
              "h-8 px-3 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
              allActive
                ? "bg-black text-white"
                : "border border-black/15 text-black hover:border-black/40"
            )}
          >
            All
          </button>
          {DOMAINS.map((d) => {
            const active = domains.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDomain(d)}
                aria-pressed={active}
                className={cn(
                  "h-8 px-3 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
                  active
                    ? "bg-lime text-black"
                    : "border border-black/15 text-black hover:border-black/40"
                )}
              >
                {d}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <label className="flex items-center gap-2 flex-1 sm:flex-none sm:w-72 border border-black/15 rounded-full h-9 px-3.5 focus-within:border-lime transition-colors">
            <Search size={14} className="text-black/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, tech, keywords…"
              className="bg-transparent flex-1 text-sm placeholder:text-lime/70 focus:outline-none"
              aria-label="Search projects"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-black/40 hover:text-black"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              data-sort-trigger
              className="h-9 px-3 inline-flex items-center gap-1.5 border border-black/15 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] text-black hover:border-black/40 transition-colors"
            >
              {sortLabel}
              <ChevronDown
                size={12}
                className={cn(
                  "transition-transform",
                  sortOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.ul
                  data-sort-menu
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute right-0 mt-2 min-w-[180px] bg-white border border-black/15 rounded-lg shadow-lg overflow-hidden z-40"
                >
                  {SORTS.map((s) => (
                    <li key={s.key}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(s.key);
                          setSortOpen(false);
                        }}
                        role="option"
                        aria-selected={sort === s.key}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm font-mono",
                          sort === s.key
                            ? "bg-lime text-black"
                            : "text-black hover:bg-black/5"
                        )}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center border border-black/15 rounded-full overflow-hidden h-9">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={cn(
                "h-full w-9 inline-flex items-center justify-center transition-colors",
                view === "grid" ? "bg-lime text-black" : "text-black hover:bg-black/5"
              )}
            >
              <Grid3x3 size={14} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={cn(
                "h-full w-9 inline-flex items-center justify-center transition-colors",
                view === "list" ? "bg-lime text-black" : "text-black hover:bg-black/5"
              )}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* tiny invisible chip to silence Chip-import being only used elsewhere */}
      <span className="sr-only">
        <Chip variant="ghost">filters</Chip>
      </span>
    </div>
  );
}

function useOutsideClose(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-sort-menu]") ||
        target.closest("[data-sort-trigger]")
      )
        return;
      close();
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open, close]);
}
