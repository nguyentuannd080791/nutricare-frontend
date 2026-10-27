import React, { useState, useMemo } from "react";
import { CalendarDays, History, RefreshCw } from "lucide-react";
import {
  buildPlanViewModel,
  buildWeeks,
  normalizeSlotId,
} from "../domain/menuPlanModel";
import PlanDayNavigator from "../components/PlanDayNavigator";
import PlanOverviewCard from "../components/PlanOverviewCard";
import MealItemCard from "../components/MealItemCard";
import SwapMealModal from "../components/SwapMealModal";
import RebuildPlanModal from "../components/RebuildPlanModal";
import { ScreenHeader } from "../../../shared/components/ui";

/**
 * Màn hình Kế hoạch Thực đơn (SOLID: SRP, OCP, Clean Architecture)
 * Bố cục 12 cột chuẩn hóa từ test-ui:
 * - Cột trái (4 cột): Tổng quan Dinh dưỡng, Macro progress bars, Hiệu suất chu kỳ
 * - Cột phải (8 cột): Thanh điều hướng ngày 2 cấp (Tuần + Ngày) & Lưới 4 bữa ăn
 */
export default function PlanViewScreen({
  plan,
  user,
  userData,
  activeTarget,
  _onBack,
  onRebuild,
  onViewHistory,
  onSwap,
  onToggleMeal,
  mealSyncVersion,
  onCreatePlan,
}) {
  // Ước tính calo mục tiêu (ưu tiên activeTarget > plan > user.weightKg)
  const targetCalories =
    activeTarget?.calories ||
    plan?.caloriesAtCreation ||
    (user?.weightKg ? Math.round(user.weightKg * 27) : 1850);

  // State cục bộ lưu trạng thái tick đã ăn để phản hồi 0ms
  const [optimisticEaten, setOptimisticEaten] = useState({});

  // Xây dựng ViewModel chuẩn hóa từ plan backend hoặc mock catalog
  const planViewModel = useMemo(() => {
    return buildPlanViewModel(plan, targetCalories, userData?.progress);
    // mealSyncVersion kích hoạt tính lại khi progress từ server hoặc local thay đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, targetCalories, userData?.progress, mealSyncVersion]);

  // Tìm ngày hôm nay trong chu kỳ để khởi tạo selectedDayIndex
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const todayIdx = planViewModel.days.findIndex((d) => d.isToday);
    return todayIdx >= 0 ? todayIdx : 0;
  });

  // State Modal Đổi món
  const [swapModalState, setSwapModalState] = useState({
    isOpen: false,
    meal: null,
  });

  // State Modal Tái tạo thực đơn
  const [isRebuildOpen, setIsRebuildOpen] = useState(false);

  // Ngày hiện đang xem
  const activeDay =
    planViewModel.days[selectedDayIndex] || planViewModel.days[0];

  // Danh sách bữa ăn của activeDay sau khi áp dụng optimistic update
  const activeDayMeals = useMemo(() => {
    return activeDay.meals.map((m) => {
      const slotKey = normalizeSlotId(m.slotId || m.mealSlot);
      const key = `${activeDay.dateKey}|${slotKey}`;
      const isOptimistic = optimisticEaten[key];
      const completed = isOptimistic !== undefined ? isOptimistic : m.completed;
      return {
        ...m,
        completed,
      };
    });
  }, [activeDay, optimisticEaten]);

  // Tính tổng calo và dinh dưỡng của ngày đang chọn
  const dayTotals = useMemo(() => {
    return activeDayMeals.reduce(
      (acc, m) => {
        acc.calories += m.dish.calories;
        acc.protein += m.dish.protein;
        acc.carbs += m.dish.carbs;
        acc.fat += m.dish.fat;
        if (m.completed) {
          acc.consumedCalories += m.dish.calories;
          acc.completedMealsCount += 1;
        }
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        consumedCalories: 0,
        completedMealsCount: 0,
      }
    );
  }, [activeDayMeals]);

  // Tính tỷ lệ tuân thủ toàn chu kỳ
  const overallCompliance = useMemo(() => {
    let totalMeals = 0;
    let completedMeals = 0;
    planViewModel.days.forEach((d) => {
      d.meals.forEach((m) => {
        totalMeals++;
        const slotKey = normalizeSlotId(m.slotId || m.mealSlot);
        const key = `${d.dateKey}|${slotKey}`;
        const isOpt = optimisticEaten[key];
        const isDone = isOpt !== undefined ? isOpt : m.completed;
        if (isDone) completedMeals++;
      });
    });
    return {
      completedMeals,
      totalMeals,
      percent:
        totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0,
    };
  }, [planViewModel.days, optimisticEaten]);

  // Tính toán chỉ số mục tiêu Dinh dưỡng (Macros) cho ngày
  const targetProtein = Math.round((planViewModel.targetCalories * 0.25) / 4);
  const targetCarbs = Math.round((planViewModel.targetCalories * 0.5) / 4);
  const targetFat = Math.round((planViewModel.targetCalories * 0.25) / 9);

  // Phân nhóm danh sách ngày theo tuần 7 ngày
  const weeks = useMemo(() => {
    return buildWeeks(planViewModel.days);
  }, [planViewModel.days]);

  // Tuần hiện đang xem
  const currentWeekIndex = Math.min(
    weeks.length - 1,
    Math.floor(selectedDayIndex / 7)
  );

  // Điều hướng chuyển tuần (Cấp 1)
  const handleWeekChange = (targetWeekIndex) => {
    if (targetWeekIndex < 0 || targetWeekIndex >= weeks.length) return;
    const targetWeek = weeks[targetWeekIndex];
    if (!targetWeek || targetWeek.days.length === 0) return;

    // Nếu tuần đích có "Hôm nay", ưu tiên chọn Hôm nay
    const todayInWeek = targetWeek.days.find((d) => d.isToday);
    if (todayInWeek) {
      setSelectedDayIndex(todayInWeek.dayIndex);
      return;
    }

    // Giữ nguyên thứ trong tuần hoặc ngày đầu tiên của tuần
    const currentDayOffset = selectedDayIndex % 7;
    const matchedDay =
      targetWeek.days[currentDayOffset] || targetWeek.days[0];
    setSelectedDayIndex(matchedDay.dayIndex);
  };

  // Hành động: Tích hoàn thành bữa ăn (chỉ ở ngày hôm nay)
  const handleToggleComplete = (rawSlot) => {
    if (!activeDay.isToday) return;
    const slotKey = normalizeSlotId(rawSlot);
    const key = `${activeDay.dateKey}|${slotKey}`;

    const currentCompleted = activeDayMeals.find(
      (m) => normalizeSlotId(m.slotId || m.mealSlot) === slotKey
    )?.completed;
    const nextCompleted = !currentCompleted;

    // Phản hồi UI tức thì 0ms
    setOptimisticEaten((prev) => ({
      ...prev,
      [key]: nextCompleted,
    }));

    // Gửi đồng bộ lên App / Server
    if (onToggleMeal) {
      onToggleMeal(activeDay.dateKey, slotKey, planViewModel.id);
    }
  };

  // Hành động: Xác nhận đổi món trong ngày
  const handleConfirmSwap = async (chosenDish) => {
    if (!swapModalState.meal || activeDay.isPast) return;
    const meal = swapModalState.meal;
    const slotId = normalizeSlotId(meal.slotId || meal.mealSlot);

    if (onSwap) {
      await onSwap({
        planId: planViewModel.id,
        dayIndex: activeDay.cycleDayIndex || activeDay.dayIndex + 1,
        mealSlot: slotId,
        chooseDishId: chosenDish.id || chosenDish.dishId,
      });
    }

    setSwapModalState({ isOpen: false, meal: null });
  };

  // Hành động: Áp dụng tái tạo thực đơn
  const handleApplyRebuild = async ({
    cycleDays,
    durationMonths: _durationMonths,
    targetCalories: _targetKcal,
  }) => {
    setIsRebuildOpen(false);
    if (onCreatePlan) {
      await onCreatePlan(cycleDays);
    } else if (onRebuild) {
      onRebuild();
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      {/* 1. TOP BAR CHUẨN HOÁ: ScreenHeader */}
      <ScreenHeader
        icon={CalendarDays}
        title="Thực Đơn Dinh Dưỡng Cá Nhân Hóa"
        badgeText={`Chu kỳ ${planViewModel.cycleDays} ngày • ${planViewModel.durationMonths} tháng`}
        subtitle="Kế hoạch phân bổ calo & vi chất theo từng ngày trong chu kỳ"
        right={
          <div className="flex items-center gap-2">
            {onViewHistory && (
              <button
                type="button"
                onClick={onViewHistory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DCEEE7] hover:border-[#059669]/40 text-[#0F172A]/70 hover:text-[#059669] font-bold text-xs shadow-2xs transition-all cursor-pointer"
                title="Xem lịch sử các thực đơn trước"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Lịch sử</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsRebuildOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#059669] text-white hover:bg-[#047857] font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Xây dựng lại thực đơn</span>
              <span className="sm:hidden">Tạo lại</span>
            </button>
          </div>
        }
      />

      {/* 2. MAIN CONTENT: Bố cục Responsive 12 cột */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (lg:col-span-4): Tổng quan Mục tiêu & Chu kỳ */}
        <div className="lg:col-span-4">
          <PlanOverviewCard
            activeDay={activeDay}
            dayTotals={dayTotals}
            targetCalories={planViewModel.targetCalories}
            targetProtein={targetProtein}
            targetCarbs={targetCarbs}
            targetFat={targetFat}
            overallCompliance={overallCompliance}
            durationMonths={planViewModel.durationMonths}
          />
        </div>

        {/* CỘT PHẢI (lg:col-span-8): Điều hướng ngày cố định & Lưới 4 bữa ăn */}
        <div className="lg:col-span-8 space-y-4">
          {/* Thanh chọn ngày 2 cấp */}
          <PlanDayNavigator
            activeDay={activeDay}
            weeks={weeks}
            currentWeekIndex={currentWeekIndex}
            selectedDayIndex={selectedDayIndex}
            onSelectDayIndex={setSelectedDayIndex}
            onWeekChange={handleWeekChange}
            cycleDays={planViewModel.cycleDays}
          />

          {/* Lưới 4 bữa ăn của ngày đang chọn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeDayMeals.map((meal) => (
              <MealItemCard
                key={meal.slotId || meal.mealSlot}
                meal={meal}
                canToggle={activeDay.isToday}
                isPast={activeDay.isPast}
                isFuture={activeDay.isFuture}
                onToggleComplete={handleToggleComplete}
                onOpenSwap={(m) => setSwapModalState({ isOpen: true, meal: m })}
              />
            ))}
          </div>
        </div>
      </div>
      </main>

      {/* 3. MODALS */}
      {/* Modal đổi món: Giới hạn đúng 3 lựa chọn cùng hệ, khóa khi đã ăn */}
      <SwapMealModal
        isOpen={swapModalState.isOpen}
        onClose={() => setSwapModalState({ isOpen: false, meal: null })}
        currentMeal={swapModalState.meal}
        onConfirmSwap={handleConfirmSwap}
      />

      {/* Modal Xây dựng lại thực đơn */}
      <RebuildPlanModal
        isOpen={isRebuildOpen}
        onClose={() => setIsRebuildOpen(false)}
        initialCycleDays={planViewModel.cycleDays}
        initialMonths={planViewModel.durationMonths}
        initialCalories={planViewModel.targetCalories}
        onApplyRebuild={handleApplyRebuild}
      />
    </div>
  );
}
