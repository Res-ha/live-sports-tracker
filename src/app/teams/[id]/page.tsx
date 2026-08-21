import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { TeamResult } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import MatchCard from "@/components/MatchCard";
import FavoriteButton from "@/components/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

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
  return {
    title: team.name,
    description: `Profil, form, klasemen, dan jadwal ${team.name} di Live PL Tracker.`,
    alternates: { canonical: `/teams/${team.id}` },
  };
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
    <div className="space-y-8">
      <Reveal>
      <section className="relative flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-accent/20 bg-gradient-to-br from-surface to-surface-hover p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        <TeamCrest team={team} size={72} />
        <div className="relative flex-1">
          <Badge tone="accent">Club profile</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.03em]">{team.name}</h1>
          <p className="text-sm text-muted">
            {team.city}
            {team.stadium ? ` · ${team.stadium}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {row && <Badge tone="accent">Peringkat {row.position}</Badge>}
            <Badge tone="default">Poin {row?.points ?? 0}</Badge>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <FavoriteButton teamId={team.id} size={24} />
          <span className="text-xs text-muted">Favorit</span>
        </div>
      </section>
      </Reveal>

      <Reveal delay={0.05}><section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Momentum</p>
        <h2 className="mt-1 mb-3 text-xl font-black">Form Terakhir</h2>
        <div className="flex gap-2">
          {form.length === 0 ? (
            <span className="text-sm text-muted">Belum ada data.</span>
          ) : (
            form.map((r, i) => (
              <span
                key={i}
                title={FORM_LABELS[r]}
                className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-extrabold shadow-sm ${FORM_COLORS[r]}`}
              >
                {r}
              </span>
            ))
          )}
        </div>
      </section></Reveal>

      <Reveal delay={0.08}><section>
        <div className="mb-3 flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Fixture trail</p><h2 className="mt-1 text-xl font-black">Jadwal Terkait</h2></div>
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
      </section></Reveal>
    </div>
  );
}
