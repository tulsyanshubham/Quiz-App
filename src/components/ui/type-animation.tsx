"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export function TypingAnimation({
  text,
  duration = 200,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");

  useEffect(() => {
    // Reset the state when text changes
    setDisplayedText("");

    const typingEffect = setInterval(() => {
      setDisplayedText((prev) => {
        const nextIndex = prev.length;
        if (nextIndex < text.length) {
          return text.substring(0, nextIndex + 1);
        } else {
          clearInterval(typingEffect);
          return prev;
        }
      });
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [text, duration]);

  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm max-w-6xl px-3",
        className,
      )}
    >
      {displayedText}
    </h1>
  );
}
