import type { PlayerStat } from "@/types";

export default function PlayerStatsTable({
  players,
  metric,
}: {
  players: PlayerStat[];
  metric: "goals" | "assists";
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-surface/80 shadow-[0_18px_50px_rgb(2_8_23/.18)]">
      <div className="border-b border-border/60 bg-background/30 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {metric === "goals" ? "Top Scorers" : "Top Assists"} — Premier League
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-muted">
            <th className="px-4 py-2.5">#</th>
            <th className="px-4 py-2.5">Pemain</th>
            <th className="hidden px-2 py-2.5 text-center sm:table-cell">Main</th>
            <th className="px-4 py-2.5 text-center">
              {metric === "goals" ? "Gol" : "Assist"}
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr
              key={p.id}
              className="border-t border-border/60 transition-colors hover:bg-surface-hover"
            >
              <td className="px-4 py-3 font-bold text-muted">
                {i < 3 ? (
                  <span className="text-accent">#{i + 1}</span>
                ) : (
                  i + 1
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-hover text-xs font-bold">
                    {p.name.charAt(0)}
                  </span>
                  <span className="font-semibold">{p.name}</span>
                </div>
              </td>
              <td className="hidden px-2 py-3 text-center text-muted sm:table-cell">
                {p.appearances}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-accent/15 px-2.5 py-1 font-bold text-accent">
                  {metric === "goals" ? p.goals : p.assists}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
