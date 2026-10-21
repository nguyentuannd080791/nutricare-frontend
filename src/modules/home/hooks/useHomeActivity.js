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
  const activityRef = useRef(activity);

  useEffect(() => {
    activityRef.current = activity;
  }, [activity]);

  useEffect(() => {
    let cancelled = false;

    const handlePartialUpdate = (key, value) => {
      if (!cancelled && value) {
        setActivity((prev) => {
          const next = { ...prev, [key]: value };
          activityRef.current = next;
          return next;
        });
      }
    };

    fetchActivity(date, handlePartialUpdate).then((loaded) => {
      if (!cancelled) {
        setActivity(loaded);
        activityRef.current = loaded;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [date, refreshKey]);

  /**
   * Toggle bài tập:
   * - CẬP NHẬT UI TỨC THÌ (0ms), không hề có độ trễ giữa các lần bấm
   * - Không chặn/khóa click của người dùng
   * - Gom request bằng debounce 350ms, gửi trạng thái chính xác (thêm/xóa) xuống backend
   * - Hoàn tác nếu có lỗi mạng
   */
  const toggleWorkout = useCallback(
    (workout) => {
      if (!workout?.exerciseId) return;
      const exerciseId = workout.exerciseId;
      setError("");

      // 1. Phân giải trạng thái kế tiếp ĐỒNG BỘ từ activityRef (tránh stale closure và React batching lag)
      const currentActivity = activityRef.current;
      const currentPlan = currentActivity?.workoutPlan || initialActivity?.workoutPlan;
      const currentWorkout = currentPlan?.workouts?.find((w) => w.exerciseId === exerciseId);

      const isCurrentlyCompleted = currentWorkout !== undefined
        ? Boolean(currentWorkout.completed)
        : Boolean(workout.completed);
      const desiredCompleted = !isCurrentlyCompleted;
      const desiredMinutes = currentWorkout?.minutes || workout.minutes || 0;
      const knownLogIds = currentWorkout?.logIds || workout.logIds || [];
      const snapshotActivity = currentActivity;

      // 2. CẬP NHẬT STATE UI TỨC THÌ (0ms) - Phản hồi mượt mà tuyệt đối
      setActivity((prev) => {
        const plan = prev.workoutPlan || initialActivity?.workoutPlan;
        if (!plan) return prev;

        const nextWorkouts = (plan.workouts || []).map((w) => {
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

        // TÍNH TOÁN TUYỆT ĐỐI TỪ DANH SÁCH BÀI TẬP (chống cộng dồn hoặc nhân đôi)
        const doneCount = nextWorkouts.filter((w) => w.completed).length;
        const extraKcal = (plan.extraWorkouts || []).reduce((sum, w) => sum + (w.burnedKcal || 0), 0);
        const extraMinutes = (plan.extraWorkouts || []).reduce((sum, w) => sum + (w.minutes || 0), 0);
        const nextBurnedKcal = nextWorkouts
          .filter((w) => w.completed)
          .reduce((sum, w) => sum + (w.plannedKcal || 0), 0) + extraKcal;
        const nextActiveMinutes = nextWorkouts
          .filter((w) => w.completed)
          .reduce((sum, w) => sum + (w.minutes || 0), 0) + extraMinutes;

        const currentBurned = plan.burnedKcal || 0;
        const deltaKcal = nextBurnedKcal - currentBurned;

        const nextPlan = {
          ...plan,
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

        const nextAct = {
          ...prev,
          workoutPlan: nextPlan,
          summary: nextSummary ?? prev.summary,
        };
        activityRef.current = nextAct;
        return nextAct;
      });

      // 3. Lưu trạng thái đồng bộ mong muốn
      pendingWorkoutSync.current.set(exerciseId, {
        isCompleting: desiredCompleted,
        minutes: desiredMinutes,
        knownLogIds,
        snapshotActivity,
      });

      // 4. DEBOUNCE GỬI API XUỐNG SERVER (350ms)
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
              date,
            });
            if (created?.id) {
              setActivity((prev) => {
                if (!prev.workoutPlan) return prev;
                const nextAct = {
                  ...prev,
                  workoutPlan: {
                    ...prev.workoutPlan,
                    workouts: prev.workoutPlan.workouts.map((w) =>
                      w.exerciseId === exerciseId ? { ...w, logIds: [created.id] } : w
                    ),
                  },
                };
                activityRef.current = nextAct;
                return nextAct;
              });
            }
          } else {
            // Bỏ tick:
            // 1. Gọi xóa theo exerciseId cho ngày hôm nay để server dọn sạch bản ghi
            await exerciseApi.remove(exerciseId, date).catch(() => null);
            // 2. Dọn thêm các id cụ thể nếu có
            for (const logId of target.knownLogIds) {
              if (logId && logId !== "opt-pending" && logId !== exerciseId) {
                await exerciseApi.remove(logId, date).catch(() => null);
              }
            }
          }
        } catch (e) {
          if (target.snapshotActivity) {
            setActivity(target.snapshotActivity);
            activityRef.current = target.snapshotActivity;
          }
          setError(e.message || "Không thể đồng bộ bài tập với máy chủ");
        }
      }, 350);

      workoutDebounceTimers.current.set(exerciseId, timer);
    },
    [date, initialActivity]
  );

  const setWaterCups = useCallback(
    async (cups) => {
      setError("");
      setActivity((previous) => {
        const next = {
          ...previous,
          water: previous.water ? { ...previous.water, cups } : { cups, goalCups: 8, cupMl: 250, maxCups: 12 },
        };
        activityRef.current = next;
        return next;
      });
      try {
        await waterApi.set(cups);
      } catch (e) {
        setError(e.message);
        const refreshed = await fetchActivity(date);
        setActivity(refreshed);
        activityRef.current = refreshed;
      }
    },
    [date]
  );

  const removeExtraWorkout = useCallback(
    async (idOrExerciseId) => {
      if (!idOrExerciseId) return;

      // Lưu lại snapshot để hoàn tác nếu có lỗi mạng
      const snapshotActivity = activityRef.current;

      // 1. Cập nhật state UI ngay lập tức: loại bỏ bài tập thêm, bảo toàn 100% trạng thái bài tập kế hoạch
      setActivity((prev) => {
        const currentPlan = prev?.workoutPlan || initialActivity?.workoutPlan;
        if (!currentPlan) return prev;

        const currentExtra = currentPlan.extraWorkouts || [];
        const target = currentExtra.find(
          (w) => w.id === idOrExerciseId || w.exerciseId === idOrExerciseId
        );
        const removedKcal = target?.burnedKcal || 0;
        const removedMinutes = target?.minutes || 0;

        const nextExtra = currentExtra.filter(
          (w) => w.id !== idOrExerciseId && w.exerciseId !== idOrExerciseId
        );

        const nextPlan = {
          ...currentPlan,
          extraWorkouts: nextExtra,
          burnedKcal: Math.max(0, (currentPlan.burnedKcal || 0) - removedKcal),
          activeMinutes: Math.max(0, (currentPlan.activeMinutes || 0) - removedMinutes),
        };

        const currentSummary = prev.summary || initialActivity?.summary;
        const nextSummary = currentSummary
          ? {
              ...currentSummary,
              burnedKcal: Math.max(0, (currentSummary.burnedKcal || 0) - removedKcal),
            }
          : currentSummary;

        const nextAct = {
          ...prev,
          workoutPlan: nextPlan,
          summary: nextSummary,
        };
        activityRef.current = nextAct;
        return nextAct;
      });

      // 2. Gửi lệnh xóa xuống server (có kèm ngày để xóa an toàn)
      try {
        await exerciseApi.remove(idOrExerciseId, date);
      } catch (e) {
        if (snapshotActivity) {
          setActivity(snapshotActivity);
          activityRef.current = snapshotActivity;
        }
        setError(e.message || "Không thể xoá bài tập");
      }
    },
    [date, initialActivity]
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
    removeExtraWorkout,
    setWaterCups,
  };
}
