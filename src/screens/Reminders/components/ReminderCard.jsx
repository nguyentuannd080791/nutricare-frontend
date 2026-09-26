import React from "react";
import { Card, Button, IconBadge } from "../../../components/ui";
import ReminderToggle from "./ReminderToggle";

/**
 * Trách nhiệm duy nhất: 1 thẻ nhắc nhở (bữa ăn theo giờ, hoặc uống nước theo chu kỳ).
 * Bộ chọn giờ dùng <input type="time"> gốc trình duyệt — tạm thời (xem TODO.md:
 * khớp lại giao diện với DateTimePicker gốc là việc để sau).
 */
export default function ReminderCard({ config, value, onToggle, onTimeChange, onIntervalChange }) {
  const Icon = config.icon;
  return (
    <Card className="p-4">
      <div className="flex flex-row items-center gap-3">
        <IconBadge icon={Icon} size={42} />
        <div className="flex-1">
          <span className="block text-[14px] font-bold text-fg">{config.label}</span>
          <span className="block text-[12px] text-descGray mt-[1px]">
            {config.kind === "time" ? `Nhắc lúc ${value.time}` : `Mỗi ${value.intervalHours} giờ`}
          </span>
        </div>
        <ReminderToggle value={value.enabled} onChange={onToggle} />
      </div>

      {value.enabled && config.kind === "time" && (
        <label className="mt-3 flex flex-row items-center justify-between rounded-[12px] py-[13px] px-[18px]" style={{ backgroundColor: "#fff", border: "1.5px solid #000" }}>
          <span className="text-[15px] font-bold text-fg">Đổi giờ</span>
          <input
            type="time"
            value={value.time}
            onChange={(e) => e.target.value && onTimeChange(e.target.value)}
            className="text-[16px] font-bold text-fg bg-transparent outline-none"
          />
        </label>
      )}
      {value.enabled && config.kind === "interval" && (
        <div className="flex flex-row gap-2 mt-3">
          {[1, 2, 3, 4].map((h) => (
            <Button key={h} variant={value.intervalHours === h ? "primary" : "secondary"} onPress={() => onIntervalChange(h)} className="flex-1">{h}h</Button>
          ))}
        </div>
      )}
    </Card>
  );
}
