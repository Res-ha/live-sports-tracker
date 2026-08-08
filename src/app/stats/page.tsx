import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import PlayerStatsTable from "@/components/PlayerStatsTable";

export const metadata: Metadata = {
  title: "Statistik",
  description: `Top scorer dan top assists ${LEAGUE.name} musim ${LEAGUE.season}.`,
};

export default async function StatsPage() {
  const [scorers, assisters] = await Promise.all([
    api.getTopScorers(),
    api.getTopAssists(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Statistik Pemain</h1>
        <p className="text-sm text-muted">
          {LEAGUE.name} · Musim {LEAGUE.season}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <PlayerStatsTable players={scorers} metric="goals" />
        <PlayerStatsTable players={assisters} metric="assists" />
      </div>
    </div>
  );
}
