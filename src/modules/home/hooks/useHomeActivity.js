import { useCallback, useEffect, useRef, useState } from "react";
import { dailySummaryApi } from "../../exercise/api/dailySummaryApi";
import { exerciseApi } from "../../exercise/api/exerciseApi";
import { workoutPlanApi } from "../../exercise/api/workoutPlanApi";
import { waterApi } from "../api/waterApi";
import { streakApi } from "../api/streakApi";

async function fetchActivity(date, onPartialUpdate = null) {
  const tasks = [
    dailySummaryApi
      .get(date)
      .then((res) => {
        onPartialUpdate?.("summary", res);
        return res;
      })
      .catch(() => null),
    workoutPlanApi
      .get(date)
      .then((res) => {
        onPartialUpdate?.("workoutPlan", res);
        return res;
      })
      .catch(() => null),
    waterApi
      .get(date)
      .then((res) => {
        onPartialUpdate?.("water", res);
        return res;
      })
      .catch(() => null),
    streakApi
      .get()
      .then((res) => {
        onPartialUpdate?.("streak", res);
        return res;
      })
      .catch(() => null),
  ];

  const [summary, workoutPlan, water, streak] = await Promise.all(tasks);
  return { date, summary, workoutPlan, water, streak };
}

/**
 * Hook quản lý hoạt động Trang chủ (SOLID: Single Responsibility).
 * - Nạp trước từ `initialActivity` (userData) để hiển thị 0ms.
 * - Áp dụng DEBOUNCED OPTIMISTIC UI:
 *   Giao diện phản hồi 0ms tức thì trên mỗi lần bấm (không bao giờ khóa nút),
 *   gom các thao tác liên tiếp qua debounce ngắn (350ms) để chỉ gửi trạng thái
 *   cuối cùng xuống backend, tránh spam API và loại bỏ hoàn toàn giật/khóa.
 */
