"use client";

import { StarIcon } from "@/components/ui/icons";
import { useFavorites, toggleFavorite } from "@/lib/use-favorites";

export default function FavoriteButton({
  teamId,
  size = 18,
}: {
  teamId: number;
  size?: number;
}) {
  const favorites = useFavorites();
  const isFav = favorites.includes(teamId);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(teamId);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFav ? "Hapus dari favorit" : "Favoritkan tim"}
      aria-pressed={isFav}
      title={isFav ? "Hapus dari favorit" : "Favoritkan tim"}
      className={`pointer-events-auto shrink-0 transition-colors ${
        isFav ? "text-amber-400" : "text-muted hover:text-amber-400"
      }`}
    >
      <StarIcon filled={isFav} width={size} height={size} />
    </button>
  );
}
