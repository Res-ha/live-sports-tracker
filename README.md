# Live PL Tracker

Live Sports Tracker Premier League — project portofolio yang menampilkan skor,
jadwal, klasemen, dan statistik pemain dari API-Football (data final musim 2024/25).

Menonjolkan 3 pilar utama PRD: **External REST API**, **Management Data**, dan
**Kustomisasi UX** (tim favorit + tampilan responsif).

## Fitur

- **Hasil Pertandingan** — beranda menampilkan hasil final pekan ke-38 beserta
  rangkuman musim (juara, top skor, top assist, top 5 klasemen).
- **Match Center** (`/matches/[id]`) — skor, pencetak gol + assist, statistik
  pertandingan, susunan pemain + pelatih, linimasa, dan info pertandingan
  (wasit, penonton).
- **Jadwal Master-Detail** — navigasi pekan 1–38 dengan list per tanggal
  (jam kickoff, crest, skor). Klik pertandingan untuk membuka panel detail
  ber-tab **Preview / Squad / Stats / Table / Info** — panel sticky di desktop,
  auto-scroll di mobile. Ada filter berdasarkan tim.
- **Klasemen** — tabel 20 klub dengan highlight tim favorit & zona Champions League.
- **Statistik** — top scorers dan top assists.
- **Tim Favorit** — bookmark tim tersimpan di `localStorage` (mode tamu, tanpa akun).
- **Responsif & Lokalisasi** — bottom nav di mobile / top nav di desktop; nama tim
  pendek di layar kecil; tanggal & jam format Indonesia (`id-ID`, 24-jam).

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| Backend | Next.js Route Handlers (`/api/*`) |
| Data fetching | Server Components (halaman data musim final di-prerender statis saat build) + fetch client tipis; provider-switchable |
| Sports API | API-Football (api-sports.io) dengan **fallback otomatis ke data mock** jika key kosong |
| Persistensi | `localStorage` (favorit) |

## Struktur

```
src/
├── app/
│   ├── page.tsx             # Beranda: hasil pekan terakhir + rangkuman musim
│   ├── schedule/            # Jadwal master-detail (per pekan · per tanggal)
│   ├── standings/           # Klasemen 20 klub
│   ├── stats/               # Top scorers & top assists
│   ├── teams/[id]/          # Profil tim (form + jadwal terkait)
│   ├── matches/[id]/        # Match Center
│   ├── profile/             # Tim favorit (guest)
│   ├── loading.tsx / not-found.tsx
│   └── api/                 # Route Handlers proxy API-Football
├── components/
│   ├── ui/                  # TeamCrest, StatusBadge, Skeleton, icons
│   ├── match/               # ScoreHeader, GoalScorers, MatchStats, Lineups,
│   │                        #   MatchTimeline, MatchInfo, MatchDetailPanel
│   ├── schedule/            # DateGroup, MatchRow, MatchTabs (master-detail)
│   ├── Header · BottomNav · MatchCard · ResultsList · StandingsTable · PlayerStatsTable
├── lib/
│   ├── sports/              # interface (types), football (API), mock + pemilihan provider
│   ├── api/                 # facade server + league.ts (konstanta) + mock.ts
│   ├── client-api.ts        # facade fetch tipis untuk komponen client (tanpa provider)
│   ├── nav.ts               # item navigasi
│   ├── use-favorites.ts     # store favorit (useSyncExternalStore)
│   └── format.ts            # format tanggal & jam (id-ID)
└── types/                   # model data
```

## Menjalankan

```bash
cp .env.example .env        # konfigurasi awal (opsional, mock tetap jalan tanpa key)
npm install
npm run dev                 # http://localhost:3000
```

```bash
npm run lint                # ESLint
npm run build               # build produksi
npm run start               # jalankan hasil build
```

## Sports API (API-Football)

Tanpa key, aplikasi memakai **data mock deterministik** (`src/lib/api/mock.ts`) sehingga
seluruh fitur tetap bisa didemokan. Untuk data asli:

1. Daftar di [api-sports.io](https://www.api-football.com) dan salin key ke `API_FOOTBALL_KEY` di `.env`.
2. **Plan Free hanya mengakses musim 2022–2024** — set `API_FOOTBALL_SEASON=2024` (default).
   Karena musim 2024/25 sudah selesai, data bersifat final (klasemen & statistik lengkap,
   tidak ada pertandingan live).
3. Data di-fetch **hanya di server** (proxy `/api/*`), key tidak pernah bocor ke browser.
4. Penghematan kuota (Free = 100 request/hari): data statis di-cache 24 jam
   (`REVALIDATE_STATIC`), endpoint dinamis di-cache sesuai `API_FOOTBALL_CACHE_SECONDS`,
   dan error/rate-limit otomatis jatuh kembali ke mock.

## Endpoint API

| Method & Path | Fungsi |
|---|---|
| `GET /api/fixtures/today`, `/api/fixtures?round=N` | Hasil pekan & jadwal |
| `GET /api/fixtures/[id]` | Detail pertandingan (skor, statistik, lineup, event) |
| `GET /api/standings` | Klasemen |
| `GET /api/stats/top-scorers`, `/api/stats/top-assists` | Statistik pemain |
| `GET /api/teams`, `/api/teams/[id]` | Daftar & detail tim |
| `GET /api/teams/[id]/fixtures`, `/api/teams/[id]/form` | Jadwal & form tim |

Dokumen lengkap: [PRD.md](./PRD.md).
