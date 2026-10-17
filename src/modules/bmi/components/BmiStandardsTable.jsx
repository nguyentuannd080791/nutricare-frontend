import React from "react";
import { HelpCircle, Info } from "lucide-react";
import { WHO_BMI_STANDARD } from "../domain/bmiEngine";

/**
 * Bảng phân loại thể trạng theo Chuẩn WHO (SOLID: Single Responsibility)
 */
export default function BmiStandardsTable({ activeCategory, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FFF7ED] text-[#EA580C]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">
            Bảng Phân Loại Chuẩn WHO
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-[#059669]">
          Tiêu chuẩn Quốc tế
        </span>
      </div>

      <div className="space-y-2">
        {WHO_BMI_STANDARD.ranges.map((range) => {
          const isCurrent = activeCategory?.key === range.key;
          return (
            <div
              key={range.key}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isCurrent
                  ? "bg-[#ECFDF5] border-[#10B981] shadow-sm ring-2 ring-[#059669]/20"
                  : "bg-white border-[#DCEEE7] opacity-85 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: range.color }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold truncate ${
                        isCurrent ? "text-[#059669]" : "text-[#0F172A]"
                      }`}
                    >
                      {range.label}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#059669] text-white shrink-0">
                        Vị trí của bạn
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#0F172A]/55 block">
                    {range.key === "underweight"
                      ? "< 18.5"
                      : range.key === "obese"
                      ? "≥ " + range.minBmi
                      : `${range.minBmi} - ${range.maxBmi}`}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className="text-[11px] font-semibold block"
                  style={{ color: range.color }}
                >
                  {range.risk.split(",")[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-[#F0F8F6] border border-[#DCEEE7] text-[11px] text-[#0F172A]/60 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
        <span>
          Theo Tổ chức Y tế Thế giới (WHO), chỉ số BMI nằm trong khoảng{" "}
          <strong>18.5 - 24.9</strong> thể hiện cân nặng tối ưu với tỷ lệ phát sinh bệnh tật thấp nhất.
        </span>
      </div>
    </div>
  );
}
