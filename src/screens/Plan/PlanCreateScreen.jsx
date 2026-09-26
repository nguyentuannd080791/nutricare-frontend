import React, { useState } from "react";
import { ShieldCheck, Cpu } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Card, Button, ScreenHeader } from "../../components/ui";

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
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Xây dựng thực đơn" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-5" style={{ paddingBottom: 40 }}>
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
          <div className="flex flex-row gap-2 rounded-xl p-3" style={{ backgroundColor: COLORS.muted }}>
            <ShieldCheck size={16} color={COLORS.primary} className="mt-[2px] shrink-0" />
            <span className="flex-1 text-[12px] text-[#475569] leading-[17px]">
              Thực đơn sẽ tự động loại trừ món không phù hợp với bệnh lý / dị ứng: {displayAvoid}.
            </span>
          </div>
        )}

        <Button full icon={Cpu} busy={generating} onPress={handleCreate}>
          {generating ? "Đang xây dựng thực đơn…" : "Xây dựng thực đơn"}
        </Button>
      </div>
    </div>
  );
}
