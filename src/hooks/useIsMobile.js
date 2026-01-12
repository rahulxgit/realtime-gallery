import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handler = () => setIsMobile(media.matches);

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
