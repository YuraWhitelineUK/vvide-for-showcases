"use client";

import { useState, useRef, useCallback } from "react";
import CountdownTimer from "./CountdownTimer";

const CTA_PHRASES = [
  "What will you do?",
  "Your move.",
  "Choose wisely.",
  "The choice is yours.",
  "What happens next?",
];

interface ChoiceOverlayProps {
  hasYes: boolean;
  hasNo: boolean;
  yesLabel: string;
  noLabel: string;
  onChoice: (choice: "yes" | "no") => void;
}

export default function ChoiceOverlay({ hasYes, hasNo, yesLabel, noLabel, onChoice }: ChoiceOverlayProps) {
  const [ctaText] = useState(() =>
    CTA_PHRASES[Math.floor(Math.random() * CTA_PHRASES.length)]
  );
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);

  const handleTimeout = useCallback(() => {
    // Auto-pick randomly
    const choices: ("yes" | "no")[] = [];
    if (hasYes) choices.push("yes");
    if (hasNo) choices.push("no");
    if (choices.length > 0) {
      onChoice(choices[Math.floor(Math.random() * choices.length)]);
    }
  }, [hasYes, hasNo, onChoice]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    swiped.current = false;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || swiped.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 60;

    if (dx > threshold && hasYes) {
      swiped.current = true;
      onChoice("yes");
    } else if (dx < -threshold && hasNo) {
      swiped.current = true;
      onChoice("no");
    }
    touchStartX.current = null;
  }, [hasYes, hasNo, onChoice]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 z-20"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Countdown timer */}
      <div className="mb-4">
        <CountdownTimer seconds={10} onTimeout={handleTimeout} />
      </div>

      <p className="text-white/80 text-sm font-medium tracking-wide uppercase mb-1 animate-cta-reveal">
        {ctaText}
      </p>

      {/* Swipe hint */}
      <p className="text-white/30 text-[10px] tracking-wider mb-4 animate-cta-reveal">
        Swipe right = {yesLabel} / Swipe left = {noLabel}
      </p>

      <div className="flex gap-5 w-full max-w-sm">
        {hasYes && (
          <button
            onClick={() => onChoice("yes")}
            className="group relative flex-1 py-4 px-6 rounded-full bg-syngenta-magenta text-white font-medium text-lg
                       hover:bg-syngenta-magenta-hover active:scale-95 transition-all duration-150
                       shadow-lg shadow-syngenta-magenta/30 animate-button-enter-1 overflow-hidden"
          >
            <span className="relative z-10">{yesLabel}</span>
            <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
              />
            </span>
          </button>
        )}
        {hasNo && (
          <button
            onClick={() => onChoice("no")}
            className="group relative flex-1 py-4 px-6 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium text-lg
                       border-2 border-white/40 hover:bg-white/20 active:scale-95 transition-all duration-150
                       animate-button-enter-2 overflow-hidden"
          >
            <span className="relative z-10">{noLabel}</span>
            <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
              />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
