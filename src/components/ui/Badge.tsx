import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "default" | "accent" | "success" | "warning" | "live" | "violet";

const toneClasses: Record<BadgeTone, string> = {
  default: "border-border/80 bg-surface text-muted",
  accent: "border-accent/30 bg-accent/10 text-accent",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-ht/30 bg-ht/10 text-ht",
  live: "border-live/30 bg-live/10 text-live",
  violet: "border-ucl/30 bg-ucl/10 text-ucl",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
