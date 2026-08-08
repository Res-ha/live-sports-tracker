"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { ShieldIcon, SunIcon, MoonIcon, GlobeIcon } from "@/components/ui/icons";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
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
          {NAV_ITEMS.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(href) ? "bg-surface text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              {t(labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            aria-label="Ganti bahasa"
            title={lang === "id" ? "Switch to English" : "Ganti ke Indonesia"}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-bold text-muted transition-colors hover:text-foreground"
          >
            <GlobeIcon width={16} height={16} />
            {lang === "id" ? "ID" : "EN"}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
            title={theme === "dark" ? "Mode terang" : "Mode gelap"}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:text-foreground"
          >
            {theme === "dark" ? (
              <SunIcon width={18} height={18} />
            ) : (
              <MoonIcon width={18} height={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
