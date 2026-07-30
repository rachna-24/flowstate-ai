import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Eraser, RefreshCw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  AiNotice,
  CopyButton,
  Field,
  OutputPanel,
  PageHeader,
  controlClass,
} from "@/components/tool-ui";
import { generateEmail, refineEmail } from "@/lib/ai.functions";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Buddy.AI" },
      {
        name: "description",
        content:
          "Generate professional, follow-up, apology, thank-you and meeting invitation emails with Buddy.AI.",
      },
      { property: "og:title", content: "Smart Email Generator — Buddy.AI" },
      {
        property: "og:description",
        content: "Draft polished business emails in seconds, then improve, shorten or expand them.",
      },
    ],
  }),
  component: EmailGenerator,
});

const TYPES = [
  "Professional email",
  "Follow-up email",
  "Leave request",
  "Apology email",
  "Meeting invitation",
  "Thank-you email",
] as const;

const TONES = ["Formal", "Friendly", "Persuasive", "Apologetic", "Enthusiastic"] as const;

function EmailGenerator() {
  const call = useServerFn(generateEmail);
  const refine = useServerFn(refineEmail);
  const track = useAppStore((s) => s.trackUse);

  const [recipient, setRecipient] = useState("");
  const [type, setType] = useState<string>(TYPES[0]);
  const [purpose, setPurpose] = useState("");
  const [extra, setExtra] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    setRecipient("");
    setPurpose("");
    setExtra("");
    setOutput("");
    setError(null);
  };

  const generate = async () => {
    if (!purpose.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await call({ data: { recipient, purpose, type, extra, tone } });
      setOutput(res.text);
      track("Smart Email Generator");
    } catch {
      setError("Buddy couldn't generate that email. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const applyRefine = async (action: "Improve" | "Shorten" | "Expand") => {
    if (!output) return;
    setLoading(true);
    setError(null);
    try {
      const res = await refine({ data: { text: output, action } });
      setOutput(res.text);
      track("Smart Email Generator");
    } catch {
      setError("Buddy couldn't revise that email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Write the email in seconds 📧"
        description="Tell Buddy who it's for and what it's about. Then refine the draft until it sounds exactly like you."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
          className="glass-panel space-y-4 p-5 sm:p-6"
        >
          <Field label="Email type" htmlFor="type">
            <select id="type" className={controlClass} value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Recipient" htmlFor="recipient" optional>
            <input
              id="recipient"
              className={controlClass}
              placeholder="Maya, Head of Partnerships"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </Field>

          <Field label="Purpose" htmlFor="purpose">
            <textarea
              id="purpose"
              required
              rows={3}
              className={controlClass}
              placeholder="Ask for a two-day extension on the Q3 report."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </Field>

          <Field label="Additional information" htmlFor="extra" optional>
            <textarea
              id="extra"
              rows={4}
              className={controlClass}
              placeholder="Data from the vendor arrived late; draft is 80% complete."
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
            />
          </Field>

          <Field label="Tone" htmlFor="tone">
            <select
              id="tone"
              className={controlClass}
              value={tone}
              onChange={(e) => setTone(e.target.value as (typeof TONES)[number])}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex flex-wrap gap-2 pt-1">
            <ActionButton type="submit" disabled={loading || !purpose.trim()}>
              <Sparkles className="size-4" /> Generate
            </ActionButton>
            <ActionButton type="button" variant="ghost" onClick={clear}>
              <Eraser className="size-4" /> Clear
            </ActionButton>
          </div>
          <AiNotice />
        </form>

        <div className="space-y-4">
          <OutputPanel
            title="Generated email"
            loading={loading}
            error={error}
            value={output}
            placeholder="Your polished email will appear here."
            actions={output ? <CopyButton value={output} /> : null}
          />
          {output && (
            <div className="flex flex-wrap gap-2">
              <ActionButton variant="ghost" disabled={loading} onClick={() => void generate()}>
                <RefreshCw className="size-4" /> Regenerate
              </ActionButton>
              <ActionButton variant="ghost" disabled={loading} onClick={() => void applyRefine("Improve")}>
                Improve
              </ActionButton>
              <ActionButton variant="ghost" disabled={loading} onClick={() => void applyRefine("Shorten")}>
                Shorten
              </ActionButton>
              <ActionButton variant="ghost" disabled={loading} onClick={() => void applyRefine("Expand")}>
                Expand
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
