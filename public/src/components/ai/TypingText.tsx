"use client";

import { useEffect, useState } from "react";

const TYPING_MS = 28;

export function TypingText({
  text,
  onDone,
  className = "",
}: {
  text: string;
  onDone?: () => void;
  className?: string;
}) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setVisible((v) => v + 1), TYPING_MS);
    return () => clearTimeout(t);
  }, [visible, text.length, onDone]);

  return (
    <span className={className}>
      {text.slice(0, visible)}
      {visible < text.length && (
        <span className="inline-block w-0.5 h-4 bg-brand-red ml-0.5 animate-pulse" aria-hidden />
      )}
    </span>
  );
}
