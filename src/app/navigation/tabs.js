import { Home, Utensils, ClipboardList, User, BarChart3, Users } from "lucide-react";

// Nguồn duy nhất cho các tab điều hướng chính — BottomNav (điện thoại) và
// Sidebar (máy tính) cùng dùng, để thêm/bớt tab chỉ sửa 1 chỗ.
export const NAV_TABS = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "foods", label: "Thực phẩm", icon: Utensils },
  { id: "plan", label: "Kế hoạch", icon: ClipboardList },
  { id: "profile", label: "Cá nhân", icon: User },
];

export const ADMIN_TABS = [
  { id: "admin-dashboard", label: "Thống kê", icon: BarChart3 },
  { id: "admin-users", label: "Người dùng", icon: Users },
  { id: "profile", label: "Cá nhân", icon: User },
];

