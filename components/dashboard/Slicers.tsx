"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SlicerLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mr-1">
      {children}
    </span>
  );
}

export function SlicerChip({
  children,
  active,
  onClick,
  ariaPressed,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  ariaPressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed ?? active}
      className={cn(
        "h-7 px-2.5 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] transition-colors border",
        active
          ? "bg-lime text-black border-lime"
          : "bg-transparent text-white/85 border-white/15 hover:border-white/40"
      )}
    >
      {children}
    </button>
  );
}

export function SlicerSearch({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex items-center gap-2 h-7 px-2.5 rounded-full border border-white/15 bg-transparent focus-within:border-lime transition-colors min-w-[200px] flex-1 sm:flex-none">
      <Search size={12} className="text-white/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent flex-1 text-[11px] text-white placeholder:text-lime/70 focus:outline-none font-mono"
        aria-label="Search"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="text-white/40 hover:text-white"
        >
          <X size={11} />
        </button>
      )}
    </label>
  );
}

export function SlicerSeparator() {
  return (
    <span className="hidden sm:inline-block h-4 w-px bg-white/15 mx-1" aria-hidden />
  );
}

export function ClearButton({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime hover:underline ml-auto"
    >
      clear all
    </button>
  );
}
