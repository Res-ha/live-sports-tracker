import Link from "next/link";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import { formatFullDate } from "@/lib/format";
import LiveMatches from "@/components/LiveMatches";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { ChevronRightIcon, TrophyIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const standings = await api.getStandings();
  const top5 = standings.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-1 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover p-6">
        <span className="text-sm text-muted">{formatFullDate(new Date())}</span>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {LEAGUE.name} · Pekan ke-{LEAGUE.currentRound}
        </h1>
        <p className="text-sm text-muted">
          Skor langsung, jadwal, dan klasemen musim {LEAGUE.season} — diperbarui otomatis.
        </p>
      </section>

      <LiveMatches />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <TrophyIcon width={18} height={18} className="text-accent" />
            Top 5 Klasemen
          </h2>
          <Link
            href="/standings"
            className="flex items-center gap-0.5 text-sm font-semibold text-accent hover:underline"
          >
            Klasemen lengkap <ChevronRightIcon width={16} height={16} />
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
