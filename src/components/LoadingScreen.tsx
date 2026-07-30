import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BuddyMascot } from "./BuddyMascot";

const STEPS = [
  "Initializing Buddy...",
  "Connecting AI Models...",
  "Preparing Workspace...",
  "Optimizing Productivity...",
];

/** Premium startup screen shown once per browser session. */
export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stepId = setInterval(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 620);
    const doneId = setTimeout(onDone, 2650);
    return () => {
      clearInterval(stepId);
      clearTimeout(doneId);
    };
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
    >
      <BuddyMascot size={92} mood="happy" />
      <div className="text-center">
        <p className="font-display text-2xl font-semibold">
          Buddy<span className="neon-text">.AI</span>
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Your Smart Productivity Assistant
        </p>
      </div>

      <div className="h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground"
          >
            {STEPS[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: "4%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary via-purple to-cyan shadow-glow"
        />
      </div>
    </motion.div>
  );
}
