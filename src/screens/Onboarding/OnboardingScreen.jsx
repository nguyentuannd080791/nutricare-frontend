import React, { useState } from "react";
import { COLORS } from "../../theme/colors";
import { Button, TextField, SelectField } from "../../components/ui";
import { GOALS, ACTIVITY_LEVELS } from "../../domain/constants";

const GENDER_OPTIONS = [
  { id: "nam", label: "Nam" },
  { id: "nu", label: "Nữ" },
];

/**
 * @param {(profile: {dob,gender,heightCm,weightKg,goalId,activityId}) => Promise<string|null>} onComplete
 */
export default function OnboardingScreen({ fullName, onComplete }) {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalId, setGoalId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) { setError("Ngày sinh cần đúng định dạng YYYY-MM-DD."); return; }
    if (!gender) { setError("Vui lòng chọn giới tính."); return; }
    if (!h || h < 100 || h > 230) { setError("Chiều cao không hợp lệ (100–230cm)."); return; }
    if (!w || w < 25 || w > 250) { setError("Cân nặng không hợp lệ (25–250kg)."); return; }
    if (!goalId) { setError("Vui lòng chọn mục tiêu."); return; }
    if (!activityId) { setError("Vui lòng chọn mức độ vận động."); return; }
    setBusy(true);
    setError("");
    const err = await onComplete({ dob, gender, heightCm: h, weightKg: w, goalId, activityId });
    setBusy(false);
    if (err) setError(err);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: COLORS.bg }}>
      <form onSubmit={handleSubmit} className="px-6 pt-14 pb-12">
        <span className="block text-[22px] font-extrabold text-fg">Chào {fullName || "bạn"} 👋</span>
        <span className="block text-[13.5px] text-descGray mt-2 leading-[19px]">
          Cho NutriCare biết vài thông tin để tính mục tiêu dinh dưỡng phù hợp nhất.
        </span>

        <div className="flex flex-col gap-4 mt-6">
          <TextField label="Ngày sinh" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="1996-05-14" />
          <SelectField label="Giới tính" value={gender} onChange={setGender} placeholder="Chọn giới tính" options={GENDER_OPTIONS} />

          <div className="flex flex-row gap-3">
            <div className="flex-1 min-w-0"><TextField label="Chiều cao (cm)" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="160" inputMode="numeric" /></div>
            <div className="flex-1 min-w-0"><TextField label="Cân nặng (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="55" inputMode="numeric" /></div>
          </div>

          <SelectField label="Mục tiêu" value={goalId} onChange={setGoalId} placeholder="Chọn mục tiêu" options={GOALS} />
          <SelectField label="Mức độ vận động" value={activityId} onChange={setActivityId} placeholder="Chọn mức độ vận động" options={ACTIVITY_LEVELS} />

          {error ? <span className="text-destructive text-[13px] font-medium">{error}</span> : null}
          <Button onPress={handleSubmit} busy={busy} full>Bắt đầu</Button>
        </div>
      </form>
    </div>
  );
}
