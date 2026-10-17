import React from "react";
import { ShieldCheck, TrendingDown, TrendingUp, Target, Flame } from "lucide-react";

/**
 * 4 Thẻ chỉ số thể trạng nhanh (SOLID: Single Responsibility)
 * - Card 1: BMI hiện tại + Nhãn thể trạng chuẩn WHO
 * - Card 2: Biến động cân nặng & BMI so với lần đo liền trước
 * - Card 3: Khung cân nặng lý tưởng theo WHO (18.5 - 24.9)
 * - Card 4: Năng lượng trao đổi cơ bản BMR & TDEE
 */
export default function BmiMetricCards({
  currentScore,
  currentWeight,
  activeCategory,
  deltaInfo,
  idealWeightRange,
  bmrValue,
  tdeeValue,
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* CARD 1: BMI HIỆN TẠI */}
      <div className="rounded-3xl bg-white border border-[#DCEEE7] p-4 sm:p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#059669]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A]/60">BMI Hiện Tại</span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border truncate max-w-[95px] sm:max-w-none"
            style={{
              color: activeCategory.color,
              backgroundColor: activeCategory.bgColor,
              borderColor: activeCategory.borderColor,
            }}
          >
            {activeCategory.badgeText}
          </span>
        </div>
        <div className="my-2 sm:my-2.5 flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            {currentScore}
          </span>
          <span className="text-xs font-medium text-[#0F172A]/50">kg/m²</span>
        </div>
        <div className="text-[10px] sm:text-[11px] text-[#059669] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Chuẩn WHO: 18.5 - 24.9</span>
        </div>
      </div>

      {/* CARD 2: BIẾN ĐỘNG CÂN NẶNG SO VỚI LẦN TRƯỚC */}
      <div className="rounded-3xl bg-white border border-[#DCEEE7] p-4 sm:p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#059669]/40 transition-all">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-bold text-[#0F172A]/60 whitespace-nowrap">Biến Động Cân</span>
          <span className="text-[10px] text-[#0F172A]/45 font-medium whitespace-nowrap">
            So với trước
          </span>
        </div>

        {deltaInfo ? (
          <div className="my-2 flex items-baseline gap-1.5 whitespace-nowrap">
            <span
              className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-0.5 ${
                deltaInfo.isDecrease
                  ? "text-[#059669]"
                  : deltaInfo.isIncrease
                  ? "text-[#EA580C]"
                  : "text-[#0F172A]"
              }`}
            >
              {deltaInfo.isDecrease && <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />}
              {deltaInfo.isIncrease && <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />}
              {deltaInfo.weightDiff > 0 ? `+${deltaInfo.weightDiff}` : deltaInfo.weightDiff}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]/60">
              kg ({deltaInfo.bmiDiff > 0 ? `+${deltaInfo.bmiDiff}` : deltaInfo.bmiDiff} BMI)
            </span>
          </div>
        ) : (
          <div className="my-2 text-sm font-semibold text-[#0F172A]/60">
            Chưa có lần đo trước
          </div>
        )}

        <div className="text-[10px] sm:text-[11px] font-semibold text-[#0F172A]/60 truncate" title={deltaInfo ? `${deltaInfo.isDecrease ? "Giảm lành mạnh" : deltaInfo.isIncrease ? "Đang tăng cân" : "Giữ ổn định"} • ${deltaInfo.previousDateDisplay}` : ""}>
          {deltaInfo ? (
            <span>
              {deltaInfo.isDecrease
                ? "Giảm lành mạnh"
                : deltaInfo.isIncrease
                ? "Đang tăng cân"
                : "Giữ ổn định"}{" "}
              • {deltaInfo.previousDateDisplay}
            </span>
          ) : (
            "Ghi lại lần đo tiếp theo"
          )}
        </div>
      </div>

      {/* CARD 3: CÂN NẶNG LÝ TƯỞNG THEO WHO (18.5 - 24.9) */}
      <div className="hidden lg:flex rounded-3xl bg-white border border-[#DCEEE7] p-5 shadow-sm flex-col justify-between relative overflow-hidden group hover:border-[#059669]/40 transition-all">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-bold text-[#0F172A]/60 whitespace-nowrap">Mức Cân Chuẩn WHO</span>
          <div className="p-1 rounded-lg bg-[#ECFDF5] text-[#059669]">
            <Target className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-2xl xl:text-3xl font-extrabold text-[#059669] tracking-tight">
            {idealWeightRange.min} - {idealWeightRange.max}
          </span>
          <span className="text-xs font-bold text-[#0F172A]/50">kg</span>
        </div>
        <div className="text-[11px] text-[#0F172A]/60 font-semibold truncate" title={currentWeight >= idealWeightRange.min && currentWeight <= idealWeightRange.max ? "Đang nằm trong vùng hoàn hảo" : currentWeight < idealWeightRange.min ? `Cần tăng thêm ${(idealWeightRange.min - currentWeight).toFixed(1)} kg` : `Cần giảm ${(currentWeight - idealWeightRange.max).toFixed(1)} kg về chuẩn`}>
          {currentWeight >= idealWeightRange.min && currentWeight <= idealWeightRange.max ? (
            <span className="text-[#059669] font-bold"> Đang nằm trong vùng hoàn hảo</span>
          ) : currentWeight < idealWeightRange.min ? (
            <span className="text-[#EA580C]">
              Cần tăng thêm {(idealWeightRange.min - currentWeight).toFixed(1)} kg
            </span>
          ) : (
            <span className="text-[#EA580C]">
              Cần giảm {(currentWeight - idealWeightRange.max).toFixed(1)} kg về chuẩn
            </span>
          )}
        </div>
      </div>

      {/* CARD 4: TIÊU HAO NĂNG LƯỢNG (BMR & TDEE) */}
      <div className="hidden lg:flex rounded-3xl bg-white border border-[#DCEEE7] p-5 shadow-sm flex-col justify-between relative overflow-hidden group hover:border-[#059669]/40 transition-all">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-bold text-[#0F172A]/60 whitespace-nowrap">Năng Lượng Trao Đổi</span>
          <div className="p-1 rounded-lg bg-[#FFF7ED] text-[#EA580C]">
            <Flame className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-2xl xl:text-3xl font-black text-[#0F172A] tracking-tight">
            {bmrValue.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-[#0F172A]/50">kcal BMR/ngày</span>
        </div>
        <div className="text-[11px] text-[#0F172A]/60 font-semibold truncate" title={`TDEE vận động nhẹ: ${tdeeValue.toLocaleString()} calo`}>
          TDEE vận động nhẹ: <strong className="text-[#EA580C]">{tdeeValue.toLocaleString()}</strong> calo
        </div>
      </div>
    </div>
  );
}
