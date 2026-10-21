import { dateKey, cycleIndexForDate } from "../../../shared/domain/planCycle";
import { GOALS, MEAL_TYPES } from "../../../shared/domain/constants";

const DAY_MS = 86400000;

function parseDate(val) {
  if (!val) return new Date();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatDateVN(date) {
  const d = parseDate(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

function formatDateFullVN(date) {
  const d = parseDate(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const DAY_NAMES = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

/**
 * Xây dựng toàn bộ mô hình dữ liệu lịch sử chế độ ăn (SOLID: Single Responsibility).
 * Tách biệt hoàn toàn tính toán miền nghiệp vụ ra khỏi React UI.
 *
 * Phân cấp nghiệp vụ:
 * 1. Chu kỳ lớn: Các chu kỳ mục tiêu 3 / 6 / 9 / 12 tháng từ `userData.targets`.
 * 2. Chu kỳ con: Các tuần (Week Cycles) trong chu kỳ đó.
 * 3. Chi tiết ngày: 7 ngày trong tuần với trạng thái từng bữa ăn (Sáng, Trưa, Tối, Phụ) và calo.
 * 4. 3 KPI cốt lõi: Tỉ lệ tuân thủ %, Calo TB/ngày, Số bữa đã hoàn thành.
 */
export function buildDietHistoryModel(userData) {
  const targets = (userData?.targets || []).slice();
  const mealPlans = userData?.mealPlans || [];
  const progress = userData?.progress || {};

  // Nếu người dùng chưa có target nào, tạo một chu kỳ mặc định an toàn
  if (targets.length === 0) {
    targets.push({
      id: "default-target",
      goalId: "giu_dang",
      durationMonths: 3,
      calories: 1800,
      protein: 135,
      carbs: 200,
      fat: 50,
      effectiveFrom: new Date(),
      effectiveTo: null,
      isActive: true,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKeyStr = dateKey(today);

  // Xây dựng danh sách các Chu kỳ Mục tiêu (3 / 6 / 9 / 12 tháng)
  const monthCycles = targets.map((target, targetIndex) => {
    const goalInfo = GOALS.find((g) => g.id === target.goalId) || { label: "Dinh dưỡng chuẩn", desc: "" };
    const durationMonths = target.durationMonths || 3;
    const startDate = parseDate(target.effectiveFrom || target.createdAt);
    startDate.setHours(0, 0, 0, 0);

    let endDate = target.effectiveTo ? parseDate(target.effectiveTo) : null;
    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationMonths);
    }
    endDate.setHours(0, 0, 0, 0);

    // Tìm thực đơn đang gán hoặc thực đơn phù hợp nhất cho chu kỳ này
    const matchingPlan =
      mealPlans.find((p) => p.isActive) ||
      mealPlans[0] ||
      null;

    // Tính toán số tuần trong chu kỳ
    const totalCycleDays = Math.max(7, Math.round((endDate - startDate) / DAY_MS));
    const totalWeeksCount = Math.max(1, Math.ceil(totalCycleDays / 7));

    // Giới hạn tuần hiển thị: từ tuần 1 đến tuần hiện tại (hoặc tối đa tổng số tuần của chu kỳ)
    const daysSinceStart = Math.max(0, Math.round((today - startDate) / DAY_MS));
    const currentWeekIdx = Math.min(totalWeeksCount - 1, Math.floor(daysSinceStart / 7));

    // Tạo danh sách các tuần
    const weeks = [];
    for (let w = 0; w < totalWeeksCount; w++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + w * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // 7 ngày trong tuần
      const days = [];
      let weekCompletedMeals = 0;
      let weekTotalScheduledMeals = 0;
      let weekConsumedKcalSum = 0;
      let weekLoggedDaysCount = 0;

      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + d);
        dayDate.setHours(0, 0, 0, 0);

        const currentKey = dateKey(dayDate);
        const isFuture = dayDate > today;
        const isToday = currentKey === todayKeyStr;

        // Bữa ăn theo thực đơn (plan template)
        const cycleIdx = matchingPlan ? cycleIndexForDate(matchingPlan, dayDate) : 0;
        const planDay = matchingPlan?.days?.[cycleIdx];

        const dayProgress = progress[currentKey] || {};

        let dayConsumedKcal = 0;
        let dayPlannedKcal = Math.round(planDay?.totalKcal || target.calories || 0);
        let dayMealsDone = 0;

        const meals = MEAL_TYPES.map((mt) => {
          const planMeal = planDay?.meals?.find((m) => m.mealSlot === mt.id);
          const isEaten = Boolean(dayProgress[mt.id]);
          const kcal = Math.round(planMeal?.kcal || (target.calories || 1800) / 3);

          if (isEaten) {
            dayConsumedKcal += kcal;
            dayMealsDone += 1;
          }

          return {
            slotId: mt.id,
            slotLabel: mt.label,
            name: planMeal?.name || `Bữa ${mt.label}`,
            kcal,
            macros: planMeal?.macros || { protein_g: 0, carb_g: 0, fat_g: 0 },
            eaten: isEaten,
          };
        });

        const scheduledMealsCount = planDay?.meals?.length || 3;
        if (!isFuture) {
          weekCompletedMeals += dayMealsDone;
          weekTotalScheduledMeals += scheduledMealsCount;
          weekConsumedKcalSum += dayConsumedKcal;
          if (dayMealsDone > 0) weekLoggedDaysCount += 1;
        }

        // Đánh giá tình trạng ngày
        let status = "upcoming";
        let statusText = "Chưa đến";
        if (!isFuture) {
          if (dayMealsDone === 0) {
            status = "missed";
            statusText = "Chưa ghi nhận";
          } else if (dayMealsDone >= scheduledMealsCount) {
            status = "perfect";
            statusText = "Đạt chuẩn bữa";
          } else {
            status = "partial";
            statusText = `Đã ăn ${dayMealsDone}/${scheduledMealsCount} bữa`;
          }
        }

        days.push({
          date: dayDate,
          dateKey: currentKey,
          dayName: DAY_NAMES[dayDate.getDay()],
          dateFormatted: formatDateVN(dayDate),
          fullDateText: formatDateFullVN(dayDate),
          isToday,
          isFuture,
          targetKcal: Math.round(dayPlannedKcal),
          consumedKcal: Math.round(dayConsumedKcal),
          meals,
          completedCount: dayMealsDone,
          totalCount: scheduledMealsCount,
          status,
          statusText,
        });
      }

      const weekAdherence =
        weekTotalScheduledMeals > 0
          ? Math.round((weekCompletedMeals / weekTotalScheduledMeals) * 100)
          : 0;

      weeks.push({
        weekIndex: w,
        weekNumber: w + 1,
        label: `Tuần ${w + 1}`,
        dateRangeText: `${formatDateVN(weekStart)} - ${formatDateVN(weekEnd)}`,
        isCurrent: w === currentWeekIdx,
        isPast: weekEnd < today,
        days,
        completedMeals: weekCompletedMeals,
        totalScheduledMeals: weekTotalScheduledMeals,
        adherencePct: weekAdherence,
        consumedKcal: weekConsumedKcalSum,
      });
    }

    // TÍNH TOÁN 3 KPI CỐT LÕI CHO TOÀN BỘ CHU KỲ NÀY
    let totalCompletedMeals = 0;
    let totalScheduledMeals = 0;
    let totalKcalConsumed = 0;
    let passedDaysCount = 0;

    // Chỉ tính các ngày từ startDate đến today
    weeks.forEach((wk) => {
      wk.days.forEach((day) => {
        if (!day.isFuture) {
          passedDaysCount += 1;
          totalCompletedMeals += day.completedCount;
          totalScheduledMeals += day.totalCount;
          totalKcalConsumed += day.consumedKcal;
        }
      });
    });

    const safePassedDays = Math.max(1, passedDaysCount);
    const overallAdherence =
      totalScheduledMeals > 0
        ? Math.round((totalCompletedMeals / totalScheduledMeals) * 100)
        : 0;
    const avgKcalPerDay = Math.round(totalKcalConsumed / safePassedDays);

    return {
      id: target.id || `cycle-${targetIndex}`,
      title: `Chu kỳ ${durationMonths} tháng: ${goalInfo.label}`,
      goalLabel: goalInfo.label,
      durationMonths,
      startDate,
      endDate,
      startDateText: formatDateFullVN(startDate),
      endDateText: formatDateFullVN(endDate),
      isActive: Boolean(target.isActive),
      targetCalories: Math.round(target.calories || 1800),
      macrosTarget: {
        protein: Math.round(target.protein || 0),
        carbs: Math.round(target.carbs || 0),
        fat: Math.round(target.fat || 0),
      },
      currentWeekIndex: currentWeekIdx,
      weeks,
      // 3 KPI CỐT LÕI
      kpis: {
        adherenceRate: overallAdherence,
        avgKcal: avgKcalPerDay,
        completedMeals: totalCompletedMeals,
        totalScheduledMeals,
        passedDays: passedDaysCount,
        totalCycleDays,
      },
    };
  });

  return {
    cycles: monthCycles,
    activeCycleId: monthCycles.find((c) => c.isActive)?.id || monthCycles[0]?.id,
  };
}
