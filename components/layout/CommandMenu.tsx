"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { toast } from "sonner";
import { navLinks, projects, site } from "@/lib/data";
import { ArrowRight, Copy, Mail, Search } from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onCustom);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onCustom);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      toast.success("Email copied ✓");
      setOpen(false);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
    >
      <div
        className="w-full max-w-xl rounded-xl bg-white border border-black/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Menu" loop className="font-sans">
          <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
            <Search size={16} className="text-black/40" />
            <Command.Input
              autoFocus
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command…"
              className="w-full bg-transparent text-sm text-black placeholder:text-lime focus:outline-none"
            />
            <kbd className="font-mono text-[10px] text-black/40 border border-black/15 rounded px-1.5 py-0.5">
              esc
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-sm text-black/50 text-center font-mono">
              // no results
            </Command.Empty>
            <Command.Group heading="Pages" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-black/40">
              {navLinks.map((l) => (
                <Command.Item
                  key={l.href}
                  value={`page ${l.label}`}
                  onSelect={() => go(l.href)}
                  className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-lime aria-selected:text-black"
                >
                  <span className="flex items-center gap-3">
                    <ArrowRight size={14} className="opacity-50" />
                    {l.label}
                  </span>
                  <span className="font-mono text-[11px] opacity-50">
                    g {l.short}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Projects" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-black/40">
              {projects.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`project ${p.name} ${p.domain} ${p.tech.join(" ")}`}
                  onSelect={() => go(`/projects/${p.slug}`)}
                  className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-lime aria-selected:text-black"
                >
                  <span className="flex items-center gap-3">
                    <ArrowRight size={14} className="opacity-50" />
                    {p.name}
                  </span>
                  <span className="font-mono text-[11px] opacity-50">
                    {p.domain.toLowerCase()}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-black/40">
              <Command.Item
                value="copy email"
                onSelect={copyEmail}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-lime aria-selected:text-black"
              >
                <Copy size={14} className="opacity-50" />
                Copy email address
              </Command.Item>
              <Command.Item
                value="open contact"
                onSelect={() => go("/contact")}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-lime aria-selected:text-black"
              >
                <Mail size={14} className="opacity-50" />
                Open contact page
              </Command.Item>
              <Command.Item
                value="show keyboard shortcuts"
                onSelect={() => {
                  setOpen(false);
                  window.dispatchEvent(new Event("open-shortcuts"));
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer aria-selected:bg-lime aria-selected:text-black"
              >
                <span className="font-mono text-xs opacity-50">?</span>
                View keyboard shortcuts
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
