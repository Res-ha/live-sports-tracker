import type { MatchDetail } from "@/types";
import { formatKickoffDate, formatKickoffTime } from "@/lib/format";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StatusBadge } from "@/components/ui/StatusBadge";
import FavoriteButton from "@/components/FavoriteButton";

export default function ScoreHeader({ match }: { match: MatchDetail }) {
  const hasStarted = match.status !== "SCHEDULED";

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-accent/20 bg-gradient-to-br from-surface to-surface-hover p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mb-5 text-center text-xs text-muted">
        {formatKickoffDate(match.kickoff)} · {formatKickoffTime(match.kickoff)} ·{" "}
        {match.venue}
      </div>
      <div className="grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamCrest team={match.homeTeam} size={56} />
          <span className="w-full min-w-0 break-words px-1 font-bold">{match.homeTeam.name}</span>
          <FavoriteButton teamId={match.homeTeam.id} />
        </div>

        <div className="text-center">
          {hasStarted ? (
          <div className="text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              {match.homeScore} - {match.awayScore}
            </div>
          ) : (
            <div className="text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              {formatKickoffTime(match.kickoff)}
            </div>
          )}
          <div className="mt-2">
            <StatusBadge status={match.status} minute={match.minute} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamCrest team={match.awayTeam} size={56} />
          <span className="w-full min-w-0 break-words px-1 font-bold">{match.awayTeam.name}</span>
          <FavoriteButton teamId={match.awayTeam.id} />
        </div>
      </div>
      {match.referee || match.attendance ? (
        <div className="relative mt-5 flex flex-wrap justify-center gap-2 text-xs text-muted">
          {match.referee && <span>Wasit: {match.referee}</span>}
          {match.attendance && <span>Penonton: {match.attendance}</span>}
        </div>
      ) : null}
    </section>
  );
}
