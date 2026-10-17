import React from "react";
import Sidebar from "../navigation/Sidebar";

/**
 * Layout máy tính: Sidebar bên trái + vùng nội dung rộng hơn khung điện thoại.
 * Dùng lại nguyên các màn hình hiện có; thiết kế đa cột riêng cho từng màn là bước sau.
 *
 * `[contain:layout]` biến vùng nội dung thành "khối chứa" của phần tử `fixed`
 * (ModalSheet, FixedActionBar) — chúng căn theo vùng nội dung thay vì cả cửa
 * sổ, nên không đè lên Sidebar.
 */
export default function DesktopLayout({ navigation, wide = false, children }) {
  const widthStyle = wide ? "max-w-[1280px]" : "max-w-[880px]";

  return (
    <div className="h-screen w-full bg-bg flex overflow-hidden">
      <Sidebar active={navigation.active} onChange={navigation.onChange} tabs={navigation.tabs} />
      <main className="flex-1 min-w-0 h-full flex flex-col [contain:layout] overflow-hidden">
        <div className={`w-full ${widthStyle} mx-auto flex-1 min-h-0 h-full flex flex-col overflow-hidden`}>{children}</div>
      </main>
    </div>
  );
}
