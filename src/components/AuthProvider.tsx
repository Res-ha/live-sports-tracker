"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  favorites: number[];
  toggleFavorite: (teamId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [favorites, setFavorites] = useState<number[]>([]);

  const refresh = useCallback(async () => {
    const me = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
    if (me.user) {
      setUser(me.user);
      setStatus("authenticated");
      const fav = await fetch("/api/user/favorites", { cache: "no-store" }).then((r) =>
        r.json()
      );
      setFavorites(fav.teamIds ?? []);
    } else {
      setUser(null);
      setStatus("unauthenticated");
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const me = await fetch("/api/auth/me", { cache: "no-store" }).then((r) =>
          r.json()
        );
        if (cancelled) return;
        if (me.user) {
          setUser(me.user);
          setStatus("authenticated");
          const fav = await fetch("/api/user/favorites", { cache: "no-store" }).then(
            (r) => r.json()
          );
          if (cancelled) return;
          setFavorites(fav.teamIds ?? []);
        } else {
          setUser(null);
          setStatus("unauthenticated");
          setFavorites([]);
        }
      } catch {
        if (!cancelled) setStatus("unauthenticated");
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = useCallback(
    async (teamId: number) => {
      const isFav = favorites.includes(teamId);
      const res = await fetch("/api/user/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setFavorites(data.teamIds ?? []);
    },
    [favorites]
  );

  return (
    <AuthContext.Provider value={{ user, status, favorites, toggleFavorite, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
