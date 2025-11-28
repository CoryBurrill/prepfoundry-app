import { createClient } from "@/lib/supabase/server";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // e.g. https://prepfoundry.app in prod
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // fallback
  return "https://prepfoundry.app";
}

export async function sendMagicLink(email: string) {
  const supabase = await createClient();
  const baseUrl = getBaseUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm`,
    },
  });

  if (error) throw error;
}