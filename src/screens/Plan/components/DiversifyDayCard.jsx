import React from "react";
import { Card, Badge } from "../../../components/ui";
import { mealLabel } from "../../../domain/constants";

/** Trách nhiệm duy nhất: hiển thị 1 ngày trong đề xuất đa dạng hoá của AI. */
export default function DiversifyDayCard({ day }) {
  return (
    <Card className="p-[14px]">
      <span className="block text-[13.5px] font-bold text-fg mb-2">Ngày {day.dayIndex} · {Math.round(day.totalKcal)} kcal</span>
      {day.meals.map((m) => (
        <div key={m.mealSlot} className="mb-2">
          <div className="flex flex-row items-center gap-2 mb-[2px]">
            <span className="text-[12.5px] font-semibold text-fg">{mealLabel(m.mealSlot)}</span>
            {m.changed && <Badge tone="dark">Đề xuất đổi</Badge>}
          </div>
          <span className="block text-[12px] text-descGray leading-4">{m.nameVi}</span>
          {m.changed && <span className="block text-[11px] text-placeholderGray mt-[1px]">Trước đó: {m.previousNameVi}</span>}
        </div>
      ))}
    </Card>
  );
}
