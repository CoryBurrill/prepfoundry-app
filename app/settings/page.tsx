// app/settings/page.tsx
import { redirect } from "next/navigation";
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
import { GatedButton } from "@/components/gated-button";

export default async function SettingsPage() {
  const result = await getCurrentUserWithProfile();

  if (!result.ok) {
    redirect("/auth/login");
  }

  if (!result.data) {
    redirect("/auth/login");
  }

  const profile = result.data as AppUserProfile;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:px-0">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile and account for PrepFoundry.
          </p>
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
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="avatar_url">Favorite Video</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    defaultValue={profile.avatarUrl ?? ""}
                    placeholder="https://..."
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This is a test url spot that will be upgraded to 
                    "profile photo" in the near future. 
                  </p>
                </div>

                <div className="flex justify-end">
                  <GatedButton type="submit" size="sm" canUse={false}>
                    Save profile
                  </GatedButton>
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
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Changing your email may require confirmation via Supabase.
                  </p>
                </div>

                <div className="flex justify-end">
                  <GatedButton type="submit" size="sm" variant="outline" canUse={false}>
                    Update email
                  </GatedButton>
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
    </main>
  );
}
