import { LEAGUE, teamById } from "@/lib/api/league";
import type {
  LineupPlayer,
  Match,
  MatchDetail,
  MatchEvent,
  MatchStatPair,
  MatchStatus,
  PlayerStat,
  StandingsRow,
  Team,
  TeamResult,
} from "@/types";
import { mockProvider } from "./mock";
import type { SportsProvider } from "./types";

const BASE_URL = "https://v3.football.api-sports.io";
const KEY = process.env.API_FOOTBALL_KEY ?? "";

const SEASON = (() => {
  const fromEnv = Number(process.env.API_FOOTBALL_SEASON);
  return Number.isInteger(fromEnv) && fromEnv > 0 ? fromEnv : LEAGUE.apiSeason;
})();

const REVALIDATE = Number(process.env.API_FOOTBALL_CACHE_SECONDS) || 3600;
const REVALIDATE_STATIC = 86_400;

function resolveTeam(id: number, fallbackName: string): Team {
  const known = teamById.get(id);
  if (known) {
    return known;
  }
  return {
    id,
    name: fallbackName,
    shortName: fallbackName.slice(0, 3).toUpperCase(),
    crestColor: "#334155",
  };
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function activeSeason(): number {
  return SEASON;
}

function todayKey(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function mapStatus(short: string, elapsed: number | null): { status: MatchStatus; minute?: number } {
  if (short === "NS") return { status: "SCHEDULED" };
  if (short === "1H" || short === "2H") {
    return { status: "LIVE", minute: elapsed ?? undefined };
  }
  if (short === "HT") return { status: "HT" };
  return { status: "FT" };
}

function extractRound(raw: string | null | undefined): number {
  const match = /(\d+)/.exec(raw ?? "");
  return match ? Number(match[1]) : LEAGUE.currentRound;
}

interface APIFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue: { name: string | null } | null;
    referee: { fullname?: string | null } | null;
    attendance: number | null;
  };
  league: { round: string | null };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: { home: number | null; away: number | null };
}

function toMatch(f: APIFixture): Match {
  const { status, minute } = mapStatus(f.fixture.status.short, f.fixture.status.elapsed);
  const scheduled = status === "SCHEDULED";
  return {
    id: f.fixture.id,
    round: extractRound(f.league.round),
    status,
    minute,
    kickoff: f.fixture.date,
    venue: f.fixture.venue?.name ?? "",
    homeTeam: resolveTeam(f.teams.home.id, f.teams.home.name),
    awayTeam: resolveTeam(f.teams.away.id, f.teams.away.name),
    homeScore: scheduled ? null : num(f.goals.home),
    awayScore: scheduled ? null : num(f.goals.away),
  };
}

async function footballGet<T>(path: string, revalidate = REVALIDATE): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": KEY },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`API-Football HTTP ${res.status}`);
  const data = (await res.json()) as { errors?: Record<string, string>; response: unknown };
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(Object.values(data.errors).join(", "));
  }
  return data as T;
}

function withFallback<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  return fn().catch(fallback);
}

function isEnabled(): boolean {
  return KEY.length > 0;
}

async function getFixtures(query: string, revalidate = REVALIDATE): Promise<Match[]> {
  const data = await footballGet<{ response: APIFixture[] }>(query, revalidate);
  return (data.response ?? []).map(toMatch);
}

