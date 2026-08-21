# Design System — Live PL Tracker

Dokumen ini menjelaskan keputusan visual dan interaction design yang dipakai
oleh redesign Live PL Tracker.

## 1. Design Intent

Live PL Tracker memakai arah **editorial sports-tech**: data tetap menjadi fokus,
namun presentation layer terasa seperti produk portfolio yang matang.

### Prinsip

1. **Scan first** — status, score, team, dan CTA harus terbaca sebelum detail.
2. **Progressive disclosure** — Home merangkum; Match Center membuka konteks.
3. **One-thumb mobile** — navigasi dan kontrol utama mudah dijangkau dengan satu tangan.
4. **Calm motion** — animasi memberi orientasi, bukan dekorasi yang mengganggu.
5. **Accessible contrast** — warna accent bukan satu-satunya penanda status.

## 2. Visual Language

### Color tokens

| Token | Nilai | Penggunaan |
|---|---|---|
| `background` | `#07111F` | Canvas utama |
| `surface` | `#0E1C2F` | Card dan panel |
| `surface-hover` | `#152942` | Hover/selected surface |
| `border` | `#203852` | Dividers dan outline |
| `foreground` | `#EEF7FF` | Heading dan text utama |
| `muted` | `#8EA7BD` | Supporting text |
| `accent` | `#5EEAD4` | CTA, active nav, highlight |
| `live` | `#FB7185` | Live/error state |
| `success` | `#4ADE80` | Completed/success state |
| `ucl` | `#A78BFA` | Zona kompetisi/top table |

Ambient gradient hanya dipakai sebagai layer background fixed yang non-repeating.
Card memakai transparansi ringan supaya background tetap terasa menyatu.

### Typography

- **Font:** Geist melalui `next/font` untuk self-hosting dan menghindari request
  font eksternal di browser.
- **Display:** `font-black`, tracking negatif, ukuran besar pada hero.
- **Section label:** uppercase, tracking lebar, ukuran 10–12px.
- **Body:** ukuran 14–16px dengan line-height 1.6–1.75.
- **Numerical data:** weight bold dan alignment konsisten.

### Shape & elevation

- Hero: radius `2rem`.
- Card: radius `1.25–1.5rem`.
- Controls: radius `0.75–1rem`.
- Shadow hanya dipakai pada hero, panel detail, dan card penting agar hierarchy
  tetap jelas.

## 3. Component Patterns

### Navigation

- Desktop: sticky header, active route menggunakan accent surface dan `aria-current`.
- Mobile: bottom navigation 5 item, safe-area padding, active indicator di atas.
- Semua target navigasi utama memiliki tinggi minimum 44px.

### Cards

- `Card` adalah primitive untuk surface konsisten.
- `Badge` dipakai untuk status/label, bukan menggantikan heading.
- Match card memakai overlay link sibling agar tombol favorit tidak nested di dalam link.

### Tables

- Header menggunakan uppercase label berukuran kecil.
- Tabel dapat di-scroll horizontal pada layar sempit.
- Highlight UCL dan favorit memakai background tint serta label/ikon tambahan.

### Match Center

- `ScoreHeader` menjadi anchor visual.
- Tabs memakai semantic `role=tab` dan `aria-selected`.
- Detail menggunakan sticky panel pada desktop dan auto-scroll pada mobile.

## 4. Motion Guidelines

Motion digunakan pada component [Reveal](../src/components/ui/Reveal.tsx):

- Hanya `opacity` dan `transform`.
- `whileInView` hanya berjalan sekali (`viewport.once`).
- `useReducedMotion` menghentikan transform untuk pengguna yang meminta reduced motion.
- Hover/press feedback memakai CSS transition ringan.
- Tidak ada parallax, infinite animation besar, atau layout animation yang mahal.

## 5. Responsive Rules

| Viewport | Behavior |
|---|---|
| 360–639px | Single column, short team names, bottom nav, detail auto-scroll |
| 640–1023px | Fluid cards, two-column sections bila muat |
| 1024px+ | Desktop nav, master-detail schedule, sticky match detail |
| 1280px+ | Content max-width 1152px, whitespace editorial lebih lega |

## 6. Accessibility Checklist

- `lang="id"` pada root document.
- Heading hierarchy dimulai dari satu `h1` per halaman.
- Focus-visible ring menggunakan accent.
- Button dan link mempunyai accessible name.
- Navigation route aktif menggunakan `aria-current="page"`.
- Match tabs menggunakan `role="tablist"`, `role="tab"`, dan `aria-selected`.
- Native select memiliki label yang eksplisit.
- Warna status disertai text/icon, bukan warna saja.
- Reduced motion dihormati pada Motion dan CSS.
- Mobile layout tidak menghasilkan horizontal overflow pada 375px.

## 7. Screen Inventory

| Screen | Primary job | Main components |
|---|---|---|
| Home | Orientasi dan discovery | Hero, season snapshot, results, top table |
| Schedule | Menemukan pertandingan | Round switcher, filter, date group, match row |
| Match Center | Memahami satu pertandingan | Score header, tabs, timeline, stats, lineup |
| Standings | Membandingkan klub | Responsive standings table, zones, favorites |
| Stats | Menemukan leader | Player stats tables |
| Team Profile | Memahami satu klub | Team hero, form guide, fixtures |
| Profile | Mengelola konteks personal | Favorite team cards, empty state |

## 8. Design QA

Sebelum perubahan UI di-commit:

1. Cek 375px dan 1440px.
2. Pastikan tidak ada horizontal overflow.
3. Pastikan focus state terlihat.
4. Pastikan no-console-error pada browser smoke test.
5. Pastikan static build dan route verification tetap lulus.
