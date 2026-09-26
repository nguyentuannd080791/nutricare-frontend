import React, { useState } from "react";
import { Scale } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Button, RadioCard, SelectField, EmptyState, ScreenHeader, FixedActionBar } from "../../components/ui";
import { GOALS, ACTIVITY_LEVELS, DURATIONS } from "../../domain/constants";
import { useTargetPreview } from "./hooks/useTargetPreview";
import GoalPreviewCard from "./components/GoalPreviewCard";

const DURATION_OPTIONS = DURATIONS.map((d) => ({ id: String(d), label: `${d} tháng` }));

export default function TargetCreateScreen({ data, onBack, onCreate }) {
  const [goalId, setGoalId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const hasBMI = data.bmiRecords.length > 0;
  const preview = useTargetPreview({ goalId, activityId, enabled: hasBMI });

  if (!hasBMI) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
        <ScreenHeader title="Tạo mục tiêu" onBack={onBack} />
        <div className="px-5">
          <EmptyState icon={Scale} title="Cần chỉ số BMI trước" desc="Vui lòng thêm chiều cao & cân nặng ở mục BMI trước khi tạo mục tiêu dinh dưỡng." />
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (submitting || !preview || !durationMonths) return;
    setSubmitting(true);
    await onCreate({ goalId, activityId, durationMonths: Number(durationMonths) });
    setSubmitting(false);
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Tạo mục tiêu dinh dưỡng" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-5" style={{ paddingBottom: 120 }}>
        <div>
          <span className="block text-[13px] font-bold text-fg mb-[10px]">Bạn muốn đạt được điều gì?</span>
          {GOALS.map((g) => (
            <RadioCard key={g.id} selected={goalId === g.id} title={g.label} desc={g.desc} onPress={() => setGoalId(g.id)} />
          ))}
        </div>

        <div>
          <span className="block text-[13px] font-bold text-fg mb-[10px]">Mức độ hoạt động hiện tại</span>
          {ACTIVITY_LEVELS.map((a) => (
            <RadioCard key={a.id} selected={activityId === a.id} title={a.label} desc={a.desc} onPress={() => setActivityId(a.id)} />
          ))}
        </div>

        <SelectField label="Thời gian áp dụng" value={durationMonths} onChange={setDurationMonths} placeholder="Chọn thời gian" options={DURATION_OPTIONS} />

        {preview && <GoalPreviewCard preview={preview} />}
      </div>

      <FixedActionBar>
        <Button full busy={submitting} disabled={!preview || !durationMonths} onPress={handleSubmit}>Xác nhận tạo mục tiêu</Button>
      </FixedActionBar>
    </div>
  );
}
