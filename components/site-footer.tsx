"use client";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 pt-4 text-xs text-slate-500">
      © {year} PrepFoundry • Built with Next.js + Supabase
    </footer>
  );
}