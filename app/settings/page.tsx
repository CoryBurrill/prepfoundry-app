// app/settings/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getPageAccess } from "@/lib/access";
import {
  getCurrentUserWithProfile,
  type AppUserProfile,
} from "@/lib/user-settings";
import { updateProfileAction, updateEmailAction } from "./actions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// ✅ Sync shell – no data fetching here
export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading settings…
            </div>
          }
        >
          <SettingsContent />
        </Suspense>
      </div>
    </main>
  );
}

// ✅ All dynamic stuff lives here, behind Suspense
async function SettingsContent() {
  const { user, canView, canUse } = await getPageAccess("settings");

  if (!user) redirect("/auth/login");

  if (!canView) {
    return (
      <main className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Settings are locked (for now)</h1>
        <p className="text-sm text-muted-foreground">
          Your account is active, but the settings page isn&apos;t unlocked for
          your beta tier yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Message me if you need access for testing.
        </p>
      </main>
    );
  }

  const result = await getCurrentUserWithProfile();
  if (!result.ok || !result.data) {
    redirect("/auth/login");
  }

  const profile = result.data as AppUserProfile;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and account for PrepFoundry.
        </p>
        {!canUse && (
          <p className="text-xs text-amber-500">
            You can view your settings, but edits are disabled for this beta
            tier.
          </p>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Profile card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile</CardTitle>
            <CardDescription className="text-xs">
              This is how you&apos;ll show up across the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="display_name">Display name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  defaultValue={profile.displayName ?? ""}
                  placeholder="Your name"
                  disabled={!canUse}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  defaultValue={profile.avatarUrl ?? ""}
                  placeholder="https://..."
                  disabled={!canUse}
                />
                <p className="text-[11px] text-muted-foreground">
                  Later this can be a full upload flow. For now, paste an image
                  URL.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={!canUse}>
                  Save profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Account</CardTitle>
            <CardDescription className="text-xs">
              Manage your login email and account metadata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={updateEmailAction} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  disabled={!canUse}
                />
                <p className="text-[11px] text-muted-foreground">
                  Changing your email may require confirmation via Supabase.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  disabled={!canUse}
                >
                  Update email
                </Button>
              </div>
            </form>

            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Role:</span>{" "}
                {profile.role ?? "—"}
              </div>
              <div>
                <span className="font-medium">Household:</span>{" "}
                {profile.householdId ?? "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
