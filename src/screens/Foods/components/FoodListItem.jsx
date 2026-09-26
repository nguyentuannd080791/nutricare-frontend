import React from "react";
import { Utensils, Apple, ChevronRight } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card, IconBadge } from "../../../components/ui";

const formatMacro = (val) => (typeof val === "number" ? val.toFixed(1) : "0.0");

/** Trách nhiệm duy nhất: 1 dòng thực phẩm/món ăn trong danh sách kết quả. */
export default function FoodListItem({ item: f, isDish, onPress }) {
  const unsuitable = f.conflicts && f.conflicts.length > 0;
  return (
    <Card
      onPress={onPress}
      className="flex flex-row items-center gap-3 p-[14px]"
      style={unsuitable ? { borderColor: COLORS.destructive, borderWidth: 2, backgroundColor: "#FEF2F2" } : undefined}
    >
      <IconBadge icon={isDish ? Utensils : Apple} size={42} bg={unsuitable ? "#FEE2E2" : COLORS.muted} color={unsuitable ? COLORS.destructive : COLORS.primary} />
      <div className="flex-1 min-w-0">
        <span className="block text-[14px] font-bold text-fg">{f.nameVi}</span>
        <span className="block text-[12px] text-descGray mt-[1px]">
          {Math.round(f.kcal || 0)} kcal | P: {formatMacro(f.protein_g)}g - F: {formatMacro(f.fat_g)}g - C: {formatMacro(f.carb_g)}g
        </span>
        {unsuitable && <span className="block text-[11px] font-semibold text-destructive mt-[2px]">VI PHẠM HỒ SƠ BỆNH LÝ CỦA BẠN</span>}
      </div>
      <ChevronRight size={16} color={unsuitable ? COLORS.destructive : "#94A3B8"} />
    </Card>
  );
}
