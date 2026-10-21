import React from "react";
import { ChevronLeft, ChevronRight, Clock, CalendarDays } from "lucide-react";

/**
 * Bộ chuyển Tuần trong Chu kỳ (SOLID: Single Responsibility).
 * Cho phép lướt qua các tuần đã thực hiện mà không làm rối mắt người dùng.
 */
export default function WeekCycleNavigator({
  weeks = [],
  selectedWeekIndex = 0,
  onSelectWeek,
  className = "",
}) {
  if (!weeks || weeks.length === 0) return null;

  const currentWeek = weeks[selectedWeekIndex] || weeks[0];
  const canGoPrev = selectedWeekIndex > 0;
  const canGoNext = selectedWeekIndex < weeks.length - 1;

  return (
    <div className={`p-4 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs space-y-3 ${className}`}>
      {/* Hàng 1: Nút điều hướng trước / sau & Tên tuần đang chọn */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#DCEEE7]">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                {currentWeek.label} ({currentWeek.dateRangeText})
              </h3>
              {currentWeek.isCurrent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  Tuần hiện tại
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#0F172A]/50 font-medium">
              Tuân thủ tuần: <strong className="text-[#059669]">{currentWeek.adherencePct}%</strong> ({currentWeek.completedMeals}/{currentWeek.totalScheduledMeals} bữa)
            </p>
          </div>
        </div>

        {/* Nút lùi / tiến */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => onSelectWeek(selectedWeekIndex - 1)}
            aria-label="Tuần trước"
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              canGoPrev
                ? "bg-white text-[#0F172A] border-[#DCEEE7] hover:bg-[#F0F8F6] hover:text-[#059669]"
                : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onSelectWeek(selectedWeekIndex + 1)}
            aria-label="Tuần kế tiếp"
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              canGoNext
                ? "bg-white text-[#0F172A] border-[#DCEEE7] hover:bg-[#F0F8F6] hover:text-[#059669]"
                : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hàng 2: Thanh trượt danh sách các tuần (Pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 [scrollbar-width:none] [-ms-overflow-style:none]">
        {weeks.map((w, idx) => {
          const isSelected = idx === selectedWeekIndex;

          return (
            <button
              key={w.weekIndex}
              type="button"
              onClick={() => onSelectWeek(idx)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#059669] text-white shadow-xs"
                  : "bg-slate-50 text-[#0F172A]/60 border border-slate-200/80 hover:text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              T{w.weekNumber}
              {w.isCurrent && <span className="ml-1 text-[9px] opacity-80">•</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
