// app/grocery/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Plus, PlusCircle, ShoppingCart, Trash2 } from "lucide-react";
import { getPageAccess } from "@/lib/access";
import { Input } from "@/components/ui/input";

export default function GroceryPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading Grocery List…
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
          rolling out access in waves. Your account doesn&apos;t have our magic grocery list
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

  const activeItems = 0;
  const fromPlanner = 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Grocery list
          </h1>
          <p className="text-sm text-muted-foreground">
            Everything you need, auto-pulled from your planner and pantry
            gaps.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GatedButton size="sm" className="gap-1" canUse={false}>
            <ShoppingCart className="h-4 w-4" />
            Send to cart
          </GatedButton>
          <Button size="sm" variant="outline" className="gap-1">
            <Trash2 className="h-4 w-4" />
            Clear checked
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Active items
            </CardTitle>
            <CardDescription className="text-xs">
              Items currently on this list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {activeItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              From planner
            </CardTitle>
            <CardDescription className="text-xs">
              Ingredients needed for upcoming meals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {fromPlanner}
            </div>
          </CardContent>
        </Card>

        <Card className="hidden lg:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Vendor routing
            </CardTitle>
            <CardDescription className="text-xs">
              Break the list into Walmart / Costco / local.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">Walmart API</Badge>
              <Badge variant="outline">Club store</Badge>
              <Badge variant="outline">Local market</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List UI */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current list
            </CardTitle>
            <CardDescription className="text-xs">
              Items you&apos;ll need for the next few days of cooking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Quick add item (e.g. 'eggs', 'tortillas')"
                className="h-8 text-xs"
              />
              <GatedButton size="sm" className="h-8 px-3 text-xs" canUse={false}>
                <Plus className="h-3 w-3" />
                Add
              </GatedButton>
            </div>

            <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-6 text-center text-xs text-muted-foreground">
              No items on your list yet. Once you start planning meals and
              setting min stock in inventory, this list will fill itself.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Smart suggestions
            </CardTitle>
            <CardDescription className="text-xs">
              Based on what you buy often and what&apos;s low in your
              pantry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <div className="flex flex-col">
                <span className="font-medium text-xs">Weekly staples</span>
                <span className="text-[11px] text-muted-foreground">
                  Milk, eggs, bananas, sandwich bread…
                </span>
              </div>
              <GatedButton variant="outline" size="sm" className="gap-1 text-[11px]" canUse={false}>
                <CheckCircle2 className="h-3 w-3" />
                Add all
              </GatedButton>
            </div>

            <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
              <div className="flex flex-col">
                <span className="font-medium text-xs">Running low</span>
                <span className="text-[11px] text-muted-foreground">
                  Items under min stock in your pantry.
                </span>
              </div>
              <GatedButton variant="outline" size="sm" className="gap-1 text-[11px]" canUse={false}>
                View
              </GatedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}