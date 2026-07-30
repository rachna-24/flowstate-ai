import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, MessageSquare, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Field, GlassCard, PageHeader, controlClass } from "@/components/tool-ui";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Buddy.AI" },
      {
        name: "description",
        content: "Contact the Buddy.AI team, report an issue or share product feedback.",
      },
      { property: "og:title", content: "Support — Buddy.AI" },
      { property: "og:description", content: "We usually reply within one business day." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const email = useAppStore((s) => s.settings.email);
  const [topic, setTopic] = useState("Bug report");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Support"
        title="We've got your back 💬"
        description="Tell us what's happening and the team will follow up. Typical response time: one business day."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <GlassCard lift={false}>
          {sent ? (
            <div className="py-12 text-center">
              <p className="font-display text-lg">Message received 🎉</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ll reply to {email} shortly.
              </p>
              <ActionButton className="mt-5" variant="ghost" onClick={() => setSent(false)}>
                Send another
              </ActionButton>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!message.trim()) return;
                setSent(true);
                setMessage("");
              }}
            >
              <Field label="Topic" htmlFor="topic">
                <select
                  id="topic"
                  className={controlClass}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {["Bug report", "Feature request", "Billing", "Something else"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Message" htmlFor="message">
                <textarea
                  id="message"
                  rows={7}
                  required
                  className={controlClass}
                  placeholder="Describe what happened and what you expected…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Field>
              <ActionButton type="submit" disabled={!message.trim()}>
                <Send className="size-4" /> Send message
              </ActionButton>
            </form>
          )}
        </GlassCard>

        <div className="space-y-5">
          <GlassCard>
            <MessageSquare className="size-5 text-cyan" />
            <h2 className="mt-3 text-base">Live chat</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Weekdays 09:00–18:00. Average wait under 5 minutes.
            </p>
          </GlassCard>
          <GlassCard>
            <BookOpen className="size-5 text-pink" />
            <h2 className="mt-3 text-base">Documentation</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Step-by-step guides for every assistant, plus keyboard shortcuts.
            </p>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
