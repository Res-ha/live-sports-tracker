"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import type { Match } from "@/types";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/Skeleton";

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

export default function ResultsList({ title = "Hasil Pertandingan" }: { title?: string }) {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getRound(LEAGUE.currentRound)
      .then((data) => {
        if (cancelled) return;
        setMatches(data.matches);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-muted">Pekan ke-{LEAGUE.currentRound}</span>
      </div>

      {error ? (
        <div className="rounded-2xl border border-live/40 bg-live/10 p-6 text-center text-sm text-foreground">
          Data sementara tidak tersedia. Silakan muat ulang halaman.
        </div>
      ) : null}

      {!matches ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
          Tidak ada pertandingan.
        </div>
      ) : (
        <div className="grid gap-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
