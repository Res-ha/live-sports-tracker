import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import MatchCard from "@/components/MatchCard";
import { Badge } from "@/components/ui/Badge";

export default async function ResultsList({
  title = "Hasil Pertandingan",
}: {
  title?: string;
}) {
  let matches: Awaited<ReturnType<typeof api.getRound>>["matches"] = [];
  try {
    const data = await api.getRound(LEAGUE.currentRound);
    matches = data.matches;
  } catch {
    matches = [];
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Match center</p>
          <h2 className="mt-1 text-xl font-black tracking-tight">{title}</h2>
        </div>
        <Badge tone="default">Pekan {LEAGUE.currentRound}</Badge>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-surface/60 p-10 text-center text-sm text-muted">
          Tidak ada pertandingan.
        </div>
      ) : (
        <div className="grid gap-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
