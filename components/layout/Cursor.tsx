"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 38, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 500, damping: 38, mass: 0.2 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.dataset.customCursor = "on";

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const matchInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "a, button, input, textarea, select, [role='button'], [role='link'], [role='slider'], [data-cursor]"
        )
      );
    };
    const onOver = (e: PointerEvent) =>
      setHovering(matchInteractive(e.target));
    const onOut = (e: PointerEvent) => {
      if (matchInteractive(e.target)) setHovering(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      delete document.body.dataset.customCursor;
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{
        x: sx,
        y: sy,
        mixBlendMode: "difference",
      }}
    >
      <motion.div
        className="rounded-full"
        animate={{
          width: hovering ? 32 : 12,
          height: hovering ? 32 : 12,
          x: hovering ? -16 : -6,
          y: hovering ? -16 : -6,
          backgroundColor: hovering ? "transparent" : "#fafafa",
          borderWidth: hovering ? 2 : 0,
          borderColor: "#c5f73b",
        }}
        transition={{ type: "spring", stiffness: 600, damping: 32 }}
      />
    </motion.div>
  );
}
