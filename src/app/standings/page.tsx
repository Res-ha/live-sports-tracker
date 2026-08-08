import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import StandingsTable from "@/components/StandingsTable";

export const metadata: Metadata = {
  title: "Klasemen",
  description: `Klasemen ${LEAGUE.name} musim ${LEAGUE.season}.`,
};

export default async function StandingsPage() {
  const standings = await api.getStandings();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Klasemen</h1>
        <p className="text-sm text-muted">
          {LEAGUE.name} · Musim {LEAGUE.season} · Selesai
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] text-muted">
        <span className="rounded-full border border-ucl/40 bg-ucl/10 px-2.5 py-1 font-semibold text-ucl">
          Top 4 — Zona Liga Champions
        </span>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-semibold text-accent">
          ★ Tim favorit Anda
        </span>
      </div>

      <StandingsTable rows={standings} />
    </div>
  );
}
