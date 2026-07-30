import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiNotice } from "./AiNotice";

/** Reusable frosted glass surface with optional hover lift. */
export function GlassCard({
  className,
  lift = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lift?: boolean }) {
  return <div {...props} className={cn("glass-panel p-5 sm:p-6", lift && "card-lift", className)} />;
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8 animate-rise">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{eyebrow}</p>
      <h1 className="mt-2 text-2xl sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

export function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
        {optional && <span className="ml-1.5 text-xs text-muted-foreground">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

export const controlClass =
  "w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/15";

export function ActionButton({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-r from-primary to-purple text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-glow",
        variant === "ghost" &&
          "border border-border bg-card/60 text-foreground hover:border-primary/50 hover:bg-accent",
        variant === "danger" &&
          "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
        className,
      )}
    />
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <ActionButton
      variant="ghost"
      disabled={!value}
      aria-label="Copy generated output"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check className="size-4 text-emerald" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </ActionButton>
  );
}

export function OutputPanel({
  title,
  loading,
  error,
  value,
  placeholder,
  actions,
}: {
  title: string;
  loading: boolean;
  error: string | null;
  value: string;
  placeholder: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="glass-panel flex min-h-[420px] flex-col p-5 sm:p-6" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {actions}
      </div>
      <div className="mt-4 flex-1">
        {loading ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
            <p className="text-sm">Buddy is thinking…</p>
          </div>
        ) : error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : value ? (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
            {value}
          </pre>
        ) : (
          <p className="flex h-full min-h-[300px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
      </div>
    </section>
  );
}

/** Count-up number used by dashboard stat cards. */
export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(0);

  useEffect(() => {
    const start = ref.current;
    const startedAt = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(start + (value - start) * eased);
      setDisplay(next);
      ref.current = next;
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className="numeric">
      {display}
      {suffix}
    </span>
  );
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "h-full rounded-full",
          tone === "primary" && "bg-gradient-to-r from-primary to-purple",
          tone === "cyan" && "bg-gradient-to-r from-cyan to-primary",
          tone === "emerald" && "bg-gradient-to-r from-emerald to-cyan",
          tone === "pink" && "bg-gradient-to-r from-pink to-purple",
          tone === "amber" && "bg-gradient-to-r from-amber to-pink",
        )}
      />
    </div>
  );
}

export { AiNotice };
