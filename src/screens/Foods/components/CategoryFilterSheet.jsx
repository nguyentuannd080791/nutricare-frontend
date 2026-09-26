import React from "react";
import { Check } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { ModalSheet } from "../../../components/ui";

/** Trách nhiệm duy nhất: bảng chọn lọc theo nhóm thực phẩm/món ăn. */
export default function CategoryFilterSheet({ open, onClose, groups, groupId, onSelect }) {
  return (
    <ModalSheet open={open} onClose={onClose} title="Lọc theo danh mục">
      <div className="max-h-[420px] overflow-y-auto">
        <button type="button" onClick={() => onSelect(null)} className="w-full flex flex-row items-center justify-between rounded-xl px-[14px] py-[13px]" style={{ backgroundColor: !groupId ? COLORS.muted : "transparent" }}>
          <span className="text-[14px] font-semibold text-fg">Tất cả</span>
          {!groupId && <Check size={17} color={COLORS.primary} />}
        </button>
        {groups.map((g) => (
          <button key={g.id} type="button" onClick={() => onSelect(g.id)} className="w-full flex flex-row items-center justify-between rounded-xl px-[14px] py-[13px]" style={{ backgroundColor: groupId === g.id ? COLORS.muted : "transparent" }}>
            <span className="text-[14px] font-semibold text-fg">{g.nameVi}</span>
            {groupId === g.id && <Check size={17} color={COLORS.primary} />}
          </button>
        ))}
      </div>
    </ModalSheet>
  );
}
