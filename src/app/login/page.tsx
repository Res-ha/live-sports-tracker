"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldIcon } from "@/components/ui/icons";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal masuk");
        return;
      }
      await refresh();
      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-accent-strong via-accent to-indigo-500 p-8 md:flex">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-background/20 text-background">
          <ShieldIcon width={22} height={22} />
        </span>
        <div className="text-background">
          <h2 className="text-2xl font-extrabold leading-tight">
            Ikuti tim favoritmu lebih dekat.
          </h2>
          <p className="mt-2 text-sm text-background/80">
            Bookmark tim, pantau pertandingan, dan selalu dapat skor terkini.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Masuk</h1>

        {error && (
          <div className="rounded-xl border border-live/40 bg-live/10 p-3 text-sm text-live">
            {error}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">
            Kata Sandi
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-2.5 font-bold text-background transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
