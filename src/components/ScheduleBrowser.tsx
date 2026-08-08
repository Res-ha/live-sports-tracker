"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import type { Match, Team } from "@/types";
import { formatKickoffDate, formatKickoffTime } from "@/lib/format";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

function MatchCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Skeleton className="mb-4 h-4 w-32" />
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Skeleton className="h-5 w-28 justify-self-end" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  );
}

export default function ScheduleBrowser() {
  const [round, setRound] = useState(LEAGUE.currentRound);
  const [range, setRange] = useState("");
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamFilter, setTeamFilter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [data, teamList] = await Promise.all([
        api.getRound(round),
        api.getTeams(),
      ]);
      if (cancelled) return;
      setMatches(data.matches);
      setRange(data.range);
      setTeams(teamList);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [round]);

  const visible = teamFilter
    ? matches?.filter(
        (m) => m.homeTeam.id === teamFilter || m.awayTeam.id === teamFilter
      )
    : matches;

  const goTo = useCallback((next: number) => {
    setMatches(null);
    setRound(next);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
        <button
          type="button"
          onClick={() => goTo(round - 1)}
          disabled={round <= 1}
          aria-label="Pekan sebelumnya"
          className="grid h-9 w-9 place-items-center rounded-lg bg-surface-hover text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon width={18} height={18} />
        </button>
        <div className="text-center">
          <div className="font-bold">Pekan ke-{round}</div>
          <div className="text-xs text-muted">{range}</div>
        </div>
        <button
          type="button"
          onClick={() => goTo(round + 1)}
          disabled={round >= 38}
          aria-label="Pekan berikutnya"
          className="grid h-9 w-9 place-items-center rounded-lg bg-surface-hover text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRightIcon width={18} height={18} />
        </button>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-muted">
          Filter berdasarkan tim
        </span>
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent sm:w-64"
        >
          <option value={0}>Semua tim</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      {!matches ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      ) : visible && visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((match) => (
            <div key={match.id}>
              <div className="mb-1.5 flex items-center gap-2 text-xs text-muted">
                <span className="font-semibold">{formatKickoffDate(match.kickoff)}</span>
                <span>·</span>
                <span>{formatKickoffTime(match.kickoff)}</span>
              </div>
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
          Tidak ada pertandingan tim ini pada pekan tersebut.
        </div>
      )}
    </div>
  );
}
