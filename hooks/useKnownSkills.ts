"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "learnpath:known-skills";
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedSnapshot: string[] = [];

function parse(raw: string | null): string[] {
  try {
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

// getSnapshot must return a referentially stable value when nothing changed,
// or useSyncExternalStore will think the store updates on every render.
function getSnapshot(): string[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = parse(raw);
  }
  return cachedSnapshot;
}

function getServerSnapshot(): string[] {
  return [];
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function persist(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private mode, etc.) — listeners still fire so UI stays in sync for this tab.
  }
  listeners.forEach((cb) => cb());
}

/**
 * Small localStorage-backed "skills I already know" profile so the planner
 * and role pages can share it without needing user accounts. Purely a
 * per-browser convenience — it never touches the graph database.
 */
export function useKnownSkills() {
  const knownIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setKnownIds = useCallback((ids: string[]) => persist(ids), []);

  const toggle = useCallback(
    (id: string) => persist(knownIds.includes(id) ? knownIds.filter((k) => k !== id) : [...knownIds, id]),
    [knownIds],
  );

  const add = useCallback(
    (id: string) => {
      if (!knownIds.includes(id)) persist([...knownIds, id]);
    },
    [knownIds],
  );

  const clear = useCallback(() => persist([]), []);

  return { knownIds, setKnownIds, toggle, add, clear };
}
