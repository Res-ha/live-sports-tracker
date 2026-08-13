"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clientApi } from "@/lib/client-api";
import { TEAMS } from "@/lib/api/league";
import type { Match } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StarIcon, UserIcon } from "@/components/ui/icons";
import { useFavorites } from "@/lib/use-favorites";

function LastResult({ teamId }: { teamId: number }) {
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    let cancelled = false;
    clientApi.getTeamFixtures(teamId).then((list) => {
      if (cancelled) return;
      const last = [...list]
        .filter((m) => m.status === "FT")
        .sort((a, b) => b.kickoff.localeCompare(a.kickoff))[0];
      setMatch(last ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (!match) return <span className="text-xs text-muted">Belum ada hasil.</span>;

  const opponent = match.homeTeam.id === teamId ? match.awayTeam : match.homeTeam;
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;
  const isHome = match.homeTeam.id === teamId;
  const outcome = isHome
    ? homeScore > awayScore
      ? "Menang"
      : homeScore === awayScore
        ? "Seri"
        : "Kalah"
    : awayScore > homeScore
      ? "Menang"
      : awayScore === homeScore
        ? "Seri"
        : "Kalah";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="text-xs text-muted transition-colors hover:text-accent"
    >
      Terakhir: vs {opponent.name} · {outcome} {homeScore}-{awayScore}
    </Link>
  );
}

export default function ProfilePage() {
  const favorites = useFavorites();
  const teams = TEAMS.filter((t) => favorites.includes(t.id));

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover p-6">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-hover text-accent">
          <UserIcon width={26} height={26} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Profil Saya</h1>
          <p className="text-sm text-muted">
            Favorit Anda disimpan di perangkat ini.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <StarIcon filled width={18} height={18} className="text-amber-400" />
          Tim Favorit
        </h2>

        {teams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-sm text-muted">Anda belum memiliki tim favorit.</p>
            <p className="mt-1 text-sm text-muted">
              Jelajahi klasemen dan tekan bintang untuk menyimpan tim.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/standings"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-accent-strong"
              >
                Lihat Klasemen
              </Link>
              <Link
                href="/schedule"
                className="rounded-lg bg-surface-hover px-4 py-2 text-sm font-semibold transition-colors hover:bg-border"
              >
                Lihat Jadwal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/50 hover:bg-surface-hover"
              >
                <div className="flex items-center gap-3">
                  <TeamCrest team={team} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{team.name}</div>
                    <LastResult teamId={team.id} />
                  </div>
                  <StarIcon filled width={18} height={18} className="text-amber-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
