// app/page.tsx
import Link from "next/link";

const features = [
  {
    title: "Know what you actually have",
    description:
      "A living inventory that updates as you cook, shop, and plan. No more guessing what’s in the fridge.",
  },
  {
    title: "Cook from what’s on hand",
    description:
      "Smart recipes built around your real ingredients, not a fantasy pantry. Waste less, cook more.",
  },
  {
    title: "Plan once, eat all week",
    description:
      "Drop meals onto your week and let PrepFoundry handle the shopping list and ingredient checks.",
  },
];

const steps = [
  "Scan or log what’s in your kitchen.",
  "Save a few go-to recipes you actually cook.",
  "Drag meals into your week and auto-build your list.",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Outer container */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        {/* Top nav */}
        <header className="flex items-center justify-between pb-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-lg">
              🔪
            </div>
            <span className="text-lg font-semibold tracking-tight">
              PrepFoundry
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link
              href="/auth/sign-in"
              className="rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900/60"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Join the beta
            </Link>
          </nav>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-12 pb-16 lg:flex-row lg:items-center lg:gap-16">
          {/* Hero text */}
          <section className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Kitchen inventory • Meal planning • Smart grocery lists</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Turn grocery chaos
                <span className="block text-slate-300">
                  into a calm, cookable kitchen.
                </span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                PrepFoundry keeps a live inventory of your kitchen, suggests
                recipes from what you already own, and builds a grocery list
                that actually respects your budget and your time.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-slate-50 px-6 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200"
              >
                Get early access
              </Link>
              <Link
                href="/app"
                className="text-sm text-slate-300 underline-offset-4 hover:underline"
              >
                Peek inside the app
              </Link>
            </div>

            {/* Simple 3-step row */}
            <div className="mt-6 grid gap-3 text-xs text-slate-400 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2"
                >
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 text-[0.7rem] text-slate-200">
                    {i + 1}
                  </span>
                  <p className="leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Right side “app preview” */}
          <section className="flex-1">
            <div className="relative">
              {/* Glow */}
              <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-slate-500/10 blur-3xl" />

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_80px_rgba(15,23,42,0.9)]">
                {/* Mini header */}
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 text-xs">
                      🔪
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-100">
                        PrepFoundry
                      </span>
                      <span className="text-[0.65rem] text-slate-400">
                        Live kitchen overview
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-300">
                    In private beta
                  </span>
                </div>

                {/* Fake “app” sections */}
                <div className="space-y-4 text-xs text-slate-200">
                  {/* Inventory row */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                        Inventory snapshot
                      </span>
                      <span className="text-[0.7rem] text-slate-400">
                        34 items tracked
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[0.7rem]">
                      <div className="rounded-xl bg-slate-900/80 px-2 py-2">
                        <p className="text-slate-400">Fresh</p>
                        <p className="font-semibold text-emerald-300">
                          12 items
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-900/80 px-2 py-2">
                        <p className="text-slate-400">Running low</p>
                        <p className="font-semibold text-amber-300">
                          7 items
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-900/80 px-2 py-2">
                        <p className="text-slate-400">At risk</p>
                        <p className="font-semibold text-rose-300">
                          3 items
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Planner row */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                        This week’s plan
                      </span>
                      <span className="text-[0.7rem] text-slate-400">
                        5 dinners locked
                      </span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {[
                        "Mon · Sheet Pan Chicken & Veg",
                        "Tue · Pasta with Fridge-Cleanout Sauce",
                        "Thu · Leftover Remix Stir-Fry",
                      ].map((line, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/70 px-2 py-1.5"
                        >
                          <span className="text-[0.7rem] text-slate-200">
                            {line}
                          </span>
                          <span className="text-[0.65rem] text-emerald-300">
                            in stock
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grocery list row */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                        Smart grocery list
                      </span>
                      <span className="text-[0.7rem] text-slate-400">
                        9 items
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1.5 text-[0.7rem]">
                      {["Greek yogurt", "Garlic", "Rice", "Spinach", "Limes"].map(
                        (item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 rounded-lg border border-slate-800/70 bg-slate-900/70 px-2 py-1"
                          >
                            <span className="h-3 w-3 rounded-sm border border-slate-600" />
                            <span>{item}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Small caption under preview */}
              <p className="mt-3 text-xs text-slate-500">
                Designed for real kitchens. Built to quietly keep you one step
                ahead of your fridge.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom strip */}
        <footer className="border-t border-slate-900 pt-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>PrepFoundry · Built for people who actually cook at home.</p>
            <div className="flex gap-3">
              <Link
                href="/privacy"
                className="hover:text-slate-300 hover:underline"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-slate-300 hover:underline"
              >
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
