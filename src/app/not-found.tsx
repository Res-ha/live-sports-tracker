import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-14 text-center">
      <p className="text-5xl font-extrabold text-accent">404</p>
      <h1 className="text-xl font-bold">Halaman tidak ditemukan</h1>
      <p className="text-sm text-muted">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-accent-strong"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
