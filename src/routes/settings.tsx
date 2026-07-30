import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Field, GlassCard, PageHeader, controlClass } from "@/components/tool-ui";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Buddy.AI" },
      {
        name: "description",
        content: "Manage your profile, AI preferences, notifications, accent colour and accessibility.",
      },
      { property: "og:title", content: "Settings — Buddy.AI" },
      { property: "og:description", content: "Tune Buddy.AI to the way you work." },
    ],
  }),
  component: SettingsPage,
});

const ACCENTS = [
  { key: "blue", label: "Electric Blue", className: "bg-primary" },
  { key: "purple", label: "Purple", className: "bg-purple" },
  { key: "cyan", label: "Cyan", className: "bg-cyan" },
  { key: "pink", label: "Pink", className: "bg-pink" },
] as const;

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 shrink-0 accent-[oklch(0.63_0.209_265)]"
      />
    </label>
  );
}

function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Settings"
        title="Make Buddy yours ⚙"
        description="Profile, AI defaults, notifications, appearance, accessibility and privacy — all in one place."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard lift={false} className="space-y-4">
          <h2 className="text-sm font-semibold text-cyan">Profile</h2>
          <Field label="Display name" htmlFor="name">
            <input
              id="name"
              className={controlClass}
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              type="email"
              className={controlClass}
              value={settings.email}
              onChange={(e) => updateSettings({ email: e.target.value })}
            />
          </Field>
        </GlassCard>

        <GlassCard lift={false} className="space-y-4">
          <h2 className="text-sm font-semibold text-cyan">AI preferences</h2>
          <Field label="Default email tone" htmlFor="tone">
            <select
              id="tone"
              className={controlClass}
              value={settings.tone}
              onChange={(e) => updateSettings({ tone: e.target.value as typeof settings.tone })}
            >
              {["Formal", "Friendly", "Persuasive"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Language" htmlFor="language">
            <select
              id="language"
              className={controlClass}
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
            >
              {["English", "Español", "Français", "Deutsch", "हिन्दी"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
        </GlassCard>

        <GlassCard lift={false} className="space-y-3">
          <h2 className="text-sm font-semibold text-cyan">Appearance</h2>
          <p className="text-xs text-muted-foreground">
            Buddy.AI is designed dark-first. Pick the accent that fits your vibe.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {ACCENTS.map((a) => (
              <button
                key={a.key}
                onClick={() => updateSettings({ accent: a.key })}
                aria-label={a.label}
                aria-pressed={settings.accent === a.key}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-all",
                  settings.accent === a.key
                    ? "border-primary/60 bg-primary/15 shadow-glow"
                    : "border-border hover:bg-white/5",
                )}
              >
                <span className={cn("size-3 rounded-full", a.className)} />
                {a.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard lift={false} className="space-y-3">
          <h2 className="text-sm font-semibold text-cyan">Notifications & accessibility</h2>
          <Toggle
            label="Notifications"
            description="Deadline reminders and daily summaries."
            checked={settings.notifications}
            onChange={(v) => updateSettings({ notifications: v })}
          />
          <Toggle
            label="Reduced motion"
            description="Minimise floating and fading animations."
            checked={settings.reducedMotion}
            onChange={(v) => updateSettings({ reducedMotion: v })}
          />
        </GlassCard>

        <GlassCard lift={false} className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-cyan">Privacy</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your tasks, chats and preferences are stored locally in this browser. Text you send to an
            assistant is processed by the AI provider to produce a response and is not used to train
            models. Clearing your browser data removes everything Buddy remembers.
          </p>
        </GlassCard>
      </div>
    </AppShell>
  );
}
