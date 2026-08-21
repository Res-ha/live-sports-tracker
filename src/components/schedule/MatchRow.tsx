import type { Match } from "@/types";
import { formatKickoffTime } from "@/lib/format";
import { TeamCrest } from "@/components/ui/TeamCrest";

export default function MatchRow({
  match,
  selected,
  onClick,
}: {
  match: Match;
  selected: boolean;
  onClick: () => void;
}) {
  const started = match.status !== "SCHEDULED";
  const isLive = match.status === "LIVE";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`grid min-h-14 w-full grid-cols-[3rem_1fr_auto_1fr] items-center gap-1.5 rounded-[1.15rem] border px-2.5 py-2.5 text-sm transition duration-200 sm:gap-2 sm:px-3 ${
        selected
          ? "border-accent/60 bg-accent/[0.07] shadow-[0_10px_24px_rgb(45_212_191/.08)]"
          : "border-border/80 bg-surface/80 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-hover"
      }`}
    >
      <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
        {isLive && <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-live" />}
        {isLive && match.minute != null ? `${match.minute}'` : formatKickoffTime(match.kickoff)}
      </span>

      <span className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
        <span className="hidden truncate font-semibold sm:block">{match.homeTeam.name}</span>
        <span className="truncate font-semibold sm:hidden">{match.homeTeam.shortName}</span>
        <TeamCrest team={match.homeTeam} size={22} />
      </span>

      <span
        className={`min-w-9 text-center text-sm font-extrabold ${
          started ? (isLive ? "text-live" : "text-foreground") : "text-muted"
        }`}
      >
        {started ? `${match.homeScore} - ${match.awayScore}` : "vs"}
      </span>

      <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <TeamCrest team={match.awayTeam} size={22} />
        <span className="hidden truncate font-semibold sm:block">{match.awayTeam.name}</span>
        <span className="truncate font-semibold sm:hidden">{match.awayTeam.shortName}</span>
      </span>
    </button>
  );
}
