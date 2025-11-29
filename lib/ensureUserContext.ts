import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type EnsureUserContextResult = {
  user: any | null;
  profile: any | null;
  household: any | null;
};

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
      auth: {
        // Avoid PKCE "Auth session missing!" explosions – use implicit flow
        flowType: "implicit",
      },
    }
  );
}

export async function ensureUserContext(): Promise<EnsureUserContextResult> {
  const supabase = await getServerSupabase();

  // 1. Get current auth user (and gracefully handle missing session)
  let user: any | null = null;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // Treat "Auth session missing!" as simply "no user"
      if (
        error.name === "AuthSessionMissingError" ||
        error.message === "Auth session missing!"
      ) {
        return { user: null, profile: null, household: null };
      }

      // Anything else is a real error
      throw error;
    }

    user = data.user;
  } catch (err: any) {
    if (
      err?.name === "AuthSessionMissingError" ||
      err?.message === "Auth session missing!"
    ) {
      return { user: null, profile: null, household: null };
    }

    throw err;
  }

  if (!user) {
    return { user: null, profile: null, household: null };
  }

  // 2. Ensure profile exists
  const {
    data: existingProfile,
    error: profileSelectError,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileSelectError) throw profileSelectError;

  let profile: any = existingProfile;

  if (!profile) {
    const displayNameFromMeta =
      (user.user_metadata &&
        (user.user_metadata.full_name ||
          user.user_metadata.name ||
          user.user_metadata.display_name)) ||
      null;

    const fallbackName = user.email?.split("@")[0] || "New User";

    const {
      data: newProfile,
      error: insertProfileError,
    } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        display_name: displayNameFromMeta || fallbackName,
        full_name: displayNameFromMeta || null,
      })
      .select("*")
      .single();

    if (insertProfileError) throw insertProfileError;
    profile = newProfile;
  }

  // 3. Resolve / create default household
  let householdId: string | null =
    (profile.default_household_id as string | null) ?? null;
  let household: any | null = null;

  // 3a. Try existing default household_id on profile
  if (householdId) {
    const { data, error } = await supabase
      .from("households")
      .select("*")
      .eq("id", householdId)
      .maybeSingle();

    if (error) throw error;
    household = data ?? null;
  }

  // 3b. If none, try any household where this profile is owner
  if (!household) {
    const { data: owned, error: ownedError } = await supabase
      .from("households")
      .select("*")
      .eq("owner_id", profile.id)
      .order("created_at", { ascending: true })
      .limit(1);

    if (ownedError) throw ownedError;

    if (owned && owned.length > 0) {
      household = owned[0];
      householdId = household.id;
    }
  }

  // 3c. If still none, create a new household
  if (!household) {
    const householdName =
      (profile.display_name || profile.full_name || "").trim() ||
      "Home Kitchen";

    const {
      data: newHousehold,
      error: newHouseholdError,
    } = await supabase
      .from("households")
      .insert({
        name: `${householdName}'s Kitchen`,
        owner_id: profile.id,
      })
      .select("*")
      .single();

    if (newHouseholdError) throw newHouseholdError;

    household = newHousehold;
    householdId = household.id;
  }

  // 4. Ensure household_members row exists
  const {
    data: existingMember,
    error: memberSelectError,
  } = await supabase
    .from("household_members")
    .select("id, role, is_default")
    .eq("household_id", householdId!)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (memberSelectError) throw memberSelectError;

  if (!existingMember) {
    const { error: insertMemberError } = await supabase
      .from("household_members")
      .insert({
        household_id: householdId,
        user_id: profile.id,
        role: "owner",
        is_default: true,
      });

    if (insertMemberError) throw insertMemberError;
  } else if (!existingMember.is_default) {
    const { error: updateMemberError } = await supabase
      .from("household_members")
      .update({ is_default: true })
      .eq("id", existingMember.id);

    if (updateMemberError) throw updateMemberError;
  }

  // 5. Ensure profile.default_household_id is set correctly
  if (profile.default_household_id !== householdId) {
    const {
      data: updatedProfile,
      error: updateProfileError,
    } = await supabase
      .from("profiles")
      .update({ default_household_id: householdId })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (updateProfileError) throw updateProfileError;
    profile = updatedProfile;
  }

  return { user, profile, household };
}
