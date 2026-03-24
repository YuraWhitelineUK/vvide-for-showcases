"use client";

import { useState } from "react";

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

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 z-20">
      <p className="text-white/80 text-sm font-medium tracking-wide uppercase mb-5 animate-cta-reveal">
        {ctaText}
      </p>
      <div className="flex gap-5 w-full max-w-sm">
        {hasYes && (
          <button
            onClick={() => onChoice("yes")}
            className="flex-1 py-4 px-6 rounded-full bg-syngenta-magenta text-white font-medium text-lg
                       hover:bg-syngenta-magenta-hover active:scale-95 transition-all duration-150
                       shadow-lg shadow-syngenta-magenta/30 animate-button-enter-1"
          >
            {yesLabel}
          </button>
        )}
        {hasNo && (
          <button
            onClick={() => onChoice("no")}
            className="flex-1 py-4 px-6 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium text-lg
                       border-2 border-white/40 hover:bg-white/20 active:scale-95 transition-all duration-150
                       animate-button-enter-2"
          >
            {noLabel}
          </button>
        )}
      </div>
    </div>
  );
}
