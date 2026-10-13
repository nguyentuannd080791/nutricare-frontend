export function describeRemaining(remainingKcal) {
  if (remainingKcal >= 0) {
    return { label: "Còn được ăn", kcal: remainingKcal, over: false };
  }
  return { label: "Vượt mục tiêu", kcal: -remainingKcal, over: true };
}
