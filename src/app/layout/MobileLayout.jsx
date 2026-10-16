import React from "react";
import BottomNav from "../navigation/BottomNav";

/**
 * Khung điện thoại (giữ nguyên hành vi cũ của #root): cột 480px căn giữa,
 * nội dung cuộn bên trong, BottomNav đứng yên ở đáy. `navigation` = null → ẩn thanh dưới.
 */
export default function MobileLayout({ navigation, children }) {
  return (
    <div className="h-screen w-full max-w-app mx-auto bg-bg flex flex-col overflow-hidden relative">
      {children}
      {navigation && <BottomNav active={navigation.active} onChange={navigation.onChange} tabs={navigation.tabs} />}
    </div>
  );
}
