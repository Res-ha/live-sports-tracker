import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import PlayerStatsTable from "@/components/PlayerStatsTable";
import { Badge } from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Statistik",
  description: `Top scorer dan top assists ${LEAGUE.name} musim ${LEAGUE.season}.`,
  alternates: { canonical: "/stats" },
};

export default async function StatsPage() {
  const [scorers, assisters] = await Promise.all([
    api.getTopScorers(),
    api.getTopAssists(),
  ]);

  return (
    <div className="space-y-7">
      <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
        <Badge tone="warning">Player intelligence</Badge>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Statistik Pemain</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {LEAGUE.name} · Musim {LEAGUE.season}
        </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Goals · assists · appearances</span>
      </div>
      </Reveal>
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal><PlayerStatsTable players={scorers} metric="goals" /></Reveal>
        <Reveal delay={0.06}><PlayerStatsTable players={assisters} metric="assists" /></Reveal>
      </div>
    </div>
  );
}
