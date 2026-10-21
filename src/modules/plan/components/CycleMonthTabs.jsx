import React from "react";
import { Calendar, CheckCircle, ShieldCheck } from "lucide-react";

/**
 * Bộ chọn Chu kỳ Tháng lớn (SOLID: Single Responsibility).
 * Cho phép xem lịch sử theo các chu kỳ 3/6/9/12 tháng.
 */
export default function CycleMonthTabs({ cycles, selectedCycleId, onSelectCycle, className = "" }) {
  if (!cycles || cycles.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wide flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#059669]" />
          Chu kỳ mục tiêu dinh dưỡng
        </span>
        <span className="text-[11px] text-[#0F172A]/50 font-medium">
          {cycles.length} chu kỳ
        </span>
      </div>

      {/* Danh sách tab: Pills cuộn ngang mượt mà trên mobile, thẻ hiện đại trên desktop */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
        {cycles.map((c) => {
          const isSelected = c.id === selectedCycleId;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCycle(c.id)}
              className={`shrink-0 px-3.5 py-2.5 rounded-2xl border transition-all text-left cursor-pointer select-none flex items-center gap-2.5 ${
                isSelected
                  ? "bg-[#059669] text-white border-[#059669] shadow-sm font-bold"
                  : "bg-white text-[#0F172A] border-[#DCEEE7] hover:border-[#059669]/50 hover:bg-[#F0F8F6]"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isSelected ? "bg-white animate-pulse" : c.isActive ? "bg-[#059669]" : "bg-slate-300"
                }`}
              />
              <div>
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  {c.title}
                  {c.isActive && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#ECFDF5] text-[#059669]"
                      }`}
                    >
                      Hiện tại
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] mt-0.5 font-medium ${
                    isSelected ? "text-white/80" : "text-[#0F172A]/50"
                  }`}
                >
                  {c.startDateText} - {c.endDateText}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
