"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { UserIcon } from "@/components/ui/icons";

const ITEMS = [
  ...NAV_ITEMS,
  { href: "/profile", label: "Profil", icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-semibold transition-colors ${
                active ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface"
              }`}
            >
              {active ? <span className="absolute top-1 h-0.5 w-5 rounded-full bg-accent" aria-hidden="true" /> : null}
              <Icon width={20} height={20} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
