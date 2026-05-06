import { cn } from "@/lib/utils";

type PanelProps = {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  control?: React.ReactNode;
  span?: number; // grid columns (1-12)
  spanSm?: number;
  spanLg?: number;
  rowSpan?: number;
  bodyClassName?: string;
  className?: string;
  noPad?: boolean;
  children: React.ReactNode;
};

const COL: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};
const COL_SM: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  10: "sm:col-span-10",
  11: "sm:col-span-11",
  12: "sm:col-span-12",
};
const COL_LG: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};
const ROW_SPAN: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
};

export function Panel({
  title,
  subtitle,
  badge,
  control,
  span = 6,
  spanSm,
  spanLg,
  rowSpan,
  bodyClassName,
  className,
  noPad,
  children,
}: PanelProps) {
  return (
    <section
      className={cn(
        "col-span-12",
        spanSm && COL_SM[spanSm],
        COL_LG[spanLg ?? span],
        rowSpan && ROW_SPAN[rowSpan],
        "border border-white/10 rounded-lg bg-white/[0.015] hover:border-white/20 transition-colors flex flex-col",
        className
      )}
    >
      {(title || control || badge) && (
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <div className="min-w-0">
            {title && (
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/55 truncate">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-[11px] text-white/35 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {control}
          </div>
        </header>
      )}
      <div className={cn(!noPad && "p-4", "flex-1 min-w-0", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

// Suppress unused-import warning when consumer only uses span/spanLg combos.
void COL;
