"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { ShieldIcon, UserIcon, LogoutIcon } from "@/components/ui/icons";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, refresh } = useAuth();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
    await refresh();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-background">
            <ShieldIcon width={20} height={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Live<span className="text-accent">PL</span> Tracker
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(href) ? "bg-surface text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}

          {status === "authenticated" && user ? (
            <div className="ml-2 flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <Link
                href="/profile"
                className="hidden max-w-32 truncate text-sm font-semibold transition-colors hover:text-accent sm:block"
                title={user.name}
              >
                {user.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Keluar"
                title="Keluar"
                className="grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:text-live"
              >
                <LogoutIcon width={16} height={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-accent-strong"
            >
              Masuk
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          {status !== "authenticated" && (
            <Link
              href="/login"
              className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-bold text-background"
            >
              Masuk
            </Link>
          )}
          <Link href="/profile" aria-label="Profil" className="text-muted">
            <UserIcon width={22} height={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
