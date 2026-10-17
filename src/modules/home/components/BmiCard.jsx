import React from "react";
import { Scale } from "lucide-react";
import { bmiScalePercent } from "../domain/bmiScale";

function getBadgeBg(color) {
  if (color === "#059669") return "#ECFDF5";
  if (color === "#2563EB") return "#EFF6FF";
  if (color === "#D97706" || color === "#EA580C") return "#FFF7ED";
  if (color === "#DC2626") return "#FEF2F2";
  return "#F0F8F6";
}

/**
 * Thẻ Chỉ số BMI (SOLID: Single Responsibility)
 * Đồng bộ chuẩn từ HealthDashboardPage của test-ui:
 * - Hiển thị cân nặng & chiều cao
 * - Huy hiệu trạng thái BMI WHO Châu Á
 * - Con số BMI lớn + nhãn Chuẩn (18.5 - 22.9)
 * - Nút "Chi tiết & Cập nhật →"
 * - Thanh dải màu gradient mềm mại từ Cam -> Xanh ngọc -> Đỏ kèm con trỏ vị trí
 */
export default function BmiCard({ latestBMI, bmiInfo, onPress, className = "" }) {
  if (!latestBMI) return null;

  const score = Number(latestBMI.bmi.toFixed(1));
  const markerPosition = bmiScalePercent(score);
  const badgeBg = getBadgeBg(bmiInfo?.color);

  return (
    <div
      className={`rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-6 shadow-sm flex flex-col justify-between group hover:border-[#059669]/50 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Chỉ số BMI</h3>
            <p className="text-xs text-[#0F172A]/55">
              {latestBMI.weightKg} kg{latestBMI.heightCm ? ` • ${latestBMI.heightCm} cm` : ""}
            </p>
          </div>
        </div>

        {bmiInfo && (
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#DCEEE7]"
            style={{ color: bmiInfo.color, backgroundColor: badgeBg }}
          >
            {bmiInfo.label}
          </span>
        )}
      </div>

      <div className="my-2.5 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#0F172A]">{score}</span>
          <span className="text-xs font-medium text-[#059669]">Chuẩn (18.5 - 22.9)</span>
        </div>

        {onPress && (
          <button
            type="button"
            onClick={onPress}
            className="text-[11px] font-bold text-[#059669] hover:underline cursor-pointer"
          >
            Chi tiết & Cập nhật →
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-[#EA580C] via-[#10B981] to-[#DC2626]">
          <div
            className="w-4 h-4 rounded-full bg-white border-2 border-[#0F172A] shadow absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all"
            style={{ left: `${markerPosition}%` }}
            title={`BMI: ${score}`}
          />
        </div>
        <div className="flex justify-between text-[10px] font-semibold text-[#0F172A]/45">
          <span>15</span>
          <span>18.5</span>
          <span>23.0</span>
          <span>30+</span>
        </div>
      </div>
    </div>
  );
}
