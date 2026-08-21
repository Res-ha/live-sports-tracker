# PRD — Live PL Tracker

**Versi:** 2.0 · **Status:** MVP implemented + roadmap · **Tipe:** Portfolio case study · **Platform:** Web responsif

## 1. Konteks Produk

Live PL Tracker adalah portfolio project yang mengeksplorasi cara menyajikan data sepak bola yang padat menjadi pengalaman match center yang cepat dipahami. Project ini menampilkan musim final Premier League 2024/25 dalam static demo deterministik, sehingga recruiter dapat mencoba seluruh flow tanpa API key, login, atau menunggu provider eksternal.

### Problem

- Data skor, jadwal, klasemen, dan statistik biasanya tersebar di banyak layar.
- Pengguna mobile membutuhkan jawaban cepat: siapa bermain, berapa skor, dan di mana posisi timnya.
- Portfolio project berbasis API sering sulit direview ketika API key, rate limit, atau data live tidak tersedia.

### Target Outcome

Membuat demo yang dapat dibuka recruiter dalam hitungan detik, menunjukkan kemampuan product thinking, UI engineering, data modeling, API abstraction, responsive design, SEO, dan deployment static.

## 2. Target User & Persona

| Persona | Kebutuhan utama | Friksi yang harus dihilangkan |
|---|---|---|
| **The Reviewer** — recruiter, hiring manager, tech lead | Memahami kualitas produk, arsitektur, dan trade-off teknis | Demo kosong, dokumentasi tidak sinkron, setup terlalu rumit |
| **The Football Fan** — suporter Premier League mobile-first | Melihat hasil, jadwal, klasemen, dan statistik dengan cepat | Navigasi bertele-tele, tabel sulit dibaca, tidak bisa menyimpan tim |
| **The Casual Visitor** — pengunjung sekali lihat | Mendapat kesan visual dan memahami value project | Landing page tidak menjelaskan konteks |

## 3. Solusi

Satu static experience dengan empat area eksplorasi:

1. **Scores / Home** — hero portfolio, rangkuman musim, hasil pertandingan, dan top 5 klasemen.
2. **Schedule** — navigasi round 1–38, grouping berdasarkan tanggal, filter tim, serta master-detail match center.
3. **Standings & Stats** — klasemen 20 klub, top scorers, dan top assists.
4. **Team & Profile** — profil klub, form terakhir, fixture terkait, dan favorit yang tersimpan di perangkat.

Data deploy menggunakan mock deterministik. Provider API-Football tetap tersedia untuk eksperimen server-side lokal, tetapi API key tidak pernah masuk ke client bundle atau static artifact.

## 4. Scope Fitur

| Fitur | Status | Keterangan |
|---|---|---|
| Home season snapshot | **Implemented** | Juara, top scorer, top assist, hasil round 38, top 5 klasemen |
| Match center | **Implemented** | Scoreboard, goal scorers, timeline, stats, lineup, info, table |
| Schedule master-detail | **Implemented** | Round navigation, date grouping, team filter, sticky detail desktop |
| Standings | **Implemented** | 20 klub, GD/Pts, zona UCL, highlight favorit |
| Player statistics | **Implemented** | Top scorers dan top assists |
| Team profile | **Implemented** | Crest, form, standings context, fixture terkait |
| Guest favorites | **Implemented** | `localStorage`, tanpa akun, tersedia pada kartu/tabel/profil |
| SEO & sharing metadata | **Implemented** | Per-route metadata, canonical, Open Graph/Twitter, robots, sitemap |
| Responsive & accessibility | **Implemented** | Mobile bottom nav, focus state, semantic labels, reduced motion |
| Live polling | **Roadmap** | Polling 30–60 detik hanya ketika ada pertandingan LIVE |
| Auth & cross-device profile | **Roadmap** | Session, database, sinkronisasi favorit lintas perangkat |
| Persistent backend | **Roadmap** | API route/server proxy dan provider live production |

## 5. User Flow Saat Ini

### First-time visitor

```text
Home
  → lihat season snapshot dan hasil pertandingan
  → buka Schedule atau klik kartu pertandingan
  → Match Center dengan tab Preview / Squad / Stats / Table / Info
  → buka Standings atau Stats
  → tandai tim favorit
  → buka Profile untuk melihat favorit di perangkat
```

### Returning visitor

```text
Home / Schedule
  → pilih tim atau pertandingan
  → gunakan favorit sebagai konteks visual
  → kembali ke Profile untuk mengelola tim favorit
```

Login tidak menjadi gate pada MVP. Auth dan sinkronisasi lintas perangkat adalah roadmap setelah kebutuhan persistence tervalidasi.

## 6. Design Direction

Dokumentasi design system lengkap tersedia di [DESIGN.md](./DESIGN.md).

