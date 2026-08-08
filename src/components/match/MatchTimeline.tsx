import type { MatchDetail, MatchEvent } from "@/types";

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

export default function MatchTimeline({ match }: { match: MatchDetail }) {
  const events = match.events ?? [];
  if (events.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Linimasa</h2>
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
                    {e.assist ? ` · Assist: ${e.assist}` : ""}
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
