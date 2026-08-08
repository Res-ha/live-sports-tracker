export interface Team {
  id: number;
  name: string;
  shortName: string;
  crestColor: string;
  city?: string;
  stadium?: string;
}

export type MatchStatus = "LIVE" | "HT" | "FT" | "SCHEDULED";

export interface Match {
  id: number;
  round: number;
  status: MatchStatus;
  minute?: number;
  kickoff: string;
  venue: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
}

export interface StandingsRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface PlayerStat {
  id: number;
  name: string;
  team: Team;
  goals: number;
  assists: number;
  appearances: number;
}

export interface LineupPlayer {
  name: string;
  number: number;
  position: string;
}

export interface MatchStatPair {
  label: string;
  home: number;
  away: number;
}

export type MatchEventType = "Goal" | "Card" | "Subst";

export interface MatchEvent {
  minute: number;
  teamId: number;
  type: MatchEventType;
  detail: string;
  player: string;
  assist?: string;
  comments?: string;
}

export interface MatchDetail extends Match {
  referee?: string;
  attendance?: string;
  homeCoach?: string;
  awayCoach?: string;
  stats: MatchStatPair[];
  lineupHome: LineupPlayer[];
  lineupAway: LineupPlayer[];
  events?: MatchEvent[];
}

export type TeamResult = "W" | "D" | "L";
