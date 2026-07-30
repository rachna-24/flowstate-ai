import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { AnimatedNumber, GlassCard, PageHeader, ProgressBar } from "@/components/tool-ui";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Buddy.AI" },
      {
        name: "description",
        content: "Weekly AI usage, daily request volume and your most used Buddy.AI feature.",
      },
      { property: "og:title", content: "Analytics — Buddy.AI" },
      {
        property: "og:description",
        content: "Track how AI is shaping your productivity week by week.",
      },
    ],
  }),
  component: Analytics,
});

const WEEK = [
  { day: "Mon", requests: 8 },
  { day: "Tue", requests: 14 },
  { day: "Wed", requests: 11 },
  { day: "Thu", requests: 17 },
  { day: "Fri", requests: 9 },
  { day: "Sat", requests: 3 },
  { day: "Sun", requests: 2 },
];

function Analytics() {
  const featureUsage = useAppStore((s) => s.featureUsage);
  const aiRequests = useAppStore((s) => s.aiRequests);

  const entries = Object.entries(featureUsage).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1;
  const [topName, topCount] = entries[0] ?? ["—", 0];
  const barData = entries.map(([name, uses]) => ({ name: name.replace(" Generator", ""), uses }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Analytics"
        title="AI usage this week 📊"
        description="How often you lean on Buddy, which assistant earns its keep, and where your time goes."
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-3">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Total interactions</p>
          <p className="numeric mt-2 text-3xl font-semibold">
            <AnimatedNumber value={total + aiRequests} />
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Most used feature</p>
          <p className="mt-2 font-display text-lg">{topName}</p>
          <p className="text-xs text-muted-foreground">
            {topCount} uses · {Math.round((topCount / total) * 100)}% of AI interactions
          </p>
          <div className="mt-3">
            <ProgressBar value={(topCount / total) * 100} tone="pink" />
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Time saved</p>
          <p className="numeric mt-2 text-3xl font-semibold">4.2h</p>
          <p className="text-xs text-muted-foreground">estimated this week</p>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard lift={false}>
          <h2 className="mb-4 text-sm font-semibold">Daily AI requests</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEK} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="req" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.66 0.21 300)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.63 0.209 265)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.07)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="oklch(0.7 0.018 275)" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="oklch(0.7 0.018 275)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.2 0.011 285)",
                    border: "1px solid oklch(0.35 0.02 285)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="oklch(0.79 0.14 200)"
                  strokeWidth={2.5}
                  fill="url(#req)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard lift={false}>
          <h2 className="mb-4 text-sm font-semibold">Feature breakdown</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.07)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  stroke="oklch(0.7 0.018 275)"
                  fontSize={11}
                />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 0.05)" }}
                  contentStyle={{
                    background: "oklch(0.2 0.011 285)",
                    border: "1px solid oklch(0.35 0.02 285)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Bar dataKey="uses" fill="oklch(0.63 0.209 265)" radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
