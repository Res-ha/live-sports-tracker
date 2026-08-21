import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import StandingsTable from "@/components/StandingsTable";
import { Badge } from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Klasemen",
  description: `Klasemen ${LEAGUE.name} musim ${LEAGUE.season}.`,
  alternates: { canonical: "/standings" },
};

export default async function StandingsPage() {
  const standings = await api.getStandings();

  return (
    <div className="space-y-6">
      <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
        <Badge tone="violet">Table watch</Badge>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Klasemen</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {LEAGUE.name} · Musim {LEAGUE.season} · Selesai
        </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Updated after round {LEAGUE.currentRound}</span>
      </div>
      </Reveal>

      <div className="flex flex-wrap gap-2 text-[11px] text-muted">
        <Badge tone="violet">Top 4 · Zona Liga Champions</Badge>
        <Badge tone="accent">★ Tim favorit Anda</Badge>
      </div>

      <StandingsTable rows={standings} />
    </div>
  );
}
