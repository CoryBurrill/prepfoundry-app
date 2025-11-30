import { createClient } from "@/lib/supabase/server";

export type AppUserProfile = {
  userId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string | null;
  householdId: string | null; // from default_household_id
};

export type SettingsResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type ProfileRow = {
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
  default_household_id: string | null;
};

/**
 * Get current auth user + profile row (if it exists).
 */
export async function getCurrentUserWithProfile(): Promise<
  SettingsResult<AppUserProfile | null>
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("[getCurrentUserWithProfile] auth error", userError);
    return { ok: false, error: "auth_error" };
  }

  if (!user) {
    return { ok: true, data: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, role, default_household_id")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    console.warn(
      "[getCurrentUserWithProfile] profile error (continuing with empty profile)",
      profileError
    );
  }

  const result: AppUserProfile = {
    userId: user.id,
    email: user.email ?? "",
    displayName: profile?.display_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    role: profile?.role ?? null,
    householdId: profile?.default_household_id ?? null,
  };

  return { ok: true, data: result };
}

/**
 * Update profile fields stored in `profiles`.
 */
export type UpdateProfileInput = {
  displayName?: string | null;
  avatarUrl?: string | null;
};

export async function updateUserProfile(
  input: UpdateProfileInput
): Promise<SettingsResult<AppUserProfile>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[updateUserProfile] auth error", userError);
    return { ok: false, error: "unauthorized" };
  }

  const updates: Record<string, any> = {};
  if (input.displayName !== undefined) {
    updates.display_name = input.displayName;
  }
  if (input.avatarUrl !== undefined) {
    updates.avatar_url = input.avatarUrl;
  }

  if (Object.keys(updates).length === 0) {
    return { ok: false, error: "no_updates" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("display_name, avatar_url, role, default_household_id")
    .maybeSingle<ProfileRow>();

  if (error || !data) {
    console.error("[updateUserProfile] update error", error);
    return { ok: false, error: "update_failed" };
  }

  const result: AppUserProfile = {
    userId: user.id,
    email: user.email ?? "",
    displayName: data.display_name ?? null,
    avatarUrl: data.avatar_url ?? null,
    role: data.role ?? null,
    householdId: data.default_household_id ?? null,
  };

  return { ok: true, data: result };
}

/**
 * Update auth email via Supabase.
 */
export async function updateUserEmail(
  newEmail: string
): Promise<SettingsResult<null>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[updateUserEmail] auth error", userError);
    return { ok: false, error: "unauthorized" };
  }

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    console.error("[updateUserEmail] update error", error);
    return { ok: false, error: "email_update_failed" };
  }

  return { ok: true, data: null };
}