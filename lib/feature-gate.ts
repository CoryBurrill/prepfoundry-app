import { createClient } from "@/lib/supabase/server";

type FeatureGateResult = {
  allowed: boolean;
  reason:
    | "ok"
    | "unauthenticated"
    | "profile_missing"
    | "not_found"
    | "disabled"
    | "forbidden"
    | "error";
};

export async function featureGate(featureName: string): Promise<FeatureGateResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) return { allowed: false, reason: "error" };
  if (!user) return { allowed: false, reason: "unauthenticated" };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) return { allowed: false, reason: "error" };
  if (!profile) return { allowed: false, reason: "profile_missing" };

  const userRole = profile.role ?? "public";

  const { data: feature, error: featureError } = await supabase
    .from("feature_flags")
    .select("enabled, roles_allowed")
    .eq("name", featureName)
    .maybeSingle();

  if (featureError) return { allowed: false, reason: "error" };
  if (!feature) return { allowed: false, reason: "not_found" };

  if (!feature.enabled) return { allowed: false, reason: "disabled" };

  const roles: string[] = feature.roles_allowed ?? [];
  if (!roles.includes(userRole)) {
    return { allowed: false, reason: "forbidden" };
  }

  return { allowed: true, reason: "ok" };
}