import {
  LiveIcon,
  CalendarIcon,
  TrophyIcon,
  ChartIcon,
} from "@/components/ui/icons";

export const NAV_ITEMS = [
  { href: "/", labelKey: "nav.live", icon: LiveIcon },
  { href: "/schedule", labelKey: "nav.schedule", icon: CalendarIcon },
  { href: "/standings", labelKey: "nav.standings", icon: TrophyIcon },
  { href: "/stats", labelKey: "nav.stats", icon: ChartIcon },
];
