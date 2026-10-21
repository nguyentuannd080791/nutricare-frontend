import React from "react";
import { CheckCircle2, Circle, Activity, Dumbbell, Flame, ChevronRight, Sparkles, Trash2 } from "lucide-react";
import RestDayNotice from "./RestDayNotice";

/**
 * Danh sách Bài tập đi kèm & Bài tập đã tập hôm nay (SOLID: Single Responsibility).
 * Đồng bộ toàn diện dữ liệu 2 chiều giữa Kế hoạch ngày và Thư viện bài tập.
 */
export default function WorkoutChecklist({
  workoutPlan,
  onToggleWorkout,
  onRemoveExtraWorkout,
  onExploreWorkouts,
}) {
  // Skeleton loader nếu dữ liệu đang nạp để chống giật trang
  if (!workoutPlan) {
    return (
      <section className="rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm space-y-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED]" />
            <div className="space-y-2">
              <div className="w-36 h-4 bg-slate-200/70 rounded" />
              <div className="w-48 h-3 bg-slate-200/50 rounded" />
            </div>
          </div>
          <div className="w-24 h-6 bg-slate-200/60 rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="h-20 bg-[#F8FAFC] border border-[#DCEEE7]/60 rounded-2xl" />
          <div className="h-20 bg-[#F8FAFC] border border-[#DCEEE7]/60 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (workoutPlan.restDay) {
    return (
      <RestDayNotice title="Hôm nay nghỉ tập">
        Cơ thể cần thời gian hồi phục. Không có bài tập bắt buộc và chuỗi ngày của bạn được giữ nguyên.
      </RestDayNotice>
    );
  }

  const doneCount = workoutPlan.doneCount || 0;
  const totalCount = workoutPlan.totalCount || workoutPlan.workouts?.length || 0;
  const burnedKcal = workoutPlan.burnedKcal || 0;
  const plannedKcal = workoutPlan.plannedKcal || 0;
  const extraWorkouts = workoutPlan.extraWorkouts || [];

  return (
    <section className="rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm space-y-5">
      {/* Header chính của Card */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FFF7ED] text-[#EA580C]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Bài tập đi kèm - {plannedKcal} calo
            </h2>
            <p className="text-xs text-[#0F172A]/60">
              Hoàn thành bài tập để tiêu hao năng lượng và duy trì thể trạng
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#EA580C] border border-[#EA580C]/20">
          {doneCount}/{totalCount} bài kế hoạch
          {extraWorkouts.length > 0 ? ` • +${extraWorkouts.length} bài thêm` : ""} • Đã đốt {burnedKcal} calo
        </span>
      </div>

      {/* KHỐI 1: CÁC BÀI TẬP TRONG KẾ HOẠCH HÔM NAY */}
      <div className="space-y-3">
        {workoutPlan.workouts?.map((workout) => {
          const completed = Boolean(workout.completed);

          return (
            <div
              key={workout.exerciseId}
              onClick={() => onToggleWorkout(workout)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleWorkout(workout);
                }
              }}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3.5 select-none ${
                completed
                  ? "bg-[#F4FBF7] border-[#10B981]/35"
                  : "bg-white border-[#DCEEE7] hover:border-[#EA580C]/50 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  type="button"
                  aria-label={completed ? "Bỏ hoàn thành bài tập" : "Hoàn thành bài tập"}
                  tabIndex={-1}
                  className="mt-0.5 shrink-0 transition-transform group-active:scale-90 pointer-events-none"
                >
                  {completed ? (
                    <CheckCircle2 className="w-6 h-6 text-[#059669] fill-[#ECFDF5]" />
                  ) : (
                    <Circle className="w-6 h-6 text-[#0F172A]/25 group-hover:text-[#EA580C]" />
                  )}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#EA580C]">
                      {workout.category || "Theo thực đơn"}
                    </span>
                    <span className="text-[11px] text-[#0F172A]/50 font-medium">
                      • {workout.time ? `${workout.time} (${workout.minutes} phút)` : `${workout.minutes} phút`}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold leading-snug transition-colors ${
                      completed ? "text-[#0F172A]/60" : "text-[#0F172A]"
                    }`}
                  >
                    {workout.label}
                  </h3>

                  <span className="inline-block text-[11px] font-medium text-[#0F172A]/55">
                    Cường độ: <strong className="text-[#0F172A]/75">{workout.intensity}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 space-y-0.5">
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-[#EA580C]">
                  <Flame className="w-3.5 h-3.5" />+{workout.plannedKcal} calo
                </span>
                <span
                  className={`block text-[11px] font-semibold ${
                    completed ? "text-[#059669]" : "text-[#0F172A]/40"
                  }`}
                >
                  {completed ? "✓ Đã tập" : "Chưa tập"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KHỐI 2: CÁC BÀI TẬP BỔ SUNG ĐÃ GHI TỪ THƯ VIỆN BÀI TẬP (NẾU CÓ) */}
      {extraWorkouts.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              Bài tập bổ sung đã ghi hôm nay
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
              Từ Thư viện
            </span>
          </div>

          <div className="space-y-2">
            {extraWorkouts.map((extra) => (
              <div
                key={extra.id || extra.exerciseId}
                className="p-3.5 rounded-2xl border border-[#10B981]/25 bg-[#F4FBF7] flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-[#059669] fill-[#ECFDF5] shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                      {extra.label}
                    </h4>
                    <span className="text-[11.5px] text-[#0F172A]/60 font-medium">
                      {extra.minutes} phút • Đã hoàn thành
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-extrabold text-[#059669] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#EA580C]" />+{extra.burnedKcal} calo
                  </span>
                  {typeof onRemoveExtraWorkout === "function" && (
                    <button
                      type="button"
                      onClick={() => onRemoveExtraWorkout(extra.id || extra.exerciseId)}
                      title="Xóa bài tập này"
                      aria-label={`Xóa bài tập ${extra.label}`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chân card: Khám phá thư viện bài tập */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Cần thêm bài tập phù hợp thể trạng?
        </span>
        {typeof onExploreWorkouts === "function" && (
          <button
            type="button"
            onClick={onExploreWorkouts}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFF7ED] text-[#EA580C] hover:bg-[#FFEDD5] border border-[#FFEDD5] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Thư viện bài tập</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </section>
  );
}
