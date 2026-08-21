import Link from "next/link";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import ResultsList from "@/components/ResultsList";
import { TeamCrest } from "@/components/ui/TeamCrest";
import Reveal from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  AssistIcon,
  BallIcon,
  ChevronRightIcon,
  TrophyIcon,
} from "@/components/ui/icons";

export default async function HomePage() {
  const [standings, scorers, assisters] = await Promise.all([
    api.getStandings(),
    api.getTopScorers(),
    api.getTopAssists(),
  ]);
  const top5 = standings.slice(0, 5);
  const champion = standings[0];
  const topScorer = scorers[0];
  const topAssister = assisters[0];

  return (
    <div className="space-y-10 sm:space-y-12">
      <Reveal>
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-accent/20 bg-[linear-gradient(135deg,rgb(14_28_47/.88),rgb(13_44_57/.72))] p-6 shadow-[0_24px_80px_rgb(2_8_23/.28)] sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-ucl/12 blur-3xl" />
          <div className="max-w-3xl">
            <Badge tone="success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Portfolio project · static demo</Badge>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-accent">Match intelligence, made simple</p>
            <h1 className="text-balance mt-3 text-4xl font-black tracking-[-0.04em] text-foreground sm:text-6xl">
              Jelajahi Premier League dengan konteks yang lebih hidup.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Live PL Tracker adalah portfolio project yang mengubah data pertandingan menjadi match center, jadwal, klasemen, dan statistik yang cepat dipahami.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/schedule">Buka match center <ChevronRightIcon width={16} height={16} /></ButtonLink>
              <ButtonLink href="/standings" variant="secondary">Lihat klasemen</ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs text-muted">
              <span><strong className="text-foreground">380</strong> pertandingan</span>
              <span><strong className="text-foreground">20</strong> klub</span>
              <span><strong className="text-foreground">4</strong> area eksplorasi</span>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Season snapshot</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">Rangkuman musim {LEAGUE.season}</h2>
            </div>
            <span className="text-sm text-muted">Data final · Pekan {LEAGUE.currentRound}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
          {champion ? (
            <Link
              href={`/teams/${champion.team.id}`}
              className="group rounded-[1.5rem] border border-ucl/30 bg-ucl/10 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-ucl/15"
            >
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ucl">
                <TrophyIcon width={16} height={16} /> Juara
              </span>
              <div className="mt-3 flex items-center gap-3">
                <TeamCrest team={champion.team} size={44} />
                <div>
                  <div className="font-bold group-hover:text-accent">{champion.team.name}</div>
                  <div className="text-xs text-muted">{champion.points} poin</div>
                </div>
              </div>
            </Link>
          ) : null}

          {topScorer ? (
            <Card className="p-5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                <BallIcon width={16} height={16} /> Top Skor
              </span>
              <div className="mt-3">
                <div className="font-bold text-foreground">{topScorer.name}</div>
                <div className="text-xs text-muted">
                  {topScorer.goals} gol · {topScorer.team.name}
                </div>
              </div>
            </Card>
          ) : null}

          {topAssister ? (
            <Card className="p-5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                <AssistIcon width={16} height={16} /> Top Assist
              </span>
              <div className="mt-3">
                <div className="font-bold text-foreground">{topAssister.name}</div>
                <div className="text-xs text-muted">
                  {topAssister.assists} assist · {topAssister.team.name}
                </div>
              </div>
            </Card>
          ) : null}
        </div>
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <ResultsList title="Hasil pertandingan" />
      </Reveal>

      <Reveal delay={0.1}>
        <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Table watch</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-black">
            <TrophyIcon width={18} height={18} className="text-accent" />
            Top 5 Klasemen
          </h2>
          </div>
          <Link
            href="/standings"
            className="flex min-h-10 items-center gap-0.5 rounded-lg px-2 text-sm font-semibold text-accent hover:bg-accent/10"
          >
            Klasemen lengkap <ChevronRightIcon width={16} height={16} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-surface/80">
          {top5.map((row) => (
            <Link
              key={row.team.id}
              href={`/teams/${row.team.id}`}
              className="group flex min-h-16 items-center gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-b-0 hover:bg-surface-hover"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-hover text-xs font-bold text-muted group-hover:bg-accent/15 group-hover:text-accent">{row.position}</span>
              <TeamCrest team={row.team} size={28} />
              <span className="flex-1 truncate font-semibold">{row.team.name}</span>
              <span className="hidden text-muted sm:block">{row.goalsFor - row.goalsAgainst > 0 ? "+" : ""}{row.goalsFor - row.goalsAgainst} GD</span>
              <span className="w-10 text-right font-bold">{row.points}</span>
            </Link>
          ))}
        </div>
        </section>
      </Reveal>
    </div>
  );
}
