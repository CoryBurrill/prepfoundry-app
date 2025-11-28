// app/auth/confirm/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `/auth/error?error=Missing+code+parameter`
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `/auth/error?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect("/dashboard");
}