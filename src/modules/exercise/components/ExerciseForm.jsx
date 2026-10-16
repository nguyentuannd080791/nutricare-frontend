import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button, SelectField, TextField } from "../../../shared/components/ui";
import { validateMinutes } from "../domain/exerciseInput";

export default function ExerciseForm({ catalog, saving, onSubmit }) {
  const [exerciseId, setExerciseId] = useState(null);
  const [minutesText, setMinutesText] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit() {
    const nextErrors = {};
    if (!exerciseId) nextErrors.exercise = "Chọn một bài tập.";
    const minutesError = validateMinutes(minutesText);
    if (minutesError) nextErrors.minutes = minutesError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const added = await onSubmit({ exerciseId, minutes: Number(minutesText.trim()) });
    if (added) setMinutesText("");
  }

  return (
    <div className="flex flex-col gap-3">
      <SelectField
        label="Bài tập"
        value={exerciseId}
        onChange={setExerciseId}
        options={catalog}
        placeholder="Chọn bài tập"
        error={errors.exercise}
      />
      <TextField
        label="Số phút"
        inputMode="numeric"
        placeholder="Ví dụ: 30"
        value={minutesText}
        onChange={(event) => setMinutesText(event.target.value)}
        error={errors.minutes}
      />
      <Button full icon={Plus} busy={saving} onPress={handleSubmit}>
        Thêm bài tập
      </Button>
    </div>
  );
}
