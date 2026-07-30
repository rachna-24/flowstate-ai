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

const EmailInput = z.object({
  recipient: z.string(),
  subject: z.string().optional(),
  purpose: z.string().min(1),
  keyPoints: z.string().optional(),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You are a professional workplace writing assistant. Write clear, concise business emails in plain text. Output only the email (subject line, then body, then sign-off). No commentary, no markdown fences.",
      [
        `Recipient: ${data.recipient || "the recipient"}`,
        data.subject ? `Subject: ${data.subject}` : "Subject: propose a suitable subject line",
        `Purpose: ${data.purpose}`,
        data.keyPoints ? `Key points:\n${data.keyPoints}` : "",
        `Tone: ${data.tone}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

const NotesInput = z.object({ notes: z.string().min(1) });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You summarize meeting notes for busy professionals. Always respond in plain text with exactly these four sections, each on its own line as a heading: 'Executive Summary', 'Key Decisions', 'Action Items', 'Deadlines'. Use '- ' bullets under each heading. If a section has no content, write '- None identified'. No markdown symbols like # or *.",
      `Meeting notes:\n\n${data.notes}`,
    ),
  );

const PlanInput = z.object({
  tasks: z.string().min(1),
  dueDates: z.string().optional(),
  workingHours: z.string().optional(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You are a productivity planner. Respond in plain text with exactly these sections as headings on their own lines: 'Priority Level', 'Suggested Daily Schedule', 'Estimated Time Per Task', 'Productivity Tips'. Use '- ' bullets. No markdown symbols like # or *.",
      [
        `Tasks:\n${data.tasks}`,
        data.dueDates ? `Due dates:\n${data.dueDates}` : "",
        `Working hours: ${data.workingHours || "9:00 - 17:00"}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );
