import { useCallback, useState } from "react";
import { bmiApi } from "../../modules/bmi/api/bmiApi";
import { targetApi } from "../../modules/target/api/targetApi";
import { conditionApi } from "../../modules/conditions/api/conditionApi";
import { planApi } from "../../modules/plan/api/planApi";
import { workoutPlanApi } from "../../modules/exercise/api/workoutPlanApi";
import { waterApi } from "../../modules/home/api/waterApi";
import { streakApi } from "../../modules/home/api/streakApi";
import { dailySummaryApi } from "../../modules/exercise/api/dailySummaryApi";
import { dateKey } from "../../shared/domain/planCycle";

// Dữ liệu nằm ở backend — nạp đồng thời toàn bộ khi vào app để các màn hình
// (đặc biệt là Trang chủ: Bài tập đi kèm, Nước, Chuỗi, Calo) có sẵn dữ liệu ngay
// từ frame render đầu tiên mà không bị trễ/giật layout.
const SERVER_LOADERS = {
  bmiRecords: () => bmiApi.list().catch(() => []),
  targets: () => targetApi.list().catch(() => []),
  conditions: () => conditionApi.list().catch(() => []),
  mealPlans: () => planApi.history().catch(() => []),
  workoutPlan: () => workoutPlanApi.get(dateKey()).catch(() => null),
  water: () => waterApi.get(dateKey()).catch(() => null),
  streak: () => streakApi.get().catch(() => null),
  summary: () => dailySummaryApi.get(dateKey()).catch(() => null),
};

/**
 * Trách nhiệm duy nhất: giữ + nạp lại dữ liệu nghiệp vụ đến từ server.
 * Nạp cùng lúc trong `loadAll()` để loại bỏ hoàn toàn độ trễ bất đối xứng giữa các khối.
 */
export function useServerData() {
  const [serverData, setServerData] = useState(null);

  const loadAll = useCallback(async () => {
    const entries = await Promise.all(
      Object.entries(SERVER_LOADERS).map(async ([key, load]) => [key, await load()])
    );
    const next = Object.fromEntries(entries);
    setServerData(next);
    return next;
  }, []);

  const reload = useCallback(async (...keys) => {
    const entries = await Promise.all(
      keys.map(async (key) => [key, SERVER_LOADERS[key] ? await SERVER_LOADERS[key]() : null])
    );
    setServerData((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
  }, []);

  const clear = useCallback(() => setServerData(null), []);

  return { serverData, loadAll, reload, clear };
}
