import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { formatKickoffDate, formatKickoffTime } from "@/lib/format";
import { getDictionary, type Translator } from "@/lib/i18n";
import type { MatchDetail, MatchEvent } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { StatusBadge } from "@/components/ui/StatusBadge";
import FavoriteButton from "@/components/FavoriteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STAT_LABEL_KEY: Record<string, string> = {
  "Penguasaan Bola": "matchStat.possession",
  "Tembakan": "matchStat.shots",
  "Tembakan ke Gawang": "matchStat.shotsOnTarget",
  "Tendangan Sudut": "matchStat.corners",
  "Pelanggaran": "matchStat.fouls",
  "Ball Possession": "matchStat.possession",
  "Total Shots": "matchStat.shots",
  "Shots on Goal": "matchStat.shotsOnTarget",
  "Corner Kicks": "matchStat.corners",
  "Fouls": "matchStat.fouls",
};

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

function GoalColumn({
  teamName,
  scorers,
  t,
}: {
  teamName: string;
  scorers: MatchEvent[];
  t: Translator;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-2 text-sm font-bold">{teamName}</div>
      {scorers.length === 0 ? (
        <div className="text-sm text-muted">{t("match.noGoals")}</div>
      ) : (
        <ul className="space-y-1.5">
          {scorers.map((g, i) => {
            const isOG =
              g.detail.includes("Own Goal") || g.detail.includes("Gol Bunuh Diri");
            const isPen = g.detail.includes("Penalty");
            return (
              <li key={i} className="flex flex-wrap items-center gap-x-2 text-sm">
                <span className="font-mono text-xs font-bold text-accent">
                  {g.minute}{"'"}
                </span>
                <span className="font-semibold">{g.player}</span>
                {isOG && (
                  <span className="rounded bg-surface-hover px-1 py-0.5 text-[9px] font-bold uppercase text-muted">
                    OG
                  </span>
                )}
                {isPen && (
                  <span className="rounded bg-surface-hover px-1 py-0.5 text-[9px] font-bold uppercase text-muted">
                    P
                  </span>
                )}
                {g.assist ? (
                  <span className="text-xs text-muted">
                    ({t("match.assist", { name: g.assist })})
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function GoalScorers({ match, t }: { match: MatchDetail; t: Translator }) {
  const goals = (match.events ?? []).filter((e) => e.type === "Goal");
  if (goals.length === 0) return null;
  const home = goals.filter((g) => g.teamId === match.homeTeam.id);
  const away = goals.filter((g) => g.teamId === match.awayTeam.id);
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{t("match.goals")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <GoalColumn teamName={match.homeTeam.name} scorers={home} t={t} />
        <GoalColumn teamName={match.awayTeam.name} scorers={away} t={t} />
      </div>
    </section>
  );
}

function EventBadge({ type, detail }: { type: MatchEvent["type"]; detail: string }) {
  if (type === "Goal") {
    return (
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-400">
        G
      </span>
    );
  }
  if (type === "Card") {
    const red = detail.includes("Red") || detail.includes("Second Yellow");
    return (
      <span
        className={`h-3.5 w-2.5 shrink-0 rounded-[2px] ${
          red ? "bg-red-500" : "bg-yellow-400"
        }`}
      />
    );
  }
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">
      ↔
    </span>
  );
}

function MatchTimeline({ match, t }: { match: MatchDetail; t: Translator }) {
  const events = match.events ?? [];
  if (events.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{t("match.timeline")}</h2>
      <div className="rounded-2xl border border-border bg-surface p-5">
        <ul>
          {events.map((e, i) => {
            const teamName =
              e.teamId === match.homeTeam.id
                ? match.homeTeam.name
                : e.teamId === match.awayTeam.id
                  ? match.awayTeam.name
                  : "";
            return (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="grid h-7 w-12 shrink-0 place-items-center rounded-md bg-surface-hover font-mono text-xs font-bold">
                    {e.minute}{"'"}
                  </span>
                  {i < events.length - 1 ? (
                    <span className="w-px flex-1 bg-border/60" />
                  ) : null}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <EventBadge type={e.type} detail={e.detail} />
                    <span className="font-semibold">{e.player}</span>
                    {teamName ? (
                      <span className="truncate text-xs text-muted">{teamName}</span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 text-xs text-muted">
                    {e.detail}
                    {e.assist ? ` · ${t("match.eventAssist", { name: e.assist })}` : ""}
                    {e.comments ? ` · ${e.comments}` : ""}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await api.getMatch(Number(id));
  if (!match) return { title: "Match not found" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    description: `${match.homeTeam.name} vs ${match.awayTeam.name} · ${match.venue}`,
  };
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const [match, t] = await Promise.all([api.getMatch(Number(id)), getDictionary()]);
  if (!match) notFound();

  const hasStarted = match.status !== "SCHEDULED";

  return (
    <div className="space-y-6">
      <LinkToSchedule round={match.round} t={t} />

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
            {match.referee && (
              <span>{t("match.referee", { name: match.referee })}</span>
            )}
            {match.attendance && (
              <span>{t("match.attendance", { n: match.attendance })}</span>
            )}
          </div>
        ) : null}
      </section>

      {hasStarted && (
        <>
          <GoalScorers match={match} t={t} />

          <section>
            <h2 className="mb-3 text-lg font-bold">{t("match.stats")}</h2>
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              {match.stats.map((s) => (
                <StatBar
                  key={s.label}
                  label={t(STAT_LABEL_KEY[s.label] ?? s.label)}
                  home={s.home}
                  away={s.away}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">{t("match.lineups")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <LineupColumn teamName={match.homeTeam.name} players={match.lineupHome} />
              <LineupColumn teamName={match.awayTeam.name} players={match.lineupAway} />
            </div>
          </section>

          <MatchTimeline match={match} t={t} />
        </>
      )}
    </div>
  );
}

function LinkToSchedule({ round, t }: { round: number; t: Translator }) {
  return (
    <a
      href="/schedule"
      className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-accent"
    >
      <span aria-hidden>←</span> {t("match.backRound", { round })}
    </a>
  );
}
