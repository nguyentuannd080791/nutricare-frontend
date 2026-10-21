import React from "react";
import { Calendar } from "lucide-react";

/**
 * Cột tổng quan dinh dưỡng & tuân thủ chu kỳ (SRP, SOLID)
 */
export default function PlanOverviewCard({
  activeDay,
  dayTotals,
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat,
  overallCompliance,
  durationMonths,
}) {
  const caloPercent = Math.min(
    100,
    Math.round((dayTotals.calories / targetCalories) * 100)
  );
  const proteinPercent = Math.min(
    100,
    Math.round((dayTotals.protein / targetProtein) * 100)
  );
  const carbsPercent = Math.min(
    100,
    Math.round((dayTotals.carbs / targetCarbs) * 100)
  );
  const fatPercent = Math.min(
    100,
    Math.round((dayTotals.fat / targetFat) * 100)
  );

  return (
    <div className="space-y-5">
      {/* Card 1: Mục tiêu dinh dưỡng của ngày đang chọn - Trực quan hóa Calo & 3 ô Macros */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DCEEE7] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
            {activeDay.isToday
              ? "Mục tiêu hôm nay"
              : `Mục tiêu ${activeDay.dayOfWeekShort} (${activeDay.title})`}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-[#ECFDF5] text-[#059669]">
            {dayTotals.completedMealsCount}/4 bữa hoàn thành
          </span>
        </div>

        {/* Khối Calo */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-[#0F172A]">
                {dayTotals.calories}
              </span>
              <span className="text-xs text-[#0F172A]/50 font-semibold ml-1">
                / {targetCalories} kcal
              </span>
            </div>
            <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-xl border border-[#DCEEE7]">
              {caloPercent}% mục tiêu
            </span>
          </div>

          {/* Thanh tiến độ Calo chuẩn xác theo % */}
          <div className="w-full h-2.5 rounded-full bg-[#F0F8F6] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#059669] transition-all duration-500"
              style={{ width: `${caloPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-[#0F172A]/60 pt-0.5">
            <span>
              Đã nạp: <strong className="text-[#059669]">{dayTotals.consumedCalories} kcal</strong>
            </span>
            <span>
              Còn thiếu:{" "}
              <strong className="text-[#EA580C]">
                {Math.max(0, targetCalories - dayTotals.calories)} kcal
              </strong>
            </span>
          </div>
        </div>

        {/* 3 ô Đạm - Tinh bột - Chất béo */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#DCEEE7]">
          {/* Đạm: Màu Đỏ cam */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#EA580C]">Đạm</span>
              <span className="text-[10px] font-semibold text-[#EA580C]/80">
                {proteinPercent}%
              </span>
            </div>
            <div className="text-xs font-extrabold text-[#0F172A]">
              {dayTotals.protein}g{" "}
              <span className="text-[10px] text-[#0F172A]/45 font-medium">
                / {targetProtein}g
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#EA580C] transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Tinh bột: Màu Vàng hổ phách */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#D97706]">Tinh bột</span>
              <span className="text-[10px] font-semibold text-[#D97706]/80">
                {carbsPercent}%
              </span>
            </div>
            <div className="text-xs font-extrabold text-[#0F172A]">
              {dayTotals.carbs}g{" "}
              <span className="text-[10px] text-[#0F172A]/45 font-medium">
                / {targetCarbs}g
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#F59E0B] transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Chất béo: Màu Xanh dương */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#0284C7]">Chất béo</span>
              <span className="text-[10px] font-semibold text-[#0284C7]/80">
                {fatPercent}%
              </span>
            </div>
            <div className="text-xs font-extrabold text-[#0F172A]">
              {dayTotals.fat}g{" "}
              <span className="text-[10px] text-[#0F172A]/45 font-medium">
                / {targetFat}g
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0284C7] transition-all duration-500"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Hiệu suất & Kế hoạch chu kỳ */}
      <div className="p-5 rounded-3xl bg-white border border-[#DCEEE7] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#059669]" />
            Hiệu suất tuân thủ chu kỳ
          </span>
          <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-lg border border-[#DCEEE7]">
            {overallCompliance.percent}% đạt
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#F0F8F6] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#059669] transition-all duration-500"
            style={{ width: `${overallCompliance.percent}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#0F172A]/65">
          <div className="p-2.5 rounded-2xl bg-[#F0F8F6]">
            Đã hoàn thành:{" "}
            <strong className="text-[#0F172A] block text-xs mt-0.5">
              {overallCompliance.completedMeals}/{overallCompliance.totalMeals} bữa
            </strong>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#F0F8F6]">
            Thời hạn kế hoạch:{" "}
            <strong className="text-[#0F172A] block text-xs mt-0.5">
              {durationMonths} tháng
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
