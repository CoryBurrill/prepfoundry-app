import { ThemeSwitcher } from "@/components/theme-switcher";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-16 px-4 py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-xs">
              🔪
            </div>
            <span className="text-lg font-semibold">PrepFoundry</span>
          </div>

          <nav className="flex gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#beta" className="hover:text-white">
              Beta access
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            The kitchen inventory brain
            <span className="block text-slate-400">
              you don&apos;t have to think about.
            </span>
          </h1>

          <p className="max-w-xl text-sm text-slate-300">
            PrepFoundry keeps track of what&apos;s in your kitchen, suggests
            recipes that actually match your pantry, and helps you waste less
            food without spreadsheets or mental math.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/waitlist"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
            >
              Get early access
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
            >
              How it works
            </a>
          </div>

          <p className="text-xs text-slate-400">
            No spam. Just a small beta group while we build the core experience.
          </p>
        </section>

        {/* Features */}
        <section id="features" className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            What it will do
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 p-4">
              <h3 className="text-sm font-semibold">Automatic inventory</h3>
              <p className="mt-2 text-xs text-slate-300">
                Scan receipts or sync orders so your pantry stays in sync
                without manual entry.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 p-4">
              <h3 className="text-sm font-semibold">Smart recipes</h3>
              <p className="mt-2 text-xs text-slate-300">
                Get meal ideas based on what&apos;s already in your kitchen,
                not just glossy food blog shots.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 p-4">
              <h3 className="text-sm font-semibold">Waste less, spend less</h3>
              <p className="mt-2 text-xs text-slate-300">
                Use what you have, plan what you need, and stop buying
                duplicates that end up in the trash.
              </p>
            </div>
          </div>
        </section>

        {/* Beta CTA */}
        <section id="beta" className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Join the beta list</h2>
              <p className="mt-1 text-xs text-slate-300">
                We&apos;re starting with a small group of home cooks to shape
                the first version. You&apos;ll get lifetime perks for helping
                us build it right.
              </p>
            </div>

            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
            >
              Join the waitlist
            </Link>
          </div>
        </section>

        {/* Footer */}
      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>

      </div>
    </main>
  );
}