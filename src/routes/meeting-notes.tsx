import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Eraser, Sparkles, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  AiNotice,
  CopyButton,
  Field,
  GlassCard,
  PageHeader,
  controlClass,
} from "@/components/tool-ui";
import { summarizeNotes } from "@/lib/ai.functions";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Note Summary — Buddy.AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary, action items, decisions, deadlines and follow-up tasks.",
      },
      { property: "og:title", content: "Meeting Note Summary — Buddy.AI" },
      {
        property: "og:description",
        content: "Paste notes or upload a TXT file and let Buddy structure the outcome.",
      },
    ],
  }),
  component: MeetingNotes,
});

const SECTIONS = [
  "Meeting Summary",
  "Action Items",
  "Important Decisions",
  "Deadlines",
  "Follow-up Tasks",
];

/** Split Buddy's plain-text answer into per-section cards. */
function parseSections(text: string) {
  if (!text) return [];
  const result: { title: string; body: string }[] = [];
  const lines = text.split("\n");
  let current: { title: string; body: string } | null = null;

  for (const line of lines) {
    const clean = line.replace(/[#*:]/g, "").trim();
    const match = SECTIONS.find((s) => clean.toLowerCase() === s.toLowerCase());
    if (match) {
      if (current) result.push(current);
      current = { title: match, body: "" };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) result.push(current);
  return result.length ? result : [{ title: "Summary", body: text }];
}

function MeetingNotes() {
  const call = useServerFn(summarizeNotes);
  const track = useAppStore((s) => s.trackUse);
  const fileRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!/\.(txt|md|csv)$/i.test(file.name)) {
      setError("Buddy can read .txt files directly. For PDF or DOCX, paste the text instead.");
      return;
    }
    setError(null);
    setNotes(await file.text());
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await call({ data: { notes } });
      setOutput(res.text);
      track("Meeting Note Summary");
    } catch {
      setError("Buddy couldn't summarize those notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sections = parseSections(output);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Meeting Note Summary"
        title="From messy notes to clear outcomes 📝"
        description="Paste your notes or upload a text file. Buddy extracts the summary, decisions, deadlines and follow-ups."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="glass-panel space-y-4 p-5 sm:p-6">
          <Field label="Meeting notes" htmlFor="notes">
            <textarea
              id="notes"
              required
              rows={16}
              className={controlClass}
              placeholder="Paste raw notes, transcript fragments or bullet points…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>

          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,.pdf,.docx"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />

          <div className="flex flex-wrap gap-2">
            <ActionButton type="submit" disabled={loading || !notes.trim()}>
              <Sparkles className="size-4" /> Summarize
            </ActionButton>
            <ActionButton type="button" variant="ghost" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" /> Upload file
            </ActionButton>
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
          <AiNotice />
        </form>

        <div className="space-y-4" aria-live="polite">
          {loading && (
            <GlassCard lift={false} className="text-sm text-muted-foreground">
              Buddy is reading your notes…
            </GlassCard>
          )}
          {error && (
            <GlassCard lift={false} className="border-destructive/40 text-sm text-destructive">
              {error}
            </GlassCard>
          )}
          {!loading && !output && !error && (
            <GlassCard lift={false} className="flex min-h-[300px] items-center justify-center text-center text-sm text-muted-foreground">
              Your structured meeting breakdown will appear here.
            </GlassCard>
          )}
          {output && (
            <>
              <div className="flex justify-end">
                <CopyButton value={output} label="Copy all" />
              </div>
              {sections.map((section) => (
                <GlassCard key={section.title}>
                  <h2 className="text-sm font-semibold text-cyan">{section.title}</h2>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
                    {section.body.trim()}
                  </pre>
                </GlassCard>
              ))}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
