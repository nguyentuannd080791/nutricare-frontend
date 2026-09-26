import React from "react";
import { ShieldCheck, Search, Bell } from "lucide-react";
import { IconBadge } from "../../../components/ui";

const QUICK_ACTIONS = [
  { id: "conditions", label: "Bệnh nền", icon: ShieldCheck },
  { id: "foods", label: "Tra món ăn", icon: Search },
  { id: "reminders", label: "Nhắc nhở", icon: Bell },
];

/** Trách nhiệm duy nhất: lưới truy cập nhanh trên Trang chủ. */
export default function QuickActionsGrid({ onQuickAction }) {
  return (
    <>
      <span className="block text-[15.5px] font-bold text-fg mb-3">Truy cập nhanh</span>
      <div className="flex flex-row justify-around gap-3">
        {QUICK_ACTIONS.map((a) => (
          <button key={a.id} type="button" onClick={() => onQuickAction(a.id)} className="flex-1 flex flex-col items-center gap-2">
            <IconBadge icon={a.icon} size={52} />
            <span className="text-[11.5px] font-semibold text-fg text-center">{a.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
