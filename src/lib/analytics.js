// Trách nhiệm duy nhất: giao tiếp với Google Analytics (gtag.js). Không chứa
// logic điều hướng hay nghiệp vụ — App.jsx (coordinator) gọi vào đây khi
// tab/overlay đổi hoặc khi có hành động đáng theo dõi, y hệt cách nó gọi vào
// services/api.js. Nếu sau này đổi sang Plausible/Mixpanble..., chỉ cần viết
// lại file này, không phải sửa nơi gọi.

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let initialized = false;

// SPA 1 trang: URL trình duyệt không đổi khi chuyển tab/overlay, nên GA
// không tự tính đó là 1 lượt xem trang mới. Phải tự báo "virtual pageview"
// mỗi lần điều hướng — xem trackPageView() bên dưới.
export function initAnalytics() {
  if (initialized || !MEASUREMENT_ID) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // send_page_view: false — vì lượt xem trang đầu tiên cũng đi qua
  // trackPageView() bên dưới (App.jsx gọi ngay khi mount), tránh đếm trùng 2 lần.
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
}

// Gọi mỗi khi "màn hình ảo" đổi (đổi tab ở BottomNav, mở/đóng overlay).
export function trackPageView(virtualPath, title) {
  if (!MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_title: title,
    page_path: virtualPath,
    page_location: window.location.href,
  });
}

// Gọi cho các hành động cụ thể muốn theo dõi (đăng nhập, quét món, tạo thực đơn...).
export function trackEvent(name, params = {}) {
  if (!MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
