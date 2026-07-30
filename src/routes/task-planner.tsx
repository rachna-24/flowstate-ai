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
import { generatePlan } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Prioritise tasks and get a realistic daily schedule with time estimates and productivity tips.",
      },
      { property: "og:title", content: "AI Task Planner — AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Prioritise tasks and get a realistic daily schedule with time estimates and productivity tips.",
      },
    ],
  }),
  component: TaskPlanner,
});

function TaskPlanner() {
  const call = useServerFn(generatePlan);
  const [tasks, setTasks] = useState("");
  const [dueDates, setDueDates] = useState("");
  const [workingHours, setWorkingHours] = useState("09:00 - 17:00");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await call({ data: { tasks, dueDates, workingHours } });
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
        eyebrow="AI Task Planner"
        title="A day that actually fits"
        description="List what's on your plate and the assistant will sequence it around your working hours."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="surface space-y-4 p-5 sm:p-6">
          <Field label="Tasks" htmlFor="tasks">
            <textarea
              id="tasks"
              required
              rows={7}
              className={controlClass}
              placeholder={"One task per line\nPrepare board deck\nReview vendor contract"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </Field>

          <Field label="Due Dates" htmlFor="due-dates" optional>
            <textarea
              id="due-dates"
              rows={4}
              className={controlClass}
              placeholder={"Board deck — Friday\nVendor contract — end of month"}
              value={dueDates}
              onChange={(e) => setDueDates(e.target.value)}
            />
          </Field>

          <Field label="Working Hours" htmlFor="working-hours">
            <input
              id="working-hours"
              className={controlClass}
              placeholder="09:00 - 17:00"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
            />
          </Field>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <ActionButton type="submit" disabled={loading || !tasks.trim()}>
              <Sparkles className="size-4" /> Generate Plan
            </ActionButton>
            <CopyButton value={output} />
            <ActionButton
              type="button"
              variant="ghost"
              onClick={() => {
                setTasks("");
                setDueDates("");
                setWorkingHours("09:00 - 17:00");
                setOutput("");
                setError(null);
              }}
            >
              <Eraser className="size-4" /> Clear
            </ActionButton>
          </div>
        </form>

        <OutputPanel
          title="Your Plan"
          loading={loading}
          error={error}
          value={output}
          placeholder="Priorities, a daily schedule, time estimates and productivity tips will appear here."
        />
      </div>

      <div className="mt-6">
        <AiNotice />
      </div>
    </AppShell>
  );
}
