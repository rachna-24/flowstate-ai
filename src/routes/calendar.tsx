import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader } from "@/components/tool-ui";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Buddy.AI" },
      {
        name: "description",
        content: "Monthly calendar with task deadlines, meetings and reminders in one glass view.",
      },
      { property: "og:title", content: "Calendar — Buddy.AI" },
      {
        property: "og:description",
        content: "See today, upcoming meetings and every task deadline at a glance.",
      },
    ],
  }),
  component: CalendarPage,
});

const MEETINGS = [
  { title: "Product sync", time: "10:00", offset: 0 },
  { title: "1:1 with Maya", time: "14:30", offset: 1 },
  { title: "Sprint review", time: "16:00", offset: 3 },
  { title: "Client onboarding call", time: "11:15", offset: 6 },
];

const iso = (d: Date) => d.toISOString().slice(0, 10);

function CalendarPage() {
  const tasks = useAppStore((s) => s.tasks);
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(iso(today));

  const meetingsByDate = useMemo(() => {
    const map: Record<string, { title: string; time: string }[]> = {};
    for (const m of MEETINGS) {
      const d = new Date(today);
      d.setDate(d.getDate() + m.offset);
      (map[iso(d)] ??= []).push({ title: m.title, time: m.time });
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const deadlines = (date: string) => tasks.filter((t) => t.dueDate === date);
  const selectedMeetings = meetingsByDate[selected] ?? [];
  const selectedDeadlines = deadlines(selected);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Calendar"
        title="Your month, mapped 📅"
        description="Meetings, deadlines and reminders together. Click any date to open its details."
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <GlassCard lift={false}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">
              {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-2">
              <button
                aria-label="Previous month"
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                aria-label="Next month"
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <span key={`empty-${i}`} />;
              const key = iso(date);
              const isToday = key === iso(today);
              const isSelected = key === selected;
              const dots =
                (meetingsByDate[key]?.length ?? 0) + deadlines(key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={cn(
                    "relative aspect-square rounded-xl border text-sm transition-all",
                    isSelected
                      ? "border-primary/60 bg-primary/20 shadow-glow"
                      : "border-transparent hover:border-border hover:bg-white/5",
                    isToday && !isSelected && "border-cyan/50 text-cyan",
                  )}
                >
                  <span className="numeric">{date.getDate()}</span>
                  {dots > 0 && (
                    <span className="absolute inset-x-0 bottom-1.5 flex justify-center gap-0.5">
                      {Array.from({ length: Math.min(3, dots) }).map((_, d) => (
                        <span key={d} className="size-1 rounded-full bg-pink" />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          <GlassCard lift={false}>
            <div className="flex items-center gap-2 text-cyan">
              <CalendarDays className="size-4" />
              <h2 className="text-sm font-semibold">
                {new Date(selected + "T00:00:00").toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
            </div>

            <h3 className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">Meetings</h3>
            <ul className="mt-2 space-y-2">
              {selectedMeetings.length ? (
                selectedMeetings.map((m) => (
                  <li key={m.title} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                    <span>{m.title}</span>
                    <span className="numeric text-muted-foreground">{m.time}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No meetings scheduled.</li>
              )}
            </ul>

            <h3 className="mt-5 text-xs uppercase tracking-[0.14em] text-muted-foreground">Deadlines</h3>
            <ul className="mt-2 space-y-2">
              {selectedDeadlines.length ? (
                selectedDeadlines.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                    <span className="truncate">{t.title}</span>
                    <span className="text-pink">{t.priority}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No deadlines on this date.</li>
              )}
            </ul>
          </GlassCard>

          <GlassCard lift={false}>
            <h3 className="text-sm font-semibold">Reminders</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>· Block 90 minutes of deep focus before lunch.</li>
              <li>· Review tomorrow&apos;s agenda at 17:30.</li>
              <li>· Send weekly recap on Friday.</li>
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </AppShell>
  );
}
