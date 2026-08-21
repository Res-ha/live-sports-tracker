import Link from "next/link";
import type { Match } from "@/types";
import { formatKickoffDate, formatKickoffTime } from "@/lib/format";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StatusBadge } from "@/components/ui/StatusBadge";
import FavoriteButton from "@/components/FavoriteButton";

function ScoreCenter({ match }: { match: Match }) {
  if (match.status === "SCHEDULED") {
    return (
      <div className="min-w-16 text-center">
        <span className="block text-lg font-bold text-foreground">
          {formatKickoffTime(match.kickoff)}
        </span>
        <span className="text-xs text-muted">{formatKickoffDate(match.kickoff)}</span>
      </div>
    );
  }
  return (
    <div className="min-w-16 text-center">
      <span className="block text-lg font-bold text-foreground">
        {match.homeScore} - {match.awayScore}
      </span>
      <StatusBadge status={match.status} minute={match.minute} />
    </div>
  );
}

export default function MatchCard({ match }: { match: Match }) {
  const matchLabel = `${match.homeTeam.name} vs ${match.awayTeam.name}`;

  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-surface/80 transition duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-hover hover:shadow-[0_16px_40px_rgb(2_8_23/.24)]">
      <Link
        href={`/matches/${match.id}`}
        aria-label={matchLabel}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <div className="pointer-events-none relative z-10">
        <div className="flex items-center justify-between border-b border-border/60 bg-background/20 px-4 py-2.5">
        <span className="text-xs text-muted">Pekan {match.round}</span>
        <span className="truncate text-xs text-muted">{match.venue}</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-5 sm:px-5">
          <div className="flex min-w-0 items-center justify-end gap-2.5">
            <span className="hidden truncate text-right text-sm font-semibold sm:block">
            {match.homeTeam.name}
            </span>
            <span className="truncate text-right text-sm font-semibold sm:hidden">
              {match.homeTeam.shortName}
            </span>
            <div className="flex items-center gap-1">
              <TeamCrest team={match.homeTeam} size={36} />
              <FavoriteButton teamId={match.homeTeam.id} />
            </div>
          </div>
          <ScoreCenter match={match} />
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex items-center gap-1">
              <TeamCrest team={match.awayTeam} size={36} />
              <FavoriteButton teamId={match.awayTeam.id} />
            </div>
            <span className="hidden truncate text-sm font-semibold sm:block">
              {match.awayTeam.name}
            </span>
            <span className="truncate text-sm font-semibold sm:hidden">
              {match.awayTeam.shortName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
