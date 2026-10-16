import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

/**
 * Trách nhiệm duy nhất: nạp số liệu thống kê admin cho khoảng `days` ngày.
 * "Đang tải" suy ra từ việc kết quả đang giữ chưa thuộc `days` hiện tại, nên
 * đổi khoảng ngày không cần setState đồng bộ trong effect.
 */
export function useAdminStats(days) {
  const [result, setResult] = useState({ days: null, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    adminApi
      .stats(days)
      .then((data) => !cancelled && setResult({ days, data, error: null }))
      .catch((e) => !cancelled && setResult({ days, data: null, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [days]);

  const loading = result.days !== days;
  return { loading, data: loading ? null : result.data, error: loading ? null : result.error };
}
