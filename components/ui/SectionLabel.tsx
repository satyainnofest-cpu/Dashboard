import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  tone = "auto",
  className,
}: {
  children: React.ReactNode;
  tone?: "auto" | "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.08em]",
        tone === "dark"
          ? "text-white/50"
          : tone === "light"
            ? "text-black/50"
            : "text-current opacity-50",
        className
      )}
    >
      {children}
    </p>
  );
}