export const footballProvider: SportsProvider = {
  getTodayMatches: () =>
    withFallback(
      () => getFixtures(`/fixtures?league=${LEAGUE.id}&season=${activeSeason()}&date=${todayKey()}`),
      () => mockProvider.getTodayMatches()
    ),

  async getRound(round) {
    return withFallback(
      async () => {
        const matches = await getFixtures(
          `/fixtures?league=${LEAGUE.id}&season=${activeSeason()}&round=Regular Season - ${round}`,
          REVALIDATE_STATIC
        );
        const range =
          matches.length > 0
            ? new Date(matches[0].kickoff).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
            : "";
        return { matches, range };
      },
      () => mockProvider.getRound(round)
    );
  },

  getStandings: () =>
    withFallback(async () => {
      const data = await footballGet<{
        response: { league: { standings: APIRow[][] } }[];
      }>(`/standings?league=${LEAGUE.id}&season=${activeSeason()}`, REVALIDATE_STATIC);
      const rows = data.response?.[0]?.league?.standings?.[0] ?? [];
      return rows
        .map((r) => {
          const all = r.all;
          return {
            position: num(r.rank),
            team: resolveTeam(r.team.id, r.team.name),
            played: num(all.played),
            won: num(all.win),
            drawn: num(all.draw),
            lost: num(all.lose),
            goalsFor: num(all.goals.for),
            goalsAgainst: num(all.goals.against),
            points: num(r.points),
          } as StandingsRow;
        })
        .sort((a, b) => a.position - b.position);
    }, () => mockProvider.getStandings()),

  getTeams: () =>
    withFallback(async () => {
      const data = await footballGet<{
        response: { team: { id: number; name: string }; venue: { name: string | null; city: string | null } }[];
      }>(`/teams?league=${LEAGUE.id}&season=${activeSeason()}`, REVALIDATE_STATIC);
      return (data.response ?? []).map((r) => {
        const known = teamById.get(r.team.id);
        return {
          id: r.team.id,
          name: known?.name ?? r.team.name,
          shortName: known?.shortName ?? r.team.name.slice(0, 3).toUpperCase(),
          crestColor: known?.crestColor ?? "#334155",
          city: known?.city ?? r.venue?.city ?? undefined,
          stadium: known?.stadium ?? r.venue?.name ?? undefined,
        };
      });
    }, () => mockProvider.getTeams()),

  getTeam: (id) =>
    withFallback(async () => {
      const teams = await footballProvider.getTeams();
      return teams.find((t) => t.id === id);
    }, async () => mockProvider.getTeam(id)),

  getTeamFixtures: (id) =>
    withFallback(
      () => getFixtures(`/fixtures?team=${id}&league=${LEAGUE.id}&season=${activeSeason()}`, REVALIDATE_STATIC),
      () => mockProvider.getTeamFixtures(id)
    ),

  async getTeamForm(id) {
    return withFallback(async () => {
      const matches = await footballProvider.getTeamFixtures(id);
      const form: TeamResult[] = [];
      for (const m of matches) {
        if (m.status !== "FT" || m.homeScore === null || m.awayScore === null) continue;
        if (m.homeTeam.id === id) {
          form.push(m.homeScore > m.awayScore ? "W" : m.homeScore === m.awayScore ? "D" : "L");
        } else if (m.awayTeam.id === id) {
          form.push(m.awayScore > m.homeScore ? "W" : m.awayScore === m.homeScore ? "D" : "L");
        }
      }
      return form.slice(-5);
    }, () => mockProvider.getTeamForm(id));
  },

  async getMatch(id) {
    return withFallback(async () => {
      const [fixtureRes, statsRes, lineupRes] = await Promise.all([
        footballGet<{ response: APIFixture[] }>(`/fixtures?id=${id}`, REVALIDATE_STATIC),
        footballGet<{
          response: { team: { id: number }; statistics: { type: string; value: string | null }[] }[];
        }>(`/fixtures/statistics?fixture=${id}`, REVALIDATE_STATIC),
        footballGet<{
          response: {
            team: { id: number };
            coach: { id: number | null; name: string | null } | null;
            startXI: { player: { id: number | null; name: string | null; pos: string | null; number: number | null } }[];
          }[];
        }>(`/fixtures/lineups?fixture=${id}`, REVALIDATE_STATIC),
      ]);

      const fixture = fixtureRes.response?.[0];
      if (!fixture) return mockProvider.getMatch(id);

      const match = toMatch(fixture);
      const homeId = match.homeTeam.id;
      const awayId = match.awayTeam.id;

      const statMap = (teamId: number) => {
        const team = statsRes.response?.find((s) => s.team.id === teamId);
        const pick = (type: string) =>
          team?.statistics?.find((s) => s.type === type)?.value ?? null;
        return {
          possession: pick("Ball Possession"),
          shots: pick("Total Shots"),
          shotsOnTarget: pick("Shots on Goal"),
          corners: pick("Corner Kicks"),
          fouls: pick("Fouls"),
        };
      };
      const home = statMap(homeId);
      const away = statMap(awayId);
      const stats: MatchStatPair[] = [
        {
          label: "Penguasaan Bola",
          home: num(String(home.possession ?? "0").replace("%", "")),
          away: num(String(away.possession ?? "0").replace("%", "")),
        },
        { label: "Tembakan", home: num(home.shots), away: num(away.shots) },
        { label: "Tembakan ke Gawang", home: num(home.shotsOnTarget), away: num(away.shotsOnTarget) },
        { label: "Tendangan Sudut", home: num(home.corners), away: num(away.corners) },
        { label: "Pelanggaran", home: num(home.fouls), away: num(away.fouls) },
      ];

      const lineup = (teamId: number): LineupPlayer[] => {
        const team = lineupRes.response?.find((l) => l.team.id === teamId);
        return (team?.startXI ?? []).map((p) => ({
          name: p.player.name ?? "—",
          number: num(p.player.number),
          position: p.player.pos ?? "",
        }));
      };

      const coachName = (teamId: number): string | undefined =>
        lineupRes.response?.find((l) => l.team.id === teamId)?.coach?.name ?? undefined;

      let eventsResponse: APIEvent[] = [];
      try {
        const res = await footballGet<{ response: APIEvent[] }>(
          `/fixtures/events?fixture=${id}`,
          REVALIDATE_STATIC
        );
        eventsResponse = res.response ?? [];
      } catch {
        eventsResponse = [];
      }

      const events = eventsResponse
        .filter((e) => e.type === "Goal" || e.type === "Card" || e.type === "Subst")
        .map((e) => ({
          minute: num(e.time?.elapsed),
          teamId: e.team?.id ?? 0,
          type: e.type as MatchEvent["type"],
          detail: e.detail ?? "",
          player: e.player?.name ?? "—",
          assist: e.assist?.name ?? undefined,
          comments: e.comments ?? undefined,
        }))
        .sort((a, b) => a.minute - b.minute);

      return {
        ...match,
        referee: fixture.fixture.referee?.fullname ?? undefined,
        attendance: fixture.fixture.attendance ? String(fixture.fixture.attendance) : undefined,
        stats,
        lineupHome: lineup(homeId),
        lineupAway: lineup(awayId),
        homeCoach: coachName(homeId),
        awayCoach: coachName(awayId),
        events,
      } as MatchDetail;
    }, async () => mockProvider.getMatch(id));
  },

  getTopScorers: () =>
    withFallback(
      () => fetchTopPlayers("/players/topscorers"),
      () => mockProvider.getTopScorers()
    ),

  getTopAssists: () =>
    withFallback(
      () => fetchTopPlayers("/players/topassists"),
      () => mockProvider.getTopAssists()
    ),
};

