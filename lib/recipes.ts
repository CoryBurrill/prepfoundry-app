// lib/recipes.ts
import { createClient } from "@/lib/supabase/server";

export type NewRecipeInput = {
  householdId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  isFavorite?: boolean;
};

export async function getHouseholdRecipes(householdId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getHouseholdRecipes] error", error);
    return [];
  }

  // data is RecipeRow[]
  return data ?? [];
}

export type RecipeRow = Awaited<
  ReturnType<typeof getHouseholdRecipes>
>[number];

export async function createRecipe(input: NewRecipeInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      household_id: input.householdId,
      owner_id: input.createdBy,
      title: input.title,
      description: input.description ?? null,
      is_favorite: input.isFavorite ?? false,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[createRecipe] error", error);
    throw error;
  }

  return data as RecipeRow;
}