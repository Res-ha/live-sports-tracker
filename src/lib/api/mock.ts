import { TEAMS, LEAGUE, teamById } from "./league";
import type {
  Match,
  MatchDetail,
  MatchStatPair,
  PlayerStat,
  StandingsRow,
  Team,
  TeamResult,
} from "@/types";

const SEASON_START = new Date(2024, 7, 16);

const STRENGTH: Record<number, number> = {
  50: 92, 42: 91, 40: 90, 49: 88, 34: 86, 47: 85, 66: 84, 33: 83,
  51: 80, 55: 79, 48: 78, 52: 77, 35: 77, 36: 76, 45: 74, 39: 74,
  65: 74, 46: 72, 57: 68, 41: 67,
};

function strengthOf(teamId: number): number {
  return STRENGTH[teamId] ?? 75;
}

function seededRandom(seed: number): number {
  const x = (seed * 9301 + 49297) % 233280;
  return x / 233280;
}

function fmtKickoff(date: Date, time: string): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function buildRoundRobin(): Team[][] {
  const arr = [...TEAMS];
  const rounds: Team[][] = [];
  for (let r = 0; r < TEAMS.length - 1; r++) {
    const round: Team[] = [];
    for (let i = 0; i < TEAMS.length / 2; i++) {
      round.push(arr[i], arr[TEAMS.length - 1 - i]);
    }
    rounds.push(round);
    arr.splice(1, 0, arr.pop() as Team);
  }
  return rounds;
}

const FIRST_LEG = buildRoundRobin();
const SECOND_LEG = FIRST_LEG.map((round) =>
  round.map((_, i) => round[(i % 2 === 0 ? i + 1 : i - 1)])
);

function roundKickoffs(round: number): Match[] {
  const raw = round <= 19 ? FIRST_LEG[round - 1] : SECOND_LEG[round - 20];
  const base = new Date(SEASON_START);
  base.setDate(base.getDate() + (round - 1) * 8);
  const saturdayTimes = ["12:30", "15:00", "15:00", "15:00", "17:30", "20:00"];

  return Array.from({ length: raw.length / 2 }, (_, k) => [raw[k * 2], raw[k * 2 + 1]]).map(
    ([home, away], i) => {
      let dayOffset = 0;
      let time = "20:00";
      if (i === 0) {
        dayOffset = 0;
        time = "20:00";
      } else if (i < 7) {
        dayOffset = 1;
        time = saturdayTimes[i - 1];
      } else {
        dayOffset = 2;
        time = ["14:00", "16:30", "19:30"][i - 7];
      }
      const kickDate = new Date(base);
      kickDate.setDate(base.getDate() + dayOffset);
      return {
        id: round * 100 + i,
        round,
        status: "SCHEDULED" as const,
        kickoff: fmtKickoff(kickDate, time),
        venue: home.stadium ?? "",
        homeTeam: home,
        awayTeam: away,
        homeScore: null,
        awayScore: null,
      };
    }
  );
}

function applyResults(match: Match): Match {
  const seed = match.id * 31 + 7;
  const ratioHome =
    strengthOf(match.homeTeam.id) / (strengthOf(match.homeTeam.id) + strengthOf(match.awayTeam.id)) +
    0.08;
  const total = 2.4 + seededRandom(seed + 4) * 1.6;
  const hGoals = Math.min(
    5,
    Math.max(0, Math.round(total * ratioHome * (1 + (seededRandom(seed + 5) - 0.5) * 0.3)))
  );
  const aGoals = Math.min(
    5,
    Math.max(0, Math.round(total * (1 - ratioHome) * (1 + (seededRandom(seed + 6) - 0.5) * 0.3)))
  );
  return { ...match, status: "FT", homeScore: hGoals, awayScore: aGoals };
}

