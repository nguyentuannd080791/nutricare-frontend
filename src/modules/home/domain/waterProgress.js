export function calcWaterProgress({ cups, goalCups, cupMl }) {
  const percent = goalCups > 0 ? Math.min(100, Math.round((cups / goalCups) * 100)) : 0;
  return {
    percent,
    liters: (cups * cupMl) / 1000,
    goalLiters: (goalCups * cupMl) / 1000,
  };
}
