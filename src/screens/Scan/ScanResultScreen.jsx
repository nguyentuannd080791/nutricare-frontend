import React, { useMemo, useState } from "react";
import { COLORS } from "../../theme/colors";
import { ScreenHeader } from "../../components/ui";
import { appendScanRecord } from "../../storage/scanStorage";
import DishPickerModal from "./components/DishPickerModal";
import IngredientRow from "./components/IngredientRow";

const MIN_SERVINGS = 0.5;

const EMPTY_MESSAGES = {
  not_food: "Ảnh này không giống món ăn. Vui lòng chụp lại.",
  low_confidence: "Ảnh chưa đủ rõ để nhận diện chính xác. Vui lòng chụp lại gần hơn / đủ sáng hơn.",
  refused_out_of_scope: "Yêu cầu này nằm ngoài phạm vi nhận diện món ăn.",
};

const sumBy = (items, field) => items.reduce((s, it) => s + it[field] * it.servings, 0);

/**
 * Hiển thị kết quả nhận diện từ backend (kcal/macro và cảnh báo xung đột bệnh
 * nền đều do server tính). Nếu status !== "ok" hoặc không có món hợp lệ,
 * hướng dẫn quét lại thay vì hiển thị dữ liệu rác.
 */
export default function ScanResultScreen({ scanId, photoUri, result, onDone, onRetry }) {
  const [items, setItems] = useState(() => result.items.map((it) => ({ ...it, servings: 1 })));
  const [pickerOpen, setPickerOpen] = useState(false);

  const totals = useMemo(
    () => ({ kcal: sumBy(items, "kcal"), protein: sumBy(items, "protein_g"), carb: sumBy(items, "carb_g"), fat: sumBy(items, "fat_g") }),
    [items]
  );
  const conflicts = useMemo(() => [...new Set(items.flatMap((it) => it.conflicts))], [items]);
  const pickerExcludeIds = useMemo(() => items.map((it) => it.id), [items]);

  function updateServings(id, delta) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, servings: Math.max(MIN_SERVINGS, it.servings + delta) } : it)));
  }
  function removeItem(id) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  }
  function addItem(dish) {
    setItems((prev) => [...prev, { ...dish, servings: 1 }]);
  }

  async function handleSave() {
    await appendScanRecord({
      id: scanId,
      date: new Date().toISOString(),
      photoUri,
      items: items.map(({ id, nameVi, servings, kcal, protein_g, carb_g, fat_g }) => ({ dishId: id, nameVi, servings, kcal, protein_g, carb_g, fat_g })),
      totals,
    });
    onDone();
  }

  if (result.status !== "ok" || items.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-0 items-center justify-center gap-4 p-6" style={{ backgroundColor: COLORS.bg }}>
        <p className="text-center text-[13.5px] text-descGray">{EMPTY_MESSAGES[result.status] || "Không nhận diện được món ăn nào phù hợp."}</p>
        <button type="button" onClick={onRetry} className="rounded-xl px-5 py-3" style={{ backgroundColor: COLORS.primary }}>
          <span className="text-white font-semibold">Quét lại</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Kết quả nhận diện" onBack={onRetry} />
      <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 40 }}>
        {photoUri ? <img src={photoUri} alt="Ảnh đã chụp" className="w-full aspect-square object-cover rounded-[20px] mb-4" /> : null}

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: COLORS.card }}>
          <span className="block text-[12px] text-descGray">Tổng dinh dưỡng</span>
          <span className="block text-[19px] font-bold text-fg">{Math.round(totals.kcal)} kcal</span>
          <div className="flex flex-row gap-2 mt-[10px]">
            {[["Đạm", totals.protein], ["Tinh bột", totals.carb], ["Béo", totals.fat]].map(([label, val]) => (
              <div key={label} className="flex-1 rounded-[10px] p-2 flex flex-col items-center" style={{ backgroundColor: COLORS.muted }}>
                <span className="text-[10.5px] text-descGray">{label}</span>
                <span className="text-[13px] font-bold text-fg">{val.toFixed(1)}g</span>
              </div>
            ))}
          </div>
        </div>

        {conflicts.length > 0 && (
          <div className="rounded-xl p-3 mb-4 bg-dangerBg">
            <span className="block text-[12.5px] font-semibold text-destructive">Không phù hợp với tình trạng của bạn</span>
            <span className="block text-[12px] mt-1" style={{ color: "#B91C1C" }}>Xung đột với: {conflicts.join(", ")}</span>
          </div>
        )}

        <span className="block text-[13px] font-semibold text-fg mb-2">Món ăn</span>
        {items.map((it) => (
          <IngredientRow key={it.id} item={it} canRemove={items.length > 1} onServingsChange={(d) => updateServings(it.id, d)} onRemove={() => removeItem(it.id)} />
        ))}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full rounded-xl py-3 text-center mt-1 mb-2"
          style={{ border: `1.5px dashed ${COLORS.primary}` }}
        >
          <span className="text-[13.5px] font-bold text-primary">+ Thêm món ăn</span>
        </button>

        <div className="flex flex-row gap-3 mt-3">
          <button type="button" onClick={onRetry} className="flex-1 rounded-xl py-[14px] text-center" style={{ backgroundColor: COLORS.muted }}>
            <span className="text-fg font-semibold">Quét lại</span>
          </button>
          <button type="button" onClick={handleSave} className="flex-1 rounded-xl py-[14px] text-center" style={{ backgroundColor: COLORS.primary }}>
            <span className="text-white font-bold">Lưu vào nhật ký</span>
          </button>
        </div>

        <DishPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={addItem} excludeIds={pickerExcludeIds} />
      </div>
    </div>
  );
}
