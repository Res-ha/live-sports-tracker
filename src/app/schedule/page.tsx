import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import ScheduleBrowser from "@/components/ScheduleBrowser";
import { Badge } from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Jadwal",
  description: "Jadwal pertandingan Premier League per pekan.",
  alternates: { canonical: "/schedule" },
};

export default async function SchedulePage() {
  const [initial, teams] = await Promise.all([
    api.getRound(LEAGUE.currentRound),
    api.getTeams(),
  ]);

  return (
    <div className="space-y-7">
      <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
        <Badge tone="accent">Season planner</Badge>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Jadwal Pertandingan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Pertandingan per pekan musim {LEAGUE.season}. Klik pertandingan untuk melihat
          detail lengkap.
        </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{LEAGUE.name} · {LEAGUE.season}</span>
      </div>
      </Reveal>
      <ScheduleBrowser initial={initial} initialTeams={teams} />
    </div>
  );
}
