// Bản port từ nutricare-expo/src/storage/scanStorage.js.
// Bản gốc có 2 việc: (1) copy ảnh chụp vào thư mục riêng của app qua
// expo-file-system, (2) lưu nhật ký quét vào AsyncStorage. Trên web không có
// filesystem riêng cho app, nên (1) không còn cần thiết — ảnh JPEG (dataURL)
// được lưu thẳng vào record. Việc này giữ đúng SRP: file này chỉ còn đúng 1
// trách nhiệm là "nhật ký quét", không còn gánh thêm việc quản lý file.
const INDEX_KEY = "nutricare:scan_records";
const MAX_SCAN_HISTORY = 20;

// Nhật ký quét lưu trên máy (chỉ lưu metadata món ăn, không lưu base64 ảnh dung lượng lớn để tránh tràn hạn mức localStorage)
export async function appendScanRecord(record) {
  let all = [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    all = raw ? JSON.parse(raw) : [];
  } catch {
    all = [];
  }

  // Tách bỏ chuỗi base64 photoUri nặng hàng megabyte để bảo vệ an toàn quota và tính riêng tư
  const { photoUri: _ignoredPhoto, ...safeRecord } = record;

  try {
    const pruned = [safeRecord, ...all].slice(0, MAX_SCAN_HISTORY);
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(pruned));
  } catch (e) {
    console.warn("[NutriCare] Không thể lưu nhật ký quét vào localStorage (hạn mức đầy):", e);
  }
}
