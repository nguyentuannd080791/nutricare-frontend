import React from "react";
import { Flame } from "lucide-react";

export default function StreakBadge({ streak, restDay }) {
  if (!streak) return null;
  const badgeStyle =
    streak.current > 0 ? "bg-accent/10 border-accent/30 text-accent" : "bg-muted border-border text-fg/60";

  return (
    <div
      title="Chuỗi ngày liên tiếp ăn đủ các bữa và hoàn thành đủ bài tập"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${badgeStyle}`}
    >
      <Flame className="w-4 h-4" />
      <span>Chuỗi {streak.current} ngày</span>
      {restDay ? <span className="font-semibold">· Hôm nay nghỉ</span> : null}
      {!restDay && streak.todayComplete ? <span className="font-semibold">· Hôm nay đã đạt</span> : null}
    </div>
  );
}
