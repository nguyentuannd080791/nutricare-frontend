import React from "react";
import {
  User,
  Crown,
  Edit3,
  ShieldCheck,
  Sparkles,
  Camera,
  LogOut,
  ArrowRight,
} from "lucide-react";

export default function DesktopProfileIdentity({
  user,
  onEditPress,
  onGoTo,
  onLogoutPress,
}) {
  const initial = (user?.fullName || user?.name || "U")[0]?.toUpperCase();
  const isPremium = Boolean(user?.isPremium);
  const isAdmin = Boolean(user?.isAdmin);

  return (
    <div className="space-y-6">
      {/* Thẻ danh tính cá nhân (Identity Hero Card) */}
      <div className="bg-white rounded-3xl border border-[#DCEEE7] shadow-xs overflow-hidden relative">
        {/* Banner nền gradient */}
        <div className="h-24 bg-gradient-to-r from-emerald-700 via-[#059669] to-teal-700 relative">
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-amber-300 backdrop-blur-xs border border-amber-400/30">
                Admin
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs ${
                isPremium
                  ? "bg-amber-400 text-amber-950 font-black shadow-xs"
                  : "bg-white/20 text-white"
              }`}
            >
              {isPremium ? "NutriCare Pro" : "Thành viên"}
            </span>
          </div>
        </div>

        {/* Nội dung hồ sơ */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar tròn lớn */}
          <div className="-mt-12 mb-3.5 flex items-end justify-between">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-[#047857] text-white flex items-center justify-center text-3xl font-black shadow-md border-4 border-white">
                {initial}
              </div>
              {isPremium && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs border-2 border-white">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onEditPress}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#059669]" />
              <span>Sửa hồ sơ</span>
            </button>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight truncate">
              {user?.fullName || "Người dùng NutriCare"}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{user?.email}</p>
          </div>

          {/* Hạn mức sử dụng tính năng AI & Camera */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#059669]" />
                <span>Quét ảnh món ăn:</span>
              </span>
              <strong className={isPremium ? "text-[#059669]" : "text-slate-800"}>
                {isPremium ? "Không giới hạn" : `${user?.limits?.scan ?? 5} lượt`}
              </strong>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Gợi ý thực đơn AI:</span>
              </span>
              <strong className={isPremium ? "text-[#059669]" : "text-slate-800"}>
                {isPremium ? "Không giới hạn" : `${user?.limits?.aiPlan ?? 5} lượt`}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Thẻ Hội viên & Nâng cấp (Membership Card) */}
      {isPremium ? (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-[#065F46] to-[#047857] text-white shadow-xs space-y-3.5 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-sm tracking-wide">Hội Viên Pro Đang Kích Hoạt</h3>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Bạn đang sở hữu quyền truy cập không giới hạn AI Vision & Feedback Loop nắn chỉnh Calo tự động.
          </p>
          <button
            type="button"
            onClick={() => onGoTo("premium")}
            className="w-full py-2.5 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Quản lý gói Pro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-50 to-teal-50 border border-emerald-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-900">
            <Crown className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm">Nâng Cấp Hội Viên Pro</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mở khóa quét camera không giới hạn & công nghệ Feedback Loop chống chững cân.
          </p>
          <button
            type="button"
            onClick={() => onGoTo("premium")}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#059669] hover:opacity-95 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5 text-amber-200" />
            <span>Xem ưu đãi chỉ từ 82.500đ</span>
          </button>
        </div>
      )}

      {/* Thẻ Bảo Mật & Đăng Xuất (Security & Session) */}
      <div className="p-5 rounded-3xl bg-white border border-[#DCEEE7] shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>Bảo mật tài khoản & Phiên làm việc</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Dữ liệu y tế và chỉ số thể trạng được mã hóa an toàn theo tiêu chuẩn SSL.
        </p>
        <button
          type="button"
          onClick={onLogoutPress}
          className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-rose-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Đăng xuất tài khoản</span>
        </button>
      </div>
    </div>
  );
}

