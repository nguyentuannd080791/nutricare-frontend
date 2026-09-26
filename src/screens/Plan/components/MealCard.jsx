import React from "react";
import { Repeat } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card, Badge } from "../../../components/ui";
import { mealLabel } from "../../../domain/constants";

/** Trách nhiệm duy nhất: 1 thẻ bữa ăn trong thực đơn + nút mở đổi món. */
export default function MealCard({ meal: m, onSwapPress }) {
  return (
    <Card className="p-4">
      <div className="flex flex-row justify-between items-center mb-[10px]">
        <span className="text-[14.5px] font-bold text-fg">{mealLabel(m.mealSlot)}</span>
        <Badge>{Math.round(m.kcal)} kcal</Badge>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 py-1">
        <div className="flex-1 min-w-0">
          <span className="block text-[13px] text-[#334155]">{m.nameVi}</span>
          <span className="block text-[11px] text-placeholderGray mt-[1px]">1 phần</span>
        </div>
        <span className="text-[12px] text-placeholderGray shrink-0">{m.macros.protein_g.toFixed(0)}g đạm</span>
        <button type="button" onClick={onSwapPress} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.muted }}>
          <Repeat size={15} color={COLORS.primary} />
        </button>
      </div>
    </Card>
  );
}
