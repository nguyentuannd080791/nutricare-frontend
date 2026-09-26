import React from "react";
import { Card, Badge } from "../../../components/ui";
import { GOALS } from "../../../domain/constants";

const TRIGGER_LABELS = {
  bmi_change: "Tự động do thay đổi BMI",
  manual: "Điều chỉnh thủ công",
  initial: "Khởi tạo",
};

/** Trách nhiệm duy nhất: danh sách lịch sử điều chỉnh mục tiêu dinh dưỡng. */
export default function TargetHistoryList({ history }) {
  if (history.length <= 1) return null;
  return (
    <div>
      <span className="block text-[14.5px] font-bold text-fg mb-[10px]">Lịch sử điều chỉnh</span>
      {history.map((h) => (
        <Card key={h.id} className="p-[14px] mb-[10px]">
          <div className="flex flex-row items-center justify-between">
            <span className="text-[13.5px] font-semibold text-fg">{h.calories} kcal · {GOALS.find((g) => g.id === h.goalId)?.label}</span>
            {h.isActive && <Badge>Đang áp dụng</Badge>}
          </div>
          <span className="block text-[11.5px] text-placeholderGray mt-1">
            Từ {new Date(h.effectiveFrom).toLocaleDateString("vi-VN")}
            {h.effectiveTo ? ` đến ${new Date(h.effectiveTo).toLocaleDateString("vi-VN")}` : ""}
            {" · "}{TRIGGER_LABELS[h.trigger] || "Khởi tạo"}
          </span>
        </Card>
      ))}
    </div>
  );
}
