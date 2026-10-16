import { useEffect, useState } from "react";

// Trả về `value` sau khi ngừng thay đổi `delayMs` — tránh gọi API mỗi phím gõ.
export function useDebounced(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
