import React from "react";
import { Check } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Badge } from "../../../components/ui";

/** Trách nhiệm duy nhất: 1 thẻ chọn gói hội viên (Tháng/Năm). */
export default function PlanOptionCard({ plan, isSelected, onPress }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full text-left bg-white rounded-2xl p-4"
      style={{ border: `1.5px solid ${isSelected ? COLORS.primary : COLORS.border}`, backgroundColor: isSelected ? "#F0FDF4" : "#fff" }}
    >
      <div className="flex flex-row justify-between items-center mb-[6px]">
        <div className="flex flex-row items-center gap-2">
          <span className="text-[15px] font-bold text-fg">{plan.title}</span>
          {plan.badge && <Badge tone="warn">{plan.badge}</Badge>}
        </div>
        <span
          className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
          style={{ border: `1.5px solid ${isSelected ? COLORS.primary : COLORS.border}`, backgroundColor: isSelected ? COLORS.primary : "#fff" }}
        >
          {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
        </span>
      </div>
      <div className="flex flex-row items-baseline gap-1 mb-1">
        <span className="text-[20px] font-extrabold text-fg">{plan.price}</span>
        <span className="text-[13px] font-semibold text-descGray">{plan.period}</span>
      </div>
      <span className="text-[12px] text-descGray">{plan.desc}</span>
    </button>
  );
}
