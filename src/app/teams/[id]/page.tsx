import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import type { TeamResult } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import MatchCard from "@/components/MatchCard";
import FavoriteButton from "@/components/FavoriteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

const FORM_COLORS: Record<TeamResult, string> = {
  W: "bg-success text-background",
  D: "bg-ht text-background",
  L: "bg-live text-background",
};

const FORM_RESULT_KEY: Record<TeamResult, string> = {
  W: "team.formWin",
  D: "team.formDraw",
  L: "team.formLoss",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const team = await api.getTeam(Number(id));
  if (!team) return { title: "Team not found" };
  return { title: team.name, description: `${team.name} · ${team.city}` };
}

export default async function TeamPage({ params }: PageProps) {
  const { id } = await params;
  const teamId = Number(id);
  const [team, fixtures, form, standings, t] = await Promise.all([
    api.getTeam(teamId),
    api.getTeamFixtures(teamId),
    api.getTeamForm(teamId),
    api.getStandings(),
    getDictionary(),
  ]);

  if (!team) notFound();

  const row = standings.find((s) => s.team.id === team.id);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover p-6 sm:flex-row sm:items-center">
        <TeamCrest team={team} size={72} />
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">{team.name}</h1>
          <p className="text-sm text-muted">
            {team.city}
            {team.stadium ? ` · ${team.stadium}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {row && (
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-semibold text-accent">
                {t("team.rank", { pos: row.position })}
              </span>
            )}
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-semibold text-muted">
              {t("team.points", { n: row?.points ?? 0 })}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <FavoriteButton teamId={team.id} size={24} />
          <span className="text-xs text-muted">{t("team.favLabel")}</span>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">{t("team.form")}</h2>
        <div className="flex gap-2">
          {form.length === 0 ? (
            <span className="text-sm text-muted">{t("team.noData")}</span>
          ) : (
            form.map((r, i) => (
              <span
                key={i}
                title={t(FORM_RESULT_KEY[r])}
                className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-extrabold ${FORM_COLORS[r]}`}
              >
                {r}
              </span>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("team.fixtures")}</h2>
          <Link
            href="/schedule"
            className="text-sm font-semibold text-accent hover:underline"
          >
            {t("team.allFixtures")}
          </Link>
        </div>
        <div className="grid gap-3">
          {fixtures.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </div>
  );
}
