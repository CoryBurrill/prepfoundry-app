// app/inventory/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getHouseholdPantryInventory } from "@/lib/inventory";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { GatedButton } from "@/components/gated-button";
import { Separator } from "@/components/ui/separator";
import { Package, PlusCircle } from "lucide-react";
import { getPageAccess } from "@/lib/access";

export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading inventory…
            </div>
          }
        >
          <InventoryContent />
        </Suspense>
      </div>
    </main>
  );
}

async function InventoryContent() {
  const { user, profile, household, canView, canUse, isAdmin} =
    await getPageAccess("inventory");

  if (!user) {
    redirect("/auth/login");
  }

  if (!canView) {
    return (
      <main className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">You’re in! (Sort of)</h1>
        <p className="text-sm text-muted-foreground">
          Thanks for signing up, {profile?.display_name ?? "friend"}. We’re
          rolling out access in waves. Your account doesn&apos;t have inventory
          access yet.
        </p>
        <p className="text-sm text-muted-foreground">
          If you think this is a mistake, message me and I’ll flip your role in
          the beta.
        </p>
      </main>
    );
  }

  // Real inventory query
  const items = await getHouseholdPantryInventory();
  const hasItems = items.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">
          Household pantry items
        </CardTitle>
        {/* Optional: quick add button later */}
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasItems ? (
          <EmptyInventoryState householdName={household?.name ?? null} canUse={canUse} href="/inventory/add" />
        ) : (
          <InventoryTable items={items} />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyInventoryState({
  householdName,
  canUse,
  href,
}: {
  householdName: string | null;
  canUse: boolean;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/40 px-6 py-10 text-center">
      <Package className="h-8 w-8 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">No pantry items yet</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Start by adding a few staples for{" "}
          {householdName ?? "this household"}. As you log quantities or scan
          receipts, we&apos;ll track balances for each location.
        </p>
      </div>
      <GatedButton size="sm" variant="outline" canUse={canUse} href={href}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add first item
      </GatedButton>
    </div>
  );
}

type InventoryTableProps = {
  items: Awaited<ReturnType<typeof getHouseholdPantryInventory>>;
};

function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-muted px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span>Item</span>
        <span className="text-right">On hand</span>
        <span className="text-right">Min stock</span>
        <span className="text-right">Reorder</span>
      </div>
      <Separator />
      <div className="divide-y">
        {items.map((item) => (
          <InventoryRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

type Row = Awaited<ReturnType<typeof getHouseholdPantryInventory>>[number];

function InventoryRow({ item }: { item: Row }) {
  const unit = item.preferred_unit_code ?? "";
  const qty = item.quantity;
  const min = item.min_quantity ?? 0;

  // For now, reuse min as reorder; later you can add a dedicated field
  const reorder = min;

  const isLow = qty <= min && (min > 0 || reorder > 0);

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-3 py-2.5 text-sm">
      <div className="flex flex-col">
        <span className="text-xs font-medium flex items-center gap-1">
          {item.name}
        </span>
        {item.description && (
          <span className="text-[11px] text-muted-foreground">
            {item.description}
          </span>
        )}
      </div>

      <span className="text-right text-xs">
        {qty.toLocaleString()}
        {unit && ` ${unit}`}
        {isLow && (
          <span className="ml-1 text-[11px] font-medium text-amber-500">
            low
          </span>
        )}
      </span>

      <span className="text-right text-xs">
        {min > 0 ? `${min}${unit ? ` ${unit}` : ""}` : "—"}
      </span>

      <span className="text-right text-xs">
        {reorder > 0 ? `${reorder}${unit ? ` ${unit}` : ""}` : "—"}
      </span>
    </div>
  );
}
