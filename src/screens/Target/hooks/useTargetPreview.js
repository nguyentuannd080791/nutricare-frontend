import { useEffect, useState } from "react";
import { targetApi } from "../../../services/api";

/**
 * Trách nhiệm duy nhất: gọi API xem-trước kết quả tính mục tiêu dinh dưỡng
 * mỗi khi goalId/activityId đổi. Công thức tính chỉ tồn tại ở server — hook
 * này không tự tính gì cả, chỉ gọi & giữ kết quả.
 */
export function useTargetPreview({ goalId, activityId, enabled }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!goalId || !activityId || !enabled) return;
    let cancelled = false;
    setPreview(null);
    targetApi.preview({ goalId, activityId }).then((res) => !cancelled && setPreview(res)).catch(() => {});
    return () => { cancelled = true; };
  }, [goalId, activityId, enabled]);

  return preview;
}
