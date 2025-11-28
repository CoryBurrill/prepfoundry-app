// app/dashboard/_components/inventory-panel.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal } from "lucide-react";

type InventoryLocation = "fridge" | "freezer" | "pantry" | "other";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: InventoryLocation;
  expiresAt?: string | null; // ISO date string
};

const MOCK_ITEMS: InventoryItem[] = [
  {
    id: 1,
    name: "Chicken Breast",
    category: "Protein",
    quantity: 2,
    unit: "lb",
    location: "freezer",
    expiresAt: "2025-12-15",
  },
  {
    id: 2,
    name: "Greek Yogurt",
    category: "Dairy",
    quantity: 1,
    unit: "tub",
    location: "fridge",
    expiresAt: "2025-12-05",
  },
  {
    id: 3,
    name: "Brown Rice",
    category: "Grains",
    quantity: 5,
    unit: "cup",
    location: "pantry",
    expiresAt: null,
  },
];

const LOCATION_LABELS: Record<InventoryLocation, string> = {
  fridge: "Fridge",
  freezer: "Freezer",
  pantry: "Pantry",
  other: "Other",
};

type ItemFormState = {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  location: InventoryLocation;
  expiresAt: string;
};

const emptyForm: ItemFormState = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  location: "fridge",
  expiresAt: "",
};

export function InventoryPanel() {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<InventoryLocation | "all">("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<ItemFormState>(emptyForm);

  const nextId = useMemo(
    () => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1),
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        locationFilter === "all" ? true : item.location === locationFilter;

      return matchesSearch && matchesLocation;
    });
  }, [items, search, locationFilter]);

  function openCreateDialog() {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(item: InventoryItem) {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      quantity: String(item.quantity),
      unit: item.unit,
      location: item.location,
      expiresAt: item.expiresAt ?? "",
    });
    setDialogOpen(true);
  }

  function handleFormChange<K extends keyof ItemFormState>(
    key: K,
    value: ItemFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const quantityNumber = Number(form.quantity || 0);

    if (!form.name.trim()) return;
    if (!quantityNumber || quantityNumber < 0) return;

    const base: Omit<InventoryItem, "id"> = {
      name: form.name.trim(),
      category: form.category.trim() || "Uncategorized",
      quantity: quantityNumber,
      unit: form.unit.trim() || "unit",
      location: form.location,
      expiresAt: form.expiresAt || null,
    };

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...base } : item
        )
      );
    } else {
      setItems((prev) => [...prev, { id: nextId, ...base }]);
    }

    setDialogOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm("Remove this item from inventory?");
    if (!confirmed) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function getExpiryBadge(item: InventoryItem) {
    if (!item.expiresAt) return null;
    const today = new Date();
    const exp = new Date(item.expiresAt);
    const diff = exp.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let tone: "danger" | "warn" | "ok";
    if (days < 0) tone = "danger";
    else if (days <= 3) tone = "warn";
    else tone = "ok";

    const label =
      days < 0 ? "Expired" : days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"}`;

    const className =
      tone === "danger"
        ? "bg-destructive/10 text-destructive border-destructive/40"
        : tone === "warn"
        ? "bg-amber-500/10 text-amber-600 border-amber-500/40"
        : "bg-emerald-500/10 text-emerald-700 border-emerald-500/40";

    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  }

  return (
    <Card className="border-muted/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base sm:text-lg">Inventory</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Track what&apos;s in your kitchen so recipes and grocery lists can stay smart.
          </CardDescription>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add item</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit inventory item" : "Add inventory item"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Name</label>
                <Input
                  autoFocus
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="e.g. Chicken breast"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Category</label>
                  <Input
                    value={form.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    placeholder="Protein, Produce, Snacks…"
                  />
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Quantity</label>
                    <Input
                      type="number"
                      min={0}
                      step="0.1"
                      value={form.quantity}
                      onChange={(e) => handleFormChange("quantity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Unit</label>
                    <Input
                      value={form.unit}
                      onChange={(e) => handleFormChange("unit", e.target.value)}
                      placeholder="lb, oz, cup…"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Location</label>
                  <Select
                    value={form.location}
                    onValueChange={(value: string) =>
                      handleFormChange("location", value as InventoryLocation)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fridge">Fridge</SelectItem>
                      <SelectItem value="freezer">Freezer</SelectItem>
                      <SelectItem value="pantry">Pantry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Expires on</label>
                  <Input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => handleFormChange("expiresAt", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingItem(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={handleSave}>
                  {editingItem ? "Save changes" : "Add item"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search by name or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={locationFilter}
              onValueChange={(value: string) =>
                setLocationFilter(value as InventoryLocation | "all")
              }
            >
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All spots</SelectItem>
                <SelectItem value="fridge">Fridge</SelectItem>
                <SelectItem value="freezer">Freezer</SelectItem>
                <SelectItem value="pantry">Pantry</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border bg-card/40">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%]">Item</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="w-[18%]">Quantity</TableHead>
                <TableHead className="hidden sm:table-cell w-[14%]">
                  Location
                </TableHead>
                <TableHead className="w-[14%]">Expires</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-16 text-center text-xs text-muted-foreground"
                  >
                    No items match your filters. Try adding something or clearing search.
                  </TableCell>
                </TableRow>
              )}

              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium">
                    {item.name}
                    <div className="sm:hidden text-[11px] text-muted-foreground mt-0.5">
                      {item.category || "Uncategorized"} •{" "}
                      {LOCATION_LABELS[item.location]}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {item.category || "Uncategorized"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs">
                    <Badge variant="outline" className="text-[11px]">
                      {LOCATION_LABELS[item.location]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {getExpiryBadge(item) ?? (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
