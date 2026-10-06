import React from "react";
import { COLORS } from "../theme/colors";
import { NAV_TABS } from "./tabs";

/** Trách nhiệm duy nhất: thanh điều hướng dọc của layout máy tính. */
export default function Sidebar({ active, onChange }) {
  return (
    <aside className="w-64 shrink-0 h-full bg-white border-r border-border flex flex-col px-4 py-6">
      <span className="px-3 mb-6 text-[20px] font-extrabold text-primaryDark">NutriCare</span>
      <nav aria-label="Điều hướng chính" className="flex flex-col gap-1">
        {NAV_TABS.map((t) => {
          const isActive = active === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={`min-h-[44px] flex items-center gap-3 px-3 rounded-xl text-[14.5px] font-semibold cursor-pointer motion-safe:transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primaryDark ${isActive ? "bg-muted text-primaryDark" : "text-slate-600 hover:bg-muted"}`}
            >
              <Icon size={20} color={isActive ? COLORS.primaryDark : "#64748B"} strokeWidth={isActive ? 2.4 : 2} />
              {t.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
