"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

export function CountUp({
  to,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
  start = true,
  className,
  compact = false,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  start?: boolean;
  className?: string;
  compact?: boolean;
}) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start) return;
    if (startedRef.current) return;
    startedRef.current = true;

    if (reduce) {
      setV(to);
      return;
    }

    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      // easeOutCubic
      const e = 1 - Math.pow(1 - t, 3);
      setV(to * e);
      if (t < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, start, reduce]);

  const formatted =
    decimals > 0
      ? v.toFixed(decimals)
      : formatNumber(v, { compact });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
