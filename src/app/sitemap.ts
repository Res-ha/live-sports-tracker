import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://live-pl-tracker.pages.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [teams, rounds] = await Promise.all([
    api.getTeams(),
    Promise.all(Array.from({ length: 38 }, (_, index) => api.getRound(index + 1))),
  ]);
  const lastModified = new Date();
  const coreRoutes = ["/", "/schedule", "/standings", "/stats", "/profile"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const teamRoutes = teams.map((team) => ({
    url: `${siteUrl}/teams/${team.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));
  const matchRoutes = rounds.flatMap((round) =>
    round.matches.map((match) => ({
      url: `${siteUrl}/matches/${match.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.45,
    })),
  );

  return [...coreRoutes, ...teamRoutes, ...matchRoutes];
}
