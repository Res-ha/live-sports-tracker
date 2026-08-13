import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import MatchCard from "@/components/MatchCard";

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
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-muted">Pekan ke-{LEAGUE.currentRound}</span>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
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