import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { AiNotice } from "./AiNotice";
import { cn } from "@/lib/utils";

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
    <header className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
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
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-soft outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10";

export function ActionButton({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
          : "border border-border bg-card text-foreground hover:bg-accent",
        className,
      )}
    />
  );
}

export function CopyButton({ value }: { value: string }) {
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
      {copied ? "Copied" : "Copy"}
    </ActionButton>
  );
}

export function OutputPanel({
  title,
  loading,
  error,
  value,
  placeholder,
}: {
  title: string;
  loading: boolean;
  error: string | null;
  value: string;
  placeholder: string;
}) {
  return (
    <section className="surface flex min-h-[420px] flex-col p-5 sm:p-6" aria-live="polite">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 flex-1">
        {loading ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
            <p className="text-sm">Generating…</p>
          </div>
        ) : error ? (
          <p className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
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

export { AiNotice };
