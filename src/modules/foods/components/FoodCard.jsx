import React from "react";
import { AlertTriangle } from "lucide-react";
import { NutritionFacts } from "../domain/nutritionModel";
import { FoodSafetyModel } from "../domain/foodSafetyModel";

const MACRO_INDICATORS = [
  { key: "protein", label: "Đạm", dotClass: "bg-[#EA580C]" },
  { key: "carbs", label: "Tinh bột", dotClass: "bg-[#F59E0B]" },
  { key: "fat", label: "Chất béo", dotClass: "bg-[#0284C7]" },
];

/**
 * Thẻ hiển thị thực phẩm / món ăn trong danh sách tra cứu (SOLID: Single Responsibility)
 * Đồng bộ phong cách thẻ từ test-ui (FoodCard):
 * - Tên món + tên tiếng Anh (nếu có) + nhóm món
 * - Khẩu phần tiêu chuẩn
 * - Huy hiệu năng lượng màu xanh ngọc
 * - Cảnh báo y tế nếu có xung đột bệnh lý / dị ứng
 * - 3 chỉ số đa lượng Đạm (Cam) - Bột (Vàng) - Béo (Xanh)
 */
export default function FoodCard({
  item,
  isSelected = false,
  onClick,
  isDish = true,
  userConditions = [],
}) {
  if (!item) return null;

  const facts = NutritionFacts.fromBackend(item);
  const evaluation = FoodSafetyModel.evaluate(item, userConditions);
  const hasWarning = Boolean(evaluation?.hasRedWarning);

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (onClick) onClick();
  };

  const cardStyle = isSelected
    ? "bg-[#ECFDF5]/90 border-[#059669] shadow-sm ring-2 ring-[#059669]/20"
    : hasWarning
    ? "bg-white hover:bg-rose-50/30 border-rose-200/90 hover:border-rose-300 shadow-2xs"
    : "bg-white hover:bg-[#F8FAFC] border-[#DCEEE7] hover:border-[#059669]/40 shadow-2xs";

  const servingLabel = isDish ? "1 phần món ăn" : "100g thực phẩm";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group relative text-left w-full rounded-2xl p-4 transition-all duration-200 cursor-pointer border select-none ${cardStyle}`}
    >
      {/* Hàng 1: Tên món + Khẩu phần (Trái) & Năng lượng (Phải) */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[#0F172A] text-sm sm:text-base leading-snug group-hover:text-[#059669] transition-colors">
            {item.nameVi}
          </h3>
          {item.nameEn && item.nameEn !== item.nameVi && (
            <p className="text-[11px] text-[#0F172A]/40 italic truncate">
              {item.nameEn}
            </p>
          )}
          <p className="text-xs text-[#0F172A]/55 mt-0.5 font-medium">
            {item.groupNameVi || (isDish ? "Món ăn" : "Thực phẩm")} • Khẩu phần: {servingLabel}
          </p>
        </div>

        {/* Huy hiệu Calo đồng bộ tông xanh ngọc của NutriCare */}
        <div className="shrink-0 text-right px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#DCEEE7]">
          <span className="text-base sm:text-lg font-extrabold text-[#059669] leading-none">
            {facts.calories}
          </span>
          <span className="text-[11px] font-bold text-[#059669]/80 ml-1">
            kcal
          </span>
        </div>
      </div>

      {/* Hàng 2: Cảnh báo y tế (Chỉ hiển thị khi có xung đột bệnh lý) */}
      {hasWarning && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-700 font-semibold bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200/80">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="truncate">
            Chống chỉ định: {evaluation.primaryConditionName}
          </span>
        </div>
      )}

      {/* Hàng 3: 3 chỉ số đa lượng kèm chấm màu đồng bộ */}
      <div className="mt-3 grid grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#DCEEE7]/70 text-center">
        {MACRO_INDICATORS.map((macro, index) => (
          <div
            key={macro.key}
            className={index === 1 ? "border-x border-slate-200/80" : ""}
          >
            <span className="inline-flex items-center justify-center gap-1.5 text-[11px] text-[#475569] font-medium">
              <span className={`w-2 h-2 rounded-full ${macro.dotClass}`} />
              {macro.label}
            </span>
            <span className="block text-xs sm:text-sm font-extrabold text-[#0F172A] mt-0.5">
              {facts[macro.key]}g
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
