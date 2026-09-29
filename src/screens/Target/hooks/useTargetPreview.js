import { useEffect, useState } from "react";
import { targetApi } from "../../../services/api";

const EMPTY = { preview: null, error: "" };

/**
 * Trách nhiệm duy nhất: gọi API xem-trước kết quả tính mục tiêu dinh dưỡng
 * mỗi khi lựa chọn đổi. Công thức và luật an toàn (tốc độ giảm/tăng cân, BMI,
 * sàn calo) chỉ tồn tại ở server — hook này không tự tính gì, chỉ gọi & giữ
 * kết quả hoặc lý do server từ chối. Chưa đủ dữ liệu (enabled=false) thì xoá
 * kết quả cũ để không xác nhận nhầm một bản xem trước đã lỗi thời.
 */
export function useTargetPreview({ goalId, activityId, durationMonths, targetChangeKg, enabled }) {
  const [state, setState] = useState(EMPTY);

  useEffect(() => {
    setState(EMPTY);
    if (!goalId || !activityId || !enabled) return;
    let cancelled = false;
    targetApi
      .preview({ goalId, activityId, durationMonths, targetChangeKg })
      .then((preview) => !cancelled && setState({ preview, error: "" }))
      .catch((e) => !cancelled && setState({ preview: null, error: e.message }));
    return () => { cancelled = true; };
  }, [goalId, activityId, durationMonths, targetChangeKg, enabled]);

  return state;
}
