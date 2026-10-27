import React, { useState } from "react";
import { ShieldCheck, Cpu, CalendarDays } from "lucide-react";
import { Card, Button, ScreenHeader } from "../../../shared/components/ui";

const DAY_OPTIONS = [3, 5, 7, 14];

export default function PlanCreateScreen({ data, onBack, onCreate }) {
  const [days, setDays] = useState(7);
  const [generating, setGenerating] = useState(false);
  const target = data.targets.find((t) => t.isActive);

  const conditionNames = (data.conditions || []).map((c) => c.name);
  const avoidLabels = [...new Set((data.conditions || []).flatMap((c) => c.tagLabels || []))];
  const displayAvoid = conditionNames.length > 0 ? conditionNames.join(", ") : avoidLabels.join(", ");

  if (!target) return null;

  async function handleCreate() {
    if (generating) return;
    setGenerating(true);
    await onCreate(days);
    setGenerating(false);
  }

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      <ScreenHeader
        title="Xây Dựng Thực Đơn"
        icon={CalendarDays}
        subtitle="Thiết lập số ngày cho chu kỳ thực đơn mới"
        onBack={onBack}
      />
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5 pb-24">
        <Card className="p-4">
          <span className="block text-[13px] text-descGray">Dựa trên mục tiêu hiện tại</span>
          <span className="block text-[17px] font-bold text-fg mt-[2px]">{target.calories} kcal · {target.protein}g đạm / ngày</span>
        </Card>

        <div>
          <span className="block text-[13px] font-bold text-fg mb-[10px]">Số ngày xây dựng thực đơn</span>
          <div className="flex flex-row gap-2">
            {DAY_OPTIONS.map((d) => (
              <Button key={d} variant={days === d ? "primary" : "secondary"} onPress={() => setDays(d)} className="flex-1">{d} ngày</Button>
            ))}
          </div>
        </div>

        {(data.conditions?.length > 0 || avoidLabels.length > 0) && (
          <div className="flex flex-row gap-2 rounded-xl p-3 bg-[#ECFDF5] border border-[#DCEEE7]">
            <ShieldCheck size={16} className="text-[#059669] mt-[2px] shrink-0" />
            <span className="flex-1 text-[12px] text-[#059669] font-medium leading-[17px]">
              Thực đơn sẽ tự động loại trừ món không phù hợp với bệnh lý / dị ứng: {displayAvoid}.
            </span>
          </div>
        )}

        <Button full icon={Cpu} busy={generating} onPress={handleCreate}>
          {generating ? "Đang xây dựng thực đơn…" : "Xây dựng thực đơn"}
        </Button>
      </main>
    </div>
  );
}
