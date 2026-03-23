"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import ChoiceOverlay from "@/components/ChoiceOverlay";
import ProgressBar from "@/components/ProgressBar";
import EndScreen from "@/components/EndScreen";

interface TreeNode {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  yesChild: TreeNode | null;
  noChild: TreeNode | null;
}

type Phase = "loading" | "splash" | "playing" | "choosing" | "ending";

export default function Home() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [currentNode, setCurrentNode] = useState<TreeNode | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [path, setPath] = useState<("yes" | "no")[]>([]);
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
          setError("No videos configured yet. Visit /admin to set up your video tree.");
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

      setPath((prev) => [...prev, choice]);
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

  // Loading state
  if (phase === "loading") {
    return (
      <div className="h-dvh bg-syngenta-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-syngenta-magenta border-t-transparent rounded-full animate-spin-slow" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-dvh bg-syngenta-bg flex flex-col items-center justify-center px-8">
        <p className="text-white/60 text-center mb-4">{error}</p>
        <a
          href="/admin"
          className="py-3 px-6 rounded-full bg-syngenta-magenta text-white font-medium hover:bg-syngenta-magenta-hover transition-colors"
        >
          Go to Admin
        </a>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-syngenta-bg overflow-hidden flex items-center justify-center">
      {/* 9:16 video container — centered on desktop */}
      <div className="relative h-full w-full max-w-[56.25dvh] bg-black">
        {/* Progress dots */}
        {currentNode && phase !== "splash" && (
          <ProgressBar currentLevel={currentNode.level} />
        )}

        {/* Video */}
        {currentNode && (
          <VideoPlayer
            src={currentNode.videoUrl}
            onEnded={handleVideoEnded}
            visible={phase === "playing" || phase === "choosing"}
          />
        )}

        {/* Splash / Tap to begin */}
        {phase === "splash" && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-syngenta-bg cursor-pointer"
            onClick={handleStart}
          >
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full border-2 border-syngenta-magenta flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-syngenta-magenta ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/60 text-sm font-medium tracking-wide uppercase">
                Tap to begin
              </p>
            </div>
          </div>
        )}

        {/* Choice overlay */}
        {phase === "choosing" && currentNode && (
          <ChoiceOverlay
            hasYes={!!currentNode.yesChild}
            hasNo={!!currentNode.noChild}
            onChoice={handleChoice}
          />
        )}

        {/* End screen */}
        {phase === "ending" && (
          <EndScreen path={path} onRestart={handleRestart} />
        )}

        {/* Dark gradient at bottom for button readability */}
        {(phase === "playing" || phase === "choosing") && (
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
