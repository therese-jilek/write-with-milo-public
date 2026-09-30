"use client";

import { useRef } from "react";

type PromptReadAloudButtonProps = {
  onReadAloudMessage?: (message: string) => void;
  promptText: string;
};

export function PromptReadAloudButton({ onReadAloudMessage, promptText }: PromptReadAloudButtonProps) {
  const readAloudRequestIdRef = useRef(0);

  function readPrompt() {
    const text = promptText.trim();

    if (!text) {
      onReadAloudMessage?.("There is no text to read yet.");
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onReadAloudMessage?.("Read aloud is not available in this browser.");
      return;
    }

    const requestId = readAloudRequestIdRef.current + 1;
    readAloudRequestIdRef.current = requestId;
    window.speechSynthesis.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.onerror = (event) => {
        if (
          readAloudRequestIdRef.current !== requestId ||
          event.error === "canceled" ||
          event.error === "interrupted"
        ) {
          return;
        }

        onReadAloudMessage?.("Read aloud could not start. Try again.");
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onReadAloudMessage?.("Read aloud could not start. Try again.");
    }
  }

  return (
    <button
      aria-label="Listen to prompt"
      className="prompt-read-aloud-button"
      onClick={readPrompt}
      title="Listen to prompt"
      type="button"
    >
      <svg aria-hidden="true" className="prompt-read-aloud-icon" viewBox="0 0 24 24">
        <path d="M6 9H3v6h3l5 4V5L6 9z" />
        <path d="M15 9.5a4 4 0 0 1 0 5" />
        <path d="M17.7 7a8 8 0 0 1 0 10" />
      </svg>
    </button>
  );
}
