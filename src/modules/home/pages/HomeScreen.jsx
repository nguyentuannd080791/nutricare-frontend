import React, { useState } from "react";
import { Sparkles, ClipboardList, Plus } from "lucide-react";
import { Button, EmptyState } from "../../../shared/components/ui";
import { classifyBMI } from "../../../shared/domain/bmi";
import { dateKey, cycleIndexForDate } from "../../../shared/domain/planCycle";
import { calcDayProgress } from "../domain/dayProgress";
import { buildCalorieBalance } from "../domain/calorieFigures";
import { useHomeActivity } from "../hooks/useHomeActivity";
import HomeHeader from "../components/HomeHeader";
import CalorieHeroCard from "../components/CalorieHeroCard";
import BmiCard from "../components/BmiCard";
import WorkoutBurnAndWaterCard from "../components/WorkoutBurnAndWaterCard";
import MealChecklist from "../components/MealChecklist";
import WorkoutChecklist from "../components/WorkoutChecklist";

const SECTION_CARD = "rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm";

/**
 * Điều phối các phần của Trang chủ Dashboard (SOLID: Single Responsibility & Dependency Inversion).
 * Tính toán số liệu miền nghiệp vụ ở tầng domain; mỗi sub-component chỉ chuyên trách hiển thị.
 * Đồng bộ toàn diện UI từ HealthDashboardPage của test-ui.
 */
export default function HomeScreen({ user, userData, mealSyncVersion, onQuickAction, onToggleMeal }) {
  const [mobileSectionTab, setMobileSectionTab] = useState("all");

  const latestBMI = userData.bmiRecords[0];
  const activeTarget = userData.targets.find((t) => t.isActive);
  const activePlan = userData.mealPlans.find((p) => p.isActive);
  const bmiInfo = latestBMI ? classifyBMI(latestBMI.bmi) : null;

  const todayKey = dateKey();
  const todayPlanDay = activePlan?.days[cycleIndexForDate(activePlan)];
  const rawProgress = userData.progress[todayKey];
  const todayProgress = activePlan && rawProgress?.planId === activePlan.id ? rawProgress : {};
  const dayProgress = calcDayProgress(todayPlanDay, todayProgress);

  const { summary, workoutPlan, water, streak, restDay, error, toggleWorkout, setWaterCups } = useHomeActivity(
    todayKey,
    mealSyncVersion,
    userData
  );

  const calorieBalance = buildCalorieBalance({
    summary,
    dayProgress,
    activeTarget,
    workoutPlan,
  });

  const macros = dayProgress
    ? {
        protein: dayProgress.consumedMacros.protein_g,
        carbs: dayProgress.consumedMacros.carb_g,
        fat: dayProgress.consumedMacros.fat_g,
      }
    : { protein: 0, carbs: 0, fat: 0 };

  const plannedMacros = dayProgress
    ? {
        protein: dayProgress.plannedMacros.protein_g,
        carbs: dayProgress.plannedMacros.carb_g,
        fat: dayProgress.plannedMacros.fat_g,
      }
    : activeTarget
    ? {
        protein: activeTarget.protein || 0,
        carbs: activeTarget.carbs || 0,
        fat: activeTarget.fat || 0,
      }
    : { protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10 bg-bg">
      <HomeHeader
        fullName={user.fullName}
        streak={streak}
        restDay={restDay}
        onAvatarPress={() => onQuickAction("profile")}
      />

      {error ? <p className="mb-4 text-sm font-medium text-destructive">{error}</p> : null}

      <div className="space-y-6">
        {/* HÀNG 1: BENTO GRID 12 CỘT (Calo 5 cột + BMI 3 cột + Vận động & Nước 4 cột) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <CalorieHeroCard
            className="lg:col-span-5"
            calorieBalance={calorieBalance}
            macros={macros}
            plannedMacros={plannedMacros}
            restDay={restDay}
            onTargetPress={() => onQuickAction("target-detail")}
          />

          <BmiCard
            className="lg:col-span-3"
            latestBMI={latestBMI}
            bmiInfo={bmiInfo}
            onPress={() => onQuickAction("bmi")}
          />

          <WorkoutBurnAndWaterCard
            className="lg:col-span-4"
            workoutPlan={workoutPlan}
            water={water}
            onChangeWater={setWaterCups}
            onOpenExercise={() => onQuickAction("exercise")}
          />
        </div>

        {/* THANH CHUYỂN ĐỔI NHANH CHO ĐIỆN THOẠI */}
        <div className="lg:hidden grid grid-cols-3 p-1 rounded-xl bg-white border border-[#DCEEE7] shadow-xs">
          {[
            { id: "all", label: "Tất cả" },
            { id: "meals", label: "Thực đơn" },
            { id: "workouts", label: "Bài tập" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileSectionTab(tab.id)}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mobileSectionTab === tab.id
                  ? "bg-[#059669] text-white shadow-xs"
                  : "text-[#0F172A]/60 hover:text-[#0F172A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* HÀNG 2: THỰC ĐƠN HÔM NAY (7 CỘT) & BÀI TẬP + TRUY CẬP NHANH (5 CỘT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className={`lg:col-span-7 ${mobileSectionTab === "workouts" ? "hidden lg:block" : "block"}`}>
            {activePlan && todayPlanDay && (
              <MealChecklist
                planDay={todayPlanDay}
                progress={todayProgress}
                dayProgress={dayProgress}
                restDay={restDay}
                onToggleMeal={(mealSlot) => onToggleMeal(todayKey, mealSlot, activePlan.id)}
              />
            )}

            {!activePlan && (
              <section className={SECTION_CARD}>
                {!activeTarget ? (
                  <EmptyState
                    icon={Sparkles}
                    title="Chưa có mục tiêu dinh dưỡng"
                    desc="Tạo mục tiêu dinh dưỡng để chúng tôi tính lượng calo & dưỡng chất phù hợp mỗi ngày cho bạn."
                    action={
                      <Button full icon={Plus} onPress={() => onQuickAction("target-create")}>
                        Tạo mục tiêu ngay
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    icon={ClipboardList}
                    title="Chưa có thực đơn"
                    desc="Bạn đã có mục tiêu dinh dưỡng — hãy để hệ thống xây dựng thực đơn theo ngày phù hợp."
                    action={
                      <Button full icon={Sparkles} onPress={() => onQuickAction("plan-create")}>
                        Tạo thực đơn
                      </Button>
                    }
                  />
                )}
              </section>
            )}
          </div>

          <div
            className={`lg:col-span-5 space-y-6 ${
              mobileSectionTab === "meals" ? "hidden lg:block" : "block"
            }`}
          >
            <WorkoutChecklist
              workoutPlan={workoutPlan}
              onToggleWorkout={toggleWorkout}
              onExploreWorkouts={() => onQuickAction("exercise")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
