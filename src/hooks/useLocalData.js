import { useCallback, useState } from "react";
import { loadLocalData, saveLocalData } from "../storage/appStorage";

/**
 * Trách nhiệm duy nhất: dữ liệu CHỈ thuộc về thiết bị — tick "đã ăn" theo
 * ngày (namespaced theo planId) và cài đặt nhắc nhở. Ghi lại appStorage mỗi
 * lần đổi, không biết gì về server hay điều hướng màn hình.
 */
export function useLocalData() {
  const [localData, setLocalData] = useState(null);

  const load = useCallback(async (userId) => {
    const data = await loadLocalData(userId);
    setLocalData(data);
    return data;
  }, []);

  const clear = useCallback(() => setLocalData(null), []);

  const update = useCallback((userId, patch) => {
    setLocalData((prev) => {
      const next = { ...prev, ...patch };
      saveLocalData(userId, next);
      return next;
    });
  }, []);

  // Progress khoá theo planId: nếu thực đơn đã bị xây lại, không kế thừa
  // checkmark cũ của thực đơn không còn tồn tại nữa.
  const toggleMeal = useCallback(
    (userId, dateKeyStr, mealSlot, planId) => {
      setLocalData((prev) => {
        const dayEntry = prev.progress[dateKeyStr]?.planId === planId ? prev.progress[dateKeyStr] : { planId };
        const next = { ...prev, progress: { ...prev.progress, [dateKeyStr]: { ...dayEntry, [mealSlot]: !dayEntry[mealSlot] } } };
        saveLocalData(userId, next);
        return next;
      });
    },
    []
  );

  return { localData, load, clear, update, toggleMeal };
}
