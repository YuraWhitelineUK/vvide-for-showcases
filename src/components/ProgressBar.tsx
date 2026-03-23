"use client";

interface ProgressBarProps {
  currentLevel: number;
  totalLevels?: number;
}

export default function ProgressBar({ currentLevel, totalLevels = 5 }: ProgressBarProps) {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
      {Array.from({ length: totalLevels }, (_, i) => {
        const level = i + 1;
        const isCompleted = level < currentLevel;
        const isCurrent = level === currentLevel;
        return (
          <div
            key={level}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isCompleted
                ? "bg-syngenta-magenta"
                : isCurrent
                ? "bg-white"
                : "bg-white/30"
            }`}
          />
        );
      })}
    </div>
  );
}
