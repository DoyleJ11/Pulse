import { useCallback, useLayoutEffect, useRef } from "react";

interface BracketCameraProps {
  currentMatchup: number | null;
  isReady: boolean;
}

export function useBracketCamera({
  currentMatchup,
  isReady,
}: BracketCameraProps) {
  const CAMERA_PAN_DELAY_MS = 1200;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const championRef = useRef<HTMLDivElement | null>(null);
  const matchupRefs = useRef(new Map<number, HTMLDivElement>());

  const registerMatchupRef = useCallback((parentIndex: number) => {
    return (node: HTMLDivElement | null) => {
      if (node) {
        matchupRefs.current.set(parentIndex, node);
      } else {
        matchupRefs.current.delete(parentIndex);
      }
    };
  }, []);

  function getCameraTarget(): HTMLDivElement | null {
    if (currentMatchup === null) {
      return championRef.current;
    }

    return matchupRefs.current.get(currentMatchup) ?? null;
  }

  useLayoutEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      const scroller = scrollContainerRef.current;
      const target = getCameraTarget();

      if (!scroller || !target) return;

      const scrollerRect = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const left =
        scroller.scrollLeft +
        targetRect.left -
        scrollerRect.left -
        (scroller.clientWidth - targetRect.width) / 2;
      const top =
        window.scrollY +
        targetRect.top -
        (window.innerHeight - targetRect.height) / 2;

      scroller.scrollTo({ left, behavior: "smooth" });
      window.scrollTo({ top, behavior: "smooth" });
    }, CAMERA_PAN_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentMatchup, isReady]);

  return {
    scrollContainerRef,
    championRef,
    registerMatchupRef,
  };
}
