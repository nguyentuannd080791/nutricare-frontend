import React, { useState } from "react";
import { Coffee, Utensils, Soup, Droplet } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { ScreenHeader } from "../../components/ui";
import ReminderCard from "./components/ReminderCard";

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
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Nhắc nhở" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
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
      </div>
    </div>
  );
}
