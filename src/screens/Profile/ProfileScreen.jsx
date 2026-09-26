import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Button, TextField, ModalSheet } from "../../components/ui";
import ProfileHeaderCard from "./components/ProfileHeaderCard";
import ProfileMenuList from "./components/ProfileMenuList";

export default function ProfileScreen({ user, data, onLogout, onGoTo, onUpdateProfile }) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto" style={{ backgroundColor: COLORS.bg }}>
      <div className="px-5" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <span className="block text-[20px] font-bold text-fg mb-4">Cá nhân</span>

        <ProfileHeaderCard user={user} onEditPress={() => setEditOpen(true)} />
        <ProfileMenuList user={user} data={data} onGoTo={onGoTo} />

        <Button full variant="danger" icon={LogOut} onPress={() => setConfirmLogout(true)} className="mt-5">Đăng xuất</Button>
      </div>

      <ModalSheet open={editOpen} onClose={() => setEditOpen(false)} title="Chỉnh sửa hồ sơ">
        <div className="flex flex-col gap-[14px]">
          <TextField label="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Button full disabled={!fullName.trim()} onPress={() => { onUpdateProfile({ fullName: fullName.trim() }); setEditOpen(false); }}>Lưu thay đổi</Button>
        </div>
      </ModalSheet>

      <ModalSheet open={confirmLogout} onClose={() => setConfirmLogout(false)} title="Đăng xuất">
        <p className="text-[14px] text-[#475569] mb-5 leading-5">Bạn có chắc muốn đăng xuất khỏi tài khoản này?</p>
        <div className="flex flex-row gap-3">
          <Button variant="secondary" className="flex-1" onPress={() => setConfirmLogout(false)}>Huỷ</Button>
          <Button variant="danger" className="flex-1" onPress={() => { setConfirmLogout(false); onLogout(); }}>Đăng xuất</Button>
        </div>
      </ModalSheet>
    </div>
  );
}
