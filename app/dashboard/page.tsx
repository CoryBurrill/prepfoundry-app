// app/dashboard/page.tsx
import { InventoryPanel } from "./components/inventory-panel";
import { ensureUserContext } from "@/lib/ensureUserContext";
import { featureGate } from "@/lib/feature-gate";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function DashboardContent() {
  const { user, profile, household } = await ensureUserContext();

  if (!user) {
    redirect("/auth/login");
  }

  // Call featureGate once per feature
  const betaGate = await featureGate("beta_public_dashboard");
  const privateGate = await featureGate("beta_private_extras");

  const hasPublicBeta = betaGate.allowed;
  const hasPrivateExtras = privateGate.allowed;

  if (!hasPublicBeta) {
    // Logged in, but not in any beta
    return (
      <main className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">You’re in! (Sort of)</h1>
        <p className="text-sm text-muted-foreground">
          Thanks for signing up, {profile?.display_name ?? "friend"}.
          We’re rolling out the beta in waves. You don’t have access yet,
          but you’re on the list.
        </p>
        <p className="text-sm text-muted-foreground">
          If you think this is a mistake, message me and I’ll flip your role in the beta.
        </p>
      </main>
    );
  }

  // Has at least public beta access
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}.
        </p>
        <p className="text-xs text-muted-foreground">
          Household: {household?.name ?? "No household"}.
        </p>
      </header>

      {/* Core beta features available to beta_public / beta_private / admin */}
      <section className="border rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-medium">Inventory & Recipes</h2>
        <p className="text-sm text-muted-foreground">
          This section is visible to public beta users.
        </p>
        {/* TODO: inventory CRUD, recipe list, etc. */}
      </section>

      {/* Extra toys for private beta only */}
      {hasPrivateExtras && (
        <section className="border rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-medium">Private Beta Experiments</h2>
          <p className="text-sm text-muted-foreground">
            This is only visible to close friends/family (beta_private) and admin.
          </p>

            <InventoryPanel />
            
        </section>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
