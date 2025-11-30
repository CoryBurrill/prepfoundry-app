// app/planner/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GatedButton } from "@/components/gated-button";
import { getPageAccess } from "@/lib/access";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { ChevronLeft, CalendarDays, ChevronRight } from "lucide-react";

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

  const plannedMeals = 0;
  const unplannedDays = 7;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Meal planner
          </h1>
          <p className="text-sm text-muted-foreground">
            Sketch out your week and keep your pantry, recipes, and grocery
            list in sync.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GatedButton size="icon" variant="outline" canUse={false}>
            <ChevronLeft className="h-4 w-4" />
          </GatedButton>
          <GatedButton
            size="sm"
            variant="outline"
            className="gap-2 text-xs font-medium" canUse={false}          >
            <CalendarDays className="h-4 w-4" />
            This week
          </GatedButton>
          <GatedButton size="icon" variant="outline" canUse={false}>
            <ChevronRight className="h-4 w-4" />
          </GatedButton>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Planned meals
            </CardTitle>
            <CardDescription className="text-xs">
              Connected to recipes + inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {plannedMeals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Unplanned days
            </CardTitle>
            <CardDescription className="text-xs">
              Days with no dinner planned yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {unplannedDays}
            </div>
          </CardContent>
        </Card>

        <Card className="hidden lg:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Upcoming events
            </CardTitle>
            <CardDescription className="text-xs">
              Birthdays, guests, or travel days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              No events synced yet.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            This week at a glance
          </CardTitle>
          <CardDescription className="text-xs">
            Drop a recipe onto each day to build your plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dinners" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dinners">Dinners</TabsTrigger>
              <TabsTrigger value="lunches">Lunches</TabsTrigger>
              <TabsTrigger value="breakfasts">Breakfasts</TabsTrigger>
            </TabsList>

            <TabsContent value="dinners">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {days.map((day) => (
                  <DayCard key={day} day={day} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lunches">
              <div className="text-xs text-muted-foreground">
                Lunch planning coming soon.
              </div>
            </TabsContent>

            <TabsContent value="breakfasts">
              <div className="text-xs text-muted-foreground">
                Breakfast planning coming soon.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function DayCard({ day }: { day: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-medium">{day}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Dinner
        </span>
      </div>
      <div className="rounded-md border border-dashed bg-background/60 px-2 py-4 text-center text-[11px] text-muted-foreground">
        No recipe assigned
      </div>
      <GatedButton size="sm" variant="outline" className="mt-1 text-[11px]" canUse={false}>
        + Add from recipes
      </GatedButton>
    </div>
  );
}