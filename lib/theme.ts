"use client";

import { useSyncExternalStore } from "react";

export const THEME_CHANGE_EVENT = "emawarist-theme-change";

export function readThemeIsDark(): boolean {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return document.documentElement.classList.contains("dark");
}

function subscribeTheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useIsDark(): boolean {
  return useSyncExternalStore(subscribeTheme, readThemeIsDark, () => false);
}

export function applyTheme(isDark: boolean) {
  if (typeof window === "undefined") return;
  if (isDark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: isDark }));
}
