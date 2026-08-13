import type { Metadata } from "next";
import { api } from "@/lib/api";
import { LEAGUE } from "@/lib/api/league";
import ScheduleBrowser from "@/components/ScheduleBrowser";

export const metadata: Metadata = {
  title: "Jadwal",
  description: "Jadwal pertandingan Premier League per pekan.",
};

export default async function SchedulePage() {
  const [initial, teams] = await Promise.all([
    api.getRound(LEAGUE.currentRound),
    api.getTeams(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Jadwal Pertandingan</h1>
        <p className="text-sm text-muted">
          Pertandingan per pekan musim {LEAGUE.season}. Klik pertandingan untuk melihat
          detail lengkap.
        </p>
      </div>
      <ScheduleBrowser initial={initial} initialTeams={teams} />
    </div>
  );
}