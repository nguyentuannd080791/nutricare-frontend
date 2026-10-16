import React from "react";
import { Search } from "lucide-react";
import SegmentedControl from "../../../shared/components/SegmentedControl";

const PREMIUM_OPTIONS = [
  { id: "", label: "Tất cả" },
  { id: "true", label: "Premium" },
  { id: "false", label: "Free" },
];

/**
 * Trách nhiệm duy nhất: ô tìm kiếm và bộ lọc gói cho danh sách người dùng.
 */
export default function UserFilters({ search, onSearchChange, premium, onPremiumChange }) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="relative flex flex-row items-center rounded-[12px] border border-border bg-white px-3 py-2">
        <Search size={18} className="text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value.slice(0, 100))}
          placeholder="Tìm theo tên hoặc email…"
          className="flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-placeholderGray"
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="text-xs text-slate-400 hover:text-slate-600 px-1"
          >
            Xoá
          </button>
        ) : null}
      </div>

      <SegmentedControl
        label="Lọc theo gói"
        options={PREMIUM_OPTIONS}
        value={premium}
        onChange={onPremiumChange}
      />
    </div>
  );
}
