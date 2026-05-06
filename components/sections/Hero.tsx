"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { marqueeKeywords, site } from "@/lib/data";

const lines = [
  { text: site.name, mono: false },
  { text: "is building", mono: false, opacity: true },
  { text: "AI for Good.", mono: false, lime: true },
];

export function Hero() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!isFine || reduce) return;
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      });
    };
    const onLeave = () => setPos(null);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [isFine, reduce]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-white text-black flex flex-col"
    >
      <div className="hero-radial pointer-events-none absolute inset-0" aria-hidden />
      {pos && isFine && !reduce && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
          aria-hidden
          style={{
            left: pos.x,
            top: pos.y,
            background:
              "radial-gradient(circle, rgba(197, 247, 59, 0.10) 0%, transparent 60%)",
            transition: "left 200ms ease-out, top 200ms ease-out",
          }}
        />
      )}

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-1 w-full flex-col px-5 sm:px-8 pt-32 sm:pt-36 pb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/40 mb-10 sm:mb-14">
          // hello
        </p>

        <h1
          className="font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(56px,11vw,140px)]"
          aria-label={`${site.name} is building AI for Good.`}
        >
          {lines.map((l, lineIdx) => (
            <WordBlock
              key={lineIdx}
              line={l.text}
              startDelay={lineIdx * 0.15}
              opacity={l.opacity}
              lime={l.lime}
              reduce={!!reduce}
            />
          ))}
        </h1>

        <p className="mt-10 sm:mt-14 max-w-2xl text-lg sm:text-xl leading-[1.6] text-black/70">
          {site.mission}
        </p>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
          // grade 9 · {site.location.toLowerCase()} · 2025
        </p>

        <div className="mt-auto pt-14 flex items-center gap-4 text-black/50">
          <motion.span
            aria-hidden
            animate={reduce ? {} : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="inline-flex"
          >
            <ArrowDown size={18} />
          </motion.span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em]">
            // scroll
          </span>
        </div>
      </div>

      <div className="relative z-10 border-t border-black/10 overflow-hidden py-5">
        <div className="marquee-track flex w-max whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex pr-12" aria-hidden={dup === 1}>
              {marqueeKeywords.map((k, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="font-mono text-[28px] sm:text-[32px] uppercase tracking-[-0.01em] text-black/30 mr-12"
                >
                  {k} <span className="text-black/15">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WordBlock({
  line,
  startDelay,
  opacity,
  lime,
  reduce,
}: {
  line: string;
  startDelay: number;
  opacity?: boolean;
  lime?: boolean;
  reduce: boolean;
}) {
  const words = line.split(" ");
  return (
    <span className="block">
      {words.map((w, i) => {
        const isLastWord = lime && i === words.length - 1;
        return (
          <span
            key={i}
            className="inline-flex overflow-hidden align-bottom mr-[0.18em]"
          >
            <motion.span
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              transition={{
                duration: reduce ? 0.2 : 0.7,
                delay: startDelay + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={
                isLastWord
                  ? "draw-underline text-lime"
                  : opacity
                    ? "text-black/85"
                    : ""
              }
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
