import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types";

const STYLES: Record<ProjectStatus, string> = {
  shipped: "bg-lime text-black border-transparent",
  pilot: "bg-transparent text-current border-lime",
  prototype: "bg-white text-black border-black/15",
  research: "bg-black text-white border-transparent",
};

const LABEL: Record<ProjectStatus, string> = {
  shipped: "shipped",
  pilot: "pilot",
  prototype: "prototype",
  research: "research",
};

export function StatusPill({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2.5 rounded-full border font-mono text-[10px] uppercase tracking-[0.1em]",
        STYLES[status],
        className
      )}
    >
      {LABEL[status]}
    </span>
  );
}