export function useHomeActivity(date, refreshKey = 0, initialActivity = null) {
  const [activity, setActivity] = useState(() => ({
    date,
    summary: initialActivity?.summary ?? null,
    workoutPlan: initialActivity?.workoutPlan ?? null,
    water: initialActivity?.water ?? null,
    streak: initialActivity?.streak ?? null,
  }));
  const [error, setError] = useState("");

  const workoutDebounceTimers = useRef(new Map());
  const pendingWorkoutSync = useRef(new Map());

  useEffect(() => {
    let cancelled = false;

    const handlePartialUpdate = (key, value) => {
      if (!cancelled && value) {
        setActivity((prev) => ({ ...prev, [key]: value }));
      }
    };

    fetchActivity(date, handlePartialUpdate).then((loaded) => {
      if (!cancelled) setActivity(loaded);
    });

    return () => {
      cancelled = true;
    };
  }, [date, refreshKey]);

  /**
   * Toggle bài tập:
   * - CẬP NHẬT UI TỨC THÌ (0ms), không hề có độ trễ giữa các lần bấm
   * - Không chặn/khóa click của người dùng
   * - Gom request bằng debounce 350ms, tránh spam API khi người dùng bấm liên tục
   * - Hoàn tác nếu có lỗi mạng
   */
  const toggleWorkout = useCallback(
    (workout) => {
      if (!workout?.exerciseId) return;
      const exerciseId = workout.exerciseId;
      setError("");

      let desiredCompleted = false;
      let desiredMinutes = workout.minutes || 0;
      let knownLogIds = [];
      let snapshotActivity = null;

      // BƯỚC 1: CẬP NHẬT STATE UI TỨC THÌ (0ms) - Phản hồi mượt mà tuyệt đối
      setActivity((prev) => {
        snapshotActivity = prev;
        const currentPlan = prev.workoutPlan || initialActivity?.workoutPlan;
        if (!currentPlan) return prev;

        const currentWorkout = currentPlan.workouts?.find((w) => w.exerciseId === exerciseId);
        // Suy ra trạng thái kế tiếp từ store hiện tại, tránh stale closure khi bấm nhanh
        desiredCompleted = currentWorkout ? !currentWorkout.completed : !workout.completed;
        desiredMinutes = currentWorkout?.minutes || workout.minutes || 0;
        knownLogIds = currentWorkout?.logIds || workout.logIds || [];

        const nextWorkouts = (currentPlan.workouts || []).map((w) => {
          if (w.exerciseId === exerciseId) {
            return {
              ...w,
              completed: desiredCompleted,
              logIds: desiredCompleted
                ? (w.logIds?.length ? w.logIds : ["opt-pending"])
                : [],
            };
          }
          return w;
        });

        // TÍNH TOÁN TUYỆT ĐỐI TỪ DANH SÁCH BÀI TẬP (chống hoàn toàn hiện tượng cộng dồn hoặc nhân đôi)
        const doneCount = nextWorkouts.filter((w) => w.completed).length;
        const nextBurnedKcal = nextWorkouts
          .filter((w) => w.completed)
          .reduce((sum, w) => sum + (w.plannedKcal || 0), 0);
        const nextActiveMinutes = nextWorkouts
          .filter((w) => w.completed)
          .reduce((sum, w) => sum + (w.minutes || 0), 0);

        const currentBurned = currentPlan.burnedKcal || 0;
        const deltaKcal = nextBurnedKcal - currentBurned;

        const nextPlan = {
          ...currentPlan,
          workouts: nextWorkouts,
          doneCount,
          burnedKcal: nextBurnedKcal,
          activeMinutes: nextActiveMinutes,
        };

        const currentSummary = prev.summary || initialActivity?.summary;
        const nextSummary = currentSummary
          ? {
              ...currentSummary,
              burnedKcal: Math.max(0, (currentSummary.burnedKcal || 0) + deltaKcal),
            }
          : null;

        return {
          ...prev,
          workoutPlan: nextPlan,
          summary: nextSummary ?? prev.summary,
        };
      });

      // Lưu trạng thái mong muốn mới nhất
      pendingWorkoutSync.current.set(exerciseId, {
        isCompleting: desiredCompleted,
        minutes: desiredMinutes,
        knownLogIds,
        snapshotActivity,
      });

      // BƯỚC 2: DEBOUNCE GỬI API XUỐNG SERVER (350ms) - Gom các lần bấm liên tiếp, không khóa nút
      if (workoutDebounceTimers.current.has(exerciseId)) {
        clearTimeout(workoutDebounceTimers.current.get(exerciseId));
      }

      const timer = setTimeout(async () => {
        workoutDebounceTimers.current.delete(exerciseId);
        const target = pendingWorkoutSync.current.get(exerciseId);
        if (!target) return;
        pendingWorkoutSync.current.delete(exerciseId);

        try {
          if (target.isCompleting) {
            const created = await exerciseApi.add({
              exerciseId,
              minutes: target.minutes,
            });
            if (created?.id) {
              setActivity((prev) => {
                if (!prev.workoutPlan) return prev;
                return {
                  ...prev,
                  workoutPlan: {
                    ...prev.workoutPlan,
                    workouts: prev.workoutPlan.workouts.map((w) =>
                      w.exerciseId === exerciseId ? { ...w, logIds: [created.id] } : w
                    ),
                  },
                };
              });
            }
          } else {
            // Bỏ tick:
            // 1. Gọi xóa theo exerciseId để server dọn sạch mọi bản ghi hôm nay của bài tập này
            await exerciseApi.remove(exerciseId).catch(() => null);
            // 2. Dọn thêm các id cụ thể nếu có
            for (const logId of target.knownLogIds) {
              if (logId && logId !== "opt-pending" && logId !== exerciseId) {
                await exerciseApi.remove(logId).catch(() => null);
              }
            }
          }
        } catch (e) {
          if (target.snapshotActivity) {
            setActivity(target.snapshotActivity);
          }
          setError(e.message || "Không thể đồng bộ bài tập với máy chủ");
        }
      }, 350);

      workoutDebounceTimers.current.set(exerciseId, timer);
    },
    [initialActivity]
  );

  const setWaterCups = useCallback(
    async (cups) => {
      setError("");
      setActivity((previous) => ({
        ...previous,
        water: previous.water ? { ...previous.water, cups } : { cups, goalCups: 8, cupMl: 250, maxCups: 12 },
      }));
      try {
        await waterApi.set(cups);
      } catch (e) {
        setError(e.message);
        setActivity(await fetchActivity(date));
      }
    },
    [date]
  );

  const effectiveWorkoutPlan = activity.workoutPlan || initialActivity?.workoutPlan || null;
  const effectiveSummary = activity.summary || initialActivity?.summary || null;
  const effectiveWater = activity.water || initialActivity?.water || null;
  const effectiveStreak = activity.streak || initialActivity?.streak || null;

  return {
    loading: activity.date !== date && !effectiveWorkoutPlan,
    restDay: Boolean(effectiveWorkoutPlan?.restDay || effectiveStreak?.todayRest),
    summary: effectiveSummary,
    workoutPlan: effectiveWorkoutPlan,
    water: effectiveWater,
    streak: effectiveStreak,
    error,
    toggleWorkout,
    setWaterCups,
  };
}
