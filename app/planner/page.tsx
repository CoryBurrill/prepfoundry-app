// app/planner/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getHouseholdPantryInventory } from "@/lib/inventory";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, PlusCircle } from "lucide-react";
import { getPageAccess } from "@/lib/access";

export default function PlannerPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading Meal Planner…
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
          rolling out access in waves. Your account doesn&apos;t have meal planner
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

    const recipes: any[] = [];
    const hasRecipes = recipes.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">Household Meal Planner</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasRecipes ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/40 px-6 py-10 text-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">No calendar yet</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Daily cards coming soon. 
              </p>
            </div>
            <Button size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add first meal
            </Button>
          </div>
        ) : (
          <div>Meal planner module coming soon…</div>
        )}
      </CardContent>
    </Card>
  );
}