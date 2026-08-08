import { provider } from "@/lib/sports";
import type {
  Match,
  MatchDetail,
  PlayerStat,
  StandingsRow,
  Team,
  TeamResult,
} from "@/types";

const isServer = typeof window === "undefined";

async function clientGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request gagal (${res.status})`);
  return res.json();
}

export const api = {
  getTodayMatches(): Promise<Match[]> {
    return isServer ? provider.getTodayMatches() : clientGet<Match[]>("/api/fixtures/today");
  },

  getRound(round: number): Promise<{ matches: Match[]; range: string }> {
    return isServer
      ? provider.getRound(round)
      : clientGet<{ matches: Match[]; range: string }>(`/api/fixtures?round=${round}`);
  },

  getStandings(): Promise<StandingsRow[]> {
    return isServer ? provider.getStandings() : clientGet<StandingsRow[]>("/api/standings");
  },

  getTeams(): Promise<Team[]> {
    return isServer ? provider.getTeams() : clientGet<Team[]>("/api/teams");
  },

  getTeam(id: number): Promise<Team | undefined> {
    return isServer ? provider.getTeam(id) : clientGet<Team>(`/api/teams/${id}`);
  },

  getTeamFixtures(id: number): Promise<Match[]> {
    return isServer
      ? provider.getTeamFixtures(id)
      : clientGet<Match[]>(`/api/teams/${id}/fixtures`);
  },

  getTeamForm(id: number): Promise<TeamResult[]> {
    return isServer
      ? provider.getTeamForm(id)
      : clientGet<TeamResult[]>(`/api/teams/${id}/form`);
  },

  getMatch(id: number): Promise<MatchDetail | undefined> {
    return isServer ? provider.getMatch(id) : clientGet<MatchDetail>(`/api/fixtures/${id}`);
  },

  getTopScorers(): Promise<PlayerStat[]> {
    return isServer ? provider.getTopScorers() : clientGet<PlayerStat[]>("/api/stats/top-scorers");
  },

  getTopAssists(): Promise<PlayerStat[]> {
    return isServer ? provider.getTopAssists() : clientGet<PlayerStat[]>("/api/stats/top-assists");
  },
};
