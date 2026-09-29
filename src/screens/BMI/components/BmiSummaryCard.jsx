import React from "react";
import { Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card, Badge, EmptyState } from "../../../components/ui";
import { classifyBMI } from "../../../domain/bmi";

/** Trách nhiệm duy nhất: thẻ tóm tắt chỉ số BMI mới nhất + xu hướng so với lần trước. */
export default function BmiSummaryCard({ last, prev }) {
  if (!last) {
    return (
      <Card className="p-5">
        <EmptyState icon={Scale} title="Chưa có dữ liệu BMI" desc="Thêm chỉ số đầu tiên để bắt đầu theo dõi." />
      </Card>
    );
  }

  let TrendIcon = Minus, trendColor = "#94A3B8", trendText = "Không đổi";
  if (prev) {
    const diff = last.weightKg - prev.weightKg;
    if (diff > 0.05) { TrendIcon = TrendingUp; trendColor = COLORS.accent; trendText = `+${diff.toFixed(1)}kg so với lần trước`; }
    else if (diff < -0.05) { TrendIcon = TrendingDown; trendColor = COLORS.primary; trendText = `${diff.toFixed(1)}kg so với lần trước`; }
  }
  const info = classifyBMI(last.bmi);

  return (
    <Card className="p-5">
      <div className="flex flex-row justify-between">
        <div>
          <span className="block text-[12.5px] text-descGray">Chỉ số hiện tại</span>
          <span className="block text-[30px] font-extrabold text-fg my-[2px]">{last.bmi.toFixed(1)}</span>
          <Badge tone="muted" textColor={info.color}>{info.label}</Badge>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[12.5px] text-descGray">{last.weightKg}kg</span>
          <div className="flex flex-row items-center gap-1 mt-1">
            <TrendIcon size={13} color={trendColor} />
            <span className="text-[11.5px] font-semibold" style={{ color: trendColor }}>{trendText}</span>
          </div>
        </div>
      </div>
      <span className="block text-[11.5px] text-placeholderGray mt-3">Chiều cao: {last.heightCm}cm (khai báo một lần, không thay đổi)</span>
    </Card>
  );
}
