// app/recipes/page.tsx
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
import { Badge, FolderOpen, Package, PlusCircle, Sparkles } from "lucide-react";
import { getPageAccess } from "@/lib/access";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading your household recipe book…
            </div>
          }
        >
          <RecipesContent />
        </Suspense>
      </div>
    </main>
  );
}

async function RecipesContent() {
  const { user, profile, household, canView, canUse, isAdmin } =
    await getPageAccess("recipes");

  if (!user) {
    redirect("/auth/login");
  }

  if (!canView) {
    return (
      <main className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">You’re in! (Sort of)</h1>
        <p className="text-sm text-muted-foreground">
          Thanks for signing up, {profile?.display_name ?? "friend"}. We’re
          rolling out access in waves. Your account doesn&apos;t have recipes
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

  const recipeCount = 0;
  const favoritesCount = 0;

  return (
    <div className="space-y-6">
      {/* Header / hero */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Recipes
          </h1>
          <p className="text-sm text-muted-foreground">
            Save your go-to meals and connect them to your pantry inventory.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GatedButton size="sm" className="gap-1" canUse={false}>
            <PlusCircle className="h-4 w-4" />
            New recipe
          </GatedButton>
          <GatedButton size="sm" variant="outline" className="gap-1" canUse={false}>
            <Sparkles className="h-4 w-4" />
            Import from URL
          </GatedButton>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total recipes
            </CardTitle>
            <CardDescription className="text-xs">
              All saved recipes in this household.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {recipeCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Favorites
            </CardTitle>
            <CardDescription className="text-xs">
              Mark your best as &quot;favorite&quot; to find them fast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {favoritesCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Connected to inventory
            </CardTitle>
            <CardDescription className="text-xs">
              Recipes that automatically pull from your pantry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Main content tabs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Recipe library
          </CardTitle>
          <CardDescription className="text-xs">
            Organize by tags, cuisine, difficulty, or whatever makes sense
            in your kitchen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All recipes</TabsTrigger>
              <TabsTrigger value="starred">Favorites</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              <EmptyRecipesState label="No recipes yet" />
            </TabsContent>

            <TabsContent value="starred" className="space-y-3">
              <EmptyRecipesState label="No favorites yet" />
            </TabsContent>

            <TabsContent value="drafts" className="space-y-3">
              <EmptyRecipesState label="No drafts yet" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyRecipesState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/40 px-6 py-8 text-center">
      <FolderOpen className="h-6 w-6 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Start by adding a few core recipes — your go-to weeknight dinners,
          family favorites, or budget lifesavers.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge>30-min meals</Badge>
        <Badge>Meal prep</Badge>
        <Badge>Pantry-only</Badge>
      </div>
    </div>
  );
}