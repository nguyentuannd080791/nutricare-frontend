import React from "react";

/** Trách nhiệm duy nhất: nhóm nút chọn 1-trong-n (lọc gói, chu kỳ thanh toán). */
export default function SegmentedControl({ label, options, value, onChange, fill = false }) {
  return (
    <div role="group" aria-label={label} className={`inline-flex gap-1 p-1 rounded-full bg-muted ${fill ? "w-full" : ""}`}>
      {options.map((o) => {
        const pressed = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(o.id)}
            className={`min-h-[44px] px-5 rounded-full text-[15px] font-medium cursor-pointer motion-safe:transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primaryDark ${fill ? "flex-1" : ""} ${pressed ? "bg-primaryDark text-white" : "text-fg hover:bg-white"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
