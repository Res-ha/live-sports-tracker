import type {
  Match,
  MatchDetail,
  PlayerStat,
  StandingsRow,
  Team,
  TeamResult,
} from "@/types";

export interface SportsProvider {
  getTodayMatches(): Promise<Match[]>;
  getRound(round: number): Promise<{ matches: Match[]; range: string }>;
  getStandings(): Promise<StandingsRow[]>;
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamFixtures(id: number): Promise<Match[]>;
  getTeamForm(id: number): Promise<TeamResult[]>;
  getMatch(id: number): Promise<MatchDetail | undefined>;
  getTopScorers(): Promise<PlayerStat[]>;
  getTopAssists(): Promise<PlayerStat[]>;
}
