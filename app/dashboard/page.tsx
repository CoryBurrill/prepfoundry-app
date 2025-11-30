// app/dashboard/page.tsx
import { ensureUserContext } from "@/lib/ensureUserContext";
import { featureGate } from "@/lib/feature-gate";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  ReceiptText,
  CalendarClock,
  Timer,
  AlertTriangle,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";
import React from "react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading dashboard…
            </div>
          }
        >
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}


async function DashboardContent() {
  const { user, profile, household } = await ensureUserContext();

  if (!user) {
    redirect("/auth/login");
  }

  // Call featureGate once per feature
  const betaGate = await featureGate("beta_public_dashboard");
  const privateGate = await featureGate("beta_private_extras");

  const hasPublicBeta = betaGate.allowed;
  const hasPrivateExtras = privateGate.allowed;

  const isAdmin =
    hasPrivateExtras || profile?.role === "admin" || profile?.role === "owner";

  if (!hasPublicBeta) {
    // Logged in, but not in any beta
    return (
      <main className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">You’re in! (Sort of)</h1>
        <p className="text-sm text-muted-foreground">
          Thanks for signing up, {profile?.display_name ?? "friend"}. We’re
          rolling out the beta in waves. You don’t have access yet, but you’re
          on the list.
        </p>
        <p className="text-sm text-muted-foreground">
          If you think this is a mistake, message me and I’ll flip your role in
          the beta.
        </p>
      </main>
    );
  }

  // Has at least public beta access
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        {/* Header */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Kitchen Command Center
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              See today&apos;s meals, inventory risks, and grocery needs at a
              glance.
            </p>
          </div>

          {/* Onboarding Progress */}
          <Card className="w-full max-w-sm border-dashed sm:w-80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                Onboarding
                <span className="text-xs font-normal text-muted-foreground">
                  3 / 5 steps
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={60} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                Next: connect a grocery vendor and set your household
                preferences.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Continue setup
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton
              icon={<PlusCircle className="h-4 w-4" />}
              label="Add inventory item"
              description="Log a new ingredient or restock something."
            />
            <QuickActionButton
              icon={<ReceiptText className="h-4 w-4" />}
              label="Scan receipt"
              description="Pull items in automatically from your last shop."
            />
            <QuickActionButton
              icon={<CalendarClock className="h-4 w-4" />}
              label="Plan this week"
              description="Fill your weekly meal plan in minutes."
            />
            <QuickActionButton
              icon={<Timer className="h-4 w-4" />}
              label="Open timers"
              description="Multi-timer for active cooking sessions."
            />
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Left column (spans 2) */}
          <div className="grid gap-4 lg:col-span-2">
            {/* Today Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Today&apos;s Overview
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    What you&apos;re eating, what you&apos;re missing, and
                    where your macros land.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-wide"
                >
                  Household view
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {/* Today meals */}
                <div className="grid gap-3 md:grid-cols-3">
                  <TodayMealCard
                    label="Breakfast"
                    recipeName="Greek yogurt + berries"
                    hasAllIngredients
                  />
                  <TodayMealCard
                    label="Lunch"
                    recipeName="Leftover chicken rice bowl"
                    hasAllIngredients
                  />
                  <TodayMealCard
                    label="Dinner"
                    recipeName="Sheet-pan veggies & sausage"
                    hasAllIngredients={false}
                    missingCount={2}
                  />
                </div>

                <Separator />

                {/* Macro snapshot */}
                <div className="grid gap-4 md:grid-cols-3">
                  <MacroChip label="Calories" current={1450} target={2100} />
                  <MacroChip
                    label="Protein"
                    current={68}
                    target={120}
                    unit="g"
                  />
                  <MacroChip
                    label="Carbs"
                    current={130}
                    target={220}
                    unit="g"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory Health */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Inventory Health
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Items running low or about to expire, with quick ways to
                    act.
                  </p>
                </div>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Low Stock
                  </h3>
                  <InventoryRow
                    name="Eggs"
                    status="4 left"
                    action="Add to grocery list"
                  />
                  <InventoryRow
                    name="Olive oil"
                    status="Below min level"
                    action="Increase min qty"
                  />
                  <InventoryRow
                    name="Frozen berries"
                    status="Last bag"
                    action="Add to grocery list"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Expiring Soon
                  </h3>
                  <InventoryRow
                    name="Spinach"
                    status="2 days left"
                    action="View recipe ideas"
                  />
                  <InventoryRow
                    name="Greek yogurt"
                    status="3 days left"
                    action="Use in breakfast"
                  />
                  <InventoryRow
                    name="Chicken thighs"
                    status="Tonight"
                    action="Plan for dinner"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="grid gap-4">
            {/* Grocery & Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Grocery & Orders
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Today&apos;s list and incoming deliveries.
                  </p>
                </div>
                <ShoppingCart className="h-4 w-4" />
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Active Grocery List
                    </p>
                    <span className="text-xs text-muted-foreground">
                      12 items
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Eggs (18-count)</li>
                    <li>• Spinach (large clamshell)</li>
                    <li>• Chicken thighs (3 lb)</li>
                    <li>• Oats, Frozen berries, Olive oil…</li>
                  </ul>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Open list
                    </Button>
                    <Button size="sm" className="flex-1">
                      Send to cart
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Incoming Orders
                    </p>
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium">
                        Walmart+ delivery window
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        5 items mapped to inventory
                      </p>
                    </div>
                    <Package className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights / Admin */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {isAdmin ? "Spending & Waste" : "Cooking Insights"}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isAdmin
                      ? "Last 30 days across your household."
                      : "Small wins that add up over time."}
                  </p>
                </div>
                {isAdmin ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {isAdmin ? (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Grocery spend (30d)
                        </span>
                        <span className="text-sm font-medium">$642</span>
                      </div>
                      <p className="text-[11px] text-emerald-500">
                        <span className="inline-flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          8% vs last month
                        </span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Estimated food waste
                        </span>
                        <span className="text-sm font-medium">11%</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Driven mostly by fresh produce. See recipes to use up
                        spinach and herbs sooner.
                      </p>
                    </div>

                    <Separator />

                    <Button size="sm" variant="outline" className="w-full">
                      Open full analytics
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Home-cooked meals this week
                        </span>
                        <span className="text-sm font-medium">9 / 14</span>
                      </div>
                      <Progress value={64} className="h-1.5" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Most used recipes
                      </span>
                      <ul className="space-y-1 text-[11px] text-muted-foreground">
                        <li>• Sheet-pan veggies & sausage</li>
                        <li>• Overnight oats</li>
                        <li>• Chicken rice bowls</li>
                      </ul>
                    </div>

                    <Separator />

                    <Button size="sm" variant="outline" className="w-full">
                      See full planner
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- Small helper components ---------- */

type QuickActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  description: string;
};

function QuickActionButton({ icon, label, description }: QuickActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="flex h-auto items-start justify-start gap-3 rounded-xl border-dashed bg-background/40 px-3 py-3 text-left hover:bg-background"
    >
      <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border text-xs">
        {icon}
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-xs font-medium leading-tight">{label}</span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">
          {description}
        </span>
      </span>
    </Button>
  );
}

type TodayMealCardProps = {
  label: string;
  recipeName: string;
  hasAllIngredients: boolean;
  missingCount?: number;
};

function TodayMealCard({
  label,
  recipeName,
  hasAllIngredients,
  missingCount,
}: TodayMealCardProps) {
  return (
    <div className="rounded-xl border bg-card px-3 py-2.5">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="uppercase tracking-[0.16em]">{label}</span>
        {hasAllIngredients ? (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
            Ready
          </span>
        ) : (
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
            {missingCount ?? 0} missing
          </span>
        )}
      </div>
      <p className="mt-1 text-xs font-medium leading-snug">{recipeName}</p>
      <button className="mt-2 text-[11px] font-medium text-primary underline-offset-2 hover:underline">
        View recipe
      </button>
    </div>
  );
}

type MacroChipProps = {
  label: string;
  current: number;
  target: number;
  unit?: string;
};

function MacroChip({ label, current, target, unit }: MacroChipProps) {
  const percent = Math.min(Math.round((current / target) * 100), 130);

  return (
    <div className="space-y-1 rounded-xl border bg-card px-3 py-2.5">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="uppercase tracking-[0.16em]">{label}</span>
        <span className="text-[11px}">
          {current}
          {unit} / {target}
          {unit}
        </span>
      </div>
      <Progress value={percent} className="h-1.5" />
    </div>
  );
}

type InventoryRowProps = {
  name: string;
  status: string;
  action: string;
};

function InventoryRow({ name, status, action }: InventoryRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-background/40 px-3 py-2">
      <div className="space-y-0.5">
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[11px] text-muted-foreground">{status}</p>
      </div>
      <button className="text-[11px] font-medium text-primary underline-offset-2 hover:underline">
        {action}
      </button>
    </div>
  );
}
