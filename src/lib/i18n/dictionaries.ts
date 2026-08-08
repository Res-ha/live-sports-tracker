export type Lang = "id" | "en";

const id: Record<string, string> = {
  // Navigasi
  "nav.live": "Live",
  "nav.schedule": "Jadwal",
  "nav.standings": "Klasemen",
  "nav.stats": "Statistik",
  "nav.settings": "Pengaturan",
  "nav.profile": "Profil",

  // Profil
  "profile.title": "Profil Saya",
  "profile.subtitle": "Favorit Anda disimpan di perangkat ini.",
  "profile.favTitle": "Tim Favorit",
  "profile.favEmpty": "Anda belum memiliki tim favorit.",
  "profile.favEmptyHint": "Jelajahi klasemen dan tekan bintang untuk menyimpan tim.",
  "profile.viewStandings": "Lihat Klasemen",
  "profile.viewSchedule": "Lihat Jadwal",
  "profile.finding": "Menentukan jadwal...",
  "profile.nextMatch": "Berikutnya: vs {team}",

  // Header
  "header.brand": "Live PL Tracker",
  "lang.locale": "id-ID",
  "home.badge": "Musim sudah berakhir",
  "home.title": "{league} · Musim {season}",
  "home.subtitle": "Hasil final, jadwal, dan klasemen {league} {season} sesuai API-Football.",
  "home.summary": "Rangkuman Musim {season}",
  "home.champion": "Juara",
  "home.points": "{points} poin",
  "home.topScorer": "Top Skor",
  "home.topAssist": "Top Assist",
  "home.goals": "{goals} gol",
  "home.assists": "{assists} assist",
  "home.top5": "Top 5 Klasemen",
  "home.standingsLink": "Klasemen lengkap",

  // Live matches
  "live.filterAll": "Semua",
  "live.filterLive": "Live",
  "live.filterUpcoming": "Akan Datang",
  "live.filterFinished": "Selesai",
  "live.error": "Data sementara tidak tersedia. Silakan muat ulang halaman.",
  "live.empty": "Tidak ada pertandingan — musim {season} telah berakhir sesuai data API.",
  "live.emptyFilter": "Tidak ada pertandingan untuk filter ini.",
  "live.updated": "Terakhir diperbarui {time}",
  "live.updating": "Memperbarui otomatis setiap 15 detik...",
  "live.updatedOn": "Pembaruan otomatis dihentikan — musim {season} telah berakhir.",

  // Favorit
  "fav.add": "Favoritkan tim",
  "fav.remove": "Hapus dari favorit",

  // Kartu pertandingan
  "match.round": "Pekan {round}",

  // Jadwal
  "schedule.title": "Jadwal Pertandingan",
  "schedule.subtitle": "Hasil seluruh pekan musim {season}. Musim telah berakhir — semua hasil final.",
  "schedule.round": "Pekan ke-{round}",
  "schedule.modeRound": "Pekan",
  "schedule.modeClub": "Klub",
  "schedule.filterTeam": "Filter berdasarkan tim",
  "schedule.allTeams": "Semua tim",
  "schedule.chooseClub": "Pilih klub",
  "schedule.emptyRound": "Tidak ada pertandingan tim ini pada pekan tersebut.",
  "schedule.emptyClub": "Belum ada pertandingan untuk klub ini.",
  "schedule.prev": "Pekan sebelumnya",
  "schedule.next": "Pekan berikutnya",

  // Klasemen
  "standings.title": "Klasemen",
  "standings.subtitle": "{league} · Musim {season} · Selesai",
  "standings.ucl": "Top 4 — Zona Liga Champions",
  "standings.fav": "Tim favorit Anda",

  // Statistik
  "stats.title": "Statistik Pemain",
  "stats.subtitle": "{league} · Musim {season}",
  "stats.goals": "Gol",
  "stats.assists": "Assist",
  "stats.player": "Pemain",
  "stats.team": "Tim",
  "stats.apps": "Penampilan",
  "stats.topScorers": "Top Scorers",
  "stats.topAssists": "Top Assists",

  // Statistik pertandingan
  "matchStat.possession": "Penguasaan Bola",
  "matchStat.shots": "Tembakan",
  "matchStat.shotsOnTarget": "Tembakan ke Gawang",
  "matchStat.corners": "Tendangan Sudut",
  "matchStat.fouls": "Pelanggaran",

  // Detail pertandingan
  "match.stats": "Statistik Pertandingan",
  "match.lineups": "Susunan Pemain",
  "match.goals": "Pencetak Gol",
  "match.timeline": "Linimasa",
  "match.referee": "Wasit: {name}",
  "match.attendance": "Penonton: {n}",
  "match.noGoals": "Tidak ada gol",
  "match.assist": "assist {name}",
  "match.eventAssist": "Assist: {name}",
  "match.backRound": "Pekan ke-{round}",

  // Halaman tim
  "team.rank": "Peringkat {pos}",
  "team.points": "Poin {n}",
  "team.favLabel": "Favorit",
  "team.form": "Form Terakhir",
  "team.formWin": "Menang",
  "team.formDraw": "Seri",
  "team.formLoss": "Kalah",
  "team.noData": "Belum ada data.",
  "team.fixtures": "Jadwal Terkait",
  "team.allFixtures": "Semua jadwal",
  "team.squad": "Skuad & Pelatih",
  "team.players": "Pemain",
  "team.coach": "Pelatih",
  "team.noSquad": "Data skuad belum tersedia.",
  "team.transfers": "Transfers Musim {season}",
  "team.transferIn": "Masuk",
  "team.transferOut": "Keluar",
  "team.noTransfers": "Tidak ada transfer pada musim ini.",
  "team.injuries": "Cedera",
  "team.noInjuries": "Tidak ada cedera tercatat.",

  // Pengaturan
  "settings.title": "Pengaturan",
  "settings.favTitle": "Tim Favorit",
  "settings.favEmpty": "Belum ada tim favorit. Tekan bintang pada kartu tim untuk menambahkannya.",
  "settings.themeTitle": "Tema",
  "settings.themeDark": "Gelap",
  "settings.themeLight": "Terang",
  "settings.themeSystem": "Sistem",
  "settings.langTitle": "Bahasa",
  "settings.langId": "Indonesia",
  "settings.langEn": "English",

  // Not found
  "notFound.title": "Halaman tidak ditemukan",
  "notFound.desc": "Halaman yang Anda cari tidak ada atau telah dipindahkan.",
  "notFound.back": "Kembali ke beranda",
};

