import React from "react";
import { COLORS } from "../../../theme/colors";
import { ModalSheet } from "../../../components/ui";
import { mealLabel } from "../../../domain/constants";

/** Trách nhiệm duy nhất: bảng chọn món thay thế cho 1 bữa. */
export default function SwapMealSheet({ meal, onClose, onPick }) {
  return (
    <ModalSheet open={!!meal} onClose={onClose} title={`Đổi món ${meal ? mealLabel(meal.mealSlot).toLowerCase() : ""}`}>
      <span className="block text-[12px] text-descGray mb-3">Các món thay thế đều đã được lọc theo bệnh nền / dị ứng của bạn.</span>
      {meal?.swapCandidates.map((c) => (
        <button
          key={c.dishId}
          type="button"
          onClick={() => onPick(c.dishId)}
          className="w-full flex flex-row items-center justify-between rounded-xl px-[14px] py-3 mb-[6px]"
          style={{ backgroundColor: COLORS.muted }}
        >
          <span className="flex-1 text-left text-[13.5px] font-semibold text-fg mr-2">{c.nameVi}</span>
          <span className="text-[12px] text-descGray shrink-0">{Math.round(c.kcal)} kcal</span>
        </button>
      ))}
    </ModalSheet>
  );
}
