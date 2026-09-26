import React from "react";
import { Scale, ShieldCheck, Flame, History, Crown, Bell, ChevronRight } from "lucide-react";
import { Card, IconBadge } from "../../../components/ui";
import { classifyBMI } from "../../../domain/bmi";
import { GOALS } from "../../../domain/constants";

/** Trách nhiệm duy nhất: danh sách menu điều hướng trên màn Cá nhân. */
export default function ProfileMenuList({ user, data, onGoTo }) {
  const activeTarget = data.targets.find((t) => t.isActive);
  const latestBMI = data.bmiRecords[0];
  const planCount = data.mealPlans.length;

  const menu = [
    { id: "bmi", label: "Chỉ số BMI", icon: Scale, sub: latestBMI ? `${latestBMI.bmi.toFixed(1)} · ${classifyBMI(latestBMI.bmi).label}` : "Chưa có dữ liệu" },
    { id: "conditions", label: "Bệnh nền / Dị ứng", icon: ShieldCheck, sub: data.conditions.length > 0 ? `${data.conditions.length} mục đã lưu` : "Chưa có dữ liệu" },
    { id: activeTarget ? "target-detail" : "target-create", label: "Mục tiêu dinh dưỡng", icon: Flame, sub: activeTarget ? `${activeTarget.calories} kcal/ngày · ${GOALS.find((g) => g.id === activeTarget.goalId)?.label}` : "Chưa thiết lập" },
    { id: "plan-history", label: "Lịch sử thực đơn", icon: History, sub: planCount > 0 ? `${planCount} thực đơn đã tạo` : "Chưa có thực đơn nào" },
    { id: "premium", label: "Nâng cấp Premium", icon: Crown, sub: user.isPremium ? "Đang là hội viên" : "120.000đ/tháng · 990.000đ/năm" },
    { id: "reminders", label: "Nhắc nhở", icon: Bell },
  ];

  return (
    <div className="mt-4 flex flex-col gap-2">
      {menu.map((m) => (
        <Card key={m.id} onPress={() => onGoTo(m.id)} className="flex flex-row items-center gap-3 p-[13px]">
          <IconBadge icon={m.icon} size={40} />
          <div className="flex-1 min-w-0">
            <span className="block text-[14px] font-semibold text-fg">{m.label}</span>
            {m.sub && <span className="block text-[11.5px] text-descGray mt-[1px] truncate">{m.sub}</span>}
          </div>
          <ChevronRight size={16} color="#94A3B8" />
        </Card>
      ))}
    </div>
  );
}
