"use client";

import { useRef, useEffect, useState } from "react";

interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
  visible: boolean;
  blurred?: boolean;
}

export default function VideoPlayer({ src, onEnded, visible, blurred = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mountBlur, setMountBlur] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visible) {
      setMountBlur(true);
      video.currentTime = 0;
      video.play().catch(() => {});
      // Small delay then clear the mount blur for reveal effect
      const timer = setTimeout(() => setMountBlur(false), 100);
      return () => clearTimeout(timer);
    } else {
      video.pause();
    }
  }, [visible, src]);

  const shouldBlur = blurred || mountBlur;

  return (
    <video
      ref={videoRef}
      src={src}
      className={`absolute inset-0 w-full h-full object-cover transition-[opacity,filter] duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ filter: shouldBlur ? "blur(16px)" : "blur(0px)" }}
      playsInline
      muted={false}
      onEnded={onEnded}
      preload="auto"
    />
  );
}
