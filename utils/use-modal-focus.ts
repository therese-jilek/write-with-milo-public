"use client";

import { useEffect, useRef, type RefObject } from "react";

type ModalFocusOptions = {
  active: boolean;
  escapeCloses?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onClose?: () => void;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

function focusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.offsetParent !== null
  );
}

export function useModalFocus<T extends HTMLElement>({
  active,
  escapeCloses = true,
  initialFocusRef,
  onClose
}: ModalFocusOptions) {
  const modalRef = useRef<T | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active || typeof document === "undefined") {
      return;
    }

    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = modalRef.current;

    if (!modal) {
      return;
    }

    const modalElement = modal;

    function focusInitialElement() {
      const initialElement = initialFocusRef?.current;

      if (initialElement && modalElement.contains(initialElement)) {
        initialElement.focus();
        return;
      }

      const focusable = focusableElements(modalElement);
      const target = focusable[0] || modalElement;
      target.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && escapeCloses && onCloseRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = focusableElements(modalElement);

      if (!focusable.length) {
        event.preventDefault();
        modalElement.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !modalElement.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const focusTimer = window.setTimeout(focusInitialElement, 0);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);

      const opener = openerRef.current;
      if (opener && document.contains(opener)) {
        window.setTimeout(() => opener.focus(), 0);
      }
    };
  }, [active, escapeCloses, initialFocusRef]);

  return modalRef;
}
