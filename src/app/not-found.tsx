import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export default async function NotFound() {
  const t = await getDictionary();
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-14 text-center">
      <p className="text-5xl font-extrabold text-accent">404</p>
      <h1 className="text-xl font-bold">{t("notFound.title")}</h1>
      <p className="text-sm text-muted">{t("notFound.desc")}</p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-accent-strong"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
