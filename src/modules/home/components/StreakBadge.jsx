import React from "react";
import { Flame, Coffee } from "lucide-react";

/**
 * Thẻ hiển thị Chuỗi ngày liên tục (Streak Badge)
 * Tuân thủ UI/UX Pro Max & Data Transparency:
 * - Không bao giờ hiển thị fallback số liệu ảo (chống bug 0 || 7)
 * - Màu sắc ngữ nghĩa: Xanh khi đã hoàn thành hôm nay, Cam hổ phách khi đang giữ chuỗi, Xám nhã nhặn khi chuỗi là 0 ngày
 * - Gợi ý vi mô (microcopy) khuyến khích người dùng hoàn thành nhiệm vụ
 */
export default function StreakBadge({ streak, restDay, className = "" }) {
  if (!streak && !restDay) return null;

  const current = streak?.current ?? 0;
  const isHot = current > 0;
  const todayComplete = Boolean(streak?.todayComplete);

  if (restDay) {
    return (
      <div
        title="Chủ nhật là ngày xả hơi nghỉ ngơi theo khoa học, không tính vào chuỗi và không làm mất chuỗi."
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] ${className}`}
      >
        <Coffee className="w-3.5 h-3.5 text-[#059669]" />
        <span>Hôm nay nghỉ ngơi</span>
      </div>
    );
  }

  // Chuỗi đang duy trì > 0 ngày
  if (isHot) {
    return (
      <div
        title="Chuỗi ngày liên tục ăn đủ 100% bữa ăn trong thực đơn và hoàn thành 100% bài tập kế hoạch."
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
          todayComplete
            ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
            : "bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]"
        } ${className}`}
      >
        <Flame
          className={`w-3.5 h-3.5 ${
            todayComplete
              ? "text-[#059669] fill-[#059669]"
              : "text-[#EA580C] fill-[#EA580C] animate-pulse"
          }`}
        />
        <span>Chuỗi {current} ngày</span>
        {todayComplete ? (
          <span className="font-bold text-[#059669]">· Đạt mục tiêu ✓</span>
        ) : (
          <span className="opacity-80">· Đang thực hiện</span>
        )}
      </div>
    );
  }

  // Chuỗi 0 ngày (trung thực và động viên)
  return (
    <div
      title="Hoàn thành tất cả các bữa ăn và bài tập hôm nay để bắt đầu chuỗi ngày ăn sạch!"
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/90 ${className}`}
    >
      <Flame className="w-3.5 h-3.5 text-slate-400" />
      <span>Chuỗi 0 ngày</span>
      <span className="opacity-75">· Bắt đầu hôm nay!</span>
    </div>
  );
}
