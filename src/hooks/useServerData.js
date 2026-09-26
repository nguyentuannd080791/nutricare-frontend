import { useCallback, useState } from "react";
import { bmiApi, targetApi, conditionApi, planApi } from "../services/api";

// Dữ liệu nằm ở backend — mỗi mutation xong chỉ nạp lại đúng phần bị ảnh hưởng.
const SERVER_LOADERS = {
  bmiRecords: bmiApi.list,
  targets: targetApi.list,
  conditions: conditionApi.list,
  mealPlans: planApi.history,
};

/**
 * Trách nhiệm duy nhất: giữ + nạp lại dữ liệu nghiệp vụ đến từ server
 * (bmiRecords, targets, conditions, mealPlans). Không biết gì về phiên đăng
 * nhập hay dữ liệu chỉ-lưu-trên-máy.
 */
export function useServerData() {
  const [serverData, setServerData] = useState(null);

  const loadAll = useCallback(async () => {
    const entries = await Promise.all(Object.entries(SERVER_LOADERS).map(async ([key, load]) => [key, await load()]));
    const next = Object.fromEntries(entries);
    setServerData(next);
    return next;
  }, []);

  const reload = useCallback(async (...keys) => {
    const entries = await Promise.all(keys.map(async (key) => [key, await SERVER_LOADERS[key]()]));
    setServerData((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
  }, []);

  const clear = useCallback(() => setServerData(null), []);

  return { serverData, loadAll, reload, clear };
}
