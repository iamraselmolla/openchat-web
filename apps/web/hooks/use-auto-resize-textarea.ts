import { useEffect, useRef } from "react";

/** Grows a textarea to fit its content up to a max height, then scrolls internally. */
export function useAutoResizeTextarea(value: string, maxHeightPx = 200) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, maxHeightPx);
    el.style.height = `${next}px`;
  }, [value, maxHeightPx]);

  return ref;
}
