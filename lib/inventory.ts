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
  name: string;
  emoji: string | null;
  min_stock_quantity: number | null;
  reorder_quantity: number | null;
  preferred_unit_code: string | null;
  total_quantity: number;
};

export async function getHouseholdPantryInventory(id: any): Promise<
  HouseholdPantryInventoryRow[]
> {
  const { user, household } = await ensureUserContext();
  if (!user || !household) return [];

  const supabase = await getServerSupabase();

  // 1) base pantry items for this household
  const { data: pantryItems, error: pantryError } = await supabase
    .from("household_pantry_items")
    .select(
      "id, name, emoji, min_stock_quantity, reorder_quantity, preferred_unit_id, sort_order"
    )
    .eq("household_id", household.id)
    .order("sort_order", { ascending: true });

  if (pantryError) throw pantryError;

  const pantryIds = pantryItems?.map((p: any) => p.id) ?? [];

  // 2) aggregate balances per pantry item
  const balancesByPantryId = new Map<string, number>();

  if (pantryIds.length > 0) {
    const { data: balances, error: balancesError } = await supabase
      .from("inventory_balances")
      .select("household_pantry_item_id, quantity")
      .eq("household_id", household.id)
      .in("household_pantry_item_id", pantryIds);

    if (balancesError) throw balancesError;

    (balances ?? []).forEach((row: any) => {
      const id = row.household_pantry_item_id;
      const q = Number(row.quantity ?? 0);
      balancesByPantryId.set(id, (balancesByPantryId.get(id) ?? 0) + q);
    });
  }

  // 3) map preferred_unit_id -> units.code
  const unitIds = Array.from(
    new Set(
      (pantryItems ?? [])
        .map((p: any) => p.preferred_unit_id)
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

    (units ?? []).forEach((u: any) => {
      unitCodesById.set(u.id, u.code);
    });
  }

  // 4) final shape for the UI
  return (pantryItems ?? []).map((p: any) => {
    const total = balancesByPantryId.get(p.id) ?? 0;
    const unitCode = p.preferred_unit_id
      ? unitCodesById.get(p.preferred_unit_id) ?? null
      : null;

    return {
      id: p.id,
      name: p.name,
      emoji: p.emoji ?? null,
      min_stock_quantity:
        p.min_stock_quantity !== null && p.min_stock_quantity !== undefined
          ? Number(p.min_stock_quantity)
          : null,
      reorder_quantity:
        p.reorder_quantity !== null && p.reorder_quantity !== undefined
          ? Number(p.reorder_quantity)
          : null,
      preferred_unit_code: unitCode,
      total_quantity: total,
    };
  });
}
