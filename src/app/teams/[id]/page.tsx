import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { TeamResult } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import MatchCard from "@/components/MatchCard";
import FavoriteButton from "@/components/FavoriteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const teams = await api.getTeams();
  return teams.map((t) => ({ id: String(t.id) }));
}

const FORM_COLORS: Record<TeamResult, string> = {
  W: "bg-success text-background",
  D: "bg-ht text-background",
  L: "bg-live text-background",
};

const FORM_LABELS: Record<TeamResult, string> = {
  W: "Menang",
  D: "Seri",
  L: "Kalah",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const team = await api.getTeam(Number(id));
  if (!team) return { title: "Tim Tidak Ditemukan" };
  return { title: team.name, description: `Profil dan jadwal ${team.name}.` };
}

export default async function TeamPage({ params }: PageProps) {
  const { id } = await params;
  const teamId = Number(id);
  const [team, fixtures, form, standings] = await Promise.all([
    api.getTeam(teamId),
    api.getTeamFixtures(teamId),
    api.getTeamForm(teamId),
    api.getStandings(),
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
                Peringkat {row.position}
              </span>
            )}
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-semibold text-muted">
              Poin {row?.points ?? 0}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <FavoriteButton teamId={team.id} size={24} />
          <span className="text-xs text-muted">Favorit</span>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Form Terakhir</h2>
        <div className="flex gap-2">
          {form.length === 0 ? (
            <span className="text-sm text-muted">Belum ada data.</span>
          ) : (
            form.map((r, i) => (
              <span
                key={i}
                title={FORM_LABELS[r]}
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
          <h2 className="text-lg font-bold">Jadwal Terkait</h2>
          <Link
            href="/schedule"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Semua jadwal
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
