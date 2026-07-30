import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Copy, Mic, RefreshCw, SendHorizontal, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BuddyMascot } from "@/components/BuddyMascot";
import { ActionButton, AiNotice, PageHeader, controlClass } from "@/components/tool-ui";
import { chatWithBuddy } from "@/lib/ai.functions";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with Buddy — Buddy.AI" },
      {
        name: "description",
        content: "Ask Buddy to plan your day, summarize text, draft emails or share productivity tips.",
      },
      { property: "og:title", content: "Chat with Buddy — Buddy.AI" },
      {
        property: "og:description",
        content: "A focused AI chat for everyday work: planning, writing and quick answers.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = ["Plan My Day", "Summarize This", "Generate Email", "Productivity Tips"];

function ChatPage() {
  const { messages, addMessage, clearMessages, trackUse } = useAppStore();
  const call = useServerFn(chatWithBuddy);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");
    setError(null);
    addMessage({ role: "user", content });
    setLoading(true);
    try {
      const history = [...useAppStore.getState().messages].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await call({ data: { messages: history } });
      addMessage({ role: "assistant", content: res.text });
      trackUse("Chat with Buddy");
    } catch {
      setError("Buddy couldn't reply just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) void send(lastUser.content);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Chat with Buddy"
        title="Ask Buddy anything 🤖"
        description="Your assistant for planning, writing and thinking out loud — grounded in your workday."
      />

      <div className="glass-panel flex h-[68vh] min-h-[520px] flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {!messages.length && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <BuddyMascot size={80} mood="happy" />
              <p className="font-display text-lg">Hey! What should we tackle first?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-xl border border-border bg-white/5 px-3 py-2 text-xs font-medium transition-all hover:border-primary/50 hover:bg-primary/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && <BuddyMascot size={34} />}
              <div className={cn("max-w-[80%] space-y-1", m.role === "user" && "text-right")}>
                <div
                  className={cn(
                    "whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-gradient-to-r from-primary to-purple text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {m.content}
                </div>
                {m.role === "assistant" && (
                  <button
                    onClick={() => navigator.clipboard.writeText(m.content)}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="size-3" /> Copy
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <BuddyMascot size={34} mood="thinking" />
              <span className="text-sm text-muted-foreground">Buddy is typing…</span>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 border-t border-border p-3 sm:p-4"
        >
          <textarea
            rows={1}
            value={input}
            aria-label="Message Buddy"
            placeholder="Message Buddy…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            className={cn(controlClass, "max-h-32 resize-none")}
          />
          <button
            type="button"
            aria-label="Voice input (coming soon)"
            title="Voice input coming soon"
            className="rounded-xl border border-border p-2.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <Mic className="size-4" />
          </button>
          <ActionButton type="submit" disabled={loading || !input.trim()} aria-label="Send message">
            <SendHorizontal className="size-4" />
          </ActionButton>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ActionButton variant="ghost" onClick={regenerate} disabled={loading || !messages.length}>
          <RefreshCw className="size-4" /> Regenerate
        </ActionButton>
        <ActionButton variant="ghost" onClick={clearMessages} disabled={!messages.length}>
          <Trash2 className="size-4" /> Clear chat
        </ActionButton>
      </div>
      <div className="mt-4">
        <AiNotice />
      </div>
    </AppShell>
  );
}
