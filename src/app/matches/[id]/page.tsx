import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import ScoreHeader from "@/components/match/ScoreHeader";
import GoalScorers from "@/components/match/GoalScorers";
import MatchStats from "@/components/match/MatchStats";
import Lineups from "@/components/match/Lineups";
import MatchTimeline from "@/components/match/MatchTimeline";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const ids: string[] = [];
  for (let round = 1; round <= LEAGUE.currentRound; round++) {
    const data = await api.getRound(round);
    for (const m of data.matches) ids.push(String(m.id));
  }
  return ids.map((id) => ({ id }));
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
      <a
        href="/schedule"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> Pekan ke-{match.round}
      </a>

      <ScoreHeader match={match} />

      {hasStarted && (
        <>
          <GoalScorers match={match} />
          <MatchStats match={match} />
          <Lineups match={match} />
          <MatchTimeline match={match} />
        </>
      )}
    </div>
  );
}
