import React, { useState } from "react";
import { Edit3, X } from "lucide-react";
import { CONDITION_TYPES } from "../domain/medicalKnowledgeBase";

export default function ConditionEditModal({
  editingItem,
  onClose,
  onSave,
}) {
  const [prevId, setPrevId] = useState(editingItem?.id);
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    type: editingItem?.type || "BENH_NEN",
    notes: editingItem?.notes || "",
  });

  if (editingItem && editingItem.id !== prevId) {
    setPrevId(editingItem.id);
    setFormData({
      name: editingItem.name || "",
      type: editingItem.type || "BENH_NEN",
      notes: editingItem.notes || "",
    });
  }

  if (!editingItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...editingItem,
      name: formData.name.trim(),
      type: formData.type,
      notes: formData.notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#059669]" />
            <span>Chỉnh sửa thông tin bệnh lý</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tên bệnh / dị ứng / chỉ định:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2.5 bg-[#F8FAFC] border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#059669] text-xs sm:text-sm text-[#0F172A]"
              placeholder="Ví dụ: Đái tháo đường Type 2"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Phân loại y khoa:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                CONDITION_TYPES.BENH_NEN,
                CONDITION_TYPES.DI_UNG,
                CONDITION_TYPES.CHI_DINH_BAC_SI,
              ].map((cat) => {
                const isSelected = formData.type === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: cat.id })}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      isSelected
                        ? "bg-white shadow-xs font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                    style={{
                      borderColor: isSelected ? cat.color : undefined,
                      color: isSelected ? cat.color : undefined,
                    }}
                  >
                    {cat.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Lời dặn / Ghi chú dinh dưỡng:
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full p-2.5 bg-[#F8FAFC] border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#059669] text-xs text-[#0F172A] leading-relaxed"
              placeholder="Ghi chú cụ thể của bác sĩ hoặc hướng dẫn tự chăm sóc..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-xs cursor-pointer disabled:opacity-50"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
