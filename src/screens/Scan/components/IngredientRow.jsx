import React from "react";
import { COLORS } from "../../../theme/colors";

const SERVING_STEP = 0.5;

/** Trách nhiệm duy nhất: 1 dòng món ăn trong kết quả quét — đổi khẩu phần / xoá. */
export default function IngredientRow({ item: it, canRemove, onServingsChange, onRemove }) {
  return (
    <div className="flex flex-row items-center gap-[10px] rounded-xl p-3 mb-2" style={{ backgroundColor: COLORS.card }}>
      <div className="flex-1 min-w-0">
        <span className="block text-[13.5px] font-semibold text-fg">{it.nameVi}</span>
        <span className="block text-[11.5px] text-descGray">{Math.round(it.kcal * it.servings)} kcal</span>
      </div>
      <button type="button" onClick={() => onServingsChange(-SERVING_STEP)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.muted }}>−</button>
      <span className="text-[13px] font-bold text-fg w-16 text-center shrink-0">{it.servings} phần</span>
      <button type="button" onClick={() => onServingsChange(SERVING_STEP)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.muted }}>+</button>
      {canRemove && (
        <button type="button" onClick={onRemove} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[16px] font-bold text-destructive bg-dangerBg">×</button>
      )}
    </div>
  );
}
