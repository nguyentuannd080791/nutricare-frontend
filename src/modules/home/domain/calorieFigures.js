import { CalorieBalance } from "./calorieBalance";

export { CalorieBalance };

export function buildCalorieFigures({ summary, dayProgress, activeTarget }) {
  if (summary) {
    return {
      targetKcal: summary.targetKcal,
      intakeKcal: summary.intakeKcal,
      burnedKcal: summary.burnedKcal,
      remainingKcal: summary.remainingKcal,
    };
  }

  const targetKcal = Math.round(activeTarget?.calories || 0);
  const intakeKcal = dayProgress ? dayProgress.consumedKcal : 0;
  return { targetKcal, intakeKcal, burnedKcal: 0, remainingKcal: targetKcal - intakeKcal };
}

export function buildCalorieBalance({ summary, dayProgress, activeTarget, workoutPlan }) {
  const fullTargetKcal = activeTarget?.calories || dayProgress?.plannedKcal || summary?.targetKcal || 0;
  const plannedBurnKcal = workoutPlan?.plannedKcal || 0;
  const consumedKcal = dayProgress ? dayProgress.consumedKcal : (summary?.intakeKcal || 0);
  const burnedKcal = workoutPlan?.burnedKcal || summary?.burnedKcal || 0;

  return new CalorieBalance({
    fullTargetKcal,
    plannedBurnKcal,
    consumedKcal,
    burnedKcal,
  });
}
