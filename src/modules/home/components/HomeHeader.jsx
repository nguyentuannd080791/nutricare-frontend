import React from "react";
import { CalendarDays } from "lucide-react";
import { formatTodayLabel, greetingFor } from "../domain/todayLabel";
import { ScreenHeader } from "../../../shared/components/ui";
import StreakBadge from "./StreakBadge";

/**
 * Header Trang chủ (SOLID: Single Responsibility)
 * - Tích hợp StreakBadge chuẩn xác, minh bạch, loại bỏ bug 0 || 7
 * - Hiển thị lời chào thân mật và thông tin thời gian thực
 */
export default function HomeHeader({ fullName, streak, restDay, onAvatarPress }) {
  const now = new Date();
  const firstName = (fullName || "").trim().split(" ").slice(-1)[0];
  const initial = (fullName || "U").trim().charAt(0).toUpperCase();

  return (
    <ScreenHeader
      icon={CalendarDays}
      title={`${greetingFor(now.getHours())}, ${firstName || "bạn"}!`}
      subtitle={`Hôm nay, ${formatTodayLabel(now)}`}
      badge={<StreakBadge streak={streak} restDay={restDay} />}
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
