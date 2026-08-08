import Link from "next/link";
import type { ReactNode } from "react";
import type { MatchDetail } from "@/types";
import { formatFullDate, formatKickoffTime } from "@/lib/format";
import { TeamCrest } from "@/components/ui/TeamCrest";

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-semibold">{children}</span>
    </div>
  );
}

export default function MatchInfo({ match }: { match: MatchDetail }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4">
      <InfoRow label="Pekan">Pekan {match.round}</InfoRow>
      <div className="border-t border-border/40">
        <InfoRow label="Tanggal">{formatFullDate(new Date(match.kickoff))}</InfoRow>
      </div>
      <div className="border-t border-border/40">
        <InfoRow label="Kickoff">{formatKickoffTime(match.kickoff)}</InfoRow>
      </div>
      <div className="border-t border-border/40">
        <InfoRow label="Stadion">{match.venue || "—"}</InfoRow>
      </div>
      {match.referee && (
        <div className="border-t border-border/40">
          <InfoRow label="Wasit">{match.referee}</InfoRow>
        </div>
      )}
      {match.attendance && (
        <div className="border-t border-border/40">
          <InfoRow label="Penonton">{match.attendance}</InfoRow>
        </div>
      )}
      <div className="border-t border-border/40">
        <InfoRow label={`Pelatih ${match.homeTeam.name}`}>
          {match.homeCoach || "—"}
        </InfoRow>
      </div>
      <div className="border-t border-border/40">
        <InfoRow label={`Pelatih ${match.awayTeam.name}`}>
          {match.awayCoach || "—"}
        </InfoRow>
      </div>

      <div className="border-t border-border/40 py-2.5">
        <div className="mb-2 text-sm text-muted">Profil Tim</div>
        <div className="flex gap-2">
          {[match.homeTeam, match.awayTeam].map((t) => (
            <Link
              key={t.id}
              href={`/teams/${t.id}`}
              className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface-hover px-3 py-2 text-sm font-semibold transition-colors hover:border-accent/50"
            >
              <TeamCrest team={t} size={24} />
              <span className="truncate">{t.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
