import type { MatchStatus } from "@/types";

export function formatKickoffTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatKickoffDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function statusLabel(status: MatchStatus): string {
  switch (status) {
    case "LIVE":
      return "Live";
    case "HT":
      return "Istirahat";
    case "FT":
      return "Selesai";
    case "SCHEDULED":
      return "Jadwal";
  }
}
