import React from "react";
import { Home, Utensils, ClipboardList, User } from "lucide-react";
import { COLORS } from "../theme/colors";

const TABS = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "foods", label: "Thực phẩm", icon: Utensils },
  { id: "plan", label: "Kế hoạch", icon: ClipboardList },
  { id: "profile", label: "Cá nhân", icon: User },
];

// paddingBottom: 24 (iOS, chừa tai thỏ) vs 14 (Android) trong bản gốc -> trên
// web dùng env(safe-area-inset-bottom) để tự thích ứng với mọi thiết bị.
export default function BottomNav({ active, onChange }) {
  return (
    <div
      className="w-full flex flex-row border-t border-border bg-white pt-[10px] shadow-[0_-2px_4px_rgba(0,0,0,0.05)] mx-auto max-w-app shrink-0"
      style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))" }}
    >
      {TABS.map((t) => {
        const isActive = active === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="flex-1 flex flex-col items-center gap-[3px]"
          >
            <Icon size={22} color={isActive ? COLORS.primary : "#94A3B8"} strokeWidth={isActive ? 2.4 : 2} />
            <span className="text-[10.5px] font-semibold" style={{ color: isActive ? COLORS.primary : "#94A3B8" }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
