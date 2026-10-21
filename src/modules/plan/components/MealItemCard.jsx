import React from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
} from "lucide-react";

/**
 * Thẻ hiển thị một bữa ăn: Gọn gàng, nút Đổi món bị khóa khi đã ăn hoặc ngày đã qua (SRP, SOLID)
 * Chỉ cho phép tích hoàn thành bữa ăn vào ngày hôm nay; ngày trước và tương lai chỉ xem & đổi món
 */
export default function MealItemCard({
  meal,
  onToggleComplete,
  onOpenSwap,
  canToggle = true,
  isPast = false,
  isFuture = false,
}) {
  const { dish, completed, slotLabel, slotTime, accent, bg, items } = meal;

  return (
    <div
      className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col justify-between gap-3 select-none ${
        completed
          ? "bg-[#ECFDF5]/50 border-[#10B981]/40"
          : "bg-white border-[#DCEEE7] hover:border-[#059669]/40 hover:shadow-sm"
      }`}
    >
      {/* Hàng 1: Badge Bữa ăn + Giờ + Trạng thái checkbox */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-xl text-xs font-bold"
            style={{ backgroundColor: bg, color: accent }}
          >
            {slotLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#0F172A]/50 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {slotTime}
          </span>
        </div>

        {/* Nút Checkbox Đã ăn: Chỉ thao tác được ở ngày hôm nay (canToggle) */}
        <button
          type="button"
          disabled={!canToggle}
          onClick={() => {
            if (canToggle) {
              onToggleComplete(meal.slotId || meal.mealSlot);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            canToggle
              ? "cursor-pointer active:scale-95"
              : "cursor-not-allowed opacity-80"
          } ${
            completed
              ? "bg-[#059669] text-white shadow-sm"
              : canToggle
                ? "bg-[#F0F8F6] text-[#0F172A]/70 hover:bg-[#DCEEE7]"
                : "bg-[#F1F5F9] text-[#0F172A]/40 border border-[#CBD5E1]/60"
          }`}
          title={
            !canToggle
              ? isPast
                ? "Ngày đã qua: Không thể tích hay hủy tích bữa ăn"
                : "Ngày tương lai: Chỉ được tích vào ngày hôm nay khi dùng bữa"
              : completed
                ? "Bấm để bỏ đánh dấu"
                : "Đánh dấu đã ăn bữa này"
          }
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Đã ăn</span>
            </>
          ) : (
            <>
              <Circle
                className={`w-4 h-4 ${
                  canToggle ? "text-[#0F172A]/40" : "text-[#0F172A]/25"
                }`}
              />
              <span>Chưa dùng</span>
            </>
          )}
        </button>
      </div>

      {/* Hàng 2: Tên món ăn & Khẩu phần & Các món con (nếu mâm cơm combo) */}
      <div className="space-y-1">
        <h4
          className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
            completed ? "line-through text-[#0F172A]/50" : "text-[#0F172A]"
          }`}
        >
          {dish.name}
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#059669] font-medium">
            Khẩu phần: {dish.serving}
          </span>
          {Array.isArray(items) && items.length > 1 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F0F8F6] text-[#059669] font-semibold border border-[#DCEEE7]">
              Mâm cơm {items.length} món
            </span>
          )}
        </div>
      </div>

      {/* Hàng 3: Dinh dưỡng (Calo, Đạm, Bột, Béo) & Thao tác Đổi món / Khóa */}
      <div className="pt-2.5 border-t border-[#DCEEE7]/70 flex items-center justify-between gap-2">
        {/* Chỉ số Macros rút gọn trên 1 dòng */}
        <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold">
          <span className="px-2 py-0.5 rounded-lg bg-[#ECFDF5] text-[#059669] font-black text-xs">
            {dish.calories} kcal
          </span>
          <span className="text-[#0F172A]/25">•</span>
          <span
            className="text-[#EA580C] font-bold inline-flex items-center gap-1"
            title={`Đạm (Protein): ${dish.protein}g`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            Đ: {dish.protein}g
          </span>
          <span className="text-[#0F172A]/25">•</span>
          <span
            className="text-[#D97706] font-bold inline-flex items-center gap-1"
            title={`Tinh bột (Carbs): ${dish.carbs}g`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            B: {dish.carbs}g
          </span>
          <span className="text-[#0F172A]/25">•</span>
          <span
            className="text-[#0284C7] font-bold inline-flex items-center gap-1"
            title={`Chất béo (Fat): ${dish.fat}g`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
            M: {dish.fat}g
          </span>
        </div>

        {/* Góc thẻ: 1 Icon duy nhất (Đổi món ⇄ chuyển thành Ổ khóa 🔒 khi đã dùng hoặc ngày đã qua) */}
        {completed ? (
          <div
            title="Món ăn đã được khóa vì đã dùng bữa"
            aria-label="Món ăn đã được khóa vì đã dùng bữa"
            className="w-8 h-8 rounded-xl bg-[#F0F8F6] border border-[#DCEEE7] text-[#059669] flex items-center justify-center select-none cursor-default shrink-0"
          >
            <Lock className="w-4 h-4" />
          </div>
        ) : isPast ? (
          <div
            title="Ngày đã qua: Đã chốt thực đơn, không thể đổi món"
            aria-label="Ngày đã qua: Đã chốt thực đơn, không thể đổi món"
            className="w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] flex items-center justify-center select-none cursor-default shrink-0"
          >
            <Lock className="w-4 h-4 text-[#94A3B8]" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenSwap(meal)}
            title={
              isFuture
                ? "Đổi món trước cho ngày tương lai"
                : "Đổi món ăn hôm nay"
            }
            aria-label="Đổi món ăn"
            className="w-8 h-8 rounded-xl bg-white border border-[#059669]/40 hover:bg-[#059669] hover:text-white text-[#059669] flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
