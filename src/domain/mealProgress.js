// Gộp các bữa đã ăn từ server vào tiến độ lưu trên máy (cùng dạng
// { [dateKey]: { planId, [mealSlot]: true } } mà useLocalData đang giữ).
// Hợp nhất, không ghi đè: tick còn nằm riêng trên máy (tạo trước khi có đồng
// bộ, hoặc chưa gửi được) vẫn được giữ; tick server có mà máy chưa có
// (đánh dấu từ thiết bị khác) được thêm vào.
export function mergeServerLogs(progress, logs) {
  const next = { ...progress };
  for (const { date, planId, mealSlot } of logs) {
    // Tick thuộc thực đơn khác đã bị thay thế → bỏ, đúng quy ước khoá theo planId.
    const entry = next[date]?.planId === planId ? next[date] : { planId };
    next[date] = { ...entry, [mealSlot]: true };
  }
  return next;
}
