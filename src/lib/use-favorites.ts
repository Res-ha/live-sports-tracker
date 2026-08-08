"use client";

import { useSyncExternalStore } from "react";

const KEY = "fav-teams";
const EVENT = "fav-teams-changed";

let cached: number[] = [];
let loaded = false;

function load(): number[] {
  if (typeof window === "undefined") return cached;
  try {
    const next: number[] = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (next.length !== cached.length || next.some((v, i) => v !== cached[i])) {
      cached = next;
    }
  } catch {
    cached = [];
  }
  loaded = true;
  return cached;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function getSnapshot(): number[] {
  return loaded ? cached : load();
}

function getServerSnapshot(): number[] {
  return [];
}

export function useFavorites(): number[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleFavorite(teamId: number): void {
  const current = load();
  const next = current.includes(teamId)
    ? current.filter((id) => id !== teamId)
    : [...current, teamId];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  cached = next;
  window.dispatchEvent(new Event(EVENT));
}
