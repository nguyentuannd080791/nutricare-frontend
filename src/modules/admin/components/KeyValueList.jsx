import React from "react";

/**
 * Trách nhiệm duy nhất: hiển thị danh sách các cặp nhãn - giá trị dùng chung.
 * items: Array<{ label: string, value: any, sub?: string, badge?: React.ReactNode }>
 */
export default function KeyValueList({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {items.map((item, idx) => {
        const displayVal =
          item.value === null || item.value === undefined || item.value === ""
            ? "—"
            : item.value;

        return (
          <div key={idx} className="flex flex-row items-center justify-between py-2.5 text-[14px]">
            <span className="text-slate-500 font-medium">{item.label}</span>
            <div className="flex flex-col items-end">
              {item.badge ? (
                item.badge
              ) : (
                <span className="font-semibold text-fg text-right">{displayVal}</span>
              )}
              {item.sub && <span className="text-[12px] text-slate-400 mt-0.5">{item.sub}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
