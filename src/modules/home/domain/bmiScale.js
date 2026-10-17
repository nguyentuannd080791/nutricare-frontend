const SCALE_MIN = 15;
const SCALE_MAX = 30;
const UNDERWEIGHT_LIMIT = 18.5;
const NORMAL_LIMIT = 23;

export function bmiScalePercent(bmi) {
  const clamped = Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX);
  return Math.round(((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100);
}

export function bmiScaleSegments() {
  const underweightEnd = bmiScalePercent(UNDERWEIGHT_LIMIT);
  const normalEnd = bmiScalePercent(NORMAL_LIMIT);
  return [
    { id: "under", width: underweightEnd, color: "#2563EB" },
    { id: "normal", width: normalEnd - underweightEnd, color: "#059669" },
    { id: "over", width: 100 - normalEnd, color: "#EA580C" },
  ];
}
