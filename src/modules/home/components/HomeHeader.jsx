import React from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { formatTodayLabel, greetingFor } from "../domain/todayLabel";

/**
 * Header Trang chủ (SOLID: Single Responsibility)
 * Đồng bộ phong cách từ test-ui:
 * - Nhãn ngày có icon CalendarDays màu xanh ngọc
 * - Tiêu đề chào hỏi trang nhã
 * - Huy hiệu chuỗi ngày ăn sạch với Sparkles cam
 * - Avatar người dùng với chữ cái đầu
 */
export default function HomeHeader({ fullName, streak, restDay, onAvatarPress }) {
  const now = new Date();
  const firstName = (fullName || "").trim().split(" ").slice(-1)[0];
  const initial = (fullName || "U").trim().charAt(0).toUpperCase();
  const streakDays = streak?.current || 7;

  return (
    <header className="flex items-center justify-between gap-3 mb-6">
      <div>
        <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#059669]">
          <CalendarDays className="w-3.5 h-3.5 text-[#059669]" />
          Hôm nay, {formatTodayLabel(now)}
        </span>
        <h1 className="text-lg sm:text-xl font-bold text-[#0F172A]">
          {greetingFor(now.getHours())}, {firstName || "bạn"}!
        </h1>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#DCEEE7]">
          <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
          {restDay ? "Hôm nay nghỉ ngơi" : `Chuỗi ${streakDays} ngày ăn sạch`}
        </span>

        <button
          type="button"
          onClick={onAvatarPress}
          aria-label="Mở trang cá nhân"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:bg-[#047857] transition-all cursor-pointer"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}
