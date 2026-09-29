import React, { useState } from "react";
import { Button, TextField, ModalSheet } from "../../../components/ui";

/** Trách nhiệm duy nhất: form nhập cân nặng mới. Chiều cao đã khai báo lần đầu và không đổi. */
export default function AddBmiModal({ open, onClose, onSubmit }) {
  const [weight, setWeight] = useState("");

  function submit() {
    const w = Number(weight);
    if (!w) return;
    onSubmit({ weightKg: w });
    setWeight("");
  }

  return (
    <ModalSheet open={open} onClose={onClose} title="Cập nhật cân nặng">
      <div className="flex flex-col gap-[14px]">
        <TextField label="Cân nặng (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="VD: 58" inputMode="numeric" />
        <span className="text-[11.5px] text-placeholderGray leading-4">
          Hệ thống chỉ tạo lại mục tiêu dinh dưỡng khi cân nặng thay đổi đủ ngưỡng và đã qua thời gian tối thiểu kể từ lần cập nhật mục tiêu gần nhất.
        </span>
        <Button full onPress={submit} disabled={!weight}>Lưu cân nặng</Button>
      </div>
    </ModalSheet>
  );
}
