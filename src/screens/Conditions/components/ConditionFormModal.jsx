import React, { useEffect, useState } from "react";
import { Button, TextField, SelectField, ModalSheet } from "../../../components/ui";
import { CONDITION_TYPES } from "../../../domain/constants";

/** Trách nhiệm duy nhất: form thêm/sửa 1 bệnh nền / dị ứng. */
export default function ConditionFormModal({ open, onClose, onSave, initial }) {
  const [name, setName] = useState(initial?.name || "");
  const [type, setType] = useState(initial?.type || "");

  useEffect(() => {
    setName(initial?.name || "");
    setType(initial?.type || "");
  }, [initial, open]);

  return (
    <ModalSheet open={open} onClose={onClose} title={initial ? "Chỉnh sửa mục" : "Thêm mới"}>
      <div className="flex flex-col gap-[14px]">
        <TextField label="Tên bệnh / dị ứng / chỉ định" placeholder="VD: Tiểu đường type 2" value={name} onChange={(e) => setName(e.target.value)} />
        <SelectField label="Loại" value={type} onChange={setType} placeholder="Chọn loại" options={CONDITION_TYPES.map((c) => ({ id: c.id, label: c.label }))} />
        <Button full disabled={!name.trim() || !type} onPress={() => onSave({ name: name.trim(), type })}>Lưu</Button>
      </div>
    </ModalSheet>
  );
}
