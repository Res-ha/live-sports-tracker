"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { translate, type Lang } from "@/lib/i18n/dictionaries";

const COOKIE = "lang";
const EVENT = "lang-changed";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

let cached: Lang | null = null;

function read(): Lang {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE}=`));
  const value = match?.split("=")[1];
  return value === "en" || value === "id" ? value : "id";
}

function getSnapshot(): Lang {
  if (cached) return cached;
  cached = read();
  return cached;
}

function getServerSnapshot(): Lang {
  return "id";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
  };
}

function persist(next: Lang) {
  cached = next;
  document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new Event(EVENT));
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback(
    (next: Lang) => {
      persist(next);
      router.refresh();
    },
    [router]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(lang, key, params),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
