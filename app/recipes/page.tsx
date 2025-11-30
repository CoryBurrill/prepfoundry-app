// app/recipes/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getPageAccess } from "@/lib/access";
import { getHouseholdRecipes, type RecipeRow } from "@/lib/recipes";
import { createRecipeAction } from "./actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { PlusCircle, Sparkles, FolderOpen } from "lucide-react";
import { GatedButton } from "@/components/gated-button";

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading recipes…
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
  const { user, profile, household, canView, canUse } = await getPageAccess("recipes");

  if (!user) redirect("/auth/login");

  if (!canView) {
    return (
      <main className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">You’re in! (Sort of)</h1>
        <p className="text-sm text-muted-foreground">
          Thanks for signing up, {profile?.display_name ?? "friend"}. Recipes
          aren&apos;t unlocked yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Message me if you need access for testing.
        </p>
      </main>
    );
  }

  // real recipes query
  const recipes = await getHouseholdRecipes(household!.id);
  const favorites = recipes.filter((r) => r.is_favorite);
  const recipeCount = recipes.length;
  const favoritesCount = favorites.length;

  return (
    <div className="space-y-6">
      {/* Header / hero */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
          <p className="text-sm text-muted-foreground">
            Save your go-to meals and connect them to your pantry inventory.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
        <Dialog>
        <DialogTrigger asChild>
          <GatedButton
            canUse={canUse}
            size="sm"
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New recipe
          </GatedButton>
        </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new recipe</DialogTitle>
              <DialogDescription>
                Give your recipe a name and optional description.
              </DialogDescription>
            </DialogHeader>

            <form action={createRecipeAction} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Chicken Alfredo"
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Description</label>
                <textarea
                  name="description"
                  placeholder="Optional: short note about the recipe"
                  className="min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <DialogFooter className="flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="h-8 px-3">
                    Cancel
                  </Button>
                </DialogClose>

                <Button type="submit" className="h-8 px-3">
                  Save Recipe
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

          <Button size="sm" variant="outline" className="gap-1">
            <Sparkles className="h-4 w-4" />
            Import from URL
          </Button>
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
            <div className="text-2xl font-semibold">{recipeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <CardDescription className="text-xs">
              Mark your best as &quot;favorite&quot; to find them fast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{favoritesCount}</div>
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
            {/* We’ll wire this once you add ingredients/inventory link */}
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
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {recipes.length === 0 ? (
                <EmptyRecipesState label="No recipes yet" />
              ) : (
                <RecipeList recipes={recipes} />
              )}
            </TabsContent>

            <TabsContent value="starred" className="space-y-3">
              {favorites.length === 0 ? (
                <EmptyRecipesState label="No favorites yet" />
              ) : (
                <RecipeList recipes={favorites} />
              )}
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
        <Badge variant="outline">30-min meals</Badge>
        <Badge variant="outline">Meal prep</Badge>
        <Badge variant="outline">Pantry-only</Badge>
      </div>
    </div>
  );
}

function RecipeList({ recipes }: { recipes: RecipeRow[] }) {
  if (recipes.length === 0) return null;

  return (
    <div className="space-y-2">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2 text-xs"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">{recipe.name}</span>
            {recipe.description && (
              <span className="text-[11px] text-muted-foreground line-clamp-2">
                {recipe.description}
              </span>
            )}
          </div>
          {recipe.is_favorite && (
            <Badge variant="outline" className="text-[10px]">
              favorite
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}