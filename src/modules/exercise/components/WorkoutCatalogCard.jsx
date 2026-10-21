import React from "react";
import { Flame, Clock, Dumbbell, Sparkles, CheckCircle2, Star } from "lucide-react";
import { calcBurnedCalories } from "../domain/exerciseCatalogModel";

const INTENSITY_THEMES = {
  light: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  high: {
    bg: "bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-500",
  },
};

export default function WorkoutCatalogCard({
  workout,
  weightKg = 65,
  isPlanWorkout = false,
  completedLog = null,
  onLog,
}) {
  const intensity = INTENSITY_THEMES[workout.intensity] || INTENSITY_THEMES.medium;
  const estimatedKcal = calcBurnedCalories(workout.met, workout.defaultMinutes, weightKg);
  const isCompleted = Boolean(completedLog);

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 hover:shadow-md group ${
        isCompleted
          ? "border-emerald-500/40 bg-emerald-500/[0.03]"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div>
        {/* Hàng nhãn đặc biệt: Kế hoạch hôm nay & Đã tập */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {isPlanWorkout && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              Kế hoạch hôm nay
            </span>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
              Đã tập ({completedLog.minutes}p • +{completedLog.kcal} calo)
            </span>
          )}
        </div>

        {/* Header: Phân loại & Cường độ */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11.5px] font-semibold text-descGray uppercase tracking-wider">
            {workout.categoryLabel}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium border ${intensity.bg} ${intensity.text} ${intensity.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${intensity.dot}`} />
            {workout.intensityLabel}
          </span>
        </div>

        {/* Tên bài tập */}
        <h4 className="text-[16px] font-bold text-fg group-hover:text-primary transition-colors leading-snug m-0 mb-2.5">
          {workout.title}
        </h4>

        {/* Thông số calo & thời gian ước tính */}
        <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/60 mb-3 border border-border/40">
          <div className="flex items-center gap-1.5 text-rose-500">
            <Flame size={16} className="shrink-0" />
            <span className="text-[14px] font-extrabold">{estimatedKcal}</span>
            <span className="text-[11px] font-medium text-descGray">kcal</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5 text-descGray">
            <Clock size={14} className="shrink-0" />
            <span className="text-[12.5px] font-medium">{workout.defaultMinutes} phút</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-card text-descGray border border-border/60">
            MET {workout.met}
          </span>
        </div>

        {/* Tags nhóm cơ & Dụng cụ */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-[11px] font-medium text-descGray">
            <Dumbbell size={11} className="shrink-0" />
            {workout.equipment}
          </span>
          {workout.muscles.slice(0, 2).map((muscle) => (
            <span
              key={muscle}
              className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-descGray"
            >
              {muscle}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button: Ghi nhận bài tập */}
      <button
        type="button"
        onClick={() => onLog(workout)}
        className={`w-full py-2.5 px-3 rounded-xl font-semibold text-[13.5px] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
          isCompleted
            ? "bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white border border-emerald-500/30"
            : "bg-primary/10 hover:bg-primary text-primary hover:text-white"
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 size={15} />
            <span>Đã tập • Ghi thêm thời gian</span>
          </>
        ) : (
          <>
            <Sparkles size={15} />
            <span>Ghi nhận đã tập</span>
          </>
        )}
      </button>
    </div>
  );
}
