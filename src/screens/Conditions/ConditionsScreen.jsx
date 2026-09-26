import React, { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Card, Button, EmptyState, ScreenHeader, FixedActionBar, ModalSheet } from "../../components/ui";
import ConditionFormModal from "./components/ConditionFormModal";
import ConditionCard from "./components/ConditionCard";

export default function ConditionsScreen({ data, onBack, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Bệnh nền / Dị ứng" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 120 }}>
        {data.conditions.length === 0 ? (
          <Card className="p-5">
            <EmptyState icon={ShieldCheck} title="Chưa có dữ liệu" desc="Thêm bệnh nền, dị ứng hoặc chỉ định của bác sĩ để hệ thống gợi ý món ăn phù hợp hơn." />
          </Card>
        ) : (
          data.conditions.map((c) => (
            <ConditionCard
              key={c.id}
              condition={c}
              onEdit={() => { setEditing(c); setModalOpen(true); }}
              onDelete={() => setConfirmDelete(c)}
            />
          ))
        )}
      </div>

      <FixedActionBar>
        <Button full icon={Plus} onPress={() => { setEditing(null); setModalOpen(true); }}>Thêm mục mới</Button>
      </FixedActionBar>

      <ConditionFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => { onSave(payload, editing?.id); setModalOpen(false); }}
      />

      <ModalSheet open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Xác nhận xoá">
        <p className="text-[14px] text-[#475569] mb-5 leading-5">Bạn có chắc muốn xoá "{confirmDelete?.name}"? Hành động này không thể hoàn tác.</p>
        <div className="flex flex-row gap-3">
          <Button variant="secondary" className="flex-1" onPress={() => setConfirmDelete(null)}>Huỷ</Button>
          <Button variant="danger" className="flex-1" onPress={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}>Xoá</Button>
        </div>
      </ModalSheet>
    </div>
  );
}
