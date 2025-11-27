import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function WaitlistPage() {
  async function joinWaitlist(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const email = (formData.get("email") as string | null)?.trim();
    const name = (formData.get("name") as string | null)?.trim() ?? null;

    if (!email) {
      // In a real app, you'd return a form state instead of throwing
      throw new Error("Email is required");
    }

    await supabase.from("waitlist").insert({
      email,
      name,
      source: "landing",
    });

    // Simple thank-you redirect
    redirect("/waitlist/thanks");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-10">
        <h1 className="text-2xl font-semibold">Join the PrepFoundry beta</h1>
        <p className="text-sm text-slate-300">
          Drop your email and we&apos;ll invite you into the early versions of
          the app. No spam, no newsletter, just meaningful updates.
        </p>

        <form action={joinWaitlist} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-xs font-medium text-slate-200"
            >
              Name (optional)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="What should we call you?"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
          >
            Join waitlist
          </button>

          <p className="text-[11px] text-slate-500">
            By joining the waitlist you agree to receive occasional emails about
            the beta and launch. You can opt out anytime.
          </p>
        </form>
      </div>
    </main>
  );
}