import React from "react";
import { useIsDesktop } from "../hooks/useIsDesktop";
import MobileLayout from "./MobileLayout";
import DesktopLayout from "./DesktopLayout";

/**
 * Chọn layout theo thiết bị. `navigation` = { active, onChange } khi đã vào
 * app, null khi đang đăng nhập/onboarding (lúc đó dùng khung hẹp ở mọi thiết bị).
 * `hideMobileNav`: màn con (overlay) trên điện thoại che luôn thanh dưới; trên
 * máy tính Sidebar vẫn hiện để người dùng chuyển mục bất cứ lúc nào.
 */
export default function AppLayout({ navigation, hideMobileNav, children }) {
  const isDesktop = useIsDesktop();
  if (isDesktop && navigation) {
    return <DesktopLayout navigation={navigation}>{children}</DesktopLayout>;
  }
  return <MobileLayout navigation={hideMobileNav ? null : navigation}>{children}</MobileLayout>;
}
