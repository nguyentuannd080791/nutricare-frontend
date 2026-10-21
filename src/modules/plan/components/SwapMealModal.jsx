import React from "react";
import { ArrowRightLeft, Sparkles, X } from "lucide-react";
import { getSwapAlternatives } from "../domain/menuPlanModel";

/**
 * Modal Đổi món: Giới hạn đúng 3 món cùng hệ thực phẩm & slot (SRP, SOLID)
 */
export default function SwapMealModal({
  isOpen,
  onClose,
  currentMeal,
  onConfirmSwap,
}) {
  if (!isOpen || !currentMeal) return null;

  const currentDish = currentMeal.dish;
  const alternatives = getSwapAlternatives(currentMeal, currentDish);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#DCEEE7] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-5 sm:p-6 border-b border-[#DCEEE7] flex items-center justify-between bg-[#F0F8F6]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-sm">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 id="swap-modal-title" className="text-base sm:text-lg font-bold text-[#0F172A]">
                Đổi món {currentMeal.slotLabel}
              </h3>
              <p className="text-xs text-[#0F172A]/60">
                3 lựa chọn tối ưu cùng hệ calo & dinh dưỡng
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#0F172A]/50 hover:bg-[#F0F8F6] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung: Món hiện tại & 3 món thay thế */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Thẻ món hiện tại */}
          <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#EA580C]/20 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                Món đang áp dụng
              </span>
              <p className="text-sm font-bold text-[#0F172A] truncate mt-0.5">
                {currentDish.name}
              </p>
              <p className="text-xs text-[#0F172A]/60">
                {currentDish.calories} kcal • {currentDish.serving}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#EA580C]/30 text-[#EA580C]">
              Hiện hành
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Sparkles className="w-4 h-4 text-[#059669]" />
            <span className="text-xs font-bold text-[#0F172A]">
              Chọn 1 trong 3 món thay thế cùng hệ:
            </span>
          </div>

          {/* Danh sách 3 món gợi ý */}
          <div className="space-y-3">
            {alternatives.map((altDish, index) => {
              const diffCalo = altDish.calories - currentDish.calories;
              const diffText =
                diffCalo === 0
                  ? "Bằng calo"
                  : diffCalo > 0
                    ? `+${diffCalo} kcal`
                    : `${diffCalo} kcal`;

              return (
                <div
                  key={altDish.id || altDish.dishId || index}
                  className="p-4 rounded-2xl border border-[#DCEEE7] hover:border-[#059669] hover:bg-[#ECFDF5]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#059669] transition-colors">
                        {altDish.name}
                      </h4>
                    </div>
                    {altDish.desc && (
                      <p className="text-xs text-[#0F172A]/60 line-clamp-1 pl-7">
                        {altDish.desc}
                      </p>
                    )}
                    <div className="flex items-center gap-2 pl-7 pt-1 text-[11px] font-medium text-[#0F172A]/65">
                      <span className="font-bold text-[#059669]">
                        {altDish.calories} calo
                      </span>
                      <span>•</span>
                      <span>Đạm: {altDish.protein}g</span>
                      <span>•</span>
                      <span>Bột: {altDish.carbs}g</span>
                      <span>•</span>
                      <span>Béo: {altDish.fat}g</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#DCEEE7]">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        diffCalo > 0
                          ? "bg-[#FFF7ED] text-[#EA580C]"
                          : "bg-[#ECFDF5] text-[#059669]"
                      }`}
                    >
                      {diffText}
                    </span>
                    <button
                      type="button"
                      onClick={() => onConfirmSwap(altDish)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      Đổi sang món này
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DCEEE7] bg-[#F0F8F6]/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0F172A]/70 hover:bg-[#F0F8F6] transition-colors cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
