import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card, Badge } from "../../../components/ui";

/** Trách nhiệm duy nhất: điều hướng qua lại giữa các ngày trong thực đơn. */
export default function DayNavigator({ day, totalDays, isToday, dayTotalProtein, onPrev, onNext, canPrev, canNext }) {
  return (
    <Card className="flex flex-row items-center gap-3 p-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: COLORS.muted, opacity: canPrev ? 1 : 0.3 }}
      >
        <ChevronLeft size={18} color={COLORS.fg} />
      </button>
      <div className="flex-1 flex flex-col items-center">
        <div className="flex flex-row items-center gap-2">
          <span className="text-[15px] font-bold text-fg">Ngày {day.dayIndex}/{totalDays}</span>
          {isToday && <Badge>Hôm nay</Badge>}
        </div>
        <span className="text-[12px] text-descGray mt-[2px]">{Math.round(day.totalKcal)} kcal · {dayTotalProtein.toFixed(0)}g đạm</span>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: COLORS.muted, opacity: canNext ? 1 : 0.3 }}
      >
        <ChevronRight size={18} color={COLORS.fg} />
      </button>
    </Card>
  );
}
