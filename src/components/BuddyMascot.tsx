import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type BuddyMood = "idle" | "happy" | "thinking" | "wave";

/**
 * Buddy mascot — a small, friendly, futuristic AI head.
 * Floats gently, blinks occasionally and reacts to the current mood.
 */
export function BuddyMascot({
  size = 56,
  mood = "idle",
  className,
}: {
  size?: number;
  mood?: BuddyMood;
  className?: string;
}) {
  const [blink, setBlink] = useState(false);

  // Occasional natural blink
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      timeout = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => setBlink(false), 140);
          loop();
        },
        2600 + Math.random() * 3200,
      );
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  const thinking = mood === "thinking";
  const smiling = mood === "happy" || mood === "wave";

  return (
    <motion.div
      className={cn("relative shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      animate={
        mood === "wave"
          ? { y: [0, -6, 0], rotate: [0, -8, 8, -4, 0] }
          : { y: [0, -5, 0] }
      }
      transition={
        mood === "wave"
          ? { duration: 1.1, ease: "easeInOut" }
          : { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }
      aria-hidden
    >
      {/* soft neon halo */}
      <div className="absolute inset-0 -z-10 rounded-full bg-primary/35 blur-xl animate-pulse-glow" />
      <svg viewBox="0 0 64 64" width={size} height={size} role="presentation">
        <defs>
          <linearGradient id="buddy-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.30 0.06 275)" />
            <stop offset="100%" stopColor="oklch(0.20 0.03 285)" />
          </linearGradient>
          <linearGradient id="buddy-outline" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.70 0.19 262)" />
            <stop offset="55%" stopColor="oklch(0.66 0.21 300)" />
            <stop offset="100%" stopColor="oklch(0.82 0.14 200)" />
          </linearGradient>
        </defs>

        {/* antenna */}
        <line x1="32" y1="6" x2="32" y2="13" stroke="url(#buddy-outline)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="32" cy="5" r="3" fill="oklch(0.82 0.14 200)">
          <animate attributeName="opacity" values="0.45;1;0.45" dur="2.2s" repeatCount="indefinite" />
        </circle>

        {/* head */}
        <rect
          x="9"
          y="13"
          width="46"
          height="40"
          rx="15"
          fill="url(#buddy-face)"
          stroke="url(#buddy-outline)"
          strokeWidth="2.4"
        />

        {/* ears */}
        <rect x="4" y="27" width="4" height="12" rx="2" fill="url(#buddy-outline)" opacity="0.85" />
        <rect x="56" y="27" width="4" height="12" rx="2" fill="url(#buddy-outline)" opacity="0.85" />

        {/* eyes */}
        {blink ? (
          <>
            <rect x="19" y="31" width="9" height="2.4" rx="1.2" fill="oklch(0.88 0.11 200)" />
            <rect x="36" y="31" width="9" height="2.4" rx="1.2" fill="oklch(0.88 0.11 200)" />
          </>
        ) : (
          <>
            <circle cx="23.5" cy="32" r="4.2" fill="oklch(0.88 0.11 200)" />
            <circle cx="40.5" cy="32" r="4.2" fill="oklch(0.88 0.11 200)" />
            <circle cx="22.2" cy="30.6" r="1.4" fill="white" opacity="0.9" />
            <circle cx="39.2" cy="30.6" r="1.4" fill="white" opacity="0.9" />
          </>
        )}

        {/* mouth */}
        {thinking ? (
          <g fill="oklch(0.72 0.2 350)">
            <circle cx="26" cy="43" r="2">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="1.1s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle cx="32" cy="43" r="2">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="1.1s" repeatCount="indefinite" begin="0.２s" />
            </circle>
            <circle cx="38" cy="43" r="2">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="1.1s" repeatCount="indefinite" begin="0.4s" />
            </circle>
          </g>
        ) : smiling ? (
          <path
            d="M24 41 Q32 48 40 41"
            fill="none"
            stroke="oklch(0.72 0.2 350)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M25 43 Q32 46 39 43"
            fill="none"
            stroke="oklch(0.72 0.2 350)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
      </svg>
    </motion.div>
  );
}
