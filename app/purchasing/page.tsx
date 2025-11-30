// app/purchasing/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getHouseholdPantryInventory } from "@/lib/inventory";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GatedButton } from "@/components/gated-button";
import { Separator } from "@/components/ui/separator";
import { Badge, Clock, CreditCard, DollarSign, Package, PlusCircle, Truck } from "lucide-react";
import { getPageAccess } from "@/lib/access";

export default function GroceryPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading PO List…
            </div>
          }
        >
          <PlannerContent />
        </Suspense>
      </div>
    </main>
  );
}

async function PlannerContent() {
  const { user, profile, household, canView, canUse, isAdmin } =
    await getPageAccess("planner");

  if (!user) {
    redirect("/auth/login");
  }

  if (!canView) {
    return (
      <main className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">You’re in! (Sort of)</h1>
        <p className="text-sm text-muted-foreground">
          Thanks for signing up, {profile?.display_name ?? "friend"}. We’re
          rolling out access in waves. Your account doesn&apos;t have purchasing
          access yet.
        </p>
        <p className="text-sm text-muted-foreground">
          If you think this is a mistake, message me and I’ll flip your role in
          the beta.
        </p>
      </main>
    );
  }

  // real inventory query
  //  const items = await getHouseholdPantryInventory(household!.id);
  //  const hasItems = items.length > 0;

  const monthlyBudget = 0;
  const committedThisWeek = 0;
  const ordersInFlight = 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Purchasing
          </h1>
          <p className="text-sm text-muted-foreground">
            Turn grocery runs into a predictable, trackable system instead
            of vibes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GatedButton size="sm" className="gap-1" canUse={false}>
            <CreditCard className="h-4 w-4" />
            Review upcoming orders
          </GatedButton>
          <Button size="sm" variant="outline" className="gap-1">
            <Truck className="h-4 w-4" />
            Delivery preferences
          </Button>
        </div>
      </div>

      {/* Budget / pipeline */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Monthly food budget
            </CardTitle>
            <CardDescription className="text-xs">
              Total planned spend for this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-2xl font-semibold">
              <DollarSign className="h-5 w-5" />
              {monthlyBudget.toFixed(0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Committed this week
            </CardTitle>
            <CardDescription className="text-xs">
              Orders in carts across vendors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-2xl font-semibold">
              <DollarSign className="h-5 w-5" />
              {committedThisWeek.toFixed(0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Orders in flight
            </CardTitle>
            <CardDescription className="text-xs">
              Deliveries on the way to your door.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <Truck className="h-5 w-5" />
              {ordersInFlight}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming orders table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming orders
          </CardTitle>
          <CardDescription className="text-xs">
            Once purchasing is wired up, this will show recurring orders,
            one-offs, and auto-generated restocks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border text-xs">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] bg-muted px-3 py-2 font-medium uppercase tracking-[0.14em] text-[10px] text-muted-foreground">
              <span>Vendor</span>
              <span className="text-right">Window</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
            </div>
            <Separator />
            <div className="px-3 py-4 text-center text-[11px] text-muted-foreground">
              No upcoming orders yet. As you build habits in inventory,
              recipes, and grocery, this page will become your control tower.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future-facing note */}
      <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>
          Long-term: this is where subscriptions, &quot;subscribe &amp;
          save&quot;, and smart restocking logic will live.
        </span>
        <Badge className="ml-auto text-[10px]">
          concept mode
        </Badge>
      </div>
    </div>
  );
}