import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function WaitlistThanksPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-10">
        <h1 className="text-2xl font-semibold">You&apos;re on the list ✅</h1>
        <p className="text-sm text-slate-300">
          Thanks for trusting us with your inbox. We&apos;ll reach out when the
          beta is ready and share some progress along the way.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
