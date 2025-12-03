// app/inventory/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createInventoryItemAction(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Find the user's household via household_members
  const { data: membership, error: membershipErr } = await (await supabase)
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

  const householdId = membership.household_id;

  // Grab fields from the form
  const name = (formData.get("name") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  const category = (formData.get("category") as string | null)?.trim() || "uncategorized";
  const baseUnit = (formData.get("base_unit") as string | null)?.trim() || "unit";

  const quantityRaw = formData.get("quantity") as string | null;
  const minQuantityRaw = formData.get("min_quantity") as string | null;

  const quantity =
    quantityRaw && quantityRaw.length > 0 ? Number(quantityRaw) : 0;

  const min_quantity =
    minQuantityRaw && minQuantityRaw.length > 0
      ? Number(minQuantityRaw)
      : null;

  if (!name) {
    throw new Error("Name is required");
  }

  try {
    const { error: insertError } = await (await supabase).from("inventory_items").insert({
      household_id: householdId,
      name,
      description,
      quantity,
      min_quantity,
      base_unit: baseUnit,
      category,
      // preferred_unit_id, code, primary_vendor, avg_expiry_days can be null for now
    });

    if (insertError) {
      console.error("❌ SUPABASE INSERT ERROR (inventory_items):", insertError);
      throw insertError;
    }
  } catch (err) {
    console.error("❌ createInventoryItemAction error:", err);
    throw err;
  }

  // After creating, go back to inventory list
  redirect("/inventory");
}
