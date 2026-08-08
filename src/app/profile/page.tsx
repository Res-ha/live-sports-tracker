"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TEAMS } from "@/lib/api/league";
import { formatKickoffDate, formatKickoffTime } from "@/lib/format";
import type { Match } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StarIcon, UserIcon } from "@/components/ui/icons";
import { useFavorites } from "@/lib/use-favorites";
import { useLanguage } from "@/components/LanguageProvider";

function NextMatch({ teamId }: { teamId: number }) {
  const [match, setMatch] = useState<Match | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    api.getTeamFixtures(teamId).then((list) => {
      if (cancelled) return;
      setMatch(list.find((m) => m.status === "SCHEDULED") ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (!match)
    return <span className="text-xs text-muted">{t("profile.finding")}</span>;

  const opponent = match.homeTeam.id === teamId ? match.awayTeam : match.homeTeam;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="text-xs text-muted transition-colors hover:text-accent"
    >
      {t("profile.nextMatch", { team: opponent.name })} ·{" "}
      {formatKickoffDate(match.kickoff)} {formatKickoffTime(match.kickoff)}
    </Link>
  );
}

export default function ProfilePage() {
  const favorites = useFavorites();
  const { t } = useLanguage();
  const teams = TEAMS.filter((t) => favorites.includes(t.id));

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover p-6">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-hover text-accent">
          <UserIcon width={26} height={26} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            {t("profile.title")}
          </h1>
          <p className="text-sm text-muted">{t("profile.subtitle")}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <StarIcon filled width={18} height={18} className="text-amber-400" />
          {t("profile.favTitle")}
        </h2>

        {teams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-sm text-muted">{t("profile.favEmpty")}</p>
            <p className="mt-1 text-sm text-muted">{t("profile.favEmptyHint")}</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/standings"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-accent-strong"
              >
                {t("profile.viewStandings")}
              </Link>
              <Link
                href="/schedule"
                className="rounded-lg bg-surface-hover px-4 py-2 text-sm font-semibold transition-colors hover:bg-border"
              >
                {t("profile.viewSchedule")}
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
                    <NextMatch teamId={team.id} />
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