const ALL_ROUNDS: Match[][] = Array.from({ length: 38 }, (_, i) => {
  const round = i + 1;
  const matches = roundKickoffs(round);
  if (round < LEAGUE.currentRound) {
    return matches.map(applyResults);
  }
  if (round === LEAGUE.currentRound) {
    return matches.map((m, i) => {
      if (i === 0) return { ...m, status: "LIVE", minute: 63, homeScore: 1, awayScore: 0 };
      if (i === 1) return { ...m, status: "LIVE", minute: 78, homeScore: 2, awayScore: 2 };
      if (i === 2) return { ...m, status: "HT", homeScore: 0, awayScore: 1 };
      return m;
    });
  }
  return matches;
});

const ALL_MATCHES = ALL_ROUNDS.flat();

export function getStandings(): StandingsRow[] {
  const rows = new Map<number, StandingsRow>(
    TEAMS.map((t) => [
      t.id,
      {
        position: 0,
        team: t,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      },
    ])
  );
  for (const m of ALL_MATCHES) {
    if (m.status !== "FT" || m.homeScore === null || m.awayScore === null) continue;
    const home = rows.get(m.homeTeam.id)!;
    const away = rows.get(m.awayTeam.id)!;
    const [h, a] = [m.homeScore, m.awayScore];
    home.played++;
    away.played++;
    home.goalsFor += h;
    home.goalsAgainst += a;
    away.goalsFor += a;
    away.goalsAgainst += h;
    if (h > a) {
      home.won++;
      away.lost++;
      home.points += 3;
    } else if (h < a) {
      away.won++;
      home.lost++;
      away.points += 3;
    } else {
      home.drawn++;
      away.drawn++;
      home.points++;
      away.points++;
    }
  }
  return [...rows.values()]
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
        b.goalsFor - a.goalsFor
    )
    .map((r, i) => ({ ...r, position: i + 1 }));
}

const SURNAMES = [
  "Silva", "Almeida", "Costa", "Souza", "Mendes", "Ribeiro", "Carvalho", "Ferreira",
  "Oliveira", "Pereira", "Kovac", "Novak", "Horvat", "Janko", "Popov", "Ivanov",
  "Petrov", "Molnar", "Nagy", "Szabo", "Kovacs", "Toth", "Larsen", "Nilsen",
  "Andersson", "Karlsson", "Johansson", "Berg", "Lindqvist", "Dahl", "Eng",
  "Ramos", "Vega", "Molina", "Navarro", "Castro", "Rojas", "Fuentes", "Vargas",
];

const POSITIONS: [string, number][] = [
  ["GK", 1],
  ["DF", 4],
  ["MF", 3],
  ["FW", 3],
];

function buildLineup(teamId: number, seed: number) {
  const players = [];
  const names = [...SURNAMES].sort(
    (a, b) => seededRandom(seed + a.charCodeAt(0)) - seededRandom(seed + b.charCodeAt(0))
  );
  let idx = 0;
  for (const [position, count] of POSITIONS) {
    for (let k = 0; k < count; k++) {
      players.push({ name: names[idx], number: 1 + idx + seededRandom(seed + idx) * 30, position });
      idx++;
    }
  }
  return players;
}

export function getMatchesForToday(): Match[] {
  return ALL_ROUNDS[LEAGUE.currentRound - 1];
}

export function getMatchesForRound(round: number): Match[] {
  if (round < 1) return [];
  if (round > 38) return [];
  return ALL_ROUNDS[round - 1];
}

export function getRoundRange(round: number): string {
  const base = new Date(SEASON_START);
  base.setDate(base.getDate() + (round - 1) * 8);
  const end = new Date(base);
  end.setDate(base.getDate() + 3);
  const fmt = (d: Date) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  return `${fmt(base)} - ${fmt(end)}`;
}

export function getTeams(): Team[] {
  return TEAMS;
}

