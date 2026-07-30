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
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into an executive summary, key decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Turn raw meeting notes into an executive summary, key decisions, action items and deadlines.",
      },
    ],
  }),
  component: MeetingNotes;
});

function MeetingNotes() {
  const call = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await call({ data: { notes } });
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
        eyebrow="Meeting Notes Summarizer"
        title="From messy notes to a clear record"
        description="Paste anything you captured during the meeting — the assistant structures it into a summary you can share."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="surface space-y-4 p-5 sm:p-6">
          <Field label="Meeting Notes" htmlFor="notes">
            <textarea
              id="notes"
              required
              rows={16}
              className={controlClass}
              placeholder="Paste your raw meeting notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>

          <div className="flex flex-wrap gap-2.5">
            <ActionButton type="submit" disabled={loading || !notes.trim()}>
              <Sparkles className="size-4" /> Summarize
            </ActionButton>
            <CopyButton value={output} />
            <ActionButton
              type="button"
              variant="ghost"
              onClick={() => {
                setNotes("");
                setOutput("");
                setError(null);
              }}
            >
              <Eraser className="size-4" /> Clear
            </ActionButton>
          </div>
        </form>

        <OutputPanel
          title="AI Summary"
          loading={loading}
          error={error}
          value={output}
          placeholder="Executive summary, key decisions, action items and deadlines will appear here."
        />
      </div>

      <div className="mt-6">
        <AiNotice />
      </div>
    </AppShell>
  );
}
