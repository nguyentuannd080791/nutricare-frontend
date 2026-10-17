import React from "react";
import {
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Ban,
  Apple,
  Info,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  CONDITION_TYPES,
  AVOID_TAGS,
} from "../domain/medicalKnowledgeBase";

/**
 * Thẻ hiển thị một tình trạng sức khỏe / bệnh nền / dị ứng (SOLID: SRP)
 * Đồng bộ toàn diện từ test-ui:
 * - Huy hiệu loại kèm màu sắc và icon nhận diện
 * - Nhãn ngày tạo
 * - Danh sách tags chống chỉ định
 * - Khối mở rộng/thu gọn chi tiết: Món cần kiêng, Món nên ăn, Lời dặn chuyên gia
 * - Nút sửa & xoá
 */
export default function ConditionCard({
  condition: item,
  isExpanded = false,
  onToggleExpand,
  onEdit,
  onDelete,
}) {
  if (!item) return null;

  const typeConfig = CONDITION_TYPES[item.type] || CONDITION_TYPES.CHUA_NHAN_DIEN;
  const TypeIcon = typeConfig.icon || HelpCircle;

  const hasDetails =
    (item.restrictedFoods && item.restrictedFoods.length > 0) ||
    (item.recommendedFoods && item.recommendedFoods.length > 0) ||
    item.notes;

  const displayTags = item.tagLabels?.length > 0
    ? item.tagLabels
    : (item.tags || []).map((t) => AVOID_TAGS[t]?.label || t);

  const formattedDate = item.addedDate
    ? new Date(item.addedDate).toLocaleDateString("vi-VN")
    : "Gần đây";

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCEEE7] hover:border-[#059669]/40 shadow-xs transition-all text-xs space-y-3">
      {/* Hàng 1: Phân loại, ngày thêm & Các nút thao tác */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: typeConfig.bgLight,
                color: typeConfig.color,
                border: `1px solid ${typeConfig.borderColor}`,
              }}
            >
              <TypeIcon className="w-3 h-3" />
              <span>{typeConfig.label}</span>
            </span>
            <span className="text-[10.5px] text-[#94A3B8]">
              Thêm ngày {formattedDate}
            </span>
          </div>

          <h3 className="font-bold text-[#0F172A] text-sm sm:text-base leading-snug">
            {item.name}
          </h3>
        </div>

        {/* Nút Sửa & Xóa */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#059669] hover:bg-emerald-50 transition-colors cursor-pointer"
            title="Chỉnh sửa"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thông báo riêng cho mục Chưa nhận diện */}
      {item.type === "CHUA_NHAN_DIEN" && (
        <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span className="text-[11.5px] truncate">
              Hệ thống chưa có sẵn dữ liệu chuẩn y khoa cho mục này.
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-[11px] font-bold text-[#D97706] hover:underline cursor-pointer"
          >
            Bổ sung ghi chú
          </button>
        </div>
      )}

      {/* Danh sách Tags nhãn vi chất chống chỉ định */}
      {displayTags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {displayTags.map((tagLabel, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[10.5px] font-medium bg-[#F1F5F9] text-[#334155] px-2 py-0.5 rounded-md border border-[#E2E8F0]"
            >
              <Tag className="w-2.5 h-2.5 text-[#64748B]" />
              <span>{tagLabel}</span>
            </span>
          ))}
        </div>
      )}

      {/* Chi tiết mở rộng: Món kiêng, Món nên ăn, Lời dặn chuyên gia */}
      {hasDetails && (
        <div className="pt-2 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onToggleExpand}
            className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#059669] hover:text-[#047857] cursor-pointer"
          >
            <span>
              {isExpanded ? "Thu gọn chi tiết" : "Xem món kiêng & lời dặn dinh dưỡng"}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-2.5 space-y-2 pt-1 text-xs animate-in fade-in slide-in-from-top-1">
              {/* Cần kiêng */}
              {item.restrictedFoods?.length > 0 && (
                <div>
                  <span className="font-bold text-[#DC2626] flex items-center gap-1 mb-1">
                    <Ban className="w-3.5 h-3.5" /> Cần kiêng:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.restrictedFoods.map((food, idx) => (
                      <span
                        key={idx}
                        className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100 text-[11px]"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nên ăn */}
              {item.recommendedFoods?.length > 0 && (
                <div>
                  <span className="font-bold text-[#059669] flex items-center gap-1 mb-1">
                    <Apple className="w-3.5 h-3.5" /> Nên ăn:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.recommendedFoods.map((food, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px]"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lời dặn / Ghi chú */}
              {item.notes && (
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] flex items-start gap-1.5 leading-relaxed">
                  <Info className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <p>{item.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
