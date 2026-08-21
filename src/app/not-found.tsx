import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[2rem] border border-border/80 bg-surface/80 p-10 text-center shadow-[0_24px_70px_rgb(2_8_23/.25)] sm:p-14">
      <Badge tone="live">Error 404</Badge>
      <p className="text-7xl font-black tracking-[-0.08em] text-accent">404</p>
      <h1 className="text-2xl font-black tracking-tight">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-sm leading-6 text-muted">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-accent-strong"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
