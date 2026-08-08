"use client";

import { StarIcon } from "@/components/ui/icons";
import { useFavorites, toggleFavorite } from "@/lib/use-favorites";
import { useLanguage } from "@/components/LanguageProvider";

export default function FavoriteButton({
  teamId,
  size = 18,
}: {
  teamId: number;
  size?: number;
}) {
  const favorites = useFavorites();
  const isFav = favorites.includes(teamId);
  const { t } = useLanguage();

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(teamId);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFav ? t("fav.remove") : t("fav.add")}
      aria-pressed={isFav}
      title={isFav ? t("fav.remove") : t("fav.add")}
      className={`shrink-0 transition-colors ${
        isFav ? "text-amber-400" : "text-muted hover:text-amber-400"
      }`}
    >
      <StarIcon filled={isFav} width={size} height={size} />
    </button>
  );
}
