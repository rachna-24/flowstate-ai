import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Eraser, Sparkles } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content: "Draft clear, professional business emails in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Draft clear, professional business emails in a formal, friendly or persuasive tone.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const call = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive">("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    setRecipient("");
    setSubject("");
    setPurpose("");
    setKeyPoints("");
    setTone("Formal");
    setOutput("");
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await call({ data: { recipient, subject, purpose, keyPoints, tone } });
      setOutput(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Write the email in one pass"
        description="Give the assistant the essentials and it will produce a ready-to-send draft in your chosen tone."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="surface space-y-4 p-5 sm:p-6">
          <Field label="Recipient" htmlFor="recipient">
            <input
              id="recipient"
              className={controlClass}
              placeholder="Priya Nair, Head of Operations"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </Field>

          <Field label="Subject" htmlFor="subject" optional>
            <input
              id="subject"
              className={controlClass}
              placeholder="Q3 rollout timeline"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Field>

          <Field label="Email Purpose" htmlFor="purpose">
            <textarea
              id="purpose"
              required
              rows={3}
              className={controlClass}
              placeholder="Ask for a one-week extension on the rollout deadline."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </Field>

          <Field label="Key Points" htmlFor="key-points" optional>
            <textarea
              id="key-points"
              rows={4}
              className={controlClass}
              placeholder={"One point per line\nVendor delay of three days\nQA still in progress"}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
          </Field>

          <Field label="Tone" htmlFor="tone">
            <select
              id="tone"
              className={controlClass}
              value={tone}
              onChange={(e) => setTone(e.target.value as typeof tone)}
            >
              <option>Formal</option>
              <option>Friendly</option>
              <option>Persuasive</option>
            </select>
          </Field>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <ActionButton type="submit" disabled={loading || !purpose.trim()}>
              <Sparkles className="size-4" /> Generate
            </ActionButton>
            <CopyButton value={output} />
            <ActionButton type="button" variant="ghost" onClick={clear}>
              <Eraser className="size-4" /> Clear
            </ActionButton>
          </div>
        </form>

        <OutputPanel
          title="Generated Email"
          loading={loading}
          error={error}
          value={output}
          placeholder="Your generated email will appear here."
        />
      </div>

      <div className="mt-6">
        <AiNotice />
      </div>
    </AppShell>
  );
}
