import { MEAL_TYPES } from "./constants";

const DAY_MS = 86400000;

export function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

const startOfDay = (value) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Thực đơn là 1 chu kỳ lặp ngắn (vd 7 ngày) dùng xuyên suốt thời hạn mục
// tiêu (vd 6 tháng) — hàm này map một ngày vào vị trí (0-based) trong chu kỳ đó.
export function cycleIndexForDate(plan, date = new Date()) {
  if (!plan?.days?.length) return 0;
  const diff = Math.round((startOfDay(date) - startOfDay(plan.createdAt)) / DAY_MS);
  return ((diff % plan.days.length) + plan.days.length) % plan.days.length;
}

// Mức tuân thủ thực tế: đã check-off bao nhiêu bữa trong số bữa đã lên lịch,
// và trung bình calo thực đã ăn/ngày (progress do máy lưu, khoá theo ngày).
export function computePlanStats(plan, progress) {
  const start = startOfDay(plan.createdAt);
  const end = startOfDay(plan.endedAt ?? new Date());
  const totalDays = Math.max(1, Math.round((end - start) / DAY_MS) + 1);
  let completedMeals = 0;
  let completedKcal = 0;
  const loggedDays = new Set();

  for (const [dk, entry] of Object.entries(progress || {})) {
    if (entry?.planId !== plan.id) continue;
    const day = plan.days[cycleIndexForDate(plan, dk)];
    for (const mt of MEAL_TYPES) {
      const meal = entry[mt.id] && day?.meals.find((m) => m.mealSlot === mt.id);
      if (!meal) continue;
      completedMeals += 1;
      completedKcal += meal.kcal;
      loggedDays.add(dk);
    }
  }

  const totalMealsScheduled = totalDays * MEAL_TYPES.length;
  return {
    totalDays,
    completedMeals,
    totalMealsScheduled,
    completedKcal,
    avgKcalPerDay: Math.round(completedKcal / totalDays),
    adherencePct: Math.round((completedMeals / totalMealsScheduled) * 100),
    loggedDays: loggedDays.size,
  };
}
