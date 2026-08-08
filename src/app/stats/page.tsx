import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import { getDictionary } from "@/lib/i18n";
import PlayerStatsTable from "@/components/PlayerStatsTable";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t("stats.title"),
    description: t("stats.subtitle", { league: LEAGUE.name, season: LEAGUE.season }),
  };
}

export default async function StatsPage() {
  const [scorers, assisters, t] = await Promise.all([
    api.getTopScorers(),
    api.getTopAssists(),
    getDictionary(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {t("stats.title")}
        </h1>
        <p className="text-sm text-muted">
          {t("stats.subtitle", { league: LEAGUE.name, season: LEAGUE.season })}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <PlayerStatsTable players={scorers} metric="goals" t={t} />
        <PlayerStatsTable players={assisters} metric="assists" t={t} />
      </div>
    </div>
  );
}
