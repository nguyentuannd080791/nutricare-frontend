import React from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { formatTodayLabel, greetingFor } from "../domain/todayLabel";
import { ScreenHeader } from "../../../shared/components/ui";

/**
 * Header Trang chủ (SOLID: Single Responsibility)
 * Tuân thủ cấu trúc header thống nhất toàn hệ thống theo chuẩn FoodsScreen (ScreenHeader):
 * - Icon CalendarDays màu xanh ngọc
 * - Tiêu đề chào hỏi trang nhã + tên người dùng
 * - Phụ đề hiển thị thứ, ngày tháng năm hôm nay
 * - Huy hiệu chuỗi ngày ăn sạch với Sparkles cam
 * - Icon người dùng trên máy tính đã chuyển về góc dưới của Sidebar (ẩn ở header trên desktop).
 */
export default function HomeHeader({ fullName, streak, restDay, onAvatarPress }) {
  const now = new Date();
  const firstName = (fullName || "").trim().split(" ").slice(-1)[0];
  const initial = (fullName || "U").trim().charAt(0).toUpperCase();
  const streakDays = streak?.current || 7;

  return (
    <ScreenHeader
      icon={CalendarDays}
      title={`${greetingFor(now.getHours())}, ${firstName || "bạn"}!`}
      subtitle={`Hôm nay, ${formatTodayLabel(now)}`}
      badgeText={restDay ? "Hôm nay nghỉ ngơi" : `Chuỗi ${streakDays} ngày ăn sạch`}
      badgeIcon={Sparkles}
      right={
        onAvatarPress ? (
          <button
            type="button"
            onClick={onAvatarPress}
            aria-label="Mở trang cá nhân"
            className="lg:hidden w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#047857] transition-all cursor-pointer"
          >
            {initial}
          </button>
        ) : null
      }
    />
  );
}
