import React, { useState } from "react";
import { LogOut, User } from "lucide-react";
import { Button, TextField, ModalSheet, ScreenHeader } from "../../../shared/components/ui";
import ProfileHeaderCard from "../components/ProfileHeaderCard";
import ProfileMenuList from "../components/ProfileMenuList";

export default function ProfileScreen({ user, data, onLogout, onGoTo, onUpdateProfile }) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      <ScreenHeader
        icon={User}
        title="Hồ Sơ Cá Nhân"
        subtitle="Quản lý tài khoản và thiết lập ứng dụng"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
        <ProfileHeaderCard user={user} onEditPress={() => setEditOpen(true)} />
        <ProfileMenuList user={user} data={data} onGoTo={onGoTo} />

        <Button full variant="danger" icon={LogOut} onPress={() => setConfirmLogout(true)} className="mt-5">Đăng xuất</Button>
      </main>

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
