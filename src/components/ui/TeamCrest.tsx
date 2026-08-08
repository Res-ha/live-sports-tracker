import type { Team } from "@/types";

export function TeamCrest({ team, size = 40 }: { team: Team; size?: number }) {
  return (
    <div
      aria-label={team.name}
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${team.crestColor}, ${team.crestColor}cc)`,
        boxShadow: `0 0 0 1px rgb(255 255 255 / 0.12), 0 2px 6px rgb(0 0 0 / 0.35)`,
      }}
    >
      {team.shortName}
    </div>
  );
}
