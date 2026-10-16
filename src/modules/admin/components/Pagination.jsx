import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Trách nhiệm duy nhất: điều hướng chuyển trang.
 * Hiển thị "Trang x/y, tổng N người dùng".
 */
export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex flex-row items-center justify-between py-4 mt-2 border-t border-slate-100 text-[13.5px] text-slate-600">
      <span>
        Trang <span className="font-semibold text-fg">{page}</span>/
        <span className="font-semibold text-fg">{totalPages}</span>, tổng{" "}
        <span className="font-semibold text-fg">{total}</span> người dùng
      </span>

      <div className="flex flex-row items-center gap-2">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className={[
            "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors",
            hasPrev
              ? "border-slate-200 bg-white text-fg hover:bg-slate-50 cursor-pointer"
              : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed",
          ].join(" ")}
          aria-label="Trang trước"
        >
          <ChevronLeft size={14} />
          <span>Trước</span>
        </button>

        <button
          type="button"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className={[
            "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors",
            hasNext
              ? "border-slate-200 bg-white text-fg hover:bg-slate-50 cursor-pointer"
              : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed",
          ].join(" ")}
          aria-label="Trang sau"
        >
          <span>Sau</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
