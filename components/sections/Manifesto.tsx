"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Manifesto() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-black text-white py-32 sm:py-40" data-theme="dark">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
        <SectionLabel tone="dark" className="mb-10 inline-block">
          // 03 — why
        </SectionLabel>

        <motion.blockquote
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-medium tracking-[-0.03em] leading-[1.15] text-[clamp(40px,6.5vw,88px)]"
        >
          A model is only useful if it lands on a phone someone actually owns,
          in a language they actually read, and gives an answer they can
          actually act on.{" "}
          <span className="text-lime">
            Everything else is a research paper.
          </span>
        </motion.blockquote>

        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
          // working principles, drafted v3
        </p>
      </div>
    </section>
  );
}
