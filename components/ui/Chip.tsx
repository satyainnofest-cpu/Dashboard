import { cn } from "@/lib/utils";

export function Chip({
  children,
  variant = "outline",
  size = "sm",
  className,
}: {
  children: React.ReactNode;
  variant?: "outline" | "solid" | "lime" | "ghost";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono uppercase tracking-[0.08em]",
        size === "sm" ? "h-6 px-2.5 text-[10px]" : "h-8 px-3 text-[11px]",
        variant === "outline" &&
          "border border-current/40 rounded-full text-current",
        variant === "solid" && "bg-black text-white rounded-full",
        variant === "lime" && "bg-lime text-black rounded-full",
        variant === "ghost" && "text-current/60",
        className
      )}
    >
      {children}
    </span>
  );
}
