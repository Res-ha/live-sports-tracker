import type { MatchDetail } from "@/types";

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

export default function MatchStats({ match }: { match: MatchDetail }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Statistik Pertandingan</h2>
      <div className="space-y-5 rounded-[1.5rem] border border-border/80 bg-surface/80 p-5">
        {match.stats.map((s) => (
          <StatBar key={s.label} label={s.label} home={s.home} away={s.away} />
        ))}
      </div>
    </section>
  );
}
