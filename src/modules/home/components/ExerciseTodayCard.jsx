import React from "react";
import { Flame } from "lucide-react";

export default function ExerciseTodayCard({ workoutPlan, onOpenExercise, className = "" }) {
  const percent =
    workoutPlan.plannedKcal > 0 ? Math.min(100, Math.round((workoutPlan.burnedKcal / workoutPlan.plannedKcal) * 100)) : 0;

  return (
    <div className={`rounded-3xl bg-white border border-border p-5 sm:p-6 shadow-sm flex flex-col gap-3 ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">
        <Flame className="w-4 h-4" />
        Vận động hôm nay
      </span>

      <div>
        <span className="text-3xl font-extrabold text-fg">{workoutPlan.burnedKcal}</span>
        <span className="ml-1.5 text-xs font-semibold text-fg/50">
          {workoutPlan.restDay ? "kcal đã đốt (ngày nghỉ)" : `/ ${workoutPlan.plannedKcal} kcal kế hoạch`}
        </span>
        <p className="text-xs text-fg/60">
          {workoutPlan.restDay
            ? `Ngày nghỉ · ${workoutPlan.activeMinutes} phút vận động nhẹ`
            : `${workoutPlan.doneCount}/${workoutPlan.totalCount} bài · ${workoutPlan.activeMinutes} phút`}
        </p>
      </div>

      {workoutPlan.restDay ? null : (
        <div className="w-full h-2.5 rounded-full bg-accent/15 overflow-hidden">
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      )}

      <button type="button" onClick={onOpenExercise} className="text-left text-xs font-semibold text-accent hover:underline">
        Ghi thêm bài tập khác →
      </button>
    </div>
  );
}
