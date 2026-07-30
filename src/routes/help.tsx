import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, CheckSquare, Mail, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader } from "@/components/tool-ui";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Buddy.AI" },
      {
        name: "description",
        content: "Learn how each Buddy.AI assistant works, plus answers to common questions.",
      },
      { property: "og:title", content: "Help — Buddy.AI" },
      { property: "og:description", content: "Guides and FAQs for getting the most out of Buddy.AI." },
    ],
  }),
  component: HelpPage,
});

const GUIDES = [
  {
    to: "/email-generator",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Pick an email type, describe the purpose, add context, choose a tone. Then Improve, Shorten or Expand the draft.",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    title: "Meeting Note Summary",
    body: "Paste notes or upload a .txt file. Buddy returns a summary, action items, decisions, deadlines and follow-ups.",
  },
  {
    to: "/task-planner",
    icon: CheckSquare,
    title: "AI Task Planner",
    body: "Add tasks with priorities and due dates, drag to reorder, then ask Buddy to build a realistic daily schedule.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "Chat with Buddy",
    body: "Free-form assistant for planning, rewriting and quick answers. Use the suggested prompts to start fast.",
  },
];

const FAQ = [
  ["Is my data stored anywhere?", "Tasks, chats and settings live in your browser's local storage only."],
  ["Can Buddy read PDFs?", "PDF and DOCX support is coming; today you can upload .txt or paste the text directly."],
  ["Why does the answer differ each time?", "AI responses are generated fresh each run. Use Regenerate to explore alternatives."],
  ["How do I reset everything?", "Clear this site's browser data, or clear individual chats from the chat screen."],
];

function HelpPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Help"
        title="Get the most out of Buddy ❓"
        description="Short guides for each assistant and answers to the questions we hear most."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {GUIDES.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to}>
            <GlassCard className="h-full">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-cyan">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </GlassCard>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg">Frequently asked</h2>
      <div className="space-y-3">
        {FAQ.map(([q, a]) => (
          <details key={q} className="glass-panel px-5 py-4">
            <summary className="cursor-pointer text-sm font-medium">{q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </AppShell>
  );
}
