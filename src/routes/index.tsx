import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Flame,
  ListTodo,
  Quote,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";
import { AppShell, LiveClock } from "@/components/AppShell";
import { BuddyMascot } from "@/components/BuddyMascot";
import { AnimatedNumber, GlassCard, ProgressBar } from "@/components/tool-ui";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Buddy.AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Buddy.AI dashboard: live clock, productivity stats, AI usage analytics and quick access to every assistant.",
      },
      { property: "og:title", content: "Dashboard — Buddy.AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Buddy.AI dashboard: live clock, productivity stats, AI usage analytics and quick access to every assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const QUOTES = [
  "Locked in. No distractions.",
  "Discipline beats motivation.",
  "Small wins become big victories.",
  "Your future self will thank you.",
  "Stay consistent.",
  "Progress over perfection.",
];

const INSIGHTS = [
  "You completed 84% of your weekly goals.",
  "Tuesday is your most productive day.",
  "You saved 4.2 hours using AI this week.",
  "You are improving every week.",
];

function QuoteCard() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 16000);
    return () => clearInterval(id);
  }, []);

  return (
    <GlassCard className="flex items-start gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-pink/15 text-pink">
        <Quote className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Daily fuel</p>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-1 font-display text-lg"
        >
          “{QUOTES[index]}”
        </motion.p>
      </div>
    </GlassCard>
  );
}

function Dashboard() {
  const tasks = useAppStore((s) => s.tasks);
  const aiRequests = useAppStore((s) => s.aiRequests);
  const focusMinutes = useAppStore((s) => s.focusMinutes);

  const completed = tasks.filter((t) => t.done).length;
  const pending = tasks.length - completed;
  const score = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const stats = [
    { icon: ListTodo, label: "Today's Tasks", value: tasks.length, desc: "in your planner", tone: "primary", pct: 100 },
    { icon: CheckCircle2, label: "Completed", value: completed, desc: "well done", tone: "emerald", pct: score },
    { icon: Clock, label: "Pending", value: pending, desc: "still open", tone: "amber", pct: 100 - score },
    { icon: Timer, label: "Focus Time", value: focusMinutes, desc: "minutes today", suffix: "m", tone: "cyan", pct: Math.min(100, (focusMinutes / 240) * 100) },
    { icon: Sparkles, label: "AI Requests", value: aiRequests, desc: "today", tone: "pink", pct: Math.min(100, aiRequests * 4) },
    { icon: TrendingUp, label: "Productivity Score", value: score, desc: "of goals met", suffix: "%", tone: "primary", pct: score },
  ];

  const shortcuts = [
    { to: "/email-generator", label: "Generate Email", icon: Sparkles },
    { to: "/meeting-notes", label: "Summarize Notes", icon: ListTodo },
    { to: "/task-planner", label: "Plan My Day", icon: Flame },
    { to: "/chat", label: "Chat with Buddy", icon: Bot },
  ];

  return (
    <AppShell>
      {/* Hero */}
      <section className="glass-panel mb-6 grid grid-cols-1 items-center gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 items-center gap-5">
          <BuddyMascot size={76} mood="wave" />
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl">Welcome, Future Successful Individual! 👋</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Let&apos;s make today ridiculously productive.
            </p>
          </div>
        </div>
        <LiveClock stacked />
      </section>

      <div className="mb-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <QuoteCard />
        <GlassCard className="flex flex-wrap items-center gap-2">
          {shortcuts.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2 text-xs font-medium transition-all hover:border-primary/50 hover:bg-primary/10"
            >
              <Icon className="size-4 text-cyan" />
              {label}
            </Link>
          ))}
        </GlassCard>
      </div>

      {/* Productivity cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ icon: Icon, label, value, desc, tone, pct, suffix }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
          >
            <GlassCard>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-cyan">
                  <Icon className="size-5" />
                </span>
                <p className="numeric text-3xl font-semibold">
                  <AnimatedNumber value={value} suffix={suffix ?? ""} />
                </p>
              </div>
              <p className="mt-4 text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
              <div className="mt-4">
                <ProgressBar value={pct} tone={tone} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Buddy insights */}
      <h2 className="mb-4 mt-10 text-lg">Buddy Insights</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {INSIGHTS.map((insight, i) => (
          <motion.div
            key={insight}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.07 }}
          >
            <GlassCard className="h-full">
              <Sparkles className="size-4 text-pink" />
              <p className="mt-3 text-sm leading-relaxed">{insight}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <Link
        to="/analytics"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan hover:underline"
      >
        View full AI analytics <ArrowRight className="size-4" />
      </Link>
    </AppShell>
  );
}
