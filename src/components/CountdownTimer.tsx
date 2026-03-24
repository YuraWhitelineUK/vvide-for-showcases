"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  seconds: number;
  onTimeout: () => void;
  paused?: boolean;
}

export default function CountdownTimer({ seconds, onTimeout, paused = false }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / seconds;

  const handleTimeout = useCallback(() => {
    onTimeout();
  }, [onTimeout]);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 0.05;
        if (next <= 0) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [paused, remaining <= 0, handleTimeout]);

  return (
    <div className="flex flex-col items-center gap-1 animate-fade-in">
      <div className="relative w-11 h-11">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22" cy="22" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <circle
            cx="22" cy="22" r={radius}
            fill="none"
            stroke={remaining <= 3 ? "#FF0064" : "rgba(255,255,255,0.6)"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-[stroke] duration-300"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
          remaining <= 3 ? "text-syngenta-magenta" : "text-white/70"
        }`}>
          {Math.ceil(remaining)}
        </span>
      </div>
    </div>
  );
}
