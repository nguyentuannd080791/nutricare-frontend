import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Utensils, Flame } from "lucide-react";

/**
 * Thẻ hiển thị lịch sử 1 ngày ăn uống (SOLID: Single Responsibility & Interface Segregation).
 * Chỉ nhận đúng dữ liệu cần thiết của ngày đó (`day`).
 * Mặc định hiển thị dạng tóm tắt cực gọn; chạm vào có thể mở rộng xem chi tiết món đã ăn.
 */
export default function DayHistoryCard({ day, className = "" }) {
  const [expanded, setExpanded] = useState(false);

  if (!day) return null;

  const isEatenAny = day.completedCount > 0;
  const isAllEaten = day.completedCount >= day.totalCount && day.totalCount > 0;
  const caloPercent = day.targetKcal > 0 ? Math.min(100, Math.round((day.consumedKcal / day.targetKcal) * 100)) : 0;

  // Badge trạng thái ngày
  const statusBadge = day.isFuture
    ? { label: "Chưa đến", bg: "bg-slate-100 text-slate-500 border-slate-200" }
    : isAllEaten
    ? { label: "Đủ bữa", bg: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" }
    : isEatenAny
    ? { label: `${day.completedCount}/${day.totalCount} bữa`, bg: "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]" }
    : { label: "Chưa ghi nhận", bg: "bg-slate-100 text-slate-500 border-slate-200" };

  return (
    <div
      className={`rounded-2xl border transition-all ${
        day.isToday
          ? "bg-white border-[#059669] shadow-sm ring-1 ring-[#059669]/20"
          : day.isFuture
          ? "bg-[#FAFBFB] border-slate-200/60 opacity-70"
          : "bg-white border-[#DCEEE7] hover:border-[#059669]/40 hover:shadow-xs"
      } ${className}`}
    >
      {/* PHẦN TÓM TẮT CHÍNH (LUÔN HIỂN THỊ) */}
      <div
        className="p-4 sm:p-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-[#0F172A]">
              {day.dayName}, {day.dateFormatted}
            </span>
            {day.isToday && (
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                Hôm nay
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}>
              {statusBadge.label}
            </span>
            <button
              type="button"
              className="p-1 text-[#0F172A]/40 hover:text-[#0F172A] transition-colors pointer-events-none"
              aria-label={expanded ? "Thu gọn" : "Xem chi tiết món"}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Thanh Calo ngày */}
        <div className="space-y-1.5 my-3">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-[#0F172A]/70 font-semibold">
              Năng lượng:{" "}
              <strong className="text-[#0F172A] font-extrabold">
                {Math.round(day.consumedKcal).toLocaleString()} kcal
              </strong>
            </span>
            <span className="text-[11px] text-[#0F172A]/50 font-medium">
              Mục tiêu: {Math.round(day.targetKcal).toLocaleString()} kcal ({caloPercent}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#F0F8F6] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                caloPercent >= 80 ? "bg-[#059669]" : caloPercent > 0 ? "bg-[#EA580C]" : "bg-transparent"
              }`}
              style={{ width: `${caloPercent}%` }}
            />
          </div>
        </div>

        {/* 4 BỮA ĂN (SÁNG - TRƯA - TỐI - PHỤ) HIỂN THỊ DẠNG PILLS TRỰC QUAN */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {day.meals.map((meal) => {
            const isEaten = meal.eaten;
            const kcalRounded = Math.round(meal.kcal);

            return (
              <div
                key={meal.slotId}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-1.5 text-xs transition-colors ${
                  isEaten
                    ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
                    : day.isFuture
                    ? "bg-slate-50 border-slate-100 text-slate-400"
                    : "bg-[#F8FAFC] border-slate-200/80 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  {isEaten ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="font-bold whitespace-nowrap text-xs">{meal.slotLabel}</span>
                </div>

                <span className={`text-[11px] font-semibold shrink-0 whitespace-nowrap ${isEaten ? "text-[#059669]" : "text-slate-400"}`}>
                  {isEaten ? `${kcalRounded} calo` : "Chưa ăn"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHI TIẾT MÓN ĂN KHI MỞ RỘNG (PROGRESSIVE DISCLOSURE) */}
      {expanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#DCEEE7] bg-[#F8FAFC]/50 space-y-2.5 animate-in fade-in-50 duration-200 rounded-b-2xl">
          <div className="text-[11px] font-bold text-[#0F172A]/60 uppercase tracking-wide flex items-center gap-1.5 pt-1">
            <Utensils className="w-3.5 h-3.5 text-[#059669]" />
            Chi tiết thực đơn ngày {day.dateFormatted}
          </div>

          <div className="space-y-2">
            {day.meals.map((meal) => (
              <div
                key={`detail-${meal.slotId}`}
                className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#0F172A]">Bữa {meal.slotLabel}:</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      meal.eaten ? "bg-[#ECFDF5] text-[#059669]" : "bg-slate-100 text-slate-500"
                    }`}>
                      {meal.eaten ? "✓ Đã ăn" : "✕ Chưa ăn"}
                    </span>
                  </div>
                  <p className="text-[#0F172A]/75 font-medium truncate">{meal.name}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-[#EA580C] flex items-center gap-0.5 justify-end">
                    <Flame className="w-3 h-3" />
                    {meal.kcal} kcal
                  </span>
                  {meal.macros?.protein_g ? (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {meal.macros.protein_g}P · {meal.macros.carb_g}C · {meal.macros.fat_g}F
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
