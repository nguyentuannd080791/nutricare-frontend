import React, { useState } from "react";
import { Flame, RefreshCw, Sparkles, X } from "lucide-react";
import { CYCLE_OPTIONS, MONTH_OPTIONS } from "../domain/menuPlanModel";

/**
 * Modal Xây dựng lại thực đơn (SRP, SOLID)
 * Cho phép người dùng chọn chu kỳ ngày (3, 5, 7, 14, 21, 30), số tháng (1, 2, 3, 6), và lượng calo mục tiêu
 */
export default function RebuildPlanModal({
  isOpen,
  onClose,
  initialCycleDays = 7,
  initialMonths = 3,
  initialCalories = 1850,
  onApplyRebuild,
}) {
  const [selectedCycle, setSelectedCycle] = useState(initialCycleDays);
  const [selectedMonths, setSelectedMonths] = useState(initialMonths);
  const [targetCalories, setTargetCalories] = useState(initialCalories);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyRebuild({
      cycleDays: Number(selectedCycle),
      durationMonths: Number(selectedMonths),
      targetCalories: Number(targetCalories) || 1850,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rebuild-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#DCEEE7] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-5 sm:p-6 border-b border-[#DCEEE7] flex items-center justify-between bg-[#ECFDF5]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="rebuild-modal-title" className="text-base sm:text-lg font-bold text-[#0F172A]">
                Tái tạo & Xây dựng thực đơn
              </h3>
              <p className="text-xs text-[#0F172A]/60">
                Điều chỉnh chu kỳ lặp và năng lượng mục tiêu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#0F172A]/50 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form cấu hình */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Chọn số ngày trong chu kỳ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0F172A]">
                1. Chu kỳ lặp thực đơn
              </label>
              <span className="text-[11px] text-[#059669] font-semibold">
                {selectedCycle <= 5 ? "Tự động luân phiên nối tiếp" : "Chu kỳ tiêu chuẩn"}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {CYCLE_OPTIONS.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setSelectedCycle(days)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedCycle === days
                      ? "bg-[#059669] text-white border-[#059669] shadow-sm scale-[1.02]"
                      : "bg-[#F0F8F6] text-[#0F172A] border-[#DCEEE7] hover:border-[#059669]/40"
                  }`}
                >
                  {days} Ngày
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#0F172A]/55 italic">
              {selectedCycle === 3 || selectedCycle === 5
                ? `💡 Chế độ ${selectedCycle} ngày sẽ sắp xếp các món kế tiếp để không bị trùng lặp khẩu vị.`
                : `Thực đơn ${selectedCycle} ngày đầy đủ các nhóm thực phẩm cân bằng.`}
            </p>
          </div>

          {/* Chọn thời gian áp dụng */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0F172A] block">
              2. Thời hạn áp dụng kế hoạch
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMonths(m)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedMonths === m
                      ? "bg-[#0284C7] text-white border-[#0284C7] shadow-sm scale-[1.02]"
                      : "bg-[#F0F8F6] text-[#0F172A] border-[#DCEEE7] hover:border-[#0284C7]/40"
                  }`}
                >
                  {m} Tháng
                </button>
              ))}
            </div>
          </div>

          {/* Lượng calo cần thiết hằng ngày */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="target-calories-input" className="text-xs font-bold text-[#0F172A]">
                3. Lượng Calo cần thiết hằng ngày
              </label>
              <span className="text-[11px] text-[#EA580C] font-semibold">
                Theo Hồ sơ & Mục tiêu hiện tại
              </span>
            </div>
            <div className="relative">
              <input
                id="target-calories-input"
                type="number"
                min="1200"
                max="3500"
                step="50"
                value={targetCalories}
                onChange={(e) => setTargetCalories(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#059669] focus:bg-white transition-all pl-10"
              />
              <Flame className="w-5 h-5 text-[#EA580C] absolute left-3 top-3.5" />
              <span className="absolute right-4 top-3.5 text-xs font-semibold text-[#0F172A]/50">
                kcal / ngày
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1 text-center text-[11px] text-[#0F172A]/60">
              <div className="p-1.5 rounded-lg bg-[#F0F8F6]">
                Sáng: ~{Math.round(targetCalories * 0.25)} kcal
              </div>
              <div className="p-1.5 rounded-lg bg-[#F0F8F6]">
                Trưa: ~{Math.round(targetCalories * 0.35)} kcal
              </div>
              <div className="p-1.5 rounded-lg bg-[#F0F8F6]">
                Xế: ~{Math.round(targetCalories * 0.15)} kcal
              </div>
              <div className="p-1.5 rounded-lg bg-[#F0F8F6]">
                Tối: ~{Math.round(targetCalories * 0.25)} kcal
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#DCEEE7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#0F172A]/70 hover:bg-[#F0F8F6] transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Áp dụng & Tái tạo thực đơn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
