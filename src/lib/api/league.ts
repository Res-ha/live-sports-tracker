import type { Team } from "@/types";

export const LEAGUE = {
  id: 39,
  name: "Premier League",
  country: "England",
  season: "2025/26",
  currentRound: 34,
  logoColor: "#38003c",
};

export const TEAMS: Team[] = [
  { id: 33, name: "Manchester United", shortName: "MUN", crestColor: "#da291c", city: "Manchester", stadium: "Old Trafford" },
  { id: 34, name: "Newcastle United", shortName: "NEW", crestColor: "#241f20", city: "Newcastle", stadium: "St James' Park" },
  { id: 35, name: "Manchester City", shortName: "MCI", crestColor: "#6cabdd", city: "Manchester", stadium: "Etihad Stadium" },
  { id: 36, name: "Aston Villa", shortName: "AVL", crestColor: "#670e36", city: "Birmingham", stadium: "Villa Park" },
  { id: 40, name: "Liverpool", shortName: "LIV", crestColor: "#c8102e", city: "Liverpool", stadium: "Anfield" },
  { id: 41, name: "Southampton", shortName: "SOU", crestColor: "#d71920", city: "Southampton", stadium: "St Mary's Stadium" },
  { id: 42, name: "Arsenal", shortName: "ARS", crestColor: "#ef0107", city: "London", stadium: "Emirates Stadium" },
  { id: 45, name: "Everton", shortName: "EVE", crestColor: "#003399", city: "Liverpool", stadium: "Goodison Park" },
  { id: 47, name: "Tottenham Hotspur", shortName: "TOT", crestColor: "#132257", city: "London", stadium: "Tottenham Hotspur Stadium" },
  { id: 48, name: "West Ham United", shortName: "WHU", crestColor: "#7a263a", city: "London", stadium: "London Stadium" },
  { id: 49, name: "Chelsea", shortName: "CHE", crestColor: "#034694", city: "London", stadium: "Stamford Bridge" },
  { id: 50, name: "Leicester City", shortName: "LEI", crestColor: "#003090", city: "Leicester", stadium: "King Power Stadium" },
  { id: 51, name: "Crystal Palace", shortName: "CRY", crestColor: "#1b458f", city: "London", stadium: "Selhurst Park" },
  { id: 52, name: "Wolverhampton Wanderers", shortName: "WOL", crestColor: "#fdb913", city: "Wolverhampton", stadium: "Molineux Stadium" },
  { id: 55, name: "Brentford", shortName: "BRE", crestColor: "#e30613", city: "London", stadium: "Brentford Community Stadium" },
  { id: 62, name: "Brighton & Hove Albion", shortName: "BHA", crestColor: "#0057b8", city: "Brighton", stadium: "Amex Stadium" },
  { id: 63, name: "Fulham", shortName: "FUL", crestColor: "#000000", city: "London", stadium: "Craven Cottage" },
  { id: 65, name: "Nottingham Forest", shortName: "NFO", crestColor: "#dd0000", city: "Nottingham", stadium: "City Ground" },
  { id: 72, name: "Bournemouth", shortName: "BOU", crestColor: "#b50e12", city: "Bournemouth", stadium: "Vitality Stadium" },
  { id: 145, name: "Ipswich Town", shortName: "IPS", crestColor: "#0033a0", city: "Ipswich", stadium: "Portman Road" },
];

export const teamById = new Map<number, Team>(TEAMS.map((t) => [t.id, t]));
