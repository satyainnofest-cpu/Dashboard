import { cn } from "@/lib/utils";

export function DashboardShell({
  title,
  eyebrow,
  meta,
  slicers,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  meta?: React.ReactNode;
  slicers?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-black text-white pt-16", className)}>
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-2">
                {eyebrow}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] leading-none">
              {title}
              <span className="text-lime">.</span>
            </h1>
          </div>
          {meta && (
            <div className="font-mono text-[11px] text-white/45 flex flex-wrap items-center gap-x-5 gap-y-1">
              {meta}
            </div>
          )}
        </div>
      </div>
      {slicers && (
        <div className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-3 flex flex-wrap items-center gap-2">
            {slicers}
          </div>
        </div>
      )}
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-6">{children}</div>
    </div>
  );
}

export function PanelGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-4 sm:gap-5 auto-rows-min",
        className
      )}
    >
      {children}
    </div>
  );
}
