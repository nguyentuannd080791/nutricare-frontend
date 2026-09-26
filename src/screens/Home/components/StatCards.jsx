import React from "react";
import { Scale, Flame } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card, IconBadge } from "../../../components/ui";

/** Trách nhiệm duy nhất: 2 thẻ tóm tắt BMI + mục tiêu calo trên Trang chủ. */
export default function StatCards({ latestBMI, bmiInfo, activeTarget, onBmiPress, onTargetPress }) {
  return (
    <div className="flex flex-row gap-3 mb-4">
      <Card onPress={onBmiPress} className="flex-1 p-4">
        <IconBadge icon={Scale} size={38} />
        <span className="block text-[12px] text-descGray mt-[10px]">BMI hiện tại</span>
        <span className="block text-[19px] font-extrabold text-fg mt-[2px]">{latestBMI ? latestBMI.bmi.toFixed(1) : "--"}</span>
        {latestBMI && <span className="block text-[11.5px] font-semibold mt-[2px]" style={{ color: bmiInfo.color }}>{bmiInfo.label}</span>}
      </Card>
      <Card onPress={onTargetPress} className="flex-1 p-4">
        <IconBadge icon={Flame} size={38} bg="#FFF7ED" color={COLORS.accent} />
        <span className="block text-[12px] text-descGray mt-[10px]">Mục tiêu calo/ngày</span>
        <span className="block text-[19px] font-extrabold text-fg mt-[2px]">{activeTarget ? `${activeTarget.calories}` : "--"}</span>
        {activeTarget && <span className="block text-[11.5px] text-descGray mt-[2px]">kcal</span>}
      </Card>
    </div>
  );
}
