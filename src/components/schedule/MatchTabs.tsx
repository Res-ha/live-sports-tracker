import {
  BallIcon,
  ChartIcon,
  ShieldIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/ui/icons";

export type MatchTab = "preview" | "squad" | "stats" | "table" | "info";

const TABS: { key: MatchTab; label: string; Icon: typeof BallIcon }[] = [
  { key: "preview", label: "Preview", Icon: BallIcon },
  { key: "squad", label: "Squad", Icon: UserIcon },
  { key: "stats", label: "Stats", Icon: ChartIcon },
  { key: "table", label: "Table", Icon: TrophyIcon },
  { key: "info", label: "Info", Icon: ShieldIcon },
];

export default function MatchTabs({
  active,
  onChange,
}: {
  active: MatchTab;
  onChange: (tab: MatchTab) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-surface p-1">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-semibold transition-colors sm:px-3 ${
              isActive
                ? "bg-accent text-background"
                : "text-muted hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            <Icon width={15} height={15} className="shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
