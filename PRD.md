# PRD — Live Sports Tracker: Premier League

**Versi:** 1.0 (MVP) · **Tipe Proyek:** Portofolio · **Platform:** Web responsif

---

## 1. Project Overview & Objectives

Website yang menampilkan data **Premier League secara real-time** — skor live, jadwal, klasemen, dan statistik pemain. Bukan sekadar "dashboard statis", melainkan bukti kemampuan teknis pada 3 pilar utama:

| Pilar | Alasan Dipilih |
|---|---|
| **External REST API** | Konsumsi data olahraga (API-Football/Football-Data.org) dengan error handling & rate-limit management |
| **User Authentication** | Login + fitur bookmark tim favorit (menunjukkan backend, session, dan relasi data) |
| **Management Data Real-time** | Skor live yang diperbarui otomatis via polling + caching yang hemat kuota API |

**Tujuan (Objectives):**
1. Meluncurkan MVP fungsional dalam waktu singkat (target: 2–3 minggu).
2. Menampilkan 4 fitur inti yang "cukup" untuk meyakinkan recruiter akan skill full-stack.
3. Menjadi showcase yang terdokumentasi rapi (README, live demo, dan PRD ini).

**Di Luar Scope MVP:** Berita/sosial feed, prediksi skor, multi-liga, push notification mobile, komentar user.

---

## 2. Target Audience & Key User Personas

**Audience utama:** Bukan pengguna umum, melainkan **HR / Technical Recruiter / Hiring Manager** yang mengevaluasi kandidat developer. Urutan kepentingan di nomor 1.

**Persona A — "The Reviewer" (prioritas tertinggi)**
- Job: Senior Developer / CTO yang menilai kode & arsitektur.
- Kebutuhan: Kode bersih, arsitektur jelas, API handling rapi, dokumentasi bagus, fitur berfungsi.
- Frustasi: Project template/boilerplate tanpa logika nyata, API key bocor, error tidak ditangani.

**Persona B — "The Football Fan" (pengguna fungsional)**
- Job: Suporter Premier League (18–35 th), akses via HP.
- Kebutuhan: Cek skor tim favorit cepat, lihat klasemen & top scorer tanpa ribet.
- Frustasi: Situs lambat, data basi, tidak bisa menyimpan tim favorit.

**Persona C — "The Casual Browsers" (bonus)**
- Pengunjung sekali lihat; cukup halaman cepat dan menarik secara visual.

**Key Insight:** UX harus *satu klik* — data tampil tanpa login, login hanya diperlukan untuk fitur bookmark.

---

## 3. Core Features (MVP Breakdown)

### 3.1 Authentication & User Profile
- Register/Login **email + password** (opsi Google OAuth sebagai stretch goal).
- Session-based auth (cookie) — portfolio-friendly: aman & mudah dijelaskan.
- **Bookmark/favoritkan tim**: toggle ⭐ di halaman tim & kartu pertandingan.
- Profil user menampilkan daftar **tim favorit** beserta pertandingan terdekat tim tersebut.
- Endpoint REST: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET/POST/DELETE /api/users/{id}/favorites`.

### 3.2 Live Scores & Match Center
- **Home page**: daftar pertandingan *today* dengan status live (`LIVE`, `HT`, `FT`, `SCHEDULED`).
- **Match Center / Halaman detail pertandingan**:
  - Skor & waktu pertandingan, babak (1H/2H/HT/FT).
  - Susunan pemain (starting XI), dan *lineup* (jika kuota API memungkinkan).
  - Statistik pertandingan: penguasaan bola, tembakan, tendangan sudut.
- **Update skor otomatis**: polling ringan tiap **30–60 detik** HANYA untuk pertandingan yang sedang berlangsung (lihat strategi caching §5).

### 3.3 Schedule & Standings
- **Jadwal**: daftar pertandingan per pekan (matchday) + filter *by team* + navigasi sebelumnya/berikutnya.
- **Klasemen**: tabel 20 klub (P, W, D, L, GD, Pts) per season, dengan highlight posisi tim favorit user (jika login).

### 3.4 Player & Team Stats
- **Top Scorers & Top Assists**: tabel TOP 10 pemain — nama, klub, jumlah gol/assist.
- **Halaman Tim**: profil singkat tim, jadwal & hasil terakhir, skuad inti.
- (Opsional) Filter statistik: *Home/Away*, musim.

### Prioritas MVP (MoSCoW)
| Priority | Fitur |
|---|---|
| **Must** | Live scores, klasemen, jadwal, top scorer/assist, bookmark tim, auth |
| **Should** | Detail match (lineup, statistik), halaman tim, profil user |
| **Could** | Google OAuth, dark mode, filter Home/Away |
| **Won't** | Multi-liga, push notif, news feed |

---

## 4. User Flow Singkat

**Flow A — First-time visitor (tanpa login):**
```
Landing/Home (lihat skor live hari ini)
  → Klik kartu match → Match Center (detail skor, lineup, statistik)
  → Nav: Klasemen → lihat tabel
  → Nav: Statistik → Top Scorers
  → Lihat tim favorit → klik tombol ⭐ "Favoritkan"
      → Redirect ke halaman login/register
      → Register/Login
      → Otomatis tersimpan → muncul di Profil "Tim Favorit"