Prinsip utama:

- **Editorial sports-tech:** dark navy, cyan accent, hierarchy tipografi kuat, dan surface bertingkat.
- **Progressive disclosure:** ringkasan cepat di Home, detail lebih dalam di Match Center.
- **One-thumb mobile:** bottom navigation, touch target minimal 44px, nama klub dipendekkan pada layar kecil.
- **Motion with restraint:** Motion hanya untuk reveal/feedback; CSS dipakai untuk hover; `prefers-reduced-motion` selalu dihormati.
- **Accessible by default:** semantic heading, `aria-current`, label kontrol, focus ring, kontras, dan tabel yang dapat di-scroll.

## 7. Arsitektur & Tech Choices

### Implemented architecture

```text
[Next.js Server Components saat build]
              │
              ├── [Mock provider deterministik]
              │       └── public/data/*.json
              │
              └── [Static export]
                       └── out/ → Cloudflare Pages

[Client islands]
  Header · BottomNav · ScheduleBrowser · Favorites · Motion Reveal
```

| Area | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16 App Router + TypeScript | Static generation, metadata API, routing, dan type safety |
| Styling | Tailwind CSS v4 | Token cepat, responsive utilities, dan tidak menambah runtime CSS-in-JS |
| UI primitives | shadcn/ui-inspired open composition | Komponen kecil yang dapat dikontrol, bukan library UI monolitik |
| Animation | Motion (`motion/react`) | Reveal terukur, viewport-based, dan reduced-motion support |
| Data | Mock provider + API-Football adapter | Demo deterministik sekaligus siap diekspansi ke provider live |
| Persistence | `localStorage` | Guest-first, zero backend untuk MVP |
| Deploy | Static export + Cloudflare Pages | CDN-friendly, murah, aman untuk demo portfolio |

### Security boundaries

- `API_FOOTBALL_KEY` hanya dibaca pada server/build lokal.
- Build deploy mengosongkan key dan memakai mock provider.
- Tidak ada endpoint `/api/*` runtime pada artifact static.
- Input filter hanya memengaruhi state lokal dan tidak membentuk query eksternal.

## 8. Tantangan & Trade-off

### Static export vs live data

Static export tidak dapat melakukan polling server-side. Solusinya adalah mock dataset deterministik untuk artifact deploy, sementara adapter API tetap tersedia untuk eksperimen lokal dan roadmap live mode.

### Data padat vs mobile readability

Match card dan tabel menggunakan hierarchy bertingkat, short name pada mobile, scroll container untuk kolom tambahan, serta master-detail agar pengguna tidak dibebani semua informasi sekaligus.

### Motion vs performance

Animasi dibatasi pada `opacity` dan `transform`, berjalan sekali saat masuk viewport, dan tidak memblokir server rendering. Konten tetap tersedia di HTML static untuk SEO.

## 9. Technical Impact & Evidence

Angka di bawah adalah bukti implementasi teknis, bukan klaim analytics produksi:

- **410** halaman static berhasil diprerender.
- **380** halaman detail pertandingan tersedia.
- **20** halaman profil klub tersedia.
- **0** API key dikirim ke browser pada build deploy.
- Responsive smoke test pada viewport **375px** tidak menghasilkan horizontal overflow.
- Lint, typecheck, static build, dan artifact verification menjadi quality gate.

## 10. Non-Functional Requirements

- **Performance:** Server Components default, client islands terbatas, static CDN, animasi ringan, dan tidak ada image asset besar yang tidak dibutuhkan.
- **SEO:** metadata per halaman, canonical, Open Graph/Twitter, `robots.txt`, `sitemap.xml`, semantic HTML, dan heading hierarchy.
- **Responsive:** layout usable mulai 360px; desktop menggunakan sticky detail panel; mobile menggunakan bottom nav dan auto-scroll detail.
- **Accessibility:** focus-visible state, label tombol, `aria-current`, `role=tab`, reduced motion, dan touch target minimal 44px.
- **Reliability:** mock fallback, loading skeleton, not-found state, dan static artifact verification.

## 11. Roadmap

### Next

- Tambahkan contact/portfolio narrative jika project diposisikan sebagai personal portfolio multi-project.
- Tambahkan OG image visual khusus dengan brand system yang sama.
- Tambahkan automated browser regression untuk mobile dan desktop.

### Later

- API route sebagai server proxy.
- Polling live dengan conditional visibility dan rate-limit budget.
- Auth + database untuk favorit lintas perangkat.
- Observability sederhana untuk API quota dan cache hit rate.

### Out of scope

Berita/sosial feed, prediksi skor, multi-liga, push notification, komentar user, dan marketplace tidak termasuk roadmap inti project ini.
