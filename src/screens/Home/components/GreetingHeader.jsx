import React from "react";
import { COLORS } from "../../../theme/colors";

/** Trách nhiệm duy nhất: dòng chào + avatar mở Cá nhân. */
export default function GreetingHeader({ fullName, onAvatarPress }) {
  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  const firstName = (fullName || "").split(" ").slice(-1)[0];

  return (
    <div className="flex flex-row justify-between items-center mb-4">
      <div>
        <span className="block text-[13.5px] text-descGray">{greeting},</span>
        <span className="block text-[21px] font-extrabold text-fg mt-[2px]">{firstName || "bạn"}</span>
      </div>
      <button
        type="button"
        onClick={onAvatarPress}
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ backgroundColor: COLORS.primary }}
      >
        <span className="text-white text-[18px] font-extrabold">{fullName?.[0]?.toUpperCase()}</span>
      </button>
    </div>
  );
}