```

**Flow B — Returning user (sudah login):**
```
Login → Home → filter "Tim Favorit Saya" → lihat jadwal/skor tim kesayangan
  → Profil → kelola bookmark (tambah/hapus) → Logout
```

**Prinsip desain flow:** tanpa login tetap bisa *browse semua data*; login hanya gate untuk fitur personalisasi.

---

## 5. Tech Stack & Architecture Recommendation

> Rekomendasi ini dipilih karena **1 bahasa di seluruh stack (JavaScript/TypeScript)**, minim konfigurasi, dan mudah dijelaskan saat interview.

### Stack Inti
| Layer | Pilihan | Alasan |
|---|---|---|
| **Frontend** | **Next.js 14+ (App Router) + TypeScript + Tailwind CSS** | SSR/SSG bagus untuk SEO & portfolio, API Routes bawaan (tanpa backend terpisah), satu repo |
| **Data Fetching** | **SWR / TanStack Query** | Stale-While-Revalidate → otomatis hemat request API |
| **Database** | **Supabase (PostgreSQL)** atau Prisma + PostgreSQL | Supabase = DB + Auth siap pakai (hemat waktu); Prisma = showcase ORM yang terlihat "senior" |
| **Auth** | **Auth.js (NextAuth) — credential + optional Google** | Standar industri untuk Next.js; session cookie aman |
| **Sports API** | **API-Football (api-sports.io)** — alternatif **Football-Data.org** | API-Football: free tier 100 req/hari, data live lengkap. Football-Data.org: gratis lebih besar tapi **tanpa live score** |
| **Deploy** | **Vercel** (Next.js) + **Supabase** | Free tier, CI/CD satu klik, showcase yang bisa dibuka recruiter |
| **Testing** | Vitest + React Testing Library (unit/kritis) | Bonus nilai; tidak wajib untuk MVP |

### Strategi Caching & Polling (Kunci Hemat Kuota API)
1. **Tier data berdasar "kebasahan" (staleness):**
   - `LIVE` → poll **30–60 detik** (sangat jarang ada di 1 pertandingan waktu, jadi hemat).
   - `SCHEDULED / hari ini` → poll **5–10 menit**.
   - `FT (selesai)` → cache **1 jam**, tidak di-poll.
   - `Standings / Top Scorers / Tim` → cache **24 jam** (SSG/ISR di Next.js), tidak pernah di-poll.
2. **Server Action / API Route sebagai proxy tunggal** — browser TIDAK langsung panggil API-Football (API key hanya di server/.env, aman dari bocor).
3. **SWR `stale-while-revalidate` + `revalidateOnFocus: false`** → UI instan dari cache, re-fetch di background.
4. **Conditional polling** — polling dihentikan otomatis saat halaman *out-of-focus* (`document.visibilityState`) atau saat tidak ada match live.
5. **Dedupe**: satu request API dipakai banyak pengguna (di-cache server-side 60 dtk via `next.revalidate`/in-memory cache).
6. **Budget audit**: catat pemakaian harian API di dashboard sederhana (log) agar tidak melebihi kuota free tier.

### Arsitektur Alur Data (ringkas)
```
[Browser] --SWR--> [Next.js API Route] --fetch+cache--> [API-Football]
                          |
                      [Supabase/Prisma]
                     (users, favorites, session)
