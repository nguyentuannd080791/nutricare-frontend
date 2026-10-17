import React from "react";

/**
 * Thanh quang phổ BMI thu gọn cho Mobile (SOLID: Single Responsibility)
 */
export default function CompactBmiSpectrum({ score }) {
  const min = 15;
  const max = 35;
  const clamped = Math.min(Math.max(score, min), max);
  const percent = Math.round(((clamped - min) / (max - min)) * 100);

  return (
    <div className="space-y-1.5 w-full">
      <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-[#EA580C] via-[#10B981] via-[#059669] via-amber-500 to-[#DC2626] shadow-inner">
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 z-10"
          style={{ left: `${percent}%` }}
        >
          <div className="w-4 h-4 rounded-full bg-white border-2 border-[#0F172A] shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          </div>
        </div>
      </div>

      <div className="flex justify-between text-[10px] font-semibold text-[#0F172A]/50 px-0.5">
        <span>Thiếu (&lt;18.5)</span>
        <span className="text-[#059669] font-bold">Chuẩn (18.5 - 24.9)</span>
        <span>Thừa (≥25)</span>
      </div>
    </div>
  );
}
