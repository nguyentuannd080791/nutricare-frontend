import React from "react";
import { useIsDesktop } from "../hooks/useIsDesktop";
import Sidebar from "../navigation/Sidebar";
import BottomNav from "../navigation/BottomNav";

/**
 * Chọn layout theo thiết bị. Giữ nguyên cây DOM của `children` khi chuyển đổi
 * qua lại giữa điện thoại và máy tính để không làm mất state thanh toán, form hay dữ liệu đang nhập.
 */
export default function AppLayout({ navigation, user, hideMobileNav, fullWidth, wideContent, children }) {
  const isDesktop = useIsDesktop();

  if (isDesktop && fullWidth) {
    return <div className="h-screen w-full bg-bg flex flex-col overflow-hidden">{children}</div>;
  }

  return (
    <div className="h-screen w-full bg-[#F0F8F6] flex overflow-hidden relative">
      {/* Sidebar trên máy tính: Chỉ hiển thị khi ở chế độ Desktop và có navigation */}
      {isDesktop && navigation && (
        <Sidebar
          active={navigation.active}
          onChange={navigation.onChange}
          tabs={navigation.tabs}
          user={user}
        />
      )}

      {/* Vùng nội dung chính: Cây DOM liên tục, không bị unmount khi resize */}
      <main className="flex-1 min-w-0 h-full flex flex-col [contain:layout] overflow-hidden">
        <div className={`w-full flex-1 min-h-0 h-full flex flex-col overflow-hidden ${
          !isDesktop ? "max-w-app mx-auto bg-bg" : ""
        }`}>
          {children}
        </div>

        {/* Thanh điều hướng dưới đáy trên điện thoại: Chỉ hiển thị khi ở màn hình nhỏ */}
        {!isDesktop && navigation && !hideMobileNav && (
          <div className="w-full max-w-app mx-auto shrink-0">
            <BottomNav active={navigation.active} onChange={navigation.onChange} tabs={navigation.tabs} />
          </div>
        )}
      </main>
    </div>
  );
}
