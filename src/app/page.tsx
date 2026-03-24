"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import ChoiceOverlay from "@/components/ChoiceOverlay";
import ProgressBar from "@/components/ProgressBar";
import EndScreen from "@/components/EndScreen";
import AnimatedBackground from "@/components/AnimatedBackground";

interface TreeNode {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  yesLabel?: string;
  noLabel?: string;
  yesChild: TreeNode | null;
  noChild: TreeNode | null;
}

interface PathEntry {
  choice: "yes" | "no";
  label: string;
}

type Phase = "loading" | "splash" | "playing" | "choosing" | "ending";

export default function Home() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [currentNode, setCurrentNode] = useState<TreeNode | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [path, setPath] = useState<PathEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const audioUnlocked = useRef(false);

  useEffect(() => {
    fetch("/api/tree")
      .then((res) => res.json())
      .then((data) => {
        if (data.root) {
          setTree(data.root);
          setCurrentNode(data.root);
          setPhase("splash");
        } else {
          setError("No video tree configured. Add a tree.json to the data/ folder.");
        }
      })
      .catch(() => setError("Failed to load video tree."));
  }, []);

  const handleStart = useCallback(() => {
    audioUnlocked.current = true;
    setPhase("playing");
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (!currentNode) return;
    const hasYes = !!currentNode.yesChild;
    const hasNo = !!currentNode.noChild;

    if (!hasYes && !hasNo) {
      setPhase("ending");
    } else {
      setPhase("choosing");
    }
  }, [currentNode]);

  const handleChoice = useCallback(
    (choice: "yes" | "no") => {
      if (!currentNode) return;
      const next = choice === "yes" ? currentNode.yesChild : currentNode.noChild;
      if (!next) return;

      const label = choice === "yes"
        ? (currentNode.yesLabel || "Yes")
        : (currentNode.noLabel || "No");

      setPath((prev) => [...prev, { choice, label }]);
      setPhase("playing");
      setCurrentNode(next);
    },
    [currentNode]
  );

  const handleRestart = useCallback(() => {
    if (!tree) return;
    setCurrentNode(tree);
    setPath([]);
    setPhase("splash");
  }, [tree]);

  if (phase === "loading") {
    return (
      <div className="h-dvh bg-syngenta-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-syngenta-magenta border-t-transparent rounded-full animate-spin-slow" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh bg-syngenta-bg flex flex-col items-center justify-center px-8">
        <p className="text-white/60 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-syngenta-bg overflow-hidden flex items-center justify-center">
      <div className="relative h-full w-full max-w-[56.25dvh] bg-black">
        <AnimatedBackground />

        {currentNode && phase !== "splash" && (
          <ProgressBar currentLevel={currentNode.level} />
        )}

        {currentNode && (
          <VideoPlayer
            src={currentNode.videoUrl}
            onEnded={handleVideoEnded}
            visible={phase === "playing" || phase === "choosing"}
            blurred={phase === "choosing" || phase === "ending"}
          />
        )}

        {phase === "splash" && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-syngenta-bg cursor-pointer"
            onClick={handleStart}
          >
            <div className="text-center animate-fade-in">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-syngenta-magenta/40 animate-pulse-ring" />
                <div className="absolute inset-0 rounded-full border border-syngenta-magenta/20 animate-pulse-ring-delay" />
                <div className="relative w-20 h-20 rounded-full border-2 border-syngenta-magenta flex items-center justify-center">
                  <svg className="w-8 h-8 text-syngenta-magenta ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/60 text-sm font-medium tracking-wide uppercase animate-float">
                Tap to begin
              </p>
            </div>
          </div>
        )}

        {phase === "playing" && currentNode && (
          <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none">
            <h2 className="text-white text-xl font-semibold animate-title-reveal">
              {currentNode.title}
            </h2>
          </div>
        )}

        {phase === "choosing" && currentNode && (
          <ChoiceOverlay
            hasYes={!!currentNode.yesChild}
            hasNo={!!currentNode.noChild}
            yesLabel={currentNode.yesLabel || "Yes"}
            noLabel={currentNode.noLabel || "No"}
            onChoice={handleChoice}
          />
        )}

        {phase === "ending" && (
          <EndScreen path={path} onRestart={handleRestart} />
        )}

        {(phase === "playing" || phase === "choosing") && (
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none animate-gradient-shimmer" />
        )}
      </div>
    </div>
  );
}
