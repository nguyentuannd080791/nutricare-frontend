import React from "react";
import { Sparkles, ClipboardList, Plus } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Card, Button, EmptyState } from "../../components/ui";
import { classifyBMI } from "../../domain/bmi";
import { dateKey, cycleIndexForDate } from "../../domain/planCycle";
import GreetingHeader from "./components/GreetingHeader";
import StatCards from "./components/StatCards";
import TodayPlanCard from "./components/TodayPlanCard";
import QuickActionsGrid from "./components/QuickActionsGrid";

/**
 * Điều phối các phần nhỏ (GreetingHeader/StatCards/TodayPlanCard/QuickActionsGrid).
 * Tính toán số liệu hiển thị ở đây; mỗi subcomponent chỉ lo hiển thị phần của nó (SRP).
 */
export default function HomeScreen({ user, userData, onQuickAction, onToggleMeal }) {
  const latestBMI = userData.bmiRecords[0];
  const activeTarget = userData.targets.find((t) => t.isActive);
  const activePlan = userData.mealPlans.find((p) => p.isActive);
  const bmiInfo = latestBMI ? classifyBMI(latestBMI.bmi) : null;

  const todayKey = dateKey();
  const todayPlanDay = activePlan?.days[cycleIndexForDate(activePlan)];
  const rawProgress = userData.progress[todayKey];
  const todayProgress = activePlan && rawProgress?.planId === activePlan.id ? rawProgress : {};
  const consumedKcal = todayPlanDay
    ? Math.round(todayPlanDay.meals.reduce((s, m) => (todayProgress[m.mealSlot] ? s + m.kcal : s), 0))
    : 0;
  const targetKcal = Math.round(todayPlanDay?.totalKcal || activeTarget?.calories || 0);
  const pct = targetKcal ? Math.min(100, Math.round((consumedKcal / targetKcal) * 100)) : 0;

  return (
    <div className="flex-1 overflow-y-auto px-5" style={{ backgroundColor: COLORS.bg, paddingBottom: 40, paddingTop: 20 }}>
      <GreetingHeader fullName={user.fullName} onAvatarPress={() => onQuickAction("profile")} />

      <StatCards
        latestBMI={latestBMI}
        bmiInfo={bmiInfo}
        activeTarget={activeTarget}
        onBmiPress={() => onQuickAction("bmi")}
        onTargetPress={() => onQuickAction(activeTarget ? "target-detail" : "target-create")}
      />

      {activeTarget && activePlan && todayPlanDay && (
        <TodayPlanCard
          consumedKcal={consumedKcal}
          targetKcal={targetKcal}
          pct={pct}
          todayPlanDay={todayPlanDay}
          todayProgress={todayProgress}
          onToggleMeal={(mealSlot) => onToggleMeal(todayKey, mealSlot, activePlan.id)}
        />
      )}
      {activeTarget && activePlan && (
        <button type="button" onClick={() => onQuickAction("plan")} className="w-full text-center mt-[10px] mb-5 text-[13.5px] font-semibold text-primary">
          Xem cả chu kỳ · Đổi thực đơn →
        </button>
      )}

      {!activePlan && (
        <Card className="p-5 mt-1 mb-5">
          {!activeTarget ? (
            <EmptyState
              icon={Sparkles}
              title="Chưa có mục tiêu dinh dưỡng"
              desc="Tạo mục tiêu dinh dưỡng để chúng tôi tính lượng calo & dưỡng chất phù hợp mỗi ngày cho bạn."
              action={<Button full icon={Plus} onPress={() => onQuickAction("target-create")}>Tạo mục tiêu ngay</Button>}
            />
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Chưa có thực đơn"
              desc="Bạn đã có mục tiêu dinh dưỡng — hãy để hệ thống xây dựng thực đơn theo ngày phù hợp."
              action={<Button full icon={Sparkles} onPress={() => onQuickAction("plan-create")}>Tạo thực đơn</Button>}
            />
          )}
        </Card>
      )}

      <QuickActionsGrid onQuickAction={onQuickAction} />
    </div>
  );
}
