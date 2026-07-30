import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AiNotice } from "@/components/AiNotice";
import { PageHeader } from "@/components/tool-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Assistant" },
      {
        name: "description",
        content: "Manage workspace preferences, default tone and notification behaviour.",
      },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Manage workspace preferences, default tone and notification behaviour.",
      },
    ],
  }),
  component: SettingsPage,
});

const PREFS = [
  { id: "tone", label: "Default email tone", hint: "Applied when you open the email generator." },
  { id: "notifications", label: "Desktop notifications", hint: "Alert me when output is ready." },
  { id: "compact", label: "Compact spacing", hint: "Tighter layout for smaller displays." },
];

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Settings"
        title="Workspace preferences"
        description="Lightweight controls for how the assistant behaves day to day."
      />

      <div className="space-y-4">
        {PREFS.map((pref) => (
          <div
            key={pref.id}
            className="surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{pref.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{pref.hint}</p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-soft px-3 py-1 text-xs font-medium text-emerald">
              Enabled
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <AiNotice />
      </div>
    </AppShell>
  );
}
