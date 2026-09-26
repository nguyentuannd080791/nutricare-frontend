import React from "react";
import { CheckCircle2 } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card } from "../../../components/ui";
import { mealLabel } from "../../../domain/constants";

/** Trách nhiệm duy nhất: thanh tiến độ + danh sách bữa ăn hôm nay. */
export default function TodayPlanCard({ consumedKcal, targetKcal, pct, todayPlanDay, todayProgress, onToggleMeal }) {
  return (
    <Card className="p-4 mb-2">
      <div className="flex flex-row justify-between items-center mb-2">
        <span className="text-[13px] font-bold text-fg">Hôm nay</span>
        <span className="text-[12.5px] font-semibold text-descGray">{consumedKcal} / {targetKcal} kcal</span>
      </div>
      <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: COLORS.muted }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? COLORS.accent : COLORS.primary }}
        />
      </div>

      <div className="mt-[14px] pt-[14px] flex flex-col gap-[10px] border-t" style={{ borderColor: COLORS.border }}>
        {todayPlanDay.meals.map((m) => {
          const done = !!todayProgress[m.mealSlot];
          return (
            <button
              key={m.mealSlot}
              type="button"
              onClick={() => onToggleMeal(m.mealSlot)}
              className="flex flex-row items-center gap-3 text-left"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: done ? COLORS.primary : COLORS.muted }}
              >
                <CheckCircle2 size={17} color={done ? "#fff" : "#94A3B8"} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13.5px] font-semibold text-fg">{mealLabel(m.mealSlot)}</span>
                <span className="block text-[12px] text-descGray truncate">{m.nameVi}</span>
              </span>
              <span className="text-[11.5px] font-semibold text-placeholderGray shrink-0">{Math.round(m.kcal)} kcal</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
