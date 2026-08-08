# Live PL Tracker

Live Sports Tracker Premier League — project portofolio yang menampilkan skor,
jadwal, klasemen, dan statistik pemain dari API-Football (data final musim 2024/25).

Menonjolkan 3 pilar utama PRD: **External REST API**, **Management Data**, dan
**Kustomisasi UX** (tim favorit + tampilan responsif).

## Fitur

- **Hasil Pertandingan** — daftar hasil final pekan terakhir di beranda.
- **Match Center** — detail skor, statistik pertandingan, dan susunan pemain.
- **Jadwal** — master-detail per pekan (1–38): list per tanggal, klik match untuk preview/squad/stats/table/info; filter berdasarkan tim.
- **Klasemen** — tabel 20 klub dengan highlight tim favorit & zona Champions League.
- **Statistik** — top scorers dan top assists.
- **Tim Favorit** — bookmark tim tersimpan di `localStorage` (mode tamu, tanpa akun).
- Tema gelap sporty, responsif (bottom nav di mobile, top nav di desktop).

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| Backend | Next.js Route Handlers (`/api/*`) |
| Data fetching | Server Components + fetch client (sekali), provider-switchable |
| Sports API | API-Football (api-sports.io) dengan **fallback otomatis ke data mock** jika key kosong |
| Persistensi | `localStorage` (favorit) |

## Struktur

```
src/
├── app/
│   ├── page.tsx            # Home · Hasil & rangkuman musim
│   ├── standings|schedule|stats/
│   ├── teams/[id]/         # Profil tim
│   ├── matches/[id]/       # Match Center
│   ├── profile/            # Tim favorit (guest)
│   └── api/                # Backend: proxy data olahraga
├── components/             # Header, BottomNav, MatchCard, MatchDetailPanel, dll.
├── lib/
│   ├── sports/             # provider interface + mock + API-Football
│   ├── api/                # facade isomorphic (server direct / client via route)
│   ├── use-favorites.ts    # store favorit (useSyncExternalStore)
│   └── format.ts
└── types/                  # model data
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
| `GET /api/fixtures/today`, `/api/fixtures?round=N` | Skor & jadwal |
| `GET /api/standings`, `/api/stats/top-scorers` | Klasemen & statistik |
| `GET /api/teams/[id]/fixtures`, `/api/teams/[id]/form` | Data tim |

Dokumen lengkap: [PRD.md](./PRD.md).
