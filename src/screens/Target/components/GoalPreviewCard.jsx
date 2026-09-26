import React from "react";
import { Card } from "../../../components/ui";

/** Trách nhiệm duy nhất: hiển thị kết quả ước tính kcal/macro mỗi ngày. */
export default function GoalPreviewCard({ preview }) {
  const items = [
    { label: "Calo", value: `${preview.calories} kcal` },
    { label: "Đạm (protein)", value: `${preview.protein} g` },
    { label: "Tinh bột", value: `${preview.carb} g` },
    { label: "Chất béo", value: `${preview.fat} g` },
  ];
  return (
    <Card className="p-4">
      <span className="block text-[13px] font-bold text-fg mb-3">Kết quả ước tính mỗi ngày</span>
      <div className="flex flex-row flex-wrap gap-3">
        {items.map((it) => (
          <div key={it.label} className="w-[45%]">
            <span className="block text-[11.5px] text-descGray">{it.label}</span>
            <span className="block text-[16px] font-bold text-fg mt-[2px]">{it.value}</span>
          </div>
        ))}
      </div>
      <span className="block text-[11px] text-placeholderGray mt-3">Tính dựa trên chiều cao, cân nặng, tuổi và mức độ hoạt động của bạn.</span>
    </Card>
  );
}
