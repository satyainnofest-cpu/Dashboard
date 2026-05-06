"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Milestone } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Timeline({ items }: { items: Milestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);

  // GSAP draws the center line as you scroll past the timeline section.
  useEffect(() => {
    if (reduce) {
      if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      return;
    }
    let mounted = true;
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (!mounted) return;
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          lineRef.current!,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.5,
            },
          }
        );
      }, containerRef);
    })();
    return () => {
      mounted = false;
      if (ctx) ctx.revert();
    };
  }, [reduce]);

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto py-8">
      <div
        ref={lineRef}
        aria-hidden
        className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 origin-top"
        style={{ transform: "scaleY(0)" }}
      />
      <ul className="relative space-y-12">
        {items.map((m, i) => (
          <TimelineRow
            key={m.id}
            item={m}
            index={i}
            isOpen={open === m.id}
            onToggle={() => setOpen(open === m.id ? null : m.id)}
            reduce={!!reduce}
          />
        ))}
      </ul>
    </div>
  );
}

function TimelineRow({
  item,
  index,
  isOpen,
  onToggle,
  reduce,
}: {
  item: Milestone;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reduce: boolean;
}) {
  const left = item.side === "left";
  return (
    <li className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-4">
      <div className={cn(left ? "" : "invisible md:visible md:order-1")}>
        {left && <Card item={item} isOpen={isOpen} onToggle={onToggle} reduce={reduce} index={index} />}
      </div>

      <div className="flex justify-center pt-2">
        <span
          className="block h-3 w-3 rounded-full bg-lime"
          aria-hidden
        />
      </div>

      <div className={cn(!left ? "" : "invisible md:visible")}>
        {!left && <Card item={item} isOpen={isOpen} onToggle={onToggle} reduce={reduce} index={index} />}
      </div>
    </li>
  );
}

function Card({
  item,
  isOpen,
  onToggle,
  reduce,
  index,
}: {
  item: Milestone;
  isOpen: boolean;
  onToggle: () => void;
  reduce: boolean;
  index: number;
}) {
  const left = item.side === "left";
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, x: left ? -20 : 20 }
      }
      whileInView={
        reduce ? { opacity: 1 } : { opacity: 1, x: 0 }
      }
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.04 * index, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "w-full text-left border border-white/10 rounded-xl p-5 hover:border-lime transition-colors bg-transparent",
        isOpen && "border-lime"
      )}
      data-cursor
      aria-expanded={isOpen}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-lime mb-2">
        {item.date}
      </p>
      <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.01em] leading-snug mb-1.5">
        {item.title}
      </h3>
      <p className="text-sm text-white/65 leading-snug">{item.short}</p>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="text-sm text-white/80 leading-relaxed">
                {item.body}
              </p>
              {item.links && item.links.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-3">
                  {item.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="font-mono text-[11px] text-lime hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {l.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-3 font-mono text-[10px] text-white/40">
        {isOpen ? "click to collapse" : "click to expand"}
      </p>
    </motion.button>
  );
}
