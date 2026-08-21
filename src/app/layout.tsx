import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://live-pl-tracker.pages.dev";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Live PL Tracker",
    template: "%s · Live PL Tracker",
  },
  description:
    "Skor, jadwal, klasemen, dan statistik Premier League dari API-Football.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Live PL Tracker",
    description: "Portfolio project untuk menjelajahi match center Premier League.",
    type: "website",
    locale: "id_ID",
    siteName: "Live PL Tracker",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <Header />
        <div className="pointer-events-none fixed inset-0 -z-10 app-grid" aria-hidden="true" />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-28 sm:px-6 md:py-10 md:pb-12">
          {children}
        </main>
        <footer className="mx-auto hidden w-full max-w-6xl items-center justify-between border-t border-border/70 px-6 py-7 text-xs text-muted md:flex">
          <div className="flex items-center gap-3">
            <Badge tone="success" className="px-2 py-0.5 text-[9px]">Static demo</Badge>
            <span>Built untuk eksplorasi data sepak bola.</span>
          </div>
          <ButtonLink href="/profile" variant="ghost" className="min-h-8 px-2 py-1 text-xs">Tim favorit →</ButtonLink>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
