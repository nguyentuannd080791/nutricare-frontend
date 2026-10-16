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
export default function DesktopLayout({ navigation, children }) {
  return (
    <div className="h-screen w-full bg-bg flex overflow-hidden">
      <Sidebar active={navigation.active} onChange={navigation.onChange} tabs={navigation.tabs} />
      <main className="flex-1 min-w-0 h-full flex flex-col [contain:layout]">
        <div className="w-full max-w-[880px] mx-auto flex-1 min-h-0 flex flex-col">{children}</div>
      </main>
    </div>
  );
}
