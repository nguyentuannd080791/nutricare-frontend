import { useCallback, useEffect, useState } from "react";

export function useCountdown(startSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(startSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((previous) => previous - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const restart = useCallback(() => setSecondsLeft(startSeconds), [startSeconds]);

  return { secondsLeft, restart };
}
