// Bản port từ nutricare-expo/src/storage/scanStorage.js.
// Bản gốc có 2 việc: (1) copy ảnh chụp vào thư mục riêng của app qua
// expo-file-system, (2) lưu nhật ký quét vào AsyncStorage. Trên web không có
// filesystem riêng cho app, nên (1) không còn cần thiết — ảnh JPEG (dataURL)
// được lưu thẳng vào record. Việc này giữ đúng SRP: file này chỉ còn đúng 1
// trách nhiệm là "nhật ký quét", không còn gánh thêm việc quản lý file.
const INDEX_KEY = "nutricare:scan_records";

// Nhật ký quét lưu trên máy (chưa có bảng food_logs ở backend).
export async function appendScanRecord(record) {
  let all = [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    all = raw ? JSON.parse(raw) : [];
  } catch {
    all = [];
  }
  try {
    window.localStorage.setItem(INDEX_KEY, JSON.stringify([record, ...all]));
  } catch (e) {
    console.error("[NutriCare] Lưu nhật ký quét thất bại:", e);
  }
}
