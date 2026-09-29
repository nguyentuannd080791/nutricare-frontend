import React from "react";
import { Edit2 } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Card, Button, ScreenHeader } from "../../components/ui";
import { GOALS, ACTIVITY_LEVELS } from "../../domain/constants";
import TargetHistoryList from "./components/TargetHistoryList";

export default function TargetDetailScreen({ data, onBack, onEdit }) {
  const history = data.targets; // server đã sắp xếp mới nhất trước
  const active = history.find((t) => t.isActive);
  if (!active) return null;

  const goal = GOALS.find((g) => g.id === active.goalId);
  const activity = ACTIVITY_LEVELS.find((a) => a.id === active.activityId);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Mục tiêu dinh dưỡng" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-5" style={{ paddingBottom: 40 }}>
        <Card className="p-5" style={{ backgroundColor: COLORS.primary }}>
          <span className="block text-[12.5px]" style={{ color: "rgba(255,255,255,0.8)" }}>Mục tiêu hiện tại</span>
          <span className="block text-[26px] font-extrabold text-white mt-1">{active.calories} kcal/ngày</span>
          <div className="flex flex-row gap-2 mt-[10px]">
            <span className="rounded-full px-[10px] py-[5px] text-[12px] font-semibold text-white" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>{goal?.label}</span>
            <span className="rounded-full px-[10px] py-[5px] text-[12px] font-semibold text-white" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>{activity?.label}</span>
            {active.targetWeightKg != null && (
              <span className="rounded-full px-[10px] py-[5px] text-[12px] font-semibold text-white" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>Đích {active.targetWeightKg}kg · {active.durationMonths} tháng</span>
            )}
          </div>
          <div className="flex flex-row gap-2 mt-4">
            {[["Đạm", `${active.protein}g`], ["Tinh bột", `${active.carb}g`], ["Béo", `${active.fat}g`]].map(([label, value]) => (
              <div key={label} className="flex-1">
                <span className="block text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
                <span className="block text-[15px] font-bold text-white mt-[2px]">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Button full variant="outline" icon={Edit2} onPress={onEdit}>Thay đổi mục tiêu / hoạt động</Button>

        <TargetHistoryList history={history} />
      </div>
    </div>
  );
}
