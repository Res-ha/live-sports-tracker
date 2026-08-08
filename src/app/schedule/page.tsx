import type { Metadata } from "next";
import ScheduleBrowser from "@/components/ScheduleBrowser";

export const metadata: Metadata = {
  title: "Jadwal",
  description: "Jadwal pertandingan Premier League per pekan.",
};

export default function SchedulePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Jadwal Pertandingan</h1>
        <p className="text-sm text-muted">
          Navigasikan antar pekan dan filter berdasarkan tim favorit Anda.
        </p>
      </div>
      <ScheduleBrowser />
    </div>
  );
}
