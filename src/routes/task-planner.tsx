import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { GripVertical, Plus, Sparkles, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  ActionButton,
  AiNotice,
  Field,
  GlassCard,
  OutputPanel,
  PageHeader,
  ProgressBar,
  controlClass,
} from "@/components/tool-ui";
import { generatePlan } from "@/lib/ai.functions";
import { useAppStore, type Priority } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Buddy.AI" },
      {
        name: "description",
        content:
          "Create, prioritise and reorder tasks with deadline countdowns and an AI-generated daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner — Buddy.AI" },
      {
        property: "og:description",
        content: "Buddy recommends priority, estimates effort and suggests the best order of work.",
      },
    ],
  }),
  component: TaskPlanner,
});

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

const priorityTone: Record<Priority, string> = {
  High: "bg-pink/15 text-pink border-pink/30",
  Medium: "bg-amber/15 text-amber border-amber/30",
  Low: "bg-cyan/15 text-cyan border-cyan/30",
};

function countdown(due?: string) {
  if (!due) return null;
  const diff = new Date(due + "T23:59:59").getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  return `${days}d left`;
}

function TaskPlanner() {
  const { tasks, addTask, updateTask, removeTask, reorderTasks, trackUse } = useAppStore();
  const call = useServerFn(generatePlan);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [workingHours, setWorkingHours] = useState("09:00 - 17:00");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completed = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;

  const submitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), priority, dueDate: dueDate || undefined });
    setTitle("");
    setDueDate("");
  };

  const buildPlan = async () => {
    const open = tasks.filter((t) => !t.done);
    if (!open.length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await call({
        data: {
          tasks: open.map((t) => `- ${t.title} (priority: ${t.priority})`).join("\n"),
          dueDates: open
            .filter((t) => t.dueDate)
            .map((t) => `- ${t.title}: ${t.dueDate}`)
            .join("\n"),
          workingHours,
        },
      });
      setPlan(res.text);
      trackUse("AI Task Planner");
    } catch {
      setError("Buddy couldn't build your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Task Planner"
        title="Plan the day, then win it ✅"
        description="Add tasks, drag to reorder, track deadlines — and let Buddy suggest the smartest running order."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-5">
          <GlassCard lift={false}>
            <form onSubmit={submitTask} className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
              <Field label="New task" htmlFor="title">
                <input
                  id="title"
                  className={controlClass}
                  placeholder="Prepare investor update"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field label="Priority" htmlFor="priority">
                <select
                  id="priority"
                  className={controlClass}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Due" htmlFor="due" optional>
                <input
                  id="due"
                  type="date"
                  className={controlClass}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Field>
              <ActionButton type="submit" disabled={!title.trim()}>
                <Plus className="size-4" /> Add
              </ActionButton>
            </form>
          </GlassCard>

          <GlassCard lift={false}>
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-medium">
                {completed}/{tasks.length} complete
              </span>
              <span className="numeric text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} tone="emerald" />

            <ul className="mt-5 space-y-2">
              {tasks.map((task, index) => (
                <li
                  key={task.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null && dragIndex !== index) reorderTasks(dragIndex, index);
                    setDragIndex(null);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-border bg-white/5 px-3 py-2.5 transition-colors hover:border-primary/40",
                    task.done && "opacity-55",
                  )}
                >
                  <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />
                  <input
                    type="checkbox"
                    checked={task.done}
                    aria-label={`Mark ${task.title} complete`}
                    onChange={(e) => updateTask(task.id, { done: e.target.checked })}
                    className="size-4 shrink-0 accent-[oklch(0.63_0.209_265)]"
                  />
                  <div className="min-w-0 flex-1">
                    <input
                      value={task.title}
                      aria-label="Task title"
                      onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      className={cn(
                        "w-full truncate bg-transparent text-sm outline-none",
                        task.done && "line-through",
                      )}
                    />
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      {task.dueDate && <span>{countdown(task.dueDate)}</span>}
                      {task.estimate && <span>· {task.estimate}</span>}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-lg border px-2 py-0.5 text-[11px] font-medium",
                      priorityTone[task.priority],
                    )}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => removeTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
              {!tasks.length && (
                <li className="py-8 text-center text-sm text-muted-foreground">
                  No tasks yet — add your first one above.
                </li>
              )}
            </ul>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard lift={false} className="space-y-3">
            <Field label="Working hours" htmlFor="hours">
              <input
                id="hours"
                className={controlClass}
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
              />
            </Field>
            <ActionButton onClick={() => void buildPlan()} disabled={loading || !tasks.some((t) => !t.done)}>
              <Sparkles className="size-4" /> Build my plan
            </ActionButton>
            <AiNotice />
          </GlassCard>

          <OutputPanel
            title="Buddy's plan"
            loading={loading}
            error={error}
            value={plan}
            placeholder="Buddy will suggest priority order, a schedule and time estimates here."
          />
        </div>
      </div>
    </AppShell>
  );
}
