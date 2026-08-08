import Link from "next/link";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import { getDictionary } from "@/lib/i18n";
import LiveMatches from "@/components/LiveMatches";
import { TeamCrest } from "@/components/ui/TeamCrest";
import {
  AssistIcon,
  BallIcon,
  ChevronRightIcon,
  TrophyIcon,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [standings, scorers, assisters] = await Promise.all([
    api.getStandings(),
    api.getTopScorers(),
    api.getTopAssists(),
  ]);
  const t = await getDictionary();
  const top5 = standings.slice(0, 5);
  const champion = standings[0];
  const topScorer = scorers[0];
  const topAssister = assisters[0];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-1 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
          {t("home.badge")}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {t("home.title", { league: LEAGUE.name, season: LEAGUE.season })}
        </h1>
        <p className="text-sm text-muted">
          {t("home.subtitle", { league: LEAGUE.name, season: LEAGUE.season })}
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-bold">
            {t("home.summary", { season: LEAGUE.season })}
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {champion ? (
            <Link
              href={`/teams/${champion.team.id}`}
              className="rounded-2xl border border-ucl/40 bg-ucl/10 p-4 transition-colors hover:bg-ucl/20"
            >
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ucl">
                <TrophyIcon width={16} height={16} /> {t("home.champion")}
              </span>
              <div className="mt-3 flex items-center gap-3">
                <TeamCrest team={champion.team} size={44} />
                <div>
                  <div className="font-bold">{champion.team.name}</div>
                  <div className="text-xs text-muted">
                    {t("home.points", { points: champion.points })}
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          {topScorer ? (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                <BallIcon width={16} height={16} /> {t("home.topScorer")}
              </span>
              <div className="mt-3">
                <div className="font-bold">{topScorer.name}</div>
                <div className="text-xs text-muted">
                  {t("home.goals", { goals: topScorer.goals })} ·{" "}
                  {topScorer.team.name}
                </div>
              </div>
            </div>
          ) : null}

          {topAssister ? (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                <AssistIcon width={16} height={16} /> {t("home.topAssist")}
              </span>
              <div className="mt-3">
                <div className="font-bold">{topAssister.name}</div>
                <div className="text-xs text-muted">
                  {t("home.assists", { assists: topAssister.assists })} ·{" "}
                  {topAssister.team.name}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <LiveMatches />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <TrophyIcon width={18} height={18} className="text-accent" />
            {t("home.top5")}
          </h2>
          <Link
            href="/standings"
            className="flex items-center gap-0.5 text-sm font-semibold text-accent hover:underline"
          >
            {t("home.standingsLink")} <ChevronRightIcon width={16} height={16} />
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-surface">
          {top5.map((row) => (
            <Link
              key={row.team.id}
              href={`/teams/${row.team.id}`}
              className="flex items-center gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-b-0 hover:bg-surface-hover"
            >
              <span className="w-6 font-bold text-muted">{row.position}</span>
              <TeamCrest team={row.team} size={28} />
              <span className="flex-1 truncate font-semibold">{row.team.name}</span>
              <span className="text-muted">{row.goalsFor - row.goalsAgainst > 0 ? "+" : ""}{row.goalsFor - row.goalsAgainst}</span>
              <span className="w-10 text-right font-bold">{row.points}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
