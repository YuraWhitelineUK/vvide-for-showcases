"use client";

interface PathEntry {
  choice: "yes" | "no";
  label: string;
}

interface EndScreenProps {
  path: PathEntry[];
  onRestart: () => void;
}

export default function EndScreen({ path, onRestart }: EndScreenProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-syngenta-bg/95 backdrop-blur-sm animate-fade-in">
      <div className="text-center px-8 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-syngenta-magenta/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-syngenta-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-3">
          Thank you
        </h2>

        <p className="text-white/60 text-sm mb-6">
          You&apos;ve completed the experience
        </p>

        {path.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {path.map((entry, i) => (
              <span key={i} className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    entry.choice === "yes"
                      ? "bg-syngenta-magenta/20 text-syngenta-magenta"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {entry.label}
                </span>
                {i < path.length - 1 && (
                  <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onRestart}
          className="py-3 px-8 rounded-full bg-syngenta-magenta text-white font-medium
                     hover:bg-syngenta-magenta-hover active:scale-95 transition-all duration-150"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
