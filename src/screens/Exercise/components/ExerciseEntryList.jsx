import React from "react";
import { Trash2 } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { exerciseLabel } from "../../../domain/exerciseInput";

export default function ExerciseEntryList({ entries, catalog, disabled, onRemove }) {
  if (entries.length === 0) {
    return <p className="m-0 text-[13.5px] text-descGray">Hôm nay chưa có bài tập nào.</p>;
  }

  return (
    <ul className="m-0 p-0 list-none flex flex-col gap-2">
      {entries.map((entry) => {
        const label = exerciseLabel(catalog, entry.exerciseId);
        return (
          <li key={entry.id} className="flex items-center justify-between rounded-[14px] border border-border bg-card pl-4 pr-1 py-1">
            <div>
              <span className="block text-[14.5px] font-semibold text-fg">{label}</span>
              <span className="block text-[12.5px] text-descGray">
                {entry.minutes} phút · {entry.kcal} kcal
              </span>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemove(entry.id)}
              aria-label={`Xoá ${label}`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={18} color={COLORS.destructive} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
