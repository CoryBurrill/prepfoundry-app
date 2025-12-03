// app/inventory/add/page.tsx
import { redirect } from "next/navigation";
import { getPageAccess } from "@/lib/access";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createInventoryItemAction } from "../actions";

export default async function AddInventoryPage() {
  const { user, canView, canUse } = await getPageAccess("inventory");

  if (!user) {
    redirect("/auth/login");
  }

  if (!canView || !canUse) {
    redirect("/inventory"); // or some "no access" message page
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Add pantry item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createInventoryItemAction} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Eggs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Optional details, brand, etc."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="quantity">Quantity on hand</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="min_quantity">Min stock (optional)</Label>
                  <Input
                    id="min_quantity"
                    name="min_quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="base_unit">Base unit</Label>
                  <Input
                    id="base_unit"
                    name="base_unit"
                    placeholder="e.g. piece, g, ml"
                    defaultValue="unit"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g. dairy, produce"
                    defaultValue="uncategorized"
                  />
                </div>
              </div>

            <div className="flex justify-end gap-2 pt-2">
            <Button asChild variant="outline">
                <a href="/inventory">Cancel</a>
            </Button>
            <Button type="submit">Save item</Button>
            </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
