import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Mail, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiNotice } from "@/components/AiNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workspace — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A calm AI workspace for drafting emails, summarizing meeting notes, and planning your day.",
      },
      { property: "og:title", content: "Workspace — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "A calm AI workspace for drafting emails, summarizing meeting notes, and planning your day.",
      },
    ],
  }),
  component: Workspace,
});

const TOOLS = [
  {
    to: "/email-generator",
    icon: Mail,
    emoji: "📧",
    title: "Smart Email Generator",
    description:
      "Draft polished, on-tone business emails from a purpose and a few key points.",
    tone: "text-primary bg-primary-soft",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    emoji: "📝",
    title: "Meeting Notes Summarizer",
    description:
      "Turn raw notes into an executive summary, decisions, action items and deadlines.",
    tone: "text-emerald bg-emerald-soft",
  },
  {
    to: "/task-planner",
    icon: CalendarClock,
    emoji: "📅",
    title: "AI Task Planner",
    description:
      "Prioritise your tasks and get a realistic daily schedule around your working hours.",
    tone: "text-purple bg-purple-soft",
  },
] as const;

function Workspace() {
  return (
    <AppShell>
      <header className="mb-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Workspace</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Do your best work, faster.</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Three focused assistants for the parts of the day that slow you down. Pick a tool to
          begin.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, emoji, title, description, tone }) => (
          <article key={to} className="surface card-lift flex flex-col p-6">
            <span
              className={`grid size-11 place-items-center rounded-xl ${tone}`}
              aria-hidden
            >
              <Icon className="size-5" />
            </span>
            <h2 className="mt-5 text-lg">
              <span className="mr-2" aria-hidden>
                {emoji}
              </span>
              {title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <Link
              to={to}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-200 hover:gap-3 hover:shadow-lift"
            >
              Open Tool <ArrowRight className="size-4" />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <AiNotice />
      </div>
    </AppShell>
  );
}
