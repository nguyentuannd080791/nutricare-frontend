import React from "react";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { ModalSheet, Badge } from "../../../components/ui";

const formatMacro = (val) => (typeof val === "number" ? val.toFixed(1) : "0.0");

/** Trách nhiệm duy nhất: bảng chi tiết dinh dưỡng cơ bản của 1 món/thực phẩm. */
export default function FoodDetailSheet({ open, onClose, detail, isDish, onOpenFullNutrients }) {
  return (
    <ModalSheet open={open} onClose={onClose} title={detail?.nameVi}>
      {!detail ? (
        <div className="py-6 flex justify-center">
          <span className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div>
          <div className="flex flex-row gap-2 mb-4 flex-wrap">
            <Badge tone="dark">{detail.groupNameVi}</Badge>
            {detail.tagLabels?.map((label) => <Badge key={label}>{label}</Badge>)}
          </div>

          {detail.conflicts && detail.conflicts.length > 0 && (
            <div className="flex flex-row gap-2 rounded-xl p-3 mb-4 bg-dangerBg">
              <AlertTriangle size={16} color={COLORS.destructive} className="mt-[1px] shrink-0" />
              <div className="flex-1">
                <span className="block text-[12.5px] font-bold text-destructive">Không phù hợp với tình trạng của bạn</span>
                <span className="block text-[12px] mt-1" style={{ color: "#B91C1C" }}>Xung đột với: {detail.conflicts.join(", ")}</span>
              </div>
            </div>
          )}

          <div className="flex flex-row flex-wrap gap-[10px] mb-4">
            {[
              ["Năng lượng", `${Math.round(detail.kcal || 0)} kcal`],
              ["Chất đạm (Protein)", `${formatMacro(detail.protein_g)} g`],
              ["Chất béo (Fat)", `${formatMacro(detail.fat_g)} g`],
              ["Chất bột đường (Carb)", `${formatMacro(detail.carb_g)} g`],
            ].map(([label, value]) => (
              <div key={label} className="w-[47%] rounded-xl p-3" style={{ backgroundColor: COLORS.muted }}>
                <span className="block text-[11px] text-descGray">{label}</span>
                <span className="block text-[16px] font-bold text-fg mt-[2px]">{value}</span>
              </div>
            ))}
          </div>

          {detail.nutrients && detail.nutrients.length > 0 && (
            <button
              type="button"
              onClick={onOpenFullNutrients}
              className="w-full flex flex-row items-center justify-center gap-[6px] rounded-xl py-[10px] px-[14px] mb-3"
              style={{ backgroundColor: COLORS.muted, border: "1px solid #E2E8F0" }}
            >
              <span className="text-[12.5px] font-semibold text-primary">Xem đầy đủ vi chất & dinh dưỡng khác ({detail.nutrients.length})</span>
              <ChevronRight size={16} color={COLORS.primary} />
            </button>
          )}

          <span className="block text-[11px] text-placeholderGray leading-4">
            {isDish ? "Giá trị dinh dưỡng tính cho 1 phần món ăn." : "Giá trị dinh dưỡng tính cho 100g thực phẩm."}
          </span>
        </div>
      )}
    </ModalSheet>
  );
}
