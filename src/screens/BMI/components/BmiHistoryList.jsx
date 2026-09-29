import React from "react";
import { Card, Badge } from "../../../components/ui";
import { classifyBMI } from "../../../domain/bmi";

/** Trách nhiệm duy nhất: danh sách lịch sử cân nặng (chiều cao cố định nên không lặp lại ở từng dòng). */
export default function BmiHistoryList({ records }) {
  if (records.length === 0) return null;
  return (
    <div className="mt-5">
      <span className="block text-[14.5px] font-bold text-fg mb-3">Lịch sử đo</span>
      {records.map((r) => (
        <Card key={r.id} className="flex flex-row items-center justify-between p-[14px] mb-[10px]">
          <div>
            <span className="block text-[13.5px] font-semibold text-fg">{r.weightKg}kg</span>
            <span className="block text-[11.5px] text-placeholderGray mt-[2px]">{new Date(r.date).toLocaleDateString("vi-VN")}</span>
          </div>
          <Badge tone="muted" textColor={classifyBMI(r.bmi).color}>{r.bmi.toFixed(1)}</Badge>
        </Card>
      ))}
    </div>
  );
}
