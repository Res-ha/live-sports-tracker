import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { formatKickoffDate, formatKickoffTime } from "@/lib/format";
import type { MatchDetail } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StatusBadge } from "@/components/ui/StatusBadge";
import FavoriteButton from "@/components/FavoriteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

function StatBar({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  const total = Math.max(home + away, 1);
  const homePct = (home / total) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold">{home}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </span>
        <span className="font-bold">{away}</span>
      </div>
      <div className="flex h-2 gap-1 overflow-hidden rounded-full">
        <div
          className="h-full rounded-l-full bg-accent"
          style={{ width: `${homePct}%` }}
        />
        <div
          className="h-full flex-1 rounded-r-full bg-surface-hover"
          style={{ width: `${100 - homePct}%` }}
        />
      </div>
    </div>
  );
}

function LineupColumn({
  teamName,
  players,
}: {
  teamName: string;
  players: MatchDetail["lineupHome"];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface">
      <div className="border-b border-border/60 px-4 py-2.5 font-bold">{teamName}</div>
      <ul className="divide-y divide-border/40">
        {players.map((p) => (
          <li
            key={`${p.number}-${p.name}`}
            className="flex items-center gap-3 px-4 py-2 text-sm"
          >
            <span className="w-6 font-mono text-xs text-muted">{p.number}</span>
            <span className="flex-1 font-medium">{p.name}</span>
            <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[10px] font-bold text-muted">
              {p.position}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await api.getMatch(Number(id));
  if (!match) return { title: "Pertandingan Tidak Ditemukan" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    description: `Detail pertandingan pekan ${match.round}.`,
  };
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const match = await api.getMatch(Number(id));
  if (!match) notFound();

  const hasStarted = match.status !== "SCHEDULED";

  return (
    <div className="space-y-6">
      <LinkToSchedule round={match.round} />

      <section className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover p-6">
        <div className="mb-4 text-center text-xs text-muted">
          {formatKickoffDate(match.kickoff)} · {formatKickoffTime(match.kickoff)} ·{" "}
          {match.venue}
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <TeamCrest team={match.homeTeam} size={64} />
            <span className="font-bold">{match.homeTeam.name}</span>
            <FavoriteButton teamId={match.homeTeam.id} />
          </div>

          <div className="text-center">
            {hasStarted ? (
              <div className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {formatKickoffTime(match.kickoff)}
              </div>
            )}
            <div className="mt-2">
              <StatusBadge status={match.status} minute={match.minute} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <TeamCrest team={match.awayTeam} size={64} />
            <span className="font-bold">{match.awayTeam.name}</span>
            <FavoriteButton teamId={match.awayTeam.id} />
          </div>
        </div>
        {match.referee || match.attendance ? (
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-muted">
            {match.referee && <span>Wasit: {match.referee}</span>}
            {match.attendance && <span>Penonton: {match.attendance}</span>}
          </div>
        ) : null}
      </section>

      {hasStarted && (
        <>
          <section>
            <h2 className="mb-3 text-lg font-bold">Statistik Pertandingan</h2>
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              {match.stats.map((s) => (
                <StatBar key={s.label} label={s.label} home={s.home} away={s.away} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">Susunan Pemain</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <LineupColumn teamName={match.homeTeam.name} players={match.lineupHome} />
              <LineupColumn teamName={match.awayTeam.name} players={match.lineupAway} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function LinkToSchedule({ round }: { round: number }) {
  return (
    <a
      href="/schedule"
      className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-accent"
    >
      <span aria-hidden>←</span> Pekan ke-{round}
    </a>
  );
}
