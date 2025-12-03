"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("feedback").insert({
      user_id: user?.id ?? null,
      title,
      body,
    });

    setLoading(false);
    setSent(true);
    setTitle("");
    setBody("");
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      {!sent && (
        <>
          <h1 className="text-xl font-semibold mb-4">Send Feedback</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Have an idea, bug report, or suggestion? I’m listening.
          </p>

          <form onSubmit={submitFeedback} className="space-y-4">
            <Input
              placeholder="Title (quick summary)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Textarea
              placeholder="Tell me what's on your mind..."
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit Feedback"}
            </Button>
          </form>
        </>
      )}

      {sent && (
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Thank you!</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your feedback helps shape what's coming next.
          </p>
          <Button onClick={() => router.push("/dashboard")}>Back to app</Button>
        </div>
      )}
    </div>
  );
}
