"use client";

import { useRef, useState } from "react";

type CopyWritingButtonProps = {
  writingText: string;
};

export function CopyWritingButton({ writingText }: CopyWritingButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const fallbackTextRef = useRef<HTMLTextAreaElement | null>(null);

  async function copyWriting() {
    try {
      await navigator.clipboard.writeText(writingText);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  function selectFallbackText() {
    fallbackTextRef.current?.select();
  }

  return (
    <>
      <div className="chip-row" style={{ marginTop: "1rem" }}>
        <button className="btn btn-writing-action primary-action" id="copy-writing-btn" onClick={copyWriting} type="button">
          Copy My Writing
        </button>
      </div>
      <p
        className={status === "error" ? "copy-status error" : "copy-status"}
        id="copy-writing-status"
        role={status === "error" ? "alert" : "status"}
        style={{ marginTop: ".75rem", color: status === "error" ? undefined : "var(--text)" }}
      >
        {status === "copied" ? "Your writing was copied. Now paste it into your document." : null}
        {status === "error" ? "We couldn't copy your writing automatically." : null}
      </p>
      {status === "error" ? (
        <div id="copy-writing-fallback" className="copy-writing-fallback" style={{ marginTop: ".75rem" }}>
          <p className="small">We couldn&apos;t copy your writing automatically.</p>
          <p className="small">Your writing is still visible in this browser view.</p>
          <p className="small">If you copy it manually, click Done copying when you are finished.</p>
          <textarea
            aria-label="Writing to copy manually"
            className="settings saved-writing-area"
            id="copy-writing-text"
            readOnly
            ref={fallbackTextRef}
            style={{ marginTop: ".5rem", minHeight: "160px" }}
            value={writingText}
          />
          <div className="chip-row" style={{ marginTop: ".65rem" }}>
            <button className="btn btn-soft btn-sm" onClick={selectFallbackText} type="button">
              Select all
            </button>
            <button className="btn btn-soft btn-sm" onClick={copyWriting} type="button">
              Try again
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
