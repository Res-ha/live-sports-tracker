"use client";

import Link from "next/link";
import type { StandingsRow } from "@/types";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { useFavorites } from "@/lib/use-favorites";

export default function StandingsTable({ rows }: { rows: StandingsRow[] }) {
  const favIds = useFavorites();

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Tim</th>
            <th className="px-2 py-3 text-center">P</th>
            <th className="hidden px-2 py-3 text-center sm:table-cell">W</th>
            <th className="hidden px-2 py-3 text-center sm:table-cell">D</th>
            <th className="hidden px-2 py-3 text-center sm:table-cell">L</th>
            <th className="px-2 py-3 text-center">GD</th>
            <th className="px-4 py-3 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isFav = favIds.includes(row.team.id);
            const isUcl = row.position <= 4;
            return (
              <tr
                key={row.team.id}
                className={`border-t border-border/60 transition-colors hover:bg-surface-hover ${
                  isUcl ? "bg-ucl/[0.06]" : ""
                } ${isFav ? "bg-accent/[0.06]" : ""}`}
              >
                <td className="px-4 py-3 font-semibold text-muted">{row.position}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/teams/${row.team.id}`}
                    className="flex items-center gap-3 font-semibold"
                  >
                    <TeamCrest team={row.team} size={26} />
                    <span className="truncate">{row.team.name}</span>
                    {isFav && <span className="text-xs text-amber-400">★</span>}
                  </Link>
                </td>
                <td className="px-2 py-3 text-center">{row.played}</td>
                <td className="hidden px-2 py-3 text-center sm:table-cell">{row.won}</td>
                <td className="hidden px-2 py-3 text-center sm:table-cell">{row.drawn}</td>
                <td className="hidden px-2 py-3 text-center sm:table-cell">{row.lost}</td>
                <td
                  className={`px-2 py-3 text-center ${
                    row.goalsFor - row.goalsAgainst >= 0 ? "text-success" : "text-live"
                  }`}
                >
                  {row.goalsFor - row.goalsAgainst > 0
                    ? `+${row.goalsFor - row.goalsAgainst}`
                    : row.goalsFor - row.goalsAgainst}
                </td>
                <td className="px-4 py-3 text-center font-bold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
