export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border border-dashed border-black/15 rounded-xl py-16 px-6 text-center bg-white">
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-6"
        aria-hidden
      >
        <rect
          x="10"
          y="20"
          width="100"
          height="50"
          rx="6"
          stroke="#0a0a0a"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="60" cy="45" r="14" fill="#c5f73b" />
        <line
          x1="50"
          y1="45"
          x2="70"
          y2="45"
          stroke="#0a0a0a"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <p className="font-mono text-[11px] text-black/40 uppercase tracking-[0.1em] mb-3">
        // no results
      </p>
      <h3 className="text-2xl font-semibold tracking-[-0.02em] mb-2">
        No projects match.
      </h3>
      <p className="text-black/60 mb-6">Try fewer filters or a shorter search.</p>
      <button
        type="button"
        onClick={onClear}
        className="h-10 px-5 rounded-full bg-black text-white font-mono text-xs uppercase tracking-[0.1em] hover:bg-lime hover:text-black transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
