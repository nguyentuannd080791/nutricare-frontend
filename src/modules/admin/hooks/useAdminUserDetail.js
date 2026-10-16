import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

/**
 * Trách nhiệm duy nhất: nạp chi tiết người dùng theo userId.
 */
export function useAdminUserDetail(userId) {
  const [result, setResult] = useState({ userId: null, data: null, error: null });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    adminApi
      .user(userId)
      .then((data) => !cancelled && setResult({ userId, data, error: null }))
      .catch((e) => !cancelled && setResult({ userId, data: null, error: e.message }));

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const loading = Boolean(userId && result.userId !== userId);
  return { loading, data: loading ? null : result.data, error: loading ? null : result.error };
}
