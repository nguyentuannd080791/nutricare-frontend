import React from "react";
import { COLORS } from "../../../theme/colors";
import { ModalSheet } from "../../../components/ui";

const formatMacro = (val) => (typeof val === "number" ? val.toFixed(1) : "0.0");

/** Trách nhiệm duy nhất: bảng đầy đủ toàn bộ vi chất của 1 món/thực phẩm. */
export default function FullNutrientsSheet({ open, onClose, detail }) {
  return (
    <ModalSheet open={open} onClose={onClose} title={`Bảng vi chất: ${detail?.nameVi || ""}`}>
      <div className="max-h-[460px] overflow-y-auto">
        <div className="flex flex-row flex-wrap gap-[10px]">
          <div className="w-[47%] rounded-xl p-3" style={{ backgroundColor: COLORS.muted }}>
            <span className="block text-[11px] text-descGray">Năng lượng</span>
            <span className="block text-[16px] font-bold text-fg mt-[2px]">{Math.round(detail?.kcal || 0)} kcal</span>
          </div>
          {detail?.nutrients?.map((n) => (
            <div key={n.code || n.key} className="w-[47%] rounded-xl p-3" style={{ backgroundColor: COLORS.muted }}>
              <span className="block text-[11px] text-descGray">{n.nameVi}</span>
              <span className="block text-[16px] font-bold text-fg mt-[2px]">{formatMacro(n.value)} {n.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </ModalSheet>
  );
}
