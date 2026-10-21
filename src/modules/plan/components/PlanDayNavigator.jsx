import React from "react";
import { Calendar, ChevronLeft, ChevronRight, Lock } from "lucide-react";

/**
 * Điều hướng ngày trong thực đơn 2 cấp (SRP, SOLID)
 * Cấp 1: Chọn tuần (Week Switcher)
 * Cấp 2: Lưới các ngày trong tuần (Grid 100% không tràn scrollbar)
 */
export default function PlanDayNavigator({
  activeDay,
  weeks,
  currentWeekIndex,
  selectedDayIndex,
  onSelectDayIndex,
  onWeekChange,
  cycleDays,
}) {
  const currentWeek = weeks[currentWeekIndex] || weeks[0];
  const totalWeeks = weeks.length;

  return (
    <div className="sticky top-0 z-20 bg-[#ECFDF5]/95 backdrop-blur-md py-2 space-y-2.5">
      {/* CẤP 1: Tiêu đề ngày & Trạng thái & Bộ chuyển đổi tuần */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            {activeDay.dayOfWeekFull}, {activeDay.dateFormatted} ({activeDay.title})
          </h2>
          {activeDay.isToday ? (
            <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Hôm nay • Cho phép ghi nhận
            </span>
          ) : activeDay.isPast ? (
            <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full border border-[#CBD5E1] inline-flex items-center gap-1.5 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#64748B]" />
              Ngày đã qua • Đã chốt thực đơn (Chỉ xem)
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-[#0284C7] bg-[#F0F9FF] px-2.5 py-0.5 rounded-full border border-[#BAE6FD] inline-flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
              Ngày tương lai • Đổi món trước
            </span>
          )}
        </div>

        {/* CẤP 1 (Chọn Tuần): Trên mobile full width, desktop ở góc phải */}
        {totalWeeks > 1 ? (
          <div className="flex items-center justify-between w-full sm:w-auto bg-white rounded-2xl border border-[#DCEEE7] shadow-2xs p-1">
            <button
              type="button"
              disabled={currentWeekIndex <= 0}
              onClick={() => onWeekChange(currentWeekIndex - 1)}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-[#0F172A]/70 hover:bg-[#F0F8F6] hover:text-[#059669] disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              title="Tuần trước"
              aria-label="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center sm:flex-initial px-2 sm:px-2.5 py-0.5 text-xs font-bold text-[#059669] flex items-center justify-center gap-1.5 select-none">
              <span>Tuần {currentWeek.weekNumber}</span>
              <span className="text-[11px] font-semibold text-[#0F172A]/45">
                (Ngày {currentWeek.startDayNumber} - {currentWeek.endDayNumber})
              </span>
            </div>
            <button
              type="button"
              disabled={currentWeekIndex >= totalWeeks - 1}
              onClick={() => onWeekChange(currentWeekIndex + 1)}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-[#0F172A]/70 hover:bg-[#F0F8F6] hover:text-[#059669] disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              title="Tuần kế tiếp"
              aria-label="Tuần kế tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full sm:w-auto text-center flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-[#DCEEE7] text-xs font-bold text-[#059669] shadow-2xs">
            <span>Chu kỳ {cycleDays} ngày</span>
          </div>
        )}
      </div>

      {/* CẤP 2 (Chọn Ngày): Lưới các ngày trong tuần đang chọn */}
      <div
        className="w-full grid gap-1 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${currentWeek.days.length}, minmax(0, 1fr))`,
        }}
      >
        {currentWeek.days.map((day) => {
          const isSelected = day.dayIndex === selectedDayIndex;
          const completedCount = day.meals.filter((m) => m.completed).length;

          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => onSelectDayIndex(day.dayIndex)}
              className={`h-15 sm:h-16 py-1.5 px-1 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-between cursor-pointer select-none w-full ${
                isSelected
                  ? "bg-[#059669] text-white shadow-md ring-2 ring-[#059669]/30 scale-[1.02]"
                  : day.isToday
                    ? "bg-[#ECFDF5] text-[#059669] border-2 border-[#059669] shadow-2xs hover:bg-[#D1FAE5]"
                    : day.isPast
                      ? "bg-white text-[#0F172A]/75 border border-[#DCEEE7] hover:border-[#059669]/40 hover:bg-[#F0F8F6]"
                      : "bg-white/80 text-[#0F172A]/60 border border-dashed border-[#CBD5E1] hover:border-[#059669]/40 hover:bg-[#F0F8F6]"
              }`}
            >
              {/* Dòng 1: Tên thứ & Đánh dấu Hôm nay */}
              <span className="text-[11px] sm:text-xs font-black tracking-tight flex items-center gap-1">
                <span>{day.dayOfWeekShort || `N${day.dayNumber}`}</span>
                {day.isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-[#FEF08A] animate-pulse" : "bg-[#059669] animate-pulse"
                    }`}
                    title="Hôm nay"
                  />
                )}
              </span>

              {/* Dòng 2: Ngày/Tháng (17/10) hoặc số ngày */}
              <span
                className={`text-[10px] font-medium leading-none ${
                  isSelected
                    ? "text-white/90"
                    : day.isToday
                      ? "text-[#059669] font-bold"
                      : "text-[#0F172A]/50"
                }`}
              >
                {day.dateFormatted || `N${day.dayNumber}`}
              </span>

              {/* Dòng 3: Số bữa đã xong đồng nhất kèm chấm màu */}
              <span
                className={`text-[10px] font-semibold leading-none flex items-center gap-1 ${
                  isSelected
                    ? "text-white/85"
                    : day.isToday
                      ? "text-[#059669] font-bold"
                      : "text-[#0F172A]/45"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    completedCount === 4
                      ? isSelected
                        ? "bg-white"
                        : "bg-[#10B981]"
                      : completedCount > 0
                        ? isSelected
                          ? "bg-[#FEF08A]"
                          : "bg-[#F59E0B]"
                        : isSelected
                          ? "bg-white/30"
                          : "bg-[#0F172A]/20"
                  }`}
                />
                {completedCount}/4
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
