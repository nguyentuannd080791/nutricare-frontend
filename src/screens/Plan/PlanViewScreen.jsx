import React, { useState } from "react";
import { History, RefreshCw } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Button, ScreenHeader } from "../../components/ui";
import { cycleIndexForDate } from "../../domain/planCycle";
import DayNavigator from "./components/DayNavigator";
import MealCard from "./components/MealCard";
import SwapMealSheet from "./components/SwapMealSheet";

export default function PlanViewScreen({ plan, onBack, onRebuild, onViewHistory, onSwap }) {
  const todayCycleIdx = cycleIndexForDate(plan);
  const [dayIdx, setDayIdx] = useState(todayCycleIdx);
  const [swapSlot, setSwapSlot] = useState(null);

  const day = plan.days[dayIdx];
  const isToday = dayIdx === todayCycleIdx;
  const dayTotalProtein = day.meals.reduce((s, m) => s + m.macros.protein_g, 0);
  const swapMeal = day.meals.find((m) => m.mealSlot === swapSlot);

  function goDay(delta) {
    setDayIdx((i) => Math.max(0, Math.min(plan.days.length - 1, i + delta)));
  }

  async function handlePickSwap(chooseDishId) {
    setSwapSlot(null);
    await onSwap({ planId: plan.id, dayIndex: day.dayIndex, mealSlot: swapSlot, chooseDishId });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader
        title="Thực đơn của bạn"
        onBack={onBack}
        right={
          <button type="button" onClick={onViewHistory} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.muted }}>
            <History size={18} color={COLORS.fg} />
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
        <DayNavigator
          day={day}
          totalDays={plan.days.length}
          isToday={isToday}
          dayTotalProtein={dayTotalProtein}
          onPrev={() => goDay(-1)}
          onNext={() => goDay(1)}
          canPrev={dayIdx > 0}
          canNext={dayIdx < plan.days.length - 1}
        />

        <div className="flex flex-col gap-3 mt-4">
          {day.meals.map((m) => (
            <MealCard key={m.mealSlot} meal={m} onSwapPress={() => setSwapSlot(m.mealSlot)} />
          ))}
        </div>

        <Button full variant="outline" icon={RefreshCw} onPress={onRebuild} className="mt-4">Xây dựng lại thực đơn</Button>
      </div>

      <SwapMealSheet meal={swapMeal} onClose={() => setSwapSlot(null)} onPick={handlePickSwap} />
    </div>
  );
}
