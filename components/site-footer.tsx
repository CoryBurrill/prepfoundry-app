"use client";

import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function SiteFooter() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const display =
    now?.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }) ?? "…";

  const year = now?.getFullYear() ?? new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 pt-4 text-xs text-slate-500 text-center">
      <div><ThemeSwitcher /></div>
      <div className="pb-5">
        © {year} PrepFoundry • Built with grit, love, and vision.
      </div>
    </footer>
  );
}