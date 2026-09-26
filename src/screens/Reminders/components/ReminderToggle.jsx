import React from "react";
import { COLORS } from "../../../theme/colors";

/** Trách nhiệm duy nhất: công tắc bật/tắt, thay cho <Switch> của RN. */
export default function ReminderToggle({ value, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={onChange}
      className="relative w-[46px] h-[26px] rounded-full shrink-0 transition-colors"
      style={{ backgroundColor: value ? COLORS.primary : COLORS.border }}
    >
      <span
        className="absolute top-[2px] w-[22px] h-[22px] rounded-full bg-white shadow transition-all"
        style={{ left: value ? 22 : 2 }}
      />
    </button>
  );
}