const en: Record<string, string> = {
  // Navigation
  "nav.live": "Live",
  "nav.schedule": "Schedule",
  "nav.standings": "Standings",
  "nav.stats": "Stats",
  "nav.settings": "Settings",
  "nav.profile": "Profile",

  // Profile
  "profile.title": "My Profile",
  "profile.subtitle": "Your favorites are stored on this device.",
  "profile.favTitle": "Favorite Teams",
  "profile.favEmpty": "You don't have any favorite teams yet.",
  "profile.favEmptyHint": "Browse the standings and tap the star to save a team.",
  "profile.viewStandings": "View Standings",
  "profile.viewSchedule": "View Schedule",
  "profile.finding": "Finding next match...",
  "profile.nextMatch": "Next: vs {team}",

  // Header
  "header.brand": "Live PL Tracker",
  "lang.locale": "en-US",

  // Home
  "home.badge": "Season ended",
  "home.title": "{league} · Season {season}",
  "home.subtitle": "Final results, fixtures, and {league} {season} standings from API-Football.",
  "home.summary": "Season {season} Summary",
  "home.champion": "Champion",
  "home.points": "{points} pts",
  "home.topScorer": "Top Scorer",
  "home.topAssist": "Top Assists",
  "home.goals": "{goals} goals",
  "home.assists": "{assists} assists",
  "home.top5": "Top 5 Standings",
  "home.standingsLink": "Full standings",

  // Live matches
  "live.filterAll": "All",
  "live.filterLive": "Live",
  "live.filterUpcoming": "Upcoming",
  "live.filterFinished": "Finished",
  "live.error": "Data temporarily unavailable. Please reload the page.",
  "live.empty": "No matches — season {season} has ended according to API data.",
  "live.emptyFilter": "No matches for this filter.",
  "live.updated": "Last updated {time}",
  "live.updating": "Auto-refreshing every 15 seconds...",
  "live.updatedOn": "Auto-refresh stopped — season {season} has ended.",

  // Favorites
  "fav.add": "Add to favorites",
  "fav.remove": "Remove from favorites",

  // Match card
  "match.round": "Round {round}",

  // Schedule
  "schedule.title": "Match Schedule",
  "schedule.subtitle": "Results for every round of season {season}. Season ended — all results are final.",
  "schedule.round": "Round {round}",
  "schedule.modeRound": "Round",
  "schedule.modeClub": "Club",
  "schedule.filterTeam": "Filter by team",
  "schedule.allTeams": "All teams",
  "schedule.chooseClub": "Choose a club",
  "schedule.emptyRound": "No matches for this team in that round.",
  "schedule.emptyClub": "No matches for this club yet.",
  "schedule.prev": "Previous round",
  "schedule.next": "Next round",

  // Standings
  "standings.title": "Standings",
  "standings.subtitle": "{league} · Season {season} · Finished",
  "standings.ucl": "Top 4 — Champions League zone",
  "standings.fav": "Your favorite team",

  // Stats
  "stats.title": "Player Stats",
  "stats.subtitle": "{league} · Season {season}",
  "stats.goals": "Goals",
  "stats.assists": "Assists",
  "stats.player": "Player",
  "stats.team": "Team",
  "stats.apps": "Apps",
  "stats.topScorers": "Top Scorers",
  "stats.topAssists": "Top Assists",

  // Match stats
  "matchStat.possession": "Possession",
  "matchStat.shots": "Shots",
  "matchStat.shotsOnTarget": "Shots on Target",
  "matchStat.corners": "Corners",
  "matchStat.fouls": "Fouls",

  // Match detail
  "match.stats": "Match Stats",
  "match.lineups": "Line Ups",
  "match.goals": "Goal Scorers",
  "match.timeline": "Timeline",
  "match.referee": "Referee: {name}",
  "match.attendance": "Attendance: {n}",
  "match.noGoals": "No goals",
  "match.assist": "assist {name}",
  "match.eventAssist": "Assist: {name}",
  "match.backRound": "Round {round}",

  // Team page
  "team.rank": "Rank {pos}",
  "team.points": "Points {n}",
  "team.favLabel": "Favorite",
  "team.form": "Recent Form",
  "team.formWin": "Win",
  "team.formDraw": "Draw",
  "team.formLoss": "Loss",
  "team.noData": "No data yet.",
  "team.fixtures": "Related Fixtures",
  "team.allFixtures": "All fixtures",
  "team.squad": "Squad & Coaches",
  "team.players": "Players",
  "team.coach": "Coach",
  "team.noSquad": "Squad data not available.",
  "team.transfers": "Season {season} Transfers",
  "team.transferIn": "In",
  "team.transferOut": "Out",
  "team.noTransfers": "No transfers this season.",
  "team.injuries": "Injuries",
  "team.noInjuries": "No injuries recorded.",

  // Settings
  "settings.title": "Settings",
  "settings.favTitle": "Favorite Teams",
  "settings.favEmpty": "No favorite teams yet. Tap the star on a team card to add one.",
  "settings.themeTitle": "Theme",
  "settings.themeDark": "Dark",
  "settings.themeLight": "Light",
  "settings.themeSystem": "System",
  "settings.langTitle": "Language",
  "settings.langId": "Indonesia",
  "settings.langEn": "English",

  // Not found
  "notFound.title": "Page not found",
  "notFound.desc": "The page you are looking for does not exist or has been moved.",
  "notFound.back": "Back to home",
};

export const dictionaries: Record<Lang, Record<string, string>> = { id, en };

export function translate(
  lang: Lang,
  key: string,
  params?: Record<string, string | number>
): string {
  let s = dictionaries[lang][key] ?? dictionaries.id[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}
