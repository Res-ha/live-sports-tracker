# Live PL Tracker

Live Sports Tracker Premier League — project portofolio full-stack yang menampilkan skor
live, jadwal, klasemen, dan statistik pemain **secara real-time**.

Menonjolkan 3 pilar utama PRD: **External REST API**, **User Authentication**, dan
**Management Data Real-time (Live Updates)**.

## Fitur

- **Live Scores** — daftar pertandingan dengan polling otomatis (15 detik), filter Live/Jadwal/Selesai.
- **Match Center** — detail skor, statistik pertandingan, dan susunan pemain.
- **Jadwal** — navigasi antar pekan (1–38) + filter berdasarkan tim.
- **Klasemen** — tabel 20 klub dengan highlight tim favorit & zona Champions League.
- **Statistik** — top scorers dan top assists.
- **Auth & Favorit** — register/login/logout (JWT session, bcrypt), bookmark tim tersimpan
  di database dan tersinkron antar perangkat.
- **Tema** dark sporty, responsif (bottom nav di mobile, top nav di desktop).

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| Backend | Next.js Route Handlers (`/api/*`) |
| Database | Prisma 7 + SQLite (mudah dipindah ke PostgreSQL) |
| Auth | JWT (jose) + bcryptjs, cookie httpOnly |
| Data fetching | Polling client (15 dtk) + Server Components, provider-switchable |
| Sports API | API-Football (api-sports.io) dengan **fallback otomatis ke data mock** jika key kosong |

## Struktur

```
src/
├── app/
│   ├── page.tsx            # Home · Live Scores
│   ├── standings|schedule|stats/
│   ├── teams/[id]/         # Profil tim
│   ├── matches/[id]/       # Match Center
│   ├── login|register/     # Autentikasi
│   ├── profile/            # Tim favorit
│   └── api/                # Backend: auth, favorites, proxy data olahraga
├── components/             # Header, BottomNav, MatchCard, AuthProvider, dll.
├── lib/
│   ├── auth/               # session JWT + bcrypt
│   ├── sports/             # provider interface + mock + API-Football
│   ├── api/                # facade isomorphic (server direct / client via route)
│   ├── db.ts               # Prisma client singleton
│   └── format.ts
├── generated/prisma/       # Prisma client (generated)
└── types/                  # model data
```

## Menjalankan

```bash
cp .env.example .env        # konfigurasi awal
npm install                 # postinstall: prisma generate
npm run db:migrate          # jalankan migrasi database
npm run dev                 # http://localhost:3000
```

```bash
npm run lint                # ESLint
npm run build               # build produksi
npm run start               # jalankan hasil build (gunakan HTTPS di prod)
npm run db:studio           # inspeksi database
```

> Catatan: cookie session bersifat `secure` pada mode produksi. Untuk pengujian lokal
> gunakan `npm run dev`; deployment ke HTTPS (mis. Vercel) otomatis aman.

## Sports API (API-Football)

Tanpa key, aplikasi memakai **data mock deterministik** (`src/lib/api/mock.ts`) sehingga
seluruh fitur tetap bisa didemokan. Untuk data asli:

1. Daftar di [api-sports.io](https://www.api-football.com) dan salin key ke `API_FOOTBALL_KEY` di `.env`.
2. Restart server — aplikasi otomatis beralih ke data asli lewat `src/lib/sports/football.ts`.
3. Data di-fetch **hanya di server** (proxy `/api/*`), key tidak pernah bocor ke browser.
4. Penghematan kuota: polling hanya pada pertandingan live, klasemen/statistik di-render
   dari server, dan error/rate-limit otomatis jatuh kembali ke mock.

## Endpoint API

| Method & Path | Fungsi |
|---|---|
| `POST /api/auth/register` | Daftar akun (set cookie session) |
| `POST /api/auth/login` | Masuk (set cookie session) |
| `POST /api/auth/logout` | Keluar (hapus cookie) |
| `GET /api/auth/me` | Ambil user saat ini (`null` bila tamu) |
| `GET/POST/DELETE /api/user/favorites` | Kelola tim favorit (wajib login) |
| `GET /api/fixtures/today`, `/api/fixtures?round=N` | Skor live & jadwal |
| `GET /api/standings`, `/api/stats/top-scorers` | Klasemen & statistik |
| `GET /api/teams/[id]/fixtures`, `/api/teams/[id]/form` | Data tim |

Dokumen lengkap: [PRD.md](./PRD.md).
