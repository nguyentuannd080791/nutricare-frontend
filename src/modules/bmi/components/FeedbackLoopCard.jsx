import React from "react";
import { Sparkles, RefreshCw, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ShieldAlert } from "lucide-react";

/**
 * Thẻ hiển thị Trạng thái Vòng lặp phản hồi Calo (Feedback Loop Card)
 * Tuân thủ SOLID (SRP) & UI/UX Pro Max:
 * - Minh bạch hóa 100% cơ chế tự động điều chỉnh calo
 * - Hiển thị tiến độ thu thập dữ liệu 14 ngày (7 ngày gần nhất vs 7 ngày trước đó)
 * - Thông báo rõ ràng lý do calo được giữ nguyên hoặc điều chỉnh ±125 kcal
 */
export default function FeedbackLoopCard({
  feedbackStatus,
  isPremium,
  onUpgrade,
  className = "",
}) {
  const status = feedbackStatus?.status || (isPremium ? "insufficient_data" : "not_premium");
  const thisWeekCount = feedbackStatus?.thisWeekCount ?? 0;
  const lastWeekCount = feedbackStatus?.lastWeekCount ?? 0;
  const daysUntilNextCheck = feedbackStatus?.daysUntilNextCheck ?? 0;
  const adjustment = feedbackStatus?.calorieAdjustment ?? 0;
  const trend = feedbackStatus?.trend;
  const message = feedbackStatus?.message;

  // Trạng thái hiển thị badge
  const badgeConfig = {
    not_premium: {
      label: "Tính năng Premium",
      className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    },
    goal_not_applicable: {
      label: "Không áp dụng",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    },
    insufficient_data: {
      label: "Cần tích lũy dữ liệu",
      className: "bg-slate-100 text-slate-700 border-slate-200",
    },
    in_cooldown: {
      label: `Chu kỳ ổn định (còn ${daysUntilNextCheck} ngày)`,
      className: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    },
    adjusted: {
      label: `Đã nắn ${adjustment > 0 ? "+" : ""}${adjustment} kcal`,
      className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    },
    on_track: {
      label: "Cân nặng đúng tiến độ ✓",
      className: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
    },
  }[status] || {
    label: "Đang theo dõi",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={`rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-6 shadow-xs space-y-4 ${className}`}
    >
      {/* HEADER CARD */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#DCEEE7] flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 text-[#059669]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] tracking-tight">
              Vòng Lặp Phản Hồi Calo
            </h3>
            <p className="text-[11px] text-[#0F172A]/50 font-medium">
              Tự động tối ưu calo theo xu hướng 14 ngày
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeConfig.className}`}
        >
          {badgeConfig.label}
        </span>
      </div>

      {/* GIỚI THIỆU CƠ CHẾ NỀN TẢNG */}
      <p className="text-xs text-[#0F172A]/70 leading-relaxed">
        Hệ thống tự động so sánh cân nặng trung bình 7 ngày gần nhất với 7 ngày liền trước. Nếu chững cân hoặc sai hướng mục tiêu, mức calo hàng ngày sẽ được tự động bù trừ <strong className="text-[#059669]">±125 kcal</strong> (tối đa 1 lần / 7 ngày).
      </p>

      {/* THANH ĐO TIẾN ĐỘ THU THẬP DỮ LIỆU */}
      {isPremium && status !== "goal_not_applicable" && (
        <div className="p-3.5 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0F172A]">Dữ liệu cân nặng 14 ngày</span>
            <span className="font-extrabold text-[#059669]">
              Tuần này: {thisWeekCount}/7 · Tuần trước: {lastWeekCount}/7
            </span>
          </div>

          {/* Thanh tiến độ 2 tuần */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-[10px] text-[#0F172A]/60 font-semibold mb-1">
                <span>Tuần trước</span>
                <span>{lastWeekCount > 0 ? `${lastWeekCount} ngày` : "Thiếu"}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#059669] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (lastWeekCount / 7) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#0F172A]/60 font-semibold mb-1">
                <span>Tuần này</span>
                <span>{thisWeekCount > 0 ? `${thisWeekCount} ngày` : "Thiếu"}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#059669] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (thisWeekCount / 7) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HỘP TRẠNG THÁI CHI TIẾT */}
      {message && (
        <div
          className={`p-3 rounded-2xl text-xs font-medium flex items-start gap-2.5 ${
            status === "adjusted"
              ? "bg-amber-500/10 text-amber-900 border border-amber-500/30"
              : status === "on_track"
              ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
              : status === "in_cooldown"
              ? "bg-blue-500/10 text-blue-900 border border-blue-500/20"
              : "bg-slate-50 text-slate-700 border border-slate-200"
          }`}
        >
          {status === "adjusted" ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : status === "on_track" ? (
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
          ) : status === "in_cooldown" ? (
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{message}</span>
        </div>
      )}

      {/* CALL TO ACTION KHI CHƯA PHẢI PREMIUM */}
      {!isPremium && (
        <button
          type="button"
          onClick={onUpgrade}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mở khoá Vòng Lặp Phản Hồi với Premium</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