interface APIEvent {
  time: { elapsed: number | null; extra: number | null };
  team: { id: number | null; name: string | null };
  player: { id: number | null; name: string | null };
  assist: { id: number | null; name: string | null } | null;
  type: string;
  detail: string;
  comments: string | null;
}

interface APIPlayerStat {
  player: { id: number; name: string };
  statistics: {
    team: { id: number };
    games: { appearences: number | null };
    goals: { total: number | null; assists: number | null };
  }[];
}
interface APIRow {
  rank: number | null;
  team: { id: number; name: string };
  all: {
    played: number | null;
    win: number | null;
    draw: number | null;
    lose: number | null;
    goals: { for: number | null; against: number | null };
  };
  points: number | null;
}

async function fetchTopPlayers(path: string): Promise<PlayerStat[]> {
  const data = await footballGet<{ response: APIPlayerStat[] }>(
    `${path}?league=${LEAGUE.id}&season=${activeSeason()}`,
    REVALIDATE_STATIC
  );
  return (data.response ?? []).slice(0, 10).map((r) => {
    const s = r.statistics?.[0];
    return {
      id: r.player.id,
      name: r.player.name,
      team: resolveTeam(s?.team.id ?? 0, "—"),
      goals: num(s?.goals?.total),
      assists: num(s?.goals?.assists),
      appearances: num(s?.games?.appearences),
    };
  });
}

export function getSportsProvider(): SportsProvider {
  return isEnabled() ? footballProvider : mockProvider;
}
