"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MatchDetail, StandingsRow } from "@/types";
import MatchTabs, { type MatchTab } from "@/components/schedule/MatchTabs";
import ScoreHeader from "./ScoreHeader";
import GoalScorers from "./GoalScorers";
import MatchStats from "./MatchStats";
import Lineups from "./Lineups";
import MatchTimeline from "./MatchTimeline";
import MatchInfo from "./MatchInfo";
import StandingsTable from "@/components/StandingsTable";
import { Skeleton } from "@/components/ui/Skeleton";

function TableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: 10 }, (_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  );
}

export default function MatchDetailPanel({
  match,
  activeTab,
  onTabChange,
  onClose,
}: {
  match: MatchDetail;
  activeTab: MatchTab;
  onTabChange: (tab: MatchTab) => void;
  onClose: () => void;
}) {
  const [standings, setStandings] = useState<StandingsRow[] | null>(null);

  useEffect(() => {
    if (activeTab !== "table" || standings) return;
    let cancelled = false;
    api
      .getStandings()
      .then((rows) => {
        if (!cancelled) setStandings(rows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeTab, standings]);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-surface">
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <span className="text-xs font-semibold text-muted">Pekan {match.round}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="grid h-7 w-7 place-items-center rounded-lg bg-surface-hover text-sm text-muted transition-colors hover:text-foreground"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto p-4 lg:max-h-[calc(100vh-2rem)] sm:p-5">
        <ScoreHeader match={match} />
        <MatchTabs active={activeTab} onChange={onTabChange} />

        {activeTab === "preview" && (
          <>
            <GoalScorers match={match} />
            <MatchTimeline match={match} />
          </>
        )}
        {activeTab === "squad" && <Lineups match={match} />}
        {activeTab === "stats" && <MatchStats match={match} />}
        {activeTab === "table" &&
          (standings ? (
            <StandingsTable rows={standings} />
          ) : (
            <TableSkeleton />
          ))}
        {activeTab === "info" && <MatchInfo match={match} />}
      </div>
    </section>
  );
}
