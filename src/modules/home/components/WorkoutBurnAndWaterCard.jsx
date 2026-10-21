import React from "react";
import { Flame, Droplets, Minus, Plus } from "lucide-react";

/**
 * Thẻ Hợp nhất Vận động & Nước uống (SOLID: Single Responsibility)
 * Đồng bộ từ HealthDashboardPage của test-ui (cột 4 trong Bento Grid 12 cột):
 * - Nửa trên: Tiến độ calo đốt từ bài tập (ngọn lửa màu cam + thanh tiến độ cam)
 * - Nửa dưới: Khối theo dõi nước uống với 8 nút cốc nước tương tác nhanh + nút +/-
 */
export default function WorkoutBurnAndWaterCard({
  workoutPlan,
  water,
  onChangeWater,
  onOpenExercise,
  className = "",
}) {
  const burnedKcal = workoutPlan?.burnedKcal || 0;
  const plannedBurnKcal = workoutPlan?.plannedKcal || 0;
  const activeMinutes = workoutPlan?.activeMinutes || 0;
  const restDay = Boolean(workoutPlan?.restDay);

  const burnPercent =
    plannedBurnKcal > 0 ? Math.min(Math.round((burnedKcal / plannedBurnKcal) * 100), 100) : 0;

  const waterCups = water?.cups || 0;
  const goalCups = water?.goalCups || 8;
  const cupMl = water?.cupMl || 250;
  const maxCups = water?.maxCups || 12;

  const canDecrease = waterCups > 0;
  const canIncrease = waterCups < maxCups;

  return (
    <div
      className={`rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-3.5 ${className}`}
    >
      {/* Nửa trên: Tiến độ đốt calo từ Tập luyện */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C]">
            <Flame className="w-4 h-4" />
            {restDay ? "Vận động ngày nghỉ" : "Tập luyện"}
          </span>
          <span className="text-xs font-semibold text-[#0F172A]/60">
            {activeMinutes} phút • {restDay ? "Nhẹ nhàng" : `${burnPercent}%`}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-xl font-extrabold text-[#0F172A]">
            {burnedKcal}{" "}
            <span className="text-xs font-semibold text-[#0F172A]/50">
              / {plannedBurnKcal} calo
            </span>
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#F0F8F6] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#EA580C] transition-all duration-500"
            style={{ width: `${restDay ? 100 : burnPercent}%` }}
          />
        </div>
      </div>

      {/* Nửa dưới: Khối Nước uống hằng ngày */}
      <div className="p-3.5 rounded-2xl bg-[#ECFDF5]/70 border border-[#10B981]/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#059669] text-white">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Nước uống hôm nay</p>
              <p className="text-[11px] text-[#047857] font-bold">
                {waterCups}/{goalCups} cốc ({waterCups * cupMl} ml)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!canDecrease}
              onClick={() => onChangeWater && onChangeWater(Math.max(0, waterCups - 1))}
              className="p-1.5 rounded-lg border border-[#DCEEE7] bg-white hover:bg-[#F0F8F6] text-[#0F172A] cursor-pointer transition-colors disabled:opacity-40"
              aria-label="Giảm 1 cốc nước"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={!canIncrease}
              onClick={() => onChangeWater && onChangeWater(Math.min(maxCups, waterCups + 1))}
              className="p-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white cursor-pointer transition-colors disabled:opacity-40"
              aria-label="Thêm 1 cốc nước"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8 cốc nước tương tác */}
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: goalCups }).map((_, index) => {
            const cupNumber = index + 1;
            const isFilled = cupNumber <= waterCups;
            return (
              <button
                key={cupNumber}
                type="button"
                onClick={() => onChangeWater && onChangeWater(cupNumber)}
                title={`Cốc thứ ${cupNumber} (${cupNumber * cupMl}ml)`}
                className={`h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                  isFilled
                    ? "bg-[#059669] border-[#059669] text-white shadow-xs"
                    : "bg-white border-[#DCEEE7] text-[#0F172A]/30 hover:border-[#059669]/50"
                }`}
              >
                <Droplets className="w-3 h-3" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
