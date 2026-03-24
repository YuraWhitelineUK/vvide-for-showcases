"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  hideAfter?: number;
  onComplete?: () => void;
}

export default function TypewriterText({ text, speed = 60, className = "", hideAfter = 3000, onComplete }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setShowCursor(true);
    setFading(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 600);
        // Start fade-out after hideAfter ms from typing complete
        setTimeout(() => setFading(true), hideAfter);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, hideAfter, onComplete]);

  return (
    <span className={`${className} transition-opacity duration-700 ${fading ? "opacity-0" : "opacity-100"}`}>
      {displayed}
      <span
        className={`inline-block w-[2px] h-[1em] bg-syngenta-magenta ml-0.5 align-middle ${
          showCursor ? "animate-cursor-blink" : "opacity-0"
        }`}
      />
    </span>
  );
}
