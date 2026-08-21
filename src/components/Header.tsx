"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { ShieldIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/Badge";

export default function Header() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="Live PL Tracker beranda">
          <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-accent text-background shadow-[0_8px_24px_rgb(45_212_191/0.2)] transition-transform group-hover:-rotate-3">
            <ShieldIcon width={21} height={21} />
          </span>
          <span>
            <span className="block text-base font-extrabold tracking-tight sm:text-lg">
              Live<span className="text-accent">PL</span> Tracker
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-muted sm:block">Portfolio project</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Badge tone="success" className="hidden lg:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Demo aktif
          </Badge>
          <nav className="flex items-center gap-1 rounded-2xl border border-border/70 bg-surface/55 p-1">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(href) ? "bg-accent/12 text-accent shadow-sm" : "text-muted hover:bg-surface-hover/70 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
