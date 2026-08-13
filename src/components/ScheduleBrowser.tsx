"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clientApi } from "@/lib/client-api";
import { LEAGUE } from "@/lib/api/league";
import type { Match, MatchDetail, Team } from "@/types";
import DateGroup from "@/components/schedule/DateGroup";
import MatchDetailPanel from "@/components/match/MatchDetailPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

function RowSkeleton() {
  return <Skeleton className="h-11 w-full" />;
}

function PanelSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

interface RoundData {
  round: number;
  matches: Match[];
  range: string;
}

interface ScheduleBrowserProps {
  initial?: { matches: Match[]; range: string };
  initialTeams?: Team[];
}

export default function ScheduleBrowser({
  initial,
  initialTeams,
}: ScheduleBrowserProps) {
  const [round, setRound] = useState(LEAGUE.currentRound);
  const [data, setData] = useState<RoundData | null>(
    initial ? { round: LEAGUE.currentRound, matches: initial.matches, range: initial.range } : null
  );
  const [teams, setTeams] = useState<Team[]>(initialTeams ?? []);
  const [teamFilter, setTeamFilter] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(
    initial && initial.matches.length > 0 ? initial.matches[0].id : null
  );
  const [detail, setDetail] = useState<{ id: number; match: MatchDetail | null } | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "preview" | "squad" | "stats" | "table" | "info"
  >("preview");

  const panelRef = useRef<HTMLDivElement>(null);
  const seededRoundsRef = useRef<number[]>(initial ? [LEAGUE.currentRound] : []);

  useEffect(() => {
    if (!selectedId) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    if (mq.matches) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedId]);

  useEffect(() => {
    if (initialTeams || teams.length > 0) return;
    let cancelled = false;
    clientApi.getTeams().then((list) => {
      if (!cancelled) setTeams(list);
    });
    return () => {
      cancelled = true;
    };
  }, [initialTeams, teams.length]);

  useEffect(() => {
    if (seededRoundsRef.current.includes(round)) return;
    let cancelled = false;
    clientApi
      .getRound(round)
      .then((res) => {
        if (cancelled) return;
        seededRoundsRef.current = [...seededRoundsRef.current, round];
        setData({ round, matches: res.matches, range: res.range });
        if (res.matches.length > 0) setSelectedId(res.matches[0].id);
      })
      .catch(() => {
        if (!cancelled) setData({ round, matches: [], range: "" });
      });
    return () => {
      cancelled = true;
    };
  }, [round]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    clientApi
      .getMatch(selectedId)
      .then((m) => {
        if (!cancelled) setDetail({ id: selectedId, match: m ?? null });
      })
      .catch(() => {
        if (!cancelled) setDetail({ id: selectedId, match: null });
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const matches = data && data.round === round ? data.matches : null;
  const range = data && data.round === round ? data.range : "";

  const visibleMatches = useMemo(() => {
    if (!matches) return [];
    if (!teamFilter) return matches;
    return matches.filter(
      (m) => m.homeTeam.id === teamFilter || m.awayTeam.id === teamFilter
    );
  }, [matches, teamFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of visibleMatches) {
      const key = m.kickoff.slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    }
    return [...map.entries()]
      .map(([date, list]) => ({
        date,
        list: [...list].sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [visibleMatches]);

  const activeMatch =
    selectedId !== null && detail && detail.id === selectedId ? detail.match : null;
  const detailLoading =
    selectedId !== null && (detail === null || detail.id !== selectedId);

  function handleRoundChange(next: number) {
    setRound(next);
    setSelectedId(null);
    setDetail(null);
    setActiveTab("preview");
  }

  function handleFilterChange(value: number) {
    setTeamFilter(value);
    setSelectedId(null);
    setDetail(null);
    setActiveTab("preview");
  }

  function handleClose() {
    setSelectedId(null);
    setDetail(null);
    setActiveTab("preview");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
        <button
          type="button"
          onClick={() => handleRoundChange(Math.max(1, round - 1))}
          disabled={round <= 1}
          aria-label="Pekan sebelumnya"
          title="Pekan sebelumnya"
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
          onClick={() => handleRoundChange(Math.min(38, round + 1))}
          disabled={round >= 38}
          aria-label="Pekan berikutnya"
          title="Pekan berikutnya"
          className="grid h-9 w-9 place-items-center rounded-lg bg-surface-hover text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRightIcon width={18} height={18} />
        </button>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              Filter berdasarkan tim
            </span>
            <select
              value={teamFilter}
              onChange={(e) => handleFilterChange(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
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
            <div className="space-y-2">
              {Array.from({ length: 8 }, (_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          ) : groups.length > 0 ? (
            <div className="space-y-5">
              {groups.map((g) => (
                <DateGroup
                  key={g.date}
                  date={g.date}
                  matches={g.list}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
              {teamFilter
                ? "Tidak ada pertandingan tim ini pada pekan tersebut."
                : "Tidak ada pertandingan pada pekan ini."}
            </div>
          )}
        </div>

        <div ref={panelRef} className="lg:sticky lg:top-4">
          {detailLoading ? (
            <PanelSkeleton />
          ) : activeMatch ? (
            <MatchDetailPanel
              match={activeMatch}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onClose={handleClose}
            />
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
              Pilih pertandingan untuk melihat detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
