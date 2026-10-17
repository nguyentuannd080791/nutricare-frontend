import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Tag } from "lucide-react";
import {
  PRESET_KNOWLEDGE_BASE,
  CONDITION_TYPES,
  normalizeVietnamese,
} from "../domain/medicalKnowledgeBase";

export default function PresetCatalogDropdown({
  existingConditions = [],
  onSelectPreset,
  onClose,
}) {
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogTab, setCatalogTab] = useState("ALL");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const filteredCatalogItems = useMemo(() => {
    const q = normalizeVietnamese(catalogSearch);
    return PRESET_KNOWLEDGE_BASE.filter((p) => {
      if (catalogTab !== "ALL" && p.type !== catalogTab) return false;
      if (!q) return true;
      const matchName = normalizeVietnamese(p.name).includes(q);
      const matchKw = p.keywords.some((k) => normalizeVietnamese(k).includes(q));
      return matchName || matchKw;
    });
  }, [catalogSearch, catalogTab]);

  return (
    <div
      ref={dropdownRef}
      className="absolute left-2 right-2 sm:left-4 sm:right-4 top-24 z-50 bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden max-h-[440px] flex flex-col animate-in fade-in slide-in-from-top-1"
    >
      {/* Header Dropdown */}
      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#059669]" />
            <span>Chọn nhanh từ danh mục y khoa có sẵn</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-0.5 cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ô tìm kiếm trong danh mục */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            placeholder="Tìm bệnh, dị ứng, chỉ định chuẩn..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#059669]"
          />
        </div>

        {/* Tab phân loại danh mục */}
        <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-0.5">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "BENH_NEN", label: "Bệnh nền" },
            { id: "DI_UNG", label: "Dị ứng" },
            { id: "CHI_DINH_BAC_SI", label: "Chỉ định" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCatalogTab(tab.id)}
              className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                catalogTab === tab.id
                  ? "bg-[#059669] text-white shadow-2xs"
                  : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách mục có sẵn */}
      <div className="overflow-y-auto divide-y divide-[#F1F5F9] p-1.5">
        {filteredCatalogItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#64748B]">
            Không tìm thấy mục khớp.
          </div>
        ) : (
          filteredCatalogItems.map((preset) => {
            const isAlreadyAdded = existingConditions.some(
              (c) => c.name.toLowerCase() === preset.name.toLowerCase()
            );
            const typeInfo = CONDITION_TYPES[preset.type];

            return (
              <div
                key={preset.id}
                onClick={() => !isAlreadyAdded && onSelectPreset(preset)}
                className={`p-2.5 rounded-xl transition-colors flex items-center justify-between gap-2 text-xs ${
                  isAlreadyAdded
                    ? "bg-slate-50 opacity-60"
                    : "hover:bg-emerald-50/60 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-[9.5px] font-bold px-2 py-0.5 rounded text-white shrink-0"
                    style={{ backgroundColor: typeInfo?.color }}
                  >
                    {typeInfo?.shortLabel}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-[#0F172A] block truncate">
                      {preset.name}
                    </span>
                    {preset.restrictedFoods?.length > 0 && (
                      <span className="text-[10.5px] text-[#DC2626] truncate block">
                        Kiêng: {preset.restrictedFoods.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAlreadyAdded}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isAlreadyAdded
                      ? "text-slate-400"
                      : "text-[#059669] bg-[#ECFDF5] hover:bg-[#059669] hover:text-white"
                  }`}
                >
                  {isAlreadyAdded ? "Đã có" : "+ Chọn"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
