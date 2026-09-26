import React, { useState } from "react";
import { Button, TextField, ModalSheet } from "../../../components/ui";

/** Trách nhiệm duy nhất: form nhập chiều cao/cân nặng để thêm bản ghi BMI mới. */
export default function AddBmiModal({ open, onClose, onSubmit }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  function submit() {
    const h = Number(height), w = Number(weight);
    if (!h || !w) return;
    onSubmit({ heightCm: h, weightKg: w });
    setHeight(""); setWeight("");
  }

  return (
    <ModalSheet open={open} onClose={onClose} title="Thêm chỉ số BMI">
      <div className="flex flex-col gap-[14px]">
        <TextField label="Chiều cao (cm)" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="VD: 165" inputMode="numeric" />
        <TextField label="Cân nặng (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="VD: 58" inputMode="numeric" />
        <span className="text-[11.5px] text-placeholderGray leading-4">
          Hệ thống chỉ tạo lại mục tiêu dinh dưỡng khi cân nặng thay đổi đủ ngưỡng và đã qua thời gian tối thiểu kể từ lần cập nhật mục tiêu gần nhất.
        </span>
        <Button full onPress={submit} disabled={!height || !weight}>Lưu chỉ số</Button>
      </div>
    </ModalSheet>
  );
}
