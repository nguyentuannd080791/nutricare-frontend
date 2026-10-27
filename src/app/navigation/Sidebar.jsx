import React from "react";
import { NAV_TABS } from "./tabs";

/**
 * Trách nhiệm duy nhất: thanh điều hướng dọc của layout máy tính.
 * Chuẩn hóa phong cách thiết kế emerald (#059669, #DCEEE7) đồng bộ với FoodsScreen,
 * đưa avatar / thông tin người dùng về góc dưới cùng (mt-auto) thay vì góc trên cùng bên phải.
 */
export default function Sidebar({ active, onChange, tabs = NAV_TABS, user }) {
  // Lọc tab profile khỏi danh sách giữa để đặt trang trọng ở khối dưới cùng
  const mainTabs = tabs.filter((t) => t.id !== "profile");

  const fullName = user?.fullName || "Người dùng";
  const initial = (fullName || "U").trim().charAt(0).toUpperCase();
  const userRoleBadge = user?.isAdmin
    ? "Quản trị viên"
    : user?.isPremium
      ? "Tài khoản Premium"
      : "Gói cơ bản";

  return (
    <aside className="w-64 shrink-0 h-full bg-white border-r border-[#DCEEE7] flex flex-col px-4 py-5 select-none">
      {/* 1. BRAND LOGO */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
          N
        </div>
        <div className="min-w-0">
          <span className="text-lg font-black text-[#0F172A] tracking-tight block leading-tight">
            NutriCare
          </span>
          <span className="text-[10px] font-semibold text-[#059669]">
            Dinh dưỡng cá nhân hóa
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION TABS CHÍNH */}
      <nav aria-label="Điều hướng chính" className="flex flex-col gap-1.5">
        {mainTabs.map((t) => {
          const isActive = active === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={`min-h-[44px] flex items-center gap-3 px-3.5 rounded-xl text-sm cursor-pointer transition-all ${
                isActive
                  ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/70 font-extrabold shadow-2xs"
                  : "text-[#0F172A]/70 hover:bg-[#F0F8F6] hover:text-[#059669] font-semibold"
              }`}
            >
              <Icon
                size={19}
                className={isActive ? "text-[#059669]" : "text-[#64748B]"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. KHỐI NGƯỜI DÙNG PHÍA DƯỚI CÙNG (Thay thế icon avatar góc trên phải) */}
      <div className="mt-auto pt-4 border-t border-[#DCEEE7]">
        <button
          type="button"
          onClick={() => onChange("profile")}
          title="Xem trang cá nhân"
          aria-label="Xem trang cá nhân"
          className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all cursor-pointer text-left ${
            active === "profile"
              ? "bg-[#ECFDF5] border border-[#A7F3D0] shadow-2xs"
              : "hover:bg-[#F0F8F6] border border-transparent"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-bold text-[#0F172A] truncate">
              {fullName}
            </span>
            <span className="block text-[11px] font-semibold text-[#059669] truncate">
              {userRoleBadge}
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}