```

---

## 6. Non-Functional Requirements

- **Performa**: FCP < 2 detik (koneksi normal); halaman statis (klasemen) pre-render via SSG/ISR.
- **Mobile-first responsif**: seluruh halaman rapi di viewport 360px ke atas; Live Score mudah dibaca saat di HP.
- **Real-time UX**: indikator visual jelas — badge `LIVE` berdenyut, skor berubah tanpa reload.
- **Ketahanan API**: timeout & retry; fallback "Data sementara tidak tersedia" saat kuota habis atau server olahraga down — **jangan pernah blank page**.
- **Keamanan**: API key di `.env` server-only; password di-hash (bcrypt/argon2); proteksi route auth; rate-limit ringan di endpoint auth.
- **Aksesibilitas**: kontras cukup, label tombol jelas, navigasi keyboard berfungsi.
- **Error handling**: error state & loading skeleton di semua daftar data.

---

## 7. Key Metrics / Success Criteria

| Kriteria | Target MVP |
|---|---|
| **Kualitas kode** | Lint & typecheck 0 error; arsitektur terdokumentasi di README |
| **Fitur berfungsi** | 100% fitur Must-Have hidup & ter-deploy (link demo aktif) |
| **Data real-time** | Skor live update ≤ 60 detik; refresh otomatis tanpa reload manual |
| **Kuota API** | Tidak melebihi free tier (≤ 100 req/hari) saat demo/screening |
| **Responsivitas** | Semua halaman lolos uji manual mobile 360px & desktop |
| **Keamanan** | API key tidak ada di client-side / repo |
| **Dokumentasi** | README + PRD lengkap; project siap dijelaskan dalam 3 menit |
| **Pengalaman** | Register → bookmark tim → muncul di profil: selesai < 60 detik |

---

## 8. Prompt untuk Generate UI

```text
Design a modern, mobile-first web UI for a Premier League live score tracker.
The product shows real-time match scores, league standings, match schedules,
and top scorer stats. Use a dark sporty theme with a primary accent color
(sporting green or electric blue), white/off-white text, and high contrast.

Create these screens as a cohesive design system (Figma style, 1440px
desktop + 375px mobile):

1. Home / Live Scores: list of today's matches as cards. Each card shows
   home vs away team crests, current score, and a status badge (LIVE with a
   pulsing red dot, HT, FT, or SCHEDULED with kickoff time). Highlight
   favorited matches with a star icon.
2. Match Center: single match detail with big scoreboard, match phase
   timeline, team lineups (two columns), and stats bars (possession, shots,
   corners) side by side.
3. Standings: full league table of 20 clubs (columns: pos, crest, team,
   P, W, D, L, GD, Pts), row of user's favorite team highlighted, auto
   sorting by points with a subtle color gradient for top 4 (UCL zone).
4. Schedule: week-by-week matchday list with a prev/next navigation,
   collapsible rounds, filter by team.
5. Stats: Top Scorers & Top Assists as clean ranked tables (rank, player
   photo/avatar, club crest, goals/assists number).
6. Team Profile: team header with crest, form guide (last 5 results as
   W/D/L chips), recent fixtures, squad list.
7. Auth: minimal login & register page (split layout, gradient side panel).
8. User Profile: favorite teams grid with remove-star action and "next
   match" card for each favorite.

Style rules: bold rounded cards with subtle border + shadow, glassmorphism
for live badges, Inter font, smooth micro-interactions on hover, skeleton
loading states for data, sticky top nav with tabs (Live, Jadwal, Klasemen,
Statistik). Mobile: bottom navigation bar instead of top tabs. Use a
consistent spacing scale (4/8/12/16/24/32px) and dark surfaces
(#0F172A background, #1E293B cards).
```
