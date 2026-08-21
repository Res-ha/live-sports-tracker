import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import ScoreHeader from "@/components/match/ScoreHeader";
import GoalScorers from "@/components/match/GoalScorers";
import MatchStats from "@/components/match/MatchStats";
import Lineups from "@/components/match/Lineups";
import MatchTimeline from "@/components/match/MatchTimeline";
import { Badge } from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

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
    description: `${match.homeTeam.name} vs ${match.awayTeam.name}, detail pertandingan pekan ${match.round}.`,
    alternates: { canonical: `/matches/${match.id}` },
  };
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const match = await api.getMatch(Number(id));
  if (!match) notFound();

  const hasStarted = match.status !== "SCHEDULED";

  return (
    <div className="space-y-7">
      <a
        href="/schedule"
        className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-accent"
      >
        <span aria-hidden>←</span> Pekan ke-{match.round}
      </a>

      <Reveal><div><Badge tone={match.status === "LIVE" ? "live" : "accent"}>{match.status === "LIVE" ? "Live match" : "Match center"}</Badge><div className="mt-3"><ScoreHeader match={match} /></div></div></Reveal>

      {hasStarted && (
        <div className="space-y-7">
          <Reveal delay={0.04}><GoalScorers match={match} /></Reveal>
          <Reveal delay={0.06}><MatchStats match={match} /></Reveal>
          <Reveal delay={0.08}><Lineups match={match} /></Reveal>
          <Reveal delay={0.1}><MatchTimeline match={match} /></Reveal>
        </div>
      )}
    </div>
  );
}
