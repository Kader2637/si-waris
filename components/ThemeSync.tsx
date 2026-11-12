"use client";

import { useEffect } from "react";
import { readThemeIsDark, THEME_CHANGE_EVENT } from "@/lib/theme";

export default function ThemeSync() {
  useEffect(() => {
    const syncDom = () => {
      document.documentElement.classList.toggle("dark", readThemeIsDark());
    };

    syncDom();
    window.addEventListener(THEME_CHANGE_EVENT, syncDom);
    window.addEventListener("storage", syncDom);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncDom);
      window.removeEventListener("storage", syncDom);
    };
  }, []);

  return null;
}

