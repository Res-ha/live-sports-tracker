import type { Match, MatchDetail, StandingsRow, Team } from "@/types";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request gagal (${res.status})`);
  return res.json() as Promise<T>;
}

export const clientApi = {
  getRound(round: number): Promise<{ matches: Match[]; range: string }> {
    return getJson(`/api/fixtures?round=${round}`);
  },

  getMatch(id: number): Promise<MatchDetail | undefined> {
    return getJson(`/api/fixtures/${id}`);
  },

  getStandings(): Promise<StandingsRow[]> {
    return getJson("/api/standings");
  },

  getTeams(): Promise<Team[]> {
    return getJson("/api/teams");
  },

  getTeamFixtures(id: number): Promise<Match[]> {
    return getJson(`/api/teams/${id}/fixtures`);
  },
};