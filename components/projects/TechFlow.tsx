import { ArrowRight } from "lucide-react";

export function TechFlow({
  bullets,
}: {
  bullets: { label: string; value: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-3 min-w-max">
        {bullets.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="border border-black/15 rounded-lg p-4 min-w-[200px]">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-lime mb-1.5">
                {b.label}
              </p>
              <p className="text-sm text-black">{b.value}</p>
            </div>
            {i < bullets.length - 1 && (
              <ArrowRight
                size={16}
                className="text-lime shrink-0"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
