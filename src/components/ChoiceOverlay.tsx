"use client";

interface ChoiceOverlayProps {
  hasYes: boolean;
  hasNo: boolean;
  onChoice: (choice: "yes" | "no") => void;
}

export default function ChoiceOverlay({ hasYes, hasNo, onChoice }: ChoiceOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-16 px-6 z-20">
      <div className="flex gap-5 w-full max-w-sm animate-fade-in">
        {hasYes && (
          <button
            onClick={() => onChoice("yes")}
            className="flex-1 py-4 px-6 rounded-full bg-syngenta-magenta text-white font-medium text-lg
                       hover:bg-syngenta-magenta-hover active:scale-95 transition-all duration-150
                       shadow-lg shadow-syngenta-magenta/30"
          >
            Yes
          </button>
        )}
        {hasNo && (
          <button
            onClick={() => onChoice("no")}
            className="flex-1 py-4 px-6 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium text-lg
                       border-2 border-white/40 hover:bg-white/20 active:scale-95 transition-all duration-150"
          >
            No
          </button>
        )}
      </div>
    </div>
  );
}
