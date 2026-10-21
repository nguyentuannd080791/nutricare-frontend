import React, { useState, useEffect } from "react";
import { X, Flame, Clock, Check, Loader2 } from "lucide-react";
import { calcBurnedCalories } from "../domain/exerciseCatalogModel";
import { MIN_MINUTES, MAX_MINUTES, validateMinutes } from "../domain/exerciseInput";

const PRESET_MINUTES = [15, 20, 30, 45, 60];

export default function QuickLogExerciseModal({
  workout,
  weightKg = 65,
  saving = false,
  onClose,
  onSubmit,
}) {
  const [minutes, setMinutes] = useState(workout?.defaultMinutes || 30);
  const [error, setError] = useState(null);

  // Sync state nếu workout thay đổi
  useEffect(() => {
    if (workout) {
      setMinutes(workout.defaultMinutes || 30);
      setError(null);
    }
  }, [workout]);

  if (!workout) return null;

  const currentBurn = calcBurnedCalories(workout.met, minutes, weightKg);

  function handleSelectPreset(preset) {
    setMinutes(preset);
    setError(null);
  }

  function handleCustomChange(e) {
    const val = e.target.value;
    if (val === "") {
      setMinutes("");
      setError("Vui lòng nhập số phút.");
      return;
    }
    const err = validateMinutes(val);
    setError(err);
    if (!err) {
      setMinutes(Number(val));
    } else {
      setMinutes(val);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateMinutes(String(minutes));
    if (err) {
      setError(err);
      return;
    }
    const success = await onSubmit({
      exerciseId: workout.id,
      minutes: Number(minutes),
    });
    if (success) {
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <span className="text-[11.5px] font-semibold text-primary uppercase tracking-wider block">
              Ghi nhận tập luyện
            </span>
            <h3 className="text-[17px] font-bold text-fg m-0 mt-0.5 leading-snug">
              {workout.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full flex items-center justify-center text-descGray hover:text-fg hover:bg-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung tính toán */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Card calo ước tính */}
          <div className="rounded-xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent border border-rose-500/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500">
                <Flame size={22} />
              </div>
              <div>
                <span className="text-[12px] font-medium text-descGray block">
                  Tiêu hao dự kiến ({weightKg} kg)
                </span>
                <span className="text-[22px] font-black text-rose-600 dark:text-rose-400 leading-tight">
                  ~{currentBurn}{" "}
                  <span className="text-[14px] font-bold text-descGray">kcal</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-descGray">
                MET {workout.met}
              </span>
            </div>
          </div>

          {/* Chọn nhanh thời gian */}
          <div>
            <label className="text-[13px] font-semibold text-fg flex items-center gap-1.5 mb-2">
              <Clock size={15} className="text-descGray" />
              <span>Thời gian tập luyện</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {PRESET_MINUTES.map((m) => {
                const isActive = Number(minutes) === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectPreset(m)}
                    className={`py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "bg-muted/80 hover:bg-muted text-fg border border-border/50"
                    }`}
                  >
                    {m}p
                  </button>
                );
              })}
            </div>

            {/* Ô nhập tùy chỉnh số phút */}
            <div className="relative">
              <input
                type="number"
                min={MIN_MINUTES}
                max={MAX_MINUTES}
                value={minutes}
                onChange={handleCustomChange}
                placeholder="Nhập số phút khác..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-fg text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12.5px] font-medium text-descGray pointer-events-none">
                phút
              </span>
            </div>
            {error && (
              <p className="m-0 mt-1.5 text-[12px] text-destructive font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Nút submit */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 rounded-xl border border-border bg-muted/50 hover:bg-muted text-fg font-semibold text-[14px] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving || Boolean(error)}
              className="flex-[2] py-3 rounded-xl bg-primary hover:bg-primaryDark text-white font-bold text-[14px] shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check size={17} />
                  <span>Xác nhận đã tập</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
