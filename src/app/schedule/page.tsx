import type { Metadata } from "next";
import { LEAGUE } from "@/lib/api/league";
import { getDictionary } from "@/lib/i18n";
import ScheduleBrowser from "@/components/ScheduleBrowser";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t("schedule.title"),
    description: `${LEAGUE.name} · ${t("schedule.subtitle", { season: LEAGUE.season })}`,
  };
}

export default async function SchedulePage() {
  const t = await getDictionary();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {t("schedule.title")}
        </h1>
        <p className="text-sm text-muted">
          {t("schedule.subtitle", { season: LEAGUE.season })}
        </p>
      </div>
      <ScheduleBrowser />
    </div>
  );
}
