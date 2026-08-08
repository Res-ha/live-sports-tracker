"use client";

import Link from "next/link";
import type { Match } from "@/types";
import { formatKickoffDate, formatKickoffTime } from "@/lib/format";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StatusBadge } from "@/components/ui/StatusBadge";
import FavoriteButton from "@/components/FavoriteButton";
import { useLanguage } from "@/components/LanguageProvider";

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
  const { t } = useLanguage();

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50 hover:bg-surface-hover"
    >
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <span className="text-xs text-muted">
          {t("match.round", { round: match.round })}
        </span>
        <span className="truncate text-xs text-muted">{match.venue}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4">
        <div className="flex items-center justify-end gap-2.5">
          <span className="truncate text-right text-sm font-semibold">
            {match.homeTeam.name}
          </span>
          <div className="flex items-center gap-1">
            <TeamCrest team={match.homeTeam} size={36} />
            <FavoriteButton teamId={match.homeTeam.id} />
          </div>
        </div>
        <ScoreCenter match={match} />
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <TeamCrest team={match.awayTeam} size={36} />
            <FavoriteButton teamId={match.awayTeam.id} />
          </div>
          <span className="truncate text-sm font-semibold">{match.awayTeam.name}</span>
        </div>
      </div>
    </Link>
  );
}
