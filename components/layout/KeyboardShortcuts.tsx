"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { navLinks } from "@/lib/data";

const VIM_TIMEOUT = 1000;

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    let chord: "g" | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const resetChord = () => {
      chord = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const isTyping = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Escape") {
        setShowHelp(false);
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp((v) => !v);
        return;
      }

      if (chord === "g") {
        const map: Record<string, string> = {
          h: "/",
          p: "/projects",
          i: "/impact",
          j: "/journey",
          c: "/contact",
        };
        const target = map[e.key.toLowerCase()];
        if (target) {
          e.preventDefault();
          router.push(target);
        }
        resetChord();
        return;
      }
      if (e.key.toLowerCase() === "g") {
        chord = "g";
        timer = setTimeout(resetChord, VIM_TIMEOUT);
        return;
      }
    };

    const onShowHelp = () => setShowHelp(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener("open-shortcuts", onShowHelp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-shortcuts", onShowHelp);
      resetChord();
    };
  }, [router]);

  if (!showHelp) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={() => setShowHelp(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white border border-black/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[11px] text-black/40 mb-4">// shortcuts</p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] mb-6">
          Keyboard shortcuts
        </h2>
        <ul className="space-y-3 text-sm">
          {navLinks.map((l) => (
            <li
              key={l.href}
              className="flex items-center justify-between border-b border-black/5 pb-3"
            >
              <span>{l.label}</span>
              <span className="flex gap-1">
                <kbd className="font-mono text-[11px] border border-black/15 rounded px-1.5 py-0.5">
                  g
                </kbd>
                <kbd className="font-mono text-[11px] border border-black/15 rounded px-1.5 py-0.5">
                  {l.short}
                </kbd>
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between border-b border-black/5 pb-3">
            <span>Open command menu</span>
            <span className="flex gap-1">
              <kbd className="font-mono text-[11px] border border-black/15 rounded px-1.5 py-0.5">
                ⌘
              </kbd>
              <kbd className="font-mono text-[11px] border border-black/15 rounded px-1.5 py-0.5">
                K
              </kbd>
            </span>
          </li>
          <li className="flex items-center justify-between border-b border-black/5 pb-3">
            <span>Show this menu</span>
            <kbd className="font-mono text-[11px] border border-black/15 rounded px-1.5 py-0.5">
              ?
            </kbd>
          </li>
          <li className="flex items-center justify-between">
            <span>Close any modal</span>
            <kbd className="font-mono text-[11px] border border-black/15 rounded px-1.5 py-0.5">
              esc
            </kbd>
          </li>
        </ul>
      </div>
    </div>
  );
}
