import type { Match, MatchDetail, StandingsRow, Team, TeamResult } from "@/types";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request gagal (${res.status})`);
  return res.json() as Promise<T>;
}

export const clientApi = {
  getRound(round: number): Promise<{ matches: Match[]; range: string }> {
    return getJson(`/data/rounds/${round}.json`);
  },

  getMatch(id: number): Promise<MatchDetail | undefined> {
    return getJson(`/data/matches/${id}.json`);
  },

  getStandings(): Promise<StandingsRow[]> {
    return getJson("/data/standings.json");
  },

  getTeams(): Promise<Team[]> {
    return getJson("/data/teams.json");
  },

  getTeamFixtures(id: number): Promise<Match[]> {
    return getJson(`/data/teams/${id}/fixtures.json`);
  },

  getTeamForm(id: number): Promise<TeamResult[]> {
    return getJson(`/data/teams/${id}/form.json`);
  },
};