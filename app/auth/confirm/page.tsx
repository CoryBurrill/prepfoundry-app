// app/auth/confirm/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface ConfirmPageProps {
  searchParams: { code?: string };
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const code = searchParams.code;

  if (!code) {
    redirect("/auth/error?error=Missing+code+parameter");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code!) ;

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}