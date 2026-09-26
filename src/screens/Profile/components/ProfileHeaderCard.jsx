import React from "react";
import { Edit2 } from "lucide-react";
import { COLORS } from "../../../theme/colors";
import { Card, Badge } from "../../../components/ui";

/** Trách nhiệm duy nhất: thẻ avatar + tên + email + nút sửa hồ sơ. */
export default function ProfileHeaderCard({ user, onEditPress }) {
  return (
    <Card className="flex flex-row items-center gap-[14px] p-[18px]">
      <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.primary }}>
        <span className="text-[22px] font-extrabold text-white">{user.fullName?.[0]?.toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[15.5px] font-bold text-fg truncate">{user.fullName}</span>
        <span className="block text-[12.5px] text-descGray mt-[1px] truncate">{user.email}</span>
        <div className="flex flex-row gap-[6px] mt-[6px]">
          <Badge tone="dark">{user.isPremium ? "Premium" : "Thành viên"}</Badge>
        </div>
      </div>
      <button type="button" onClick={onEditPress} className="p-[9px] rounded-xl shrink-0" style={{ backgroundColor: COLORS.muted }}>
        <Edit2 size={15} color={COLORS.primary} />
      </button>
    </Card>
  );
}
