import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import { getDictionary } from "@/lib/i18n";
import StandingsTable from "@/components/StandingsTable";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t("standings.title"),
    description: t("standings.subtitle", { league: LEAGUE.name, season: LEAGUE.season }),
  };
}

export default async function StandingsPage() {
  const [standings, t] = await Promise.all([
    api.getStandings(),
    getDictionary(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {t("standings.title")}
        </h1>
        <p className="text-sm text-muted">
          {t("standings.subtitle", { league: LEAGUE.name, season: LEAGUE.season })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] text-muted">
        <span className="rounded-full border border-ucl/40 bg-ucl/10 px-2.5 py-1 font-semibold text-ucl">
          {t("standings.ucl")}
        </span>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-semibold text-accent">
          ★ {t("standings.fav")}
        </span>
      </div>

      <StandingsTable rows={standings} />
    </div>
  );
}
