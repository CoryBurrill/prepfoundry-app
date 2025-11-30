// components/site-header.tsx
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";

export function SiteHeader() {
  return (
    <nav className="border-b border-slate-900 pt-4 text-xs text-slate-600 text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT — Logo + App Name */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logoSlate-900.png"
                alt="PrepFoundry Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <span className="text-sm font-semibold tracking-wide text-slate-900">
                PrepFoundry
              </span>
            </Link>
          </div>

          {/* CENTER — Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            <NavLink href="/inventory">Inventory</NavLink>
            <NavLink href="/recipes">Recipes</NavLink>
            <NavLink href="/planner">Planner</NavLink>
            <NavLink href="/grocery">Grocery</NavLink>
            <NavLink href="/po">Purchasing</NavLink>
          </div>

          {/* RIGHT — Auth */}
          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <span className="text-xs text-slate-400">Loading…</span>
              }
            >
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-600 hover:text-slate-300 hover:border-slate-300 px-3 py-2 rounded-md transition"
    >
      {children}
    </Link>
  );
}