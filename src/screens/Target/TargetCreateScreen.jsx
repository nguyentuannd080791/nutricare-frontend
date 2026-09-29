import React, { useState } from "react";
import { Scale } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Button, RadioCard, SelectField, TextField, EmptyState, ScreenHeader, FixedActionBar } from "../../components/ui";
import { GOALS, ACTIVITY_LEVELS, DURATION_OPTIONS } from "../../domain/constants";
import { useDebounced } from "../../hooks/useDebounced";
import { useTargetPreview } from "./hooks/useTargetPreview";
import GoalPreviewCard from "./components/GoalPreviewCard";

export default function TargetCreateScreen({ data, onBack, onCreate }) {
  const [goalId, setGoalId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [targetChangeKgText, setTargetChangeKgText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const hasBMI = data.bmiRecords.length > 0;

  // Mục tiêu giảm/tăng cân cần thêm số kg + thời gian; các mục tiêu khác thì không.
  const changeVerb = GOALS.find((g) => g.id === goalId)?.changeVerb;
  const targetChangeKg = Number(targetChangeKgText.replace(",", "."));
  const settledChangeKg = useDebounced(targetChangeKg);
  const weightGoalInput = changeVerb ? { durationMonths: Number(durationMonths), targetChangeKg: settledChangeKg } : {};
  const { preview, error: previewError } = useTargetPreview({
    goalId,
    activityId,
    ...weightGoalInput,
    enabled: hasBMI && (!changeVerb || (settledChangeKg > 0 && Boolean(durationMonths))),
  });

  if (!hasBMI) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
        <ScreenHeader title="Tạo mục tiêu" onBack={onBack} />
        <div className="px-5">
          <EmptyState icon={Scale} title="Cần chỉ số BMI trước" desc="Vui lòng hoàn tất khai báo chỉ số BMI ban đầu trước khi tạo mục tiêu dinh dưỡng." />
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (submitting || !preview || !durationMonths) return;
    setSubmitting(true);
    await onCreate({ goalId, activityId, durationMonths: Number(durationMonths), ...(changeVerb && { targetChangeKg: settledChangeKg }) });
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

        {changeVerb && (
          <TextField label={`Bạn muốn ${changeVerb} bao nhiêu kg?`} value={targetChangeKgText} onChange={(e) => setTargetChangeKgText(e.target.value)} placeholder="VD: 5" inputMode="decimal" />
        )}

        <SelectField label="Thời gian áp dụng" value={durationMonths} onChange={setDurationMonths} placeholder="Chọn thời gian" options={DURATION_OPTIONS} />

        {previewError && <span className="block text-destructive text-[13px] font-medium">{previewError}</span>}
        {preview && <GoalPreviewCard preview={preview} />}
      </div>

      <FixedActionBar>
        <Button full busy={submitting} disabled={!preview || !durationMonths || settledChangeKg !== targetChangeKg} onPress={handleSubmit}>Xác nhận tạo mục tiêu</Button>
      </FixedActionBar>
    </div>
  );
}
