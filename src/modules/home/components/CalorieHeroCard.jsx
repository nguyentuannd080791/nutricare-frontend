import React from "react";
import { AlertTriangle, Moon, ShieldCheck } from "lucide-react";

/**
 * Thẻ Calo Tổng quan hôm nay (SOLID: Single Responsibility)
 * Đồng bộ UI từ HealthDashboardPage của test-ui:
 * - Nền trắng sạch, viền ngọc #DCEEE7
 * - Hiển thị Calo đã nạp / Calo mở khóa từ tập luyện
 * - Dual progress bar (thanh nền calo mở khóa + thanh calo đã nạp)
 * - 3 thẻ Pastel Macros: Đạm (cam), Tinh bột (vàng hổ phách), Chất béo (xanh dương)
 */
export default function CalorieHeroCard({
  calorieBalance,
  macros = { protein: 0, carbs: 0, fat: 0 },
  plannedMacros = { protein: 0, carbs: 0, fat: 0 },
  restDay = false,
  onTargetPress,
  className = "",
}) {
  const status = calorieBalance.evaluateStatus(restDay);
  const surplus = calorieBalance.getSurplusCalories();
  const remainingUnlocked = calorieBalance.getRemainingUnlockedCalories();
  const intakePercent = calorieBalance.getIntakePercentageOfFullTarget();
  const unlockedPercent = calorieBalance.getUnlockedPercentageOfFullTarget();
  const isSurplusWarning = status.type === "warning_surplus";

  const proteinPlanned = Math.round(plannedMacros.protein || 0);
  const carbsPlanned = Math.round(plannedMacros.carbs || 0);
  const fatPlanned = Math.round(plannedMacros.fat || 0);

  const proteinConsumed = Math.round(macros.protein || 0);
  const carbsConsumed = Math.round(macros.carbs || 0);
  const fatConsumed = Math.round(macros.fat || 0);

  const proteinPercent = proteinPlanned > 0 ? Math.round((proteinConsumed / proteinPlanned) * 100) : 0;
  const carbsPercent = carbsPlanned > 0 ? Math.round((carbsConsumed / carbsPlanned) * 100) : 0;
  const fatPercent = fatPlanned > 0 ? Math.round((fatConsumed / fatPlanned) * 100) : 0;

  return (
    <div
      className={`rounded-3xl bg-white border border-[#DCEEE7] text-[#0F172A] p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      {/* Hàng 1: Huy hiệu trạng thái & Mục tiêu tổng */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
            restDay
              ? "bg-[#F0F8F6] text-[#059669] border-[#DCEEE7]"
              : isSurplusWarning
              ? "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]"
              : "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
          }`}
        >
          {restDay ? (
            <Moon className="w-3.5 h-3.5 text-[#059669]" />
          ) : isSurplusWarning ? (
            <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C]" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          )}
          {status.badge}
        </span>

        {onTargetPress ? (
          <button
            type="button"
            onClick={onTargetPress}
            className="text-xs font-semibold text-[#0F172A]/60 hover:text-[#059669] transition-colors cursor-pointer"
          >
            Mục tiêu ngày: <strong className="text-[#0F172A]">{calorieBalance.fullTarget.toLocaleString()} calo</strong>
          </button>
        ) : (
          <span className="text-xs font-semibold text-[#0F172A]/60">
            Mục tiêu ngày: <strong className="text-[#0F172A]">{calorieBalance.fullTarget.toLocaleString()} calo</strong>
          </span>
        )}
      </div>

      {/* Hàng 2: Con số chính & Thanh tiến độ kép chuẩn xác */}
      <div className="my-4 space-y-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              {calorieBalance.consumed.toLocaleString()}
            </span>
            <span className="text-xs text-[#0F172A]/50 font-semibold">
              / {calorieBalance.getUnlockedAllowance().toLocaleString()} calo mở khóa
            </span>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-xl border shrink-0 ${
              isSurplusWarning
                ? "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]"
                : "bg-[#ECFDF5] text-[#059669] border-[#DCEEE7]"
            }`}
          >
            {isSurplusWarning ? `Vượt +${surplus} calo` : `Còn nạp: ${remainingUnlocked} calo`}
          </span>
        </div>

        <div className="relative w-full h-2.5 rounded-full bg-[#F0F8F6] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[#059669]/20 transition-all duration-500 rounded-full"
            style={{ width: `${unlockedPercent}%` }}
          />
          <div
            className={`relative h-full rounded-full transition-all duration-500 ${
              isSurplusWarning ? "bg-[#EA580C]" : "bg-[#059669]"
            }`}
            style={{ width: `${intakePercent}%` }}
          />
        </div>
      </div>

      {/* Hàng 3: 3 thẻ Macros pastel tổng quan */}
      <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#DCEEE7]">
        {/* Đạm (Protein): Màu Cam ấm */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#EA580C]">Đạm</span>
            <span className="text-[10px] font-semibold text-[#EA580C]/80">{proteinPercent}%</span>
          </div>
          <div className="text-xs font-extrabold text-[#0F172A]">
            {proteinConsumed}g{" "}
            <span className="text-[10px] text-[#0F172A]/45 font-medium">/ {proteinPlanned}g</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#EA580C] transition-all duration-500"
              style={{ width: `${Math.min(100, proteinPercent)}%` }}
            />
          </div>
        </div>

        {/* Tinh bột (Carbs): Màu Vàng hổ phách */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#D97706]">Tinh bột</span>
            <span className="text-[10px] font-semibold text-[#D97706]/80">{carbsPercent}%</span>
          </div>
          <div className="text-xs font-extrabold text-[#0F172A]">
            {carbsConsumed}g{" "}
            <span className="text-[10px] text-[#0F172A]/45 font-medium">/ {carbsPlanned}g</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F59E0B] transition-all duration-500"
              style={{ width: `${Math.min(100, carbsPercent)}%` }}
            />
          </div>
        </div>

        {/* Chất béo (Fat): Màu Xanh dương tươi */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#0284C7]">Chất béo</span>
            <span className="text-[10px] font-semibold text-[#0284C7]/80">{fatPercent}%</span>
          </div>
          <div className="text-xs font-extrabold text-[#0F172A]">
            {fatConsumed}g{" "}
            <span className="text-[10px] text-[#0F172A]/45 font-medium">/ {fatPlanned}g</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0284C7] transition-all duration-500"
              style={{ width: `${Math.min(100, fatPercent)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
