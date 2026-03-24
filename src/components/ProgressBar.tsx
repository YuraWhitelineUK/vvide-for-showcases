"use client";

interface ProgressBarProps {
  currentLevel: number;
  totalLevels?: number;
}

export default function ProgressBar({ currentLevel, totalLevels = 5 }: ProgressBarProps) {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
      {Array.from({ length: totalLevels }, (_, i) => {
        const level = i + 1;
        const isCompleted = level < currentLevel;
        const isCurrent = level === currentLevel;
        return (
          <div
            key={level}
            className={`rounded-full transition-all duration-500 ${
              isCompleted
                ? "w-2 h-2 bg-syngenta-magenta animate-dot-pop"
                : isCurrent
                ? "w-2.5 h-2.5 bg-white animate-dot-glow"
                : "w-2 h-2 bg-white/30"
            }`}
          />
        );
      })}
    </div>
  );
}
