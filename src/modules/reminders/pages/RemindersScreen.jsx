import React, { useState } from "react";
import { Coffee, Utensils, Soup, Droplet, Bell } from "lucide-react";
import { ScreenHeader } from "../../../shared/components/ui";
import ReminderCard from "../components/ReminderCard";

const REMINDER_TYPES = [
  { id: "sang", label: "Bữa sáng", icon: Coffee, kind: "time" },
  { id: "trua", label: "Bữa trưa", icon: Utensils, kind: "time" },
  { id: "toi", label: "Bữa tối", icon: Soup, kind: "time" },
  { id: "nuoc", label: "Uống nước", icon: Droplet, kind: "interval" },
];

export default function RemindersScreen({ reminders: initialReminders, onBack, onSave }) {
  const [reminders, setReminders] = useState(initialReminders);

  function update(id, patch) {
    const next = { ...reminders, [id]: { ...reminders[id], ...patch } };
    setReminders(next);
    onSave(next);
  }

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      <ScreenHeader
        title="Nhắc Nhở Bữa Ăn & Uống Nước"
        icon={Bell}
        subtitle="Cài đặt lịch trình và chu kỳ nhắc nhở khoa học"
        onBack={onBack}
      />
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-4 pb-24">
        <div className="flex flex-col gap-[10px]">
          {REMINDER_TYPES.map((r) => (
            <ReminderCard
              key={r.id}
              config={r}
              value={reminders[r.id]}
              onToggle={() => update(r.id, { enabled: !reminders[r.id].enabled })}
              onTimeChange={(time) => update(r.id, { time })}
              onIntervalChange={(intervalHours) => update(r.id, { intervalHours })}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
