import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  dueDate?: string;
  done: boolean;
  estimate?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Settings {
  name: string;
  email: string;
  accent: "blue" | "purple" | "cyan" | "pink";
  tone: "Formal" | "Friendly" | "Persuasive";
  notifications: boolean;
  reducedMotion: boolean;
  language: string;
}

interface AppState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "done">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  reorderTasks: (from: number, to: number) => void;

  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, "id">) => void;
  clearMessages: () => void;

  aiRequests: number;
  focusMinutes: number;
  featureUsage: Record<string, number>;
  trackUse: (feature: string) => void;

  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: uid(),
          title: "Send Q3 partnership recap to Maya",
          priority: "High",
          done: false,
          estimate: "25 min",
          createdAt: Date.now(),
        },
        {
          id: uid(),
          title: "Summarise Monday product sync notes",
          priority: "Medium",
          done: true,
          estimate: "15 min",
          createdAt: Date.now(),
        },
        {
          id: uid(),
          title: "Draft onboarding checklist v2",
          priority: "Low",
          done: false,
          estimate: "40 min",
          createdAt: Date.now(),
        },
      ],
      addTask: (task) =>
        set((s) => ({
          tasks: [{ ...task, id: uid(), done: false, createdAt: Date.now() }, ...s.tasks],
        })),
      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      reorderTasks: (from, to) =>
        set((s) => {
          const next = [...s.tasks];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return { tasks: next };
        }),

      messages: [],
      addMessage: (message) => set((s) => ({ messages: [...s.messages, { ...message, id: uid() }] })),
      clearMessages: () => set({ messages: [] }),

      aiRequests: 12,
      focusMinutes: 186,
      featureUsage: { "Smart Email Generator": 37, "Meeting Note Summary": 14, "AI Task Planner": 9, "Chat with Buddy": 4 },
      trackUse: (feature) =>
        set((s) => ({
          aiRequests: s.aiRequests + 1,
          featureUsage: { ...s.featureUsage, [feature]: (s.featureUsage[feature] ?? 0) + 1 },
        })),

      settings: {
        name: "Alex Morgan",
        email: "alex@buddy.ai",
        accent: "blue",
        tone: "Formal",
        notifications: true,
        reducedMotion: false,
        language: "English",
      },
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
    }),
    { name: "buddy-ai-store" },
  ),
);
