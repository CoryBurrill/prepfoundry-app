// lib/inventory.ts
import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { ensureUserContext } from "@/lib/ensureUserContext";

async function getServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component with no direct response headers.
          }
        },
      },
      auth: { flowType: "implicit" },
    }
  );
}

export type HouseholdPantryInventoryRow = {
  id: string;
  household_id: string;
  name: string;
  description: string | null;
  quantity: number;
  min_quantity: number | null;
  preferred_unit_code: string | null;
};

export async function getHouseholdPantryInventory(): Promise<
  HouseholdPantryInventoryRow[]
> {
  const { user, household } = await ensureUserContext();
  if (!user || !household) return [];

  const supabase = await getServerSupabase();

  // Base pantry items for this household
  const { data: pantryItems, error: pantryError } = await supabase
    .from("inventory_items")
    .select(
      `
      id,
      household_id,
      name,
      description,
      quantity,
      min_quantity,
      preferred_unit_id
    `
    )
    .eq("household_id", household.id);

  if (pantryError) throw pantryError;

  if (!pantryItems || pantryItems.length === 0) return [];

  // Map preferred_unit_id -> units.code
  const unitIds = Array.from(
    new Set(
      pantryItems
        .map((p) => p.preferred_unit_id as string | null)
        .filter(Boolean) as string[]
    )
  );

  const unitCodesById = new Map<string, string>();

  if (unitIds.length > 0) {
    const { data: units, error: unitsError } = await supabase
      .from("units")
      .select("id, code")
      .in("id", unitIds);

    if (unitsError) throw unitsError;

    (units ?? []).forEach((u) => {
      unitCodesById.set(u.id, u.code);
    });
  }

  // Final shape for the UI
  return pantryItems.map((p) => {
    const quantity = p.quantity !== null && p.quantity !== undefined
      ? Number(p.quantity)
      : 0;

    const min_quantity =
      p.min_quantity !== null && p.min_quantity !== undefined
        ? Number(p.min_quantity)
        : null;

    const preferred_unit_code = p.preferred_unit_id
      ? unitCodesById.get(p.preferred_unit_id) ?? null
      : null;

    return {
      id: p.id,
      household_id: p.household_id,
      name: p.name,
      description: p.description ?? null,
      quantity,
      min_quantity,
      preferred_unit_code,
    };
  });
}
