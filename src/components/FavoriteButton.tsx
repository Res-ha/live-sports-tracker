"use client";

import { StarIcon } from "@/components/ui/icons";
import { useAuth } from "@/components/AuthProvider";
import { useFavorites, toggleFavorite } from "@/lib/use-favorites";

export default function FavoriteButton({
  teamId,
  size = 18,
}: {
  teamId: number;
  size?: number;
}) {
  const { user, favorites, toggleFavorite: toggleRemote } = useAuth();
  const localFavorites = useFavorites();
  const isFav = user ? favorites.includes(teamId) : localFavorites.includes(teamId);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      void toggleRemote(teamId);
    } else {
      toggleFavorite(teamId);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFav ? "Hapus dari favorit" : "Favoritkan tim"}
      aria-pressed={isFav}
      title={isFav ? "Hapus dari favorit" : "Favoritkan tim"}
      className={`shrink-0 transition-colors ${
        isFav ? "text-amber-400" : "text-muted hover:text-amber-400"
      }`}
    >
      <StarIcon filled={isFav} width={size} height={size} />
    </button>
  );
}
