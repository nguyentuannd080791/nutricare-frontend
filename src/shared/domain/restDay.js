const DAY_MS = 86400000;

// Phải khớp với REST_WEEKDAYS ở backend (domain/restDay.js). Backend là nơi quyết định.
const REST_WEEKDAYS = [0];

export function isRestDay(dateKey) {
  const weekday = new Date(`${dateKey}T00:00:00.000Z`).getUTCDay();
  return REST_WEEKDAYS.includes(weekday);
}

export function countRestDays(fromKey, toKey) {
  let count = 0;
  let cursor = new Date(`${fromKey}T00:00:00.000Z`);
  const end = new Date(`${toKey}T00:00:00.000Z`);
  while (cursor <= end) {
    if (isRestDay(cursor.toISOString().slice(0, 10))) count += 1;
    cursor = new Date(cursor.getTime() + DAY_MS);
  }
  return count;
}
