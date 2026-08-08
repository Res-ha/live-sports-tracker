import type { MatchDetail, MatchEvent } from "@/types";

function GoalColumn({
  teamName,
  scorers,
}: {
  teamName: string;
  scorers: MatchEvent[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-2 text-sm font-bold">{teamName}</div>
      {scorers.length === 0 ? (
        <div className="text-sm text-muted">Tidak ada gol</div>
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
                  <span className="text-xs text-muted">(assist {g.assist})</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function GoalScorers({ match }: { match: MatchDetail }) {
  const goals = (match.events ?? []).filter((e) => e.type === "Goal");
  if (goals.length === 0) return null;
  const home = goals.filter((g) => g.teamId === match.homeTeam.id);
  const away = goals.filter((g) => g.teamId === match.awayTeam.id);
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Pencetak Gol</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <GoalColumn teamName={match.homeTeam.name} scorers={home} />
        <GoalColumn teamName={match.awayTeam.name} scorers={away} />
      </div>
    </section>
  );
}
