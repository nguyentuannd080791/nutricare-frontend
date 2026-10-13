export const MIN_MINUTES = 1;
export const MAX_MINUTES = 300;

export function validateMinutes(text) {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return "Nhập số phút là số nguyên.";
  const minutes = Number(trimmed);
  if (minutes < MIN_MINUTES || minutes > MAX_MINUTES) {
    return `Số phút phải từ ${MIN_MINUTES} đến ${MAX_MINUTES}.`;
  }
  return null;
}

export function sumEntryKcal(entries) {
  let total = 0;
  for (const entry of entries) {
    total += entry.kcal;
  }
  return total;
}

export function exerciseLabel(catalog, exerciseId) {
  for (const exercise of catalog) {
    if (exercise.id === exerciseId) return exercise.label;
  }
  return exerciseId;
}
