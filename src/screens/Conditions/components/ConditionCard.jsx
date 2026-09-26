import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card, Badge } from "../../../components/ui";
import { CONDITION_TYPES } from "../../../domain/constants";

/** Trách nhiệm duy nhất: hiển thị 1 bệnh nền / dị ứng + nút sửa/xoá. */
export default function ConditionCard({ condition: c, onEdit, onDelete }) {
  return (
    <Card className="p-4 mb-[10px]">
      <div className="flex flex-row items-center gap-2 flex-wrap">
        <span className="text-[14.5px] font-bold text-fg">{c.name}</span>
        <Badge tone="dark">{CONDITION_TYPES.find((t) => t.id === c.type)?.label}</Badge>
      </div>
      <span className="block text-[11.5px] text-placeholderGray mt-1">Thêm ngày {new Date(c.addedDate).toLocaleDateString("vi-VN")}</span>
      {c.tagLabels.length > 0 && (
        <div className="flex flex-row flex-wrap gap-[6px] mt-2">
          {c.tagLabels.map((label) => <Badge key={label}>{label}</Badge>)}
        </div>
      )}
      <span className="block text-[11.5px] text-placeholderGray mt-2">
        {c.recognized ? "Hệ thống sẽ tự động lọc món ăn không phù hợp." : "Chưa nhận diện được — hệ thống chỉ lưu để hiển thị, không tự lọc món ăn."}
      </span>
      <div className="flex flex-row gap-2 mt-[14px] pt-[14px] border-t" style={{ borderColor: COLORS.border }}>
        <button type="button" onClick={onEdit} className="flex-1 flex flex-row items-center justify-center gap-[6px] rounded-[12px] py-[11px]" style={{ backgroundColor: COLORS.muted }}>
          <Edit2 size={16} color={COLORS.primary} />
          <span className="text-primary font-bold text-[13px]">Sửa</span>
        </button>
        <button type="button" onClick={onDelete} className="flex-1 flex flex-row items-center justify-center gap-[6px] rounded-[12px] py-[11px] bg-dangerBg">
          <Trash2 size={16} color={COLORS.destructive} />
          <span className="text-destructive font-bold text-[13px]">Xoá</span>
        </button>
      </div>
    </Card>
  );
}