export function getTeamById(id: number): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function getTeamForm(teamId: number): TeamResult[] {
  const form: TeamResult[] = [];
  for (const m of ALL_MATCHES) {
    if (m.status !== "FT" || m.homeScore === null || m.awayScore === null) continue;
    if (m.homeTeam.id === teamId) {
      form.push(m.homeScore > m.awayScore ? "W" : m.homeScore === m.awayScore ? "D" : "L");
    } else if (m.awayTeam.id === teamId) {
      form.push(m.awayScore > m.homeScore ? "W" : m.awayScore === m.homeScore ? "D" : "L");
    }
  }
  return form.slice(-5);
}

export function getTeamFixtures(teamId: number): Match[] {
  return ALL_MATCHES.filter(
    (m) =>
      (m.homeTeam.id === teamId || m.awayTeam.id === teamId) &&
      (m.round >= LEAGUE.currentRound - 5 && m.round <= LEAGUE.currentRound + 3)
  );
}

export function getMatchById(id: number): MatchDetail | undefined {
  const base = ALL_MATCHES.find((m) => m.id === id);
  if (!base) return undefined;
  const seed = id * 7 + 13;
  const stats: MatchStatPair[] = [
    { label: "Penguasaan Bola", home: 42 + Math.floor(seededRandom(seed) * 30), away: 0 },
    { label: "Tembakan", home: Math.floor(seededRandom(seed + 1) * 12) + 4, away: Math.floor(seededRandom(seed + 2) * 12) + 3 },
    { label: "Tembakan ke Gawang", home: Math.floor(seededRandom(seed + 3) * 6), away: Math.floor(seededRandom(seed + 4) * 6) },
    { label: "Tendangan Sudut", home: Math.floor(seededRandom(seed + 5) * 9), away: Math.floor(seededRandom(seed + 6) * 9) },
    { label: "Pelanggaran", home: Math.floor(seededRandom(seed + 7) * 10) + 5, away: Math.floor(seededRandom(seed + 8) * 10) + 5 },
  ];
  stats[0].away = 100 - stats[0].home;
  return {
    ...base,
    stats,
    lineupHome: buildLineup(base.homeTeam.id, seed),
    lineupAway: buildLineup(base.awayTeam.id, seed + 100),
    referee: "A. Taylor",
    attendance: `${(52_000 + Math.floor(seededRandom(seed + 9) * 15_000)).toLocaleString("id-ID")}`,
  };
}

const SCORERS: PlayerStat[] = [
  { id: 1, name: "E. Haaland", team: teamById.get(50)!, goals: 27, assists: 5, appearances: 31 },
  { id: 2, name: "M. Salah", team: teamById.get(40)!, goals: 24, assists: 14, appearances: 32 },
  { id: 3, name: "A. Isak", team: teamById.get(34)!, goals: 21, assists: 6, appearances: 30 },
  { id: 4, name: "C. Palmer", team: teamById.get(49)!, goals: 18, assists: 12, appearances: 32 },
  { id: 5, name: "B. Saka", team: teamById.get(42)!, goals: 17, assists: 11, appearances: 29 },
  { id: 6, name: "O. Watkins", team: teamById.get(66)!, goals: 16, assists: 7, appearances: 31 },
  { id: 7, name: "B. Fernandes", team: teamById.get(33)!, goals: 14, assists: 9, appearances: 33 },
  { id: 8, name: "Son Heung-min", team: teamById.get(47)!, goals: 14, assists: 8, appearances: 30 },
  { id: 9, name: "C. Wood", team: teamById.get(65)!, goals: 13, assists: 3, appearances: 30 },
  { id: 10, name: "J. Maddison", team: teamById.get(47)!, goals: 12, assists: 10, appearances: 31 },
];

const ASSISTERS: PlayerStat[] = [...SCORERS].sort((a, b) => b.assists - a.assists).slice(0, 10);

export function getTopScorers(): PlayerStat[] {
  return [...SCORERS].sort((a, b) => b.goals - a.goals);
}

export function getTopAssists(): PlayerStat[] {
  return [...ASSISTERS];
}
