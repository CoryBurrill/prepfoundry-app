// components/site-header.tsx
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { MainNavClient } from "@/components/main-nav-client";

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-0">
        {/* logo */}
        <div className="flex items-center gap-2">
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

        {/* nav (client) */}
        <MainNavClient />

        {/* auth (server, behind Suspense) */}
        <Suspense fallback={<div className="h-8 w-16 rounded-md bg-muted" />}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}