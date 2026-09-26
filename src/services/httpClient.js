import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./apiConfig";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

let authToken = null;
let onUnauthorized = () => {};

export function setAuthToken(token) {
  authToken = token;
}

// Token hết hạn/không hợp lệ → App đăng xuất về màn hình đăng nhập.
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function request(method, path, { body, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  // AbortSignal.timeout chưa có trên mọi runtime React Native — dùng AbortController.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Bỏ qua trang cảnh báo interstitial của ngrok (bản free) — trang đó
        // không có header CORS nên trình duyệt chặn fetch trước khi tới được
        // backend thật. Header này vô hại với backend không qua ngrok.
        "ngrok-skip-browser-warning": "true",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(0, `Không kết nối được máy chủ (${API_BASE_URL}). Hãy kiểm tra backend đang chạy và điện thoại cùng mạng Wi-Fi với máy tính.`);
  } finally {
    clearTimeout(timer);
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    // 401 khi đang đăng nhập = phiên hết hạn; 401 khi chưa có token = sai mật khẩu (để form tự hiển thị).
    if (res.status === 401 && authToken) onUnauthorized();
    throw new ApiError(res.status, data?.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
  }
  return data;
}
