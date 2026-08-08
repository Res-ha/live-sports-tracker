"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { UserIcon } from "@/components/ui/icons";
import { useLanguage } from "@/components/LanguageProvider";

const ITEMS = [
  ...NAV_ITEMS,
  { href: "/profile", labelKey: "nav.profile", icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {ITEMS.map(({ href, labelKey, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <Icon width={20} height={20} />
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
