import { ShieldAlert } from "lucide-react";

export function AiNotice() {
  return (
    <aside
      role="note"
      className="flex items-start gap-3 rounded-xl border border-amber/30 bg-amber-soft/60 p-4"
    >
      <ShieldAlert className="mt-0.5 size-[18px] shrink-0 text-amber" aria-hidden />
      <p className="text-sm leading-relaxed text-foreground/80">
        AI-generated content may contain inaccuracies. Always review generated outputs before using
        them professionally. Do not enter confidential or sensitive workplace information.
      </p>
    </aside>
  );
}
