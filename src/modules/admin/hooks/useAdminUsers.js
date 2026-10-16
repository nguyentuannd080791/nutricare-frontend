import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

/**
 * Trách nhiệm duy nhất: nạp danh sách người dùng theo bộ lọc và trang.
 * Đổi bộ lọc hoặc trang sẽ nạp lại dữ liệu; loading suy ra từ việc kết quả
 * đang giữ chưa khớp với queryKey hiện tại.
 */
export function useAdminUsers({ page = 1, pageSize = 20, search = "", premium = "" } = {}) {
  const queryKey = `${page}|${pageSize}|${search}|${premium}`;
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    adminApi
      .users({
        page,
        pageSize,
        search: search ? search.trim() : undefined,
        premium: premium !== "" ? premium : undefined,
      })
      .then((data) => !cancelled && setResult({ key: queryKey, data, error: null }))
      .catch((e) => !cancelled && setResult({ key: queryKey, data: null, error: e.message }));

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, search, premium, queryKey]);

  const loading = result.key !== queryKey;
  return { loading, data: loading ? null : result.data, error: loading ? null : result.error };
}
