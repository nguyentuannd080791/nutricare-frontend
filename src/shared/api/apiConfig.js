// Bản gốc (Expo) tự dò IP máy chạy backend qua Constants.expoConfig.hostUri
// vì Expo Go/emulator không dùng chung "localhost" với máy tính. Trên web,
// trình duyệt và backend thường chạy trên cùng máy dev nên "localhost" là đủ.
// Ghi đè bằng biến môi trường VITE_API_URL (file .env) khi backend ở máy khác.
const API_PORT = 3000;

function resolveBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return `http://${window.location.hostname}:${API_PORT}/api`;
}

export const API_BASE_URL = resolveBaseUrl();
export const REQUEST_TIMEOUT_MS = 15000;
export const AI_TIMEOUT_MS = 60000; // phân tích ảnh / gợi ý AI chậm hơn request thường
