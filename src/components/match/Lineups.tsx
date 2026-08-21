import type { MatchDetail, LineupPlayer } from "@/types";

function LineupColumn({
  teamName,
  players,
  coach,
}: {
  teamName: string;
  players: LineupPlayer[];
  coach?: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border/80 bg-surface/80">
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
      {coach ? (
        <div className="border-t border-border/60 px-4 py-2 text-xs text-muted">
          Pelatih: <span className="font-semibold text-foreground">{coach}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function Lineups({ match }: { match: MatchDetail }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Susunan Pemain</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <LineupColumn
          teamName={match.homeTeam.name}
          players={match.lineupHome}
          coach={match.homeCoach}
        />
        <LineupColumn
          teamName={match.awayTeam.name}
          players={match.lineupAway}
          coach={match.awayCoach}
        />
      </div>
    </section>
  );
}
