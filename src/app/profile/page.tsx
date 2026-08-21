"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clientApi } from "@/lib/client-api";
import { TEAMS } from "@/lib/api/league";
import type { Match } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StarIcon, UserIcon } from "@/components/ui/icons";
import { useFavorites } from "@/lib/use-favorites";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
      <section className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-gradient-to-br from-surface to-surface-hover p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
          <UserIcon width={26} height={26} />
        </span>
        <div>
          <Badge tone="accent">Personal workspace</Badge>
          <h1 className="mt-2 text-2xl font-black tracking-tight">Profil Saya</h1>
          <p className="text-sm text-muted">
            Favorit Anda disimpan di perangkat ini.
          </p>
        </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <StarIcon filled width={18} height={18} className="text-amber-400" />
          Tim Favorit
        </h2>

        {teams.length === 0 ? (
          <Card className="border-dashed bg-surface/60 p-10 text-center">
            <p className="text-sm text-muted">Anda belum memiliki tim favorit.</p>
            <p className="mt-1 text-sm text-muted">
              Jelajahi klasemen dan tekan bintang untuk menyimpan tim.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <ButtonLink href="/standings">Lihat klasemen</ButtonLink>
              <ButtonLink href="/schedule" variant="secondary">
                Lihat jadwal
              </ButtonLink>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
              className="rounded-[1.5rem] border border-border/80 bg-surface/80 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-hover"
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
