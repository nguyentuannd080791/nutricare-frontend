import React from "react";
import { COLORS } from "../../../theme/colors";
import { Card, Badge } from "../../../components/ui";
import { computePlanStats } from "../../../domain/planCycle";

function StatBox({ label, value, valueColor }) {
  return (
    <div className="w-[47%] rounded-xl p-3" style={{ backgroundColor: COLORS.muted }}>
      <span className="block text-[11px] text-descGray">{label}</span>
      <span className="block text-[16px] font-bold mt-[2px]" style={{ color: valueColor || COLORS.fg }}>{value}</span>
    </div>
  );
}

/** Trách nhiệm duy nhất: thẻ thống kê 1 thực đơn trong lịch sử. */
export default function PlanStatsCard({ plan: p, progress }) {
  const stats = computePlanStats(p, progress);
  const avgTemplateKcal = Math.round(p.days.reduce((s, d) => s + d.totalKcal, 0) / p.days.length);
  const adherenceColor = stats.adherencePct >= 70 ? COLORS.primary : stats.adherencePct >= 40 ? "#D97706" : COLORS.destructive;

  return (
    <Card className="p-4 mb-3">
      <div className="flex flex-row justify-between items-center mb-1">
        <span className="text-[14.5px] font-bold text-fg">Chu kỳ {p.days.length} ngày</span>
        {p.isActive ? <Badge>Đang áp dụng</Badge> : <Badge tone="dark">Đã kết thúc</Badge>}
      </div>
      <span className="block text-[11.5px] text-placeholderGray mb-3">
        Bắt đầu {new Date(p.createdAt).toLocaleDateString("vi-VN")}
        {p.endedAt ? ` · Kết thúc ${new Date(p.endedAt).toLocaleDateString("vi-VN")}` : " · Đang chạy"}
        {" · "}Đã thực hiện {stats.totalDays} ngày
      </span>

      <div className="flex flex-row flex-wrap gap-[10px] mb-3">
        <StatBox label="Bữa đã hoàn thành" value={`${stats.completedMeals}/${stats.totalMealsScheduled}`} />
        <StatBox label="Tỉ lệ tuân thủ" value={`${stats.adherencePct}%`} valueColor={adherenceColor} />
        <StatBox label="Calo TB đã ghi nhận/ngày" value={stats.avgKcalPerDay} />
        <StatBox label="Calo TB theo thực đơn" value={avgTemplateKcal} />
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
        <div className="h-full rounded-full" style={{ width: `${stats.adherencePct}%`, backgroundColor: COLORS.primary }} />
      </div>
      <span className="block text-[11px] text-placeholderGray mt-[6px]">{stats.loggedDays}/{stats.totalDays} ngày có ít nhất một bữa được đánh dấu đã ăn.</span>
    </Card>
  );
}
