import {
  getMatchById,
  getMatchesForRound,
  getMatchesForToday,
  getRoundRange,
  getStandings,
  getTeamById,
  getTeamFixtures,
  getTeamForm,
  getTeams,
  getTopAssists,
  getTopScorers,
} from "@/lib/api/mock";
import type { SportsProvider } from "./types";

export const mockProvider: SportsProvider = {
  getTodayMatches: () => Promise.resolve(getMatchesForToday()),
  getRound: (round) => Promise.resolve({ matches: getMatchesForRound(round), range: getRoundRange(round) }),
  getStandings: () => Promise.resolve(getStandings()),
  getTeams: () => Promise.resolve(getTeams()),
  getTeam: (id) => Promise.resolve(getTeamById(id)),
  getTeamFixtures: (id) => Promise.resolve(getTeamFixtures(id)),
  getTeamForm: (id) => Promise.resolve(getTeamForm(id)),
  getMatch: (id) => Promise.resolve(getMatchById(id)),
  getTopScorers: () => Promise.resolve(getTopScorers()),
  getTopAssists: () => Promise.resolve(getTopAssists()),
};
