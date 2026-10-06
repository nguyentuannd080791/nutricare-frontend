import React from "react";

/** Trách nhiệm duy nhất: 1 chỉ số lớn + nhãn + ghi chú ngắn. Giá trị luôn hiện dạng chữ. */
export default function KpiCard({ label, value, note }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <span className="block text-[12.5px] text-slate-600">{label}</span>
      <span className="block mt-1 text-[28px] leading-none font-extrabold text-fg">{value}</span>
      {note && <span className="block mt-2 text-[12px] text-slate-600">{note}</span>}
    </div>
  );
}
