import type { Match } from "@/types";
import { formatFullDate } from "@/lib/format";
import MatchRow from "./MatchRow";

export default function DateGroup({
  date,
  matches,
  selectedId,
  onSelect,
}: {
  date: string;
  matches: Match[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <section>
      <div className="mb-2 flex items-baseline gap-2 px-1">
        <h2 className="text-sm font-bold tracking-tight">{formatFullDate(new Date(date))}</h2>
        <span className="text-xs text-muted">
          {matches.length} pertandingan
        </span>
      </div>
      <div className="space-y-2">
        {matches.map((m) => (
          <MatchRow
            key={m.id}
            match={m}
            selected={m.id === selectedId}
            onClick={() => onSelect(m.id)}
          />
        ))}
      </div>
    </section>
  );
}
