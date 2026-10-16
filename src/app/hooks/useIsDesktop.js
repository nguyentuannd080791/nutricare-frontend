import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

/** Trách nhiệm duy nhất: cho biết viewport có đủ rộng để dùng layout máy tính không. */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
