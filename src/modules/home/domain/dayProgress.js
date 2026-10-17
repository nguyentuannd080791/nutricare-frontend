function addMacros(total, macros) {
  return {
    protein_g: total.protein_g + (macros?.protein_g || 0),
    carb_g: total.carb_g + (macros?.carb_g || 0),
    fat_g: total.fat_g + (macros?.fat_g || 0),
  };
}

function roundMacros(macros) {
  return {
    protein_g: Math.round(macros.protein_g),
    carb_g: Math.round(macros.carb_g),
    fat_g: Math.round(macros.fat_g),
  };
}

export function calcDayProgress(planDay, progress) {
  if (!planDay) return null;

  let mealsKcal = 0;
  let consumedKcal = 0;
  let completed = 0;
  let plannedMacros = { protein_g: 0, carb_g: 0, fat_g: 0 };
  let consumedMacros = { protein_g: 0, carb_g: 0, fat_g: 0 };

  for (const meal of planDay.meals) {
    mealsKcal += meal.kcal;
    plannedMacros = addMacros(plannedMacros, meal.macros);
    if (progress[meal.mealSlot]) {
      consumedKcal += meal.kcal;
      consumedMacros = addMacros(consumedMacros, meal.macros);
      completed += 1;
    }
  }

  return {
    plannedKcal: Math.round(planDay.totalKcal || mealsKcal),
    consumedKcal: Math.round(consumedKcal),
    completed,
    total: planDay.meals.length,
    plannedMacros: roundMacros(plannedMacros),
    consumedMacros: roundMacros(consumedMacros),
  };
}

export function sumExerciseMinutes(entries) {
  let total = 0;
  for (const entry of entries) {
    total += entry.minutes;
  }
  return total;
}
