import React, { useState } from "react";
import { LogOut, User, Edit3 } from "lucide-react";
import { Button, TextField, ModalSheet, ScreenHeader } from "../../../shared/components/ui";
import ProfileHeaderCard from "../components/ProfileHeaderCard";
import ProfileMenuList from "../components/ProfileMenuList";
import DesktopProfileIdentity from "../components/DesktopProfileIdentity";
import DesktopSettingsHub from "../components/DesktopSettingsHub";

export default function ProfileScreen({ user, data, onLogout, onGoTo, onUpdateProfile }) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");

  const handleSaveProfile = () => {
    if (!fullName.trim()) return;
    onUpdateProfile({ fullName: fullName.trim() });
    setEditOpen(false);
  };

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      {/* Top Header */}
      <ScreenHeader
        icon={User}
        title="Trung Tâm Cài Đặt & Cấu Hình Cá Nhân"
        subtitle="Quản lý tài khoản, cấu hình hồ sơ thể trạng, mục tiêu dinh dưỡng và thiết lập ứng dụng"
        right={
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#059669]" />
              <span>Sửa tên hồ sơ</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmLogout(true)}
              className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-xs font-bold text-rose-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Đăng xuất</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
        {/* ================= GIAO DIỆN MÁY TÍNH DÀNH RIÊNG (DESKTOP VIEW: >= 1024px) ================= */}
        {/* Bố cục cấu hình & thiết lập 2 cột, không lặp lại biểu đồ/thống kê từ Dashboard */}
        <div className="hidden lg:flex flex-row items-start gap-8">
          {/* Cột trái: Thẻ định danh tài khoản, Gói Pro, Hạn mức, Đăng xuất */}
          <div className="w-80 xl:w-96 shrink-0">
            <DesktopProfileIdentity
              user={user}
              onEditPress={() => setEditOpen(true)}
              onGoTo={onGoTo}
              onLogoutPress={() => setConfirmLogout(true)}
            />
          </div>

          {/* Cột phải: Bảng Cài đặt & Cấu hình theo danh mục bảo toàn đầy đủ các mục trong UI cũ */}
          <div className="flex-1 min-w-0">
            <DesktopSettingsHub user={user} data={data} onGoTo={onGoTo} />
          </div>
        </div>

        {/* ================= GIAO DIỆN DI ĐỘNG TINH GỌN (MOBILE VIEW: < 1024px) ================= */}
        <div className="block lg:hidden space-y-5">
          <ProfileHeaderCard user={user} onEditPress={() => setEditOpen(true)} />
          <ProfileMenuList user={user} data={data} onGoTo={onGoTo} />

          <Button
            full
            variant="danger"
            icon={LogOut}
            onPress={() => setConfirmLogout(true)}
            className="mt-6"
          >
            Đăng xuất tài khoản
          </Button>
        </div>
      </main>

      {/* Modal chỉnh sửa họ tên */}
      <ModalSheet open={editOpen} onClose={() => setEditOpen(false)} title="Chỉnh Sửa Hồ Sơ">
        <div className="space-y-4">
          <TextField
            label="Họ và tên hiển thị"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên của bạn..."
          />
          <Button
            full
            disabled={!fullName.trim()}
            onPress={handleSaveProfile}
          >
            Lưu Thay Đổi
          </Button>
        </div>
      </ModalSheet>

      {/* Modal xác nhận đăng xuất */}
      <ModalSheet open={confirmLogout} onClose={() => setConfirmLogout(false)} title="Xác Nhận Đăng Xuất">
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản NutriCare trên thiết bị này?
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button
              full
              variant="secondary"
              onPress={() => setConfirmLogout(false)}
            >
              Hủy Bỏ
            </Button>
            <Button
              full
              variant="danger"
              onPress={() => {
                setConfirmLogout(false);
                onLogout();
              }}
            >
              Đăng Xuất
            </Button>
          </div>
        </div>
      </ModalSheet>
    </div>
  );
}
