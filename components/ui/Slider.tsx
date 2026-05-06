"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
  tone?: "light" | "dark";
  className?: string;
};

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  ariaLabel,
  tone = "dark",
  className,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  const positionFromX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return value;
      const r = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step, value]
  );

  useEffect(() => {
    if (!dragging) return;
    let raf = 0;
    let pendingX: number | null = null;
    const flush = () => {
      raf = 0;
      if (pendingX != null) {
        onChange(positionFromX(pendingX));
        pendingX = null;
      }
    };
    const move = (e: PointerEvent) => {
      pendingX = e.clientX;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [dragging, onChange, positionFromX]);

  const trackBg = tone === "dark" ? "bg-white/15" : "bg-black/10";
  const thumbBorder = tone === "dark" ? "border-black" : "border-white";

  return (
    <div
      className={cn("relative w-full select-none touch-none", className)}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(Math.max(min, value - step));
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(max, value + step));
        } else if (e.key === "Home") {
          e.preventDefault();
          onChange(min);
        } else if (e.key === "End") {
          e.preventDefault();
          onChange(max);
        }
      }}
    >
      <div
        ref={trackRef}
        className={cn("relative h-1.5 rounded-full", trackBg)}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          onChange(positionFromX(e.clientX));
          setDragging(true);
        }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-lime"
          style={{ width: `${pct}%` }}
        />
        <div
          className={cn(
            "absolute -top-2 h-5 w-5 -translate-x-1/2 rounded-full bg-lime border-2 transition-transform",
            thumbBorder,
            dragging && "scale-110"
          )}
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
