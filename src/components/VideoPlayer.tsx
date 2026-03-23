"use client";

import { useRef, useEffect } from "react";

interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
  visible: boolean;
}

export default function VideoPlayer({ src, onEnded, visible }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visible) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      playsInline
      muted={false}
      onEnded={onEnded}
      preload="auto"
    />
  );
}
