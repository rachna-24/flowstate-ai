import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AiNotice } from "@/components/AiNotice";
import { PageHeader } from "@/components/tool-ui";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "What the AI Workplace Productivity Assistant does, how it works, and how to use it responsibly.",
      },
      { property: "og:title", content: "About — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "What the AI Workplace Productivity Assistant does, how it works, and how to use it responsibly.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="About"
        title="Built for focused office work"
        description="A small set of assistants that remove the friction from writing, recording and planning."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {[
          { k: "3", label: "Focused tools", tone: "text-primary" },
          { k: "<10s", label: "Typical generation", tone: "text-emerald" },
          { k: "0", label: "Notes stored", tone: "text-purple" },
        ].map((s) => (
          <div key={s.label} className="surface p-6">
            <p className={`numeric text-3xl font-semibold ${s.tone}`}>{s.k}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="surface mt-6 space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          The AI Workplace Productivity Assistant brings three everyday tasks — drafting emails,
          summarizing meetings and planning work — into one calm, uncluttered interface.
        </p>
        <p>
          Everything runs on demand: your input is sent to the AI model only when you press a
          generate button, and outputs are never saved to a database.
        </p>
      </div>

      <div className="mt-6">
        <AiNotice />
      </div>
    </AppShell>
  );
}
