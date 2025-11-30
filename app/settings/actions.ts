// app/settings/actions.ts
"use server";

import { redirect } from "next/navigation";
import {
  updateUserProfile,
  updateUserEmail,
  getCurrentUserWithProfile,
} from "@/lib/user-settings";

/**
 * Update display name + avatar URL in profiles table
 */
export async function updateProfileAction(formData: FormData) {
  // make sure user is logged in
  const result = await getCurrentUserWithProfile();
  if (!result.ok || !result.data) {
    redirect("/auth/login");
  }

  const displayName = (formData.get("display_name") as string | null) ?? null;
  const avatarUrl = (formData.get("avatar_url") as string | null) ?? null;

  await updateUserProfile({
    displayName,
    avatarUrl,
  });

  // simple post-redirect to refresh data
  redirect("/settings");
}

/**
 * Update auth email via Supabase auth
 */
export async function updateEmailAction(formData: FormData) {
  const result = await getCurrentUserWithProfile();
  if (!result.ok || !result.data) {
    redirect("/auth/login");
  }

  const email = formData.get("email") as string;
  if (!email) {
    redirect("/settings");
  }

  await updateUserEmail(email);

  // You might want to show some "check your email" UI later
  redirect("/settings");
}
