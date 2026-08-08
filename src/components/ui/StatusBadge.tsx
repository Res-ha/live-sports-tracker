import type { MatchStatus } from "@/types";
import { statusLabel } from "@/lib/format";

export function StatusBadge({
  status,
  minute,
  className = "",
}: {
  status: MatchStatus;
  minute?: number;
  className?: string;
}) {
  if (status === "LIVE") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-1 text-xs font-semibold text-live ${className}`}
      >
        <span className="h-2 w-2 animate-live-pulse rounded-full bg-live" />
        {minute != null ? `LIVE ${minute}'` : "LIVE"}
      </span>
    );
  }
  if (status === "HT") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-ht/15 px-2.5 py-1 text-xs font-semibold text-ht ${className}`}
      >
        HT
      </span>
    );
  }
  if (status === "FT") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-border/40 px-2.5 py-1 text-xs font-semibold text-muted ${className}`}
      >
        Selesai
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center text-xs font-medium text-muted ${className}`}>
      {statusLabel(status)}
    </span>
  );
}
