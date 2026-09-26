import { useCallback, useState } from "react";

/**
 * Trách nhiệm duy nhất: hiển thị/tự ẩn 1 toast tại 1 thời điểm.
 * Không biết gì về lỗi API hay nghiệp vụ — nơi gọi tự quyết định message/tone.
 */
export function useToast(durationMs = 2600) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    (message, tone = "success") => {
      setToast({ message, tone });
      setTimeout(() => setToast(null), durationMs);
    },
    [durationMs]
  );

  const reportError = useCallback((e) => showToast(e.message, "error"), [showToast]);

  return { toast, showToast, reportError };
}
