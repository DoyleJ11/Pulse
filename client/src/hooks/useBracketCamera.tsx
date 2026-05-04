import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface BracketCameraProps {
  currentMatchup: number | null;
  isReady: boolean;
}

export function useBracketCamera({
  currentMatchup,
  isReady,
}: BracketCameraProps) {
  const CAMERA_PAN_DELAY_MS = 1200;
  const CAMERA_SETTLE_DELAY_MS = 900;
  const HORIZONTAL_CENTER_TOLERANCE = 240;
  const VERTICAL_CENTER_TOLERANCE = 360;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const championRef = useRef<HTMLDivElement | null>(null);
  const matchupRefs = useRef(new Map<number, HTMLDivElement>());
  const cameraMoveTimeoutRef = useRef<number | null>(null);
  const isProgrammaticMoveRef = useRef(false);
  const [showRecenter, setShowRecenter] = useState(false);

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

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

  function getTargetScrollPosition() {
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

    const maxLeft = scroller.scrollWidth - scroller.clientWidth;
    const maxTop = document.documentElement.scrollHeight - window.innerHeight;

    return {
      left: clamp(left, 0, Math.max(0, maxLeft)),
      top: clamp(top, 0, Math.max(0, maxTop)),
    };
  }

  function isCameraCentered() {
    const scroller = scrollContainerRef.current;
    const targetPosition = getTargetScrollPosition();
    if (!scroller || !targetPosition) return true;

    const horizontalDiff = Math.abs(scroller.scrollLeft - targetPosition.left);
    const verticalDiff = Math.abs(window.scrollY - targetPosition.top);

    return (
      horizontalDiff < HORIZONTAL_CENTER_TOLERANCE &&
      verticalDiff < VERTICAL_CENTER_TOLERANCE
    );
  }

  useEffect(() => {
    if (!isReady) return;

    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    let frameId: number | null = null;

    const updateRecenterVisibility = () => {
      if (isProgrammaticMoveRef.current) return;
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        setShowRecenter(!isCameraCentered());
        frameId = null;
      });
    };

    scroller.addEventListener("scroll", updateRecenterVisibility, {
      passive: true,
    });

    window.addEventListener("scroll", updateRecenterVisibility, {
      passive: true,
    });

    updateRecenterVisibility();

    return () => {
      scroller.removeEventListener("scroll", updateRecenterVisibility);
      window.removeEventListener("scroll", updateRecenterVisibility);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isReady, currentMatchup]);

  const moveToCurrentTarget = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const scroller = scrollContainerRef.current;
      const target = getCameraTarget();
      const targetPosition = getTargetScrollPosition();
      if (!scroller || !target) return;

      scroller.scrollTo({ left: targetPosition?.left, behavior });
      window.scrollTo({ top: targetPosition?.top, behavior });

      isProgrammaticMoveRef.current = true;
      setShowRecenter(false);

      if (cameraMoveTimeoutRef.current !== null) {
        window.clearTimeout(cameraMoveTimeoutRef.current);
      }

      cameraMoveTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticMoveRef.current = false;
        setShowRecenter(!isCameraCentered());
      }, CAMERA_SETTLE_DELAY_MS);
    },
    [currentMatchup],
  );

  useEffect(() => {
    return () => {
      if (cameraMoveTimeoutRef.current !== null) {
        window.clearTimeout(cameraMoveTimeoutRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      moveToCurrentTarget("smooth");
    }, CAMERA_PAN_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [currentMatchup, isReady, moveToCurrentTarget]);

  return {
    scrollContainerRef,
    championRef,
    registerMatchupRef,
    recenter: () => {
      moveToCurrentTarget("smooth");
      setShowRecenter(false);
    },
    showRecenter,
  };
}
