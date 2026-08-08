"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import type { Match, MatchStatus } from "@/types";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage } from "@/components/LanguageProvider";

const POLL_MS = 15_000;
type Filter = "all" | MatchStatus;

const FILTERS: { key: Filter; labelKey: string }[] = [
  { key: "all", labelKey: "live.filterAll" },
  { key: "LIVE", labelKey: "live.filterLive" },
  { key: "SCHEDULED", labelKey: "live.filterUpcoming" },
  { key: "FT", labelKey: "live.filterFinished" },
];

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

export default function LiveMatches() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState(false);
  const [polling, setPolling] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    async function load() {
      try {
        const data = await api.getTodayMatches();
        if (cancelled) return;
        setMatches(data);
        setLastUpdated(new Date());
        setError(false);
        const hasUpcoming = data.some(
          (m) => m.status === "LIVE" || m.status === "SCHEDULED" || m.status === "HT"
        );
        if (!hasUpcoming && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          setPolling(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    intervalId = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const liveCount = useMemo(
    () => matches?.filter((m) => m.status === "LIVE").length ?? 0,
    [matches]
  );

  const visible = useMemo(() => {
    if (!matches) return [];
    if (filter === "all") return matches;
    return matches.filter((m) => m.status === filter);
  }, [matches, filter]);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ key, labelKey }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === key
                  ? "bg-accent text-background"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {t(labelKey)}
              {key === "LIVE" && liveCount > 0 ? ` (${liveCount})` : ""}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted">
          {polling
            ? lastUpdated
              ? t("live.updated", {
                  time: lastUpdated.toLocaleTimeString(t("lang.locale")),
                })
              : t("live.updating")
            : t("live.updatedOn", { season: LEAGUE.season })}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-live/40 bg-live/10 p-6 text-center text-sm text-foreground">
          {t("live.error")}
        </div>
      ) : null}

      {!matches ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
          {filter === "all" && !polling
            ? t("live.empty", { season: LEAGUE.season })
            : t("live.emptyFilter")}
        </div>
      ) : (
        <div className="grid gap-3">
          {visible.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
