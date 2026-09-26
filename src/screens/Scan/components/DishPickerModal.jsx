import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { dishApi } from "../../../services/api";
import { useDebounced } from "../../../hooks/useDebounced";
import { ModalSheet, TextField } from "../../../components/ui";

/**
 * Trách nhiệm duy nhất: thêm món AI nhận diện sót — chỉ chọn được từ catalog
 * món ăn của hệ thống (không cho tự gõ tên món mới).
 */
export default function DishPickerModal({ open, onClose, onPick, excludeIds }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!open || !debouncedQuery.trim()) { setResults(null); return; }
    let cancelled = false;
    dishApi
      .search({ query: debouncedQuery.trim(), page: 1 })
      .then((res) => !cancelled && setResults(res.items.filter((d) => !excludeIds.includes(d.id))))
      .catch(() => !cancelled && setResults([]));
    return () => { cancelled = true; };
  }, [open, debouncedQuery, excludeIds]);

  function handlePick(dish) {
    onPick(dish);
    onClose();
    setQuery("");
  }

  return (
    <ModalSheet open={open} onClose={onClose} title="Thêm món ăn">
      <TextField icon={Search} placeholder="Tìm món ăn..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="max-h-[280px] overflow-y-auto mt-3">
        {results === null && query.trim() !== "" && (
          <div className="flex justify-center my-6"><span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
        )}
        {results?.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => handlePick(d)}
            className="w-full flex flex-row items-center justify-between rounded-xl px-[14px] py-[10px] mb-[6px]"
            style={{ backgroundColor: COLORS.muted }}
          >
            <span className="flex-1 text-left text-[13.5px] font-semibold text-fg mr-2">{d.nameVi}</span>
            <span className="text-[11.5px] text-descGray shrink-0">{Math.round(d.kcal)} kcal/phần</span>
          </button>
        ))}
        {results?.length === 0 && <p className="text-center text-[13px] text-placeholderGray py-6">Không tìm thấy món ăn phù hợp.</p>}
      </div>
      <span className="block text-[11px] text-placeholderGray mt-3">Chỉ chọn được từ danh mục món ăn có sẵn của hệ thống.</span>
    </ModalSheet>
  );
}
