import { useCallback, useState } from "react";

const TABS = ["home", "scan", "foods", "plan", "profile"];

/**
 * Trách nhiệm duy nhất: điều hướng trong app sau khi đăng nhập — tab đang mở,
 * overlay (màn hình con dạng "đẩy lên trên") và trạng thái đang xem kết quả
 * quét. Không biết gì về phiên đăng nhập hay dữ liệu nghiệp vụ.
 *
 * LƯU Ý: nút back vật lý Android (BackHandler, double-tap-to-exit) không có
 * tương đương trên web và đã đưa vào TODO.md — hook này chỉ còn phần state
 * điều hướng thuần, không có phần lắng nghe back cứng.
 */
export function useAppNavigation() {
  const [tab, setTab] = useState("home");
  const [overlay, setOverlay] = useState(null);
  const [scanPending, setScanPending] = useState(null);

  const goToTab = useCallback((t) => {
    setScanPending(null);
    setTab(t);
  }, []);

  const openOverlay = useCallback((id) => setOverlay(id), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);

  // Trang chủ / menu Cá nhân gọi hành động bằng id: nếu trùng tên 1 tab thì
  // chuyển tab, ngược lại mở overlay (đúng hành vi App.js gốc).
  const handleQuickAction = useCallback(
    (id) => {
      if (TABS.includes(id)) goToTab(id);
      else openOverlay(id);
    },
    [goToTab]
  );

  const reset = useCallback(() => {
    setTab("home");
    setOverlay(null);
    setScanPending(null);
  }, []);

  return { tab, overlay, scanPending, setScanPending, goToTab, openOverlay, closeOverlay, handleQuickAction, reset };
}
