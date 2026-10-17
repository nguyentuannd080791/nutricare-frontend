import React from "react";
import { Scale, Minus, Plus, Check, Loader2 } from "lucide-react";
import { BmiEngine } from "../domain/bmiEngine";

/**
 * Khối cập nhật cân nặng mới (SOLID: Single Responsibility)
 * Tinh gọn, trực quan, hỗ trợ nút [-] / [+] bước 0.1kg và live preview BMI
 */
export default function WeightUpdateCard({
  inputWeight,
  setInputWeight,
  currentWeight,
  fixedHeight,
  optionalNote,
  setOptionalNote,
  onSave,
  isSaving = false,
  className = "",
}) {
  const handleStep = (delta) => {
    setInputWeight((prev) => {
      const next = Number(Math.max(25, Math.min(250, Number(prev) + delta)).toFixed(1));
      return next;
    });
  };

  const predictedBmi = BmiEngine.calculateScore(inputWeight, fixedHeight);
  const weightDiff = Number((inputWeight - currentWeight).toFixed(1));

  return (
    <div
      className={`rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm space-y-5 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-[#ECFDF5] text-[#059669]">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
            Cập Nhật Cân Nặng Hiện Tại
          </h2>
          <p className="text-xs text-[#0F172A]/55">
            Nhập số cân mới để hệ thống tính lại BMI và ghi nhận tiến trình
          </p>
        </div>
      </div>

      {/* BỘ ĐIỀU KHIỂN CÂN NẶNG: 2 NÚT [-] [+] VÀ Ô NHẬP SỐ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#F0F8F6] to-white border border-[#DCEEE7] flex flex-col items-center justify-center space-y-4">
        <span className="text-xs font-semibold text-[#0F172A]/50 uppercase tracking-wider">
          Cân nặng nhập vào (kg)
        </span>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => handleStep(-0.1)}
            disabled={isSaving}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#DCEEE7] hover:bg-[#ECFDF5] hover:border-[#059669] text-[#0F172A] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
            aria-label="Giảm 0.1 kg"
            title="Giảm 0.1 kg"
          >
            <Minus className="w-6 h-6 text-[#059669]" />
          </button>

          <div className="flex items-baseline gap-1.5 bg-white px-5 py-2 rounded-2xl border-2 border-[#059669]/30 shadow-xs focus-within:border-[#059669]">
            <input
              type="number"
              step="0.1"
              min="25"
              max="250"
              value={inputWeight}
              onChange={(e) => setInputWeight(Number(e.target.value))}
              disabled={isSaving}
              className="w-24 sm:w-32 text-3xl sm:text-4xl font-black text-center text-[#0F172A] bg-transparent focus:outline-none"
            />
            <span className="text-base sm:text-lg font-bold text-[#059669]">kg</span>
          </div>

          <button
            type="button"
            onClick={() => handleStep(+0.1)}
            disabled={isSaving}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#DCEEE7] hover:bg-[#ECFDF5] hover:border-[#059669] text-[#0F172A] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
            aria-label="Tăng 0.1 kg"
            title="Tăng 0.1 kg"
          >
            <Plus className="w-6 h-6 text-[#059669]" />
          </button>
        </div>

        {/* Preview BMI tạm tính trực tiếp */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCEEE7] text-xs font-semibold text-[#0F172A]/75 shadow-xs">
          <span>BMI dự kiến:</span>
          <strong className="text-[#059669] font-bold">{predictedBmi}</strong>
          <span>•</span>
          <span
            className={
              weightDiff < 0
                ? "text-[#059669]"
                : weightDiff > 0
                ? "text-[#EA580C]"
                : "text-[#0F172A]/50"
            }
          >
            {weightDiff > 0
              ? `Tăng +${weightDiff} kg`
              : weightDiff < 0
              ? `Giảm ${weightDiff} kg`
              : "Chưa đổi"}
          </span>
        </div>
      </div>

      {/* Ghi chú tùy chọn (1 dòng đơn giản) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#0F172A]">
          Ghi chú ngắn (Tùy chọn):
        </label>
        <input
          type="text"
          value={optionalNote}
          onChange={(e) => setOptionalNote(e.target.value)}
          placeholder="Ví dụ: Đo sáng sớm lúc đói, sau khi uống nước..."
          disabled={isSaving}
          className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DCEEE7] bg-[#F0F8F6] text-xs focus:bg-white focus:outline-none focus:border-[#059669] transition-all"
        />
      </div>

      {/* NÚT LƯU CÂN NẶNG */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving || !inputWeight}
        className="w-full py-3.5 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang ghi nhận...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Lưu Cân Nặng Mới</span>
          </>
        )}
      </button>
    </div>
  );
}
