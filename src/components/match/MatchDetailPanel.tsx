"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/lib/client-api";
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
    clientApi
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
    <section className="flex h-full flex-col rounded-[1.75rem] border border-border/80 bg-surface/85 shadow-[0_20px_60px_rgb(2_8_23/.24)]">
      <header className="flex items-center justify-between border-b border-border/60 bg-background/20 px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Round {match.round} · Match detail</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="grid h-9 w-9 place-items-center rounded-xl bg-surface-hover text-sm text-muted transition-colors hover:bg-live/10 hover:text-live"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto p-4 lg:max-h-[calc(100vh-2rem)] sm:p-6">
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
