import React, { useState } from "react";
import { Flame, Clock, Trash2, ChevronDown, ChevronUp, Trophy, Info } from "lucide-react";
import { COLORS } from "../../../assets/theme/colors";
import { sumEntryKcal, exerciseLabel } from "../domain/exerciseInput";

export default function TodayActivitySummary({
  entries = [],
  catalog = [],
  disabled = false,
  onRemove,
  weightKg = 65,
}) {
  const [showListMobile, setShowListMobile] = useState(false);

  const totalKcal = sumEntryKcal(entries);
  const totalMinutes = entries.reduce((acc, curr) => acc + (curr.minutes || 0), 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
      {/* Header card */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-fg m-0">Vận động hôm nay</h3>
            <span className="text-[11.5px] text-descGray">Cập nhật thời gian thực</span>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-descGray">
          {entries.length} bài đã tập
        </span>
      </div>

      {/* 2 khối số liệu: Calo & Thời gian */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="rounded-xl bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 p-3">
          <div className="flex items-center gap-1.5 text-rose-500 mb-1">
            <Flame size={16} />
            <span className="text-[12px] font-medium text-descGray">Đã đốt</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-black text-rose-600 dark:text-rose-400">
              {totalKcal}
            </span>
            <span className="text-[12px] font-bold text-descGray">kcal</span>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-3">
          <div className="flex items-center gap-1.5 text-blue-500 mb-1">
            <Clock size={16} />
            <span className="text-[12px] font-medium text-descGray">Thời gian</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-black text-blue-600 dark:text-blue-400">
              {totalMinutes}
            </span>
            <span className="text-[12px] font-bold text-descGray">phút</span>
          </div>
        </div>
      </div>

      {/* Tip mở khóa calo ăn uống */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15 mb-4">
        <Info size={15} className="text-primary shrink-0 mt-0.5" />
        <p className="text-[11.5px] text-descGray leading-relaxed m-0">
          Calo tiêu hao từ bài tập được cộng trực tiếp vào ngân sách năng lượng trên Trang chủ, giúp bạn thoải mái ăn đủ chất.
        </p>
      </div>

      {/* Danh sách các bài đã tập */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-fg">Nhật ký bài tập</span>
          {/* Toggle xem trên mobile nếu danh sách dài */}
          <button
            type="button"
            onClick={() => setShowListMobile(!showListMobile)}
            className="md:hidden text-[12px] font-semibold text-primary flex items-center gap-0.5 cursor-pointer"
          >
            {showListMobile ? "Thu gọn" : "Xem tất cả"}
            {showListMobile ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="py-4 text-center rounded-xl border border-dashed border-border/80 bg-muted/30">
            <p className="text-[12.5px] text-descGray m-0">Chưa có bài tập nào hôm nay.</p>
            <span className="text-[11px] text-descGray/80 block mt-0.5">
              Chọn một bài tập bên dưới để ghi nhận nhé!
            </span>
          </div>
        ) : (
          <div className={`${showListMobile ? "block" : "max-h-[160px] md:max-h-[280px]"} overflow-y-auto pr-1 space-y-2`}>
            {entries.map((entry) => {
              const label = exerciseLabel(catalog, entry.exerciseId);
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/70 transition-colors group"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[13px] font-bold text-fg block truncate">
                      {label}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-descGray">
                      <span>{entry.minutes} phút</span>
                      <span>•</span>
                      <span className="font-semibold text-rose-500">+{entry.kcal} kcal</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onRemove(entry.id)}
                    aria-label={`Xoá ${label}`}
                    title="Xóa bài tập này"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-descGray hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
