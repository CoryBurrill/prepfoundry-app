"use server";

import { createClient } from "@/lib/supabase/server";
import { createRecipe } from "@/lib/recipes";

export async function createRecipeAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: membership, error: membershipErr } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single();

  if (membershipErr) {
    console.error("❌ membershipErr:", membershipErr);
    throw membershipErr;
  }

  if (!membership) {
    console.error("❌ No household found for:", user.id);
    throw new Error("No household found");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  try {
    await createRecipe({
      householdId: membership.household_id,
      createdBy: user.id,
      title,
      description,
    });
  } catch (err: any) {
    console.error("❌ SUPABASE INSERT ERROR:");
    console.error(JSON.stringify(err, null, 2));
    throw err;   // Important: rethrow the REAL error
  }
}