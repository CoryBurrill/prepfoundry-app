// components/auth-button.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

type SupabaseUser = {
  id: string;
  email?: string;
  // add fields if you care later
};

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!cancelled) {
        if (error) {
          console.error("auth.getUser error:", error);
        }
        setUser(data?.user ?? null);
        setLoading(false);
      }
    };

    loadUser();

    // optional: listen to auth changes to keep it in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    // skeleton / placeholder while we figure out auth state
    return (
      <div className="flex gap-2">
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={logout}>
        Log out
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
