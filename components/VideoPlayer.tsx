"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream | undefined;
}

const VideoPlayer = ({ stream }: VideoPlayerProps) => {
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (vidRef.current) vidRef.current.srcObject = stream!;
  }, [stream]);

  return <video ref={vidRef} autoPlay muted />;
};

export default VideoPlayer;
