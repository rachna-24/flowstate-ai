import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const MODEL = "openai/gpt-5.6-sol";

async function run(system: string, prompt: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured.");
  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(key);
  const { text } = await generateText({
    model: gateway(MODEL),
    system,
    prompt,
    providerOptions: { lovable: { reasoningEffort: "none" } },
  });
  return { text: text.trim() };
}

/* ------------------------------ Email ------------------------------ */

const EmailInput = z.object({
  recipient: z.string(),
  purpose: z.string().min(1),
  type: z.string(),
  extra: z.string().optional(),
  tone: z.enum(["Formal", "Friendly", "Persuasive", "Apologetic", "Enthusiastic"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You are Buddy, a professional workplace writing assistant. Write clear, polished business emails in plain text. Output only the email (subject line, then body, then sign-off). No commentary, no markdown fences.",
      [
        `Email type: ${data.type}`,
        `Recipient: ${data.recipient || "the recipient"}`,
        `Purpose: ${data.purpose}`,
        data.extra ? `Additional information:\n${data.extra}` : "",
        `Tone: ${data.tone}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

const RefineInput = z.object({
  text: z.string().min(1),
  action: z.enum(["Improve", "Shorten", "Expand"]),
});

export const refineEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RefineInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You revise business emails. Return only the revised email in plain text — no commentary, no markdown fences.",
      `Action: ${data.action} this email while keeping its intent and tone.\n\n${data.text}`,
    ),
  );

/* --------------------------- Meeting notes -------------------------- */

const NotesInput = z.object({ notes: z.string().min(1) });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You summarize meeting notes for busy professionals. Always respond in plain text with exactly these five sections, each on its own line as a heading: 'Meeting Summary', 'Action Items', 'Important Decisions', 'Deadlines', 'Follow-up Tasks'. Use '- ' bullets under each heading. If a section has no content, write '- None identified'. No markdown symbols like # or *.",
      `Meeting notes:\n\n${data.notes}`,
    ),
  );

/* ----------------------------- Planner ------------------------------ */

const PlanInput = z.object({
  tasks: z.string().min(1),
  dueDates: z.string().optional(),
  workingHours: z.string().optional(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You are a productivity planner. Respond in plain text with exactly these sections as headings on their own lines: 'Recommended Priority Order', 'Suggested Daily Schedule', 'Estimated Time Per Task', 'Productivity Tips'. Use '- ' bullets. No markdown symbols like # or *.",
      [
        `Tasks:\n${data.tasks}`,
        data.dueDates ? `Due dates:\n${data.dueDates}` : "",
        `Working hours: ${data.workingHours || "9:00 - 17:00"}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

/* ------------------------------- Chat ------------------------------- */

const ChatInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1),
});

export const chatWithBuddy = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured.");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are Buddy, a friendly, sharp workplace productivity assistant. Be concise and practical. Use short paragraphs and '- ' bullets when listing. Avoid markdown headings and asterisks.",
      messages: data.messages,
      providerOptions: { lovable: { reasoningEffort: "none" } },
    });
    return { text: text.trim() };
  });
