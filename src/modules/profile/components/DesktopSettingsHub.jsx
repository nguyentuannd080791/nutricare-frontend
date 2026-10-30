import React from "react";
import {
  Scale,
  Flame,
  ShieldAlert,
  History,
  Crown,
  Bell,
  Apple,
  Activity,
  BarChart3,
  Users,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react";
import { classifyBMI } from "../../../shared/domain/bmi";
import { GOALS } from "../../../shared/domain/constants";

/**
 * Trách nhiệm duy nhất (SRP):
 * Trung tâm Cấu hình & Cài đặt thông tin tài khoản trên Desktop.
 * Không lặp lại biểu đồ/thống kê từ Dashboard mà tập trung vào hiển thị
 * trạng thái cấu hình hiện tại và nút hành động tương ứng.
 */
export default function DesktopSettingsHub({ user, data, onGoTo }) {
  const latestBMI = data?.bmiRecords?.[0];
  const activeTarget = data?.targets?.find((t) => t.isActive);
  const planCount = data?.mealPlans?.length || 0;
  const conditions = data?.conditions || [];
  const isPremium = Boolean(user?.isPremium);
  const isAdmin = Boolean(user?.isAdmin);

  const bmiClassification = latestBMI ? classifyBMI(latestBMI.bmi) : null;
  const goalObj = activeTarget ? GOALS.find((g) => g.id === activeTarget.goalId) : null;

  // 1. Nhóm cấu hình thể trạng & dinh dưỡng
  const healthSettings = [
    {
      id: "bmi",
      label: "Chỉ số BMI & Cân nặng",
      description: "Theo dõi chỉ số khối cơ thể, chiều cao và cân nặng chuẩn y khoa",
      icon: Scale,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-100",
      currentValue: latestBMI
        ? `${latestBMI.bmi.toFixed(1)} · ${bmiClassification?.label || "Bình thường"}`
        : "Chưa có dữ liệu",
      valueColor: bmiClassification ? bmiClassification.color : "#64748B",
      actionText: "Cập nhật",
      onAction: () => onGoTo("bmi"),
    },
    {
      id: activeTarget ? "target-detail" : "target-create",
      label: "Mục tiêu Dinh dưỡng & Calo",
      description: "Năng lượng mỗi ngày, tốc độ điều chỉnh cân nặng và tỉ lệ Carb/Đạm/Béo",
      icon: Flame,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      currentValue: activeTarget
        ? `${activeTarget.calories.toLocaleString("vi-VN")} kcal/ngày · ${goalObj?.label || "Mục tiêu"}`
        : "Chưa thiết lập mục tiêu",
      valueColor: activeTarget ? "#D97706" : "#64748B",
      actionText: activeTarget ? "Chỉnh sửa" : "Thiết lập",
      onAction: () => onGoTo(activeTarget ? "target-detail" : "target-create"),
    },
    {
      id: "conditions",
      label: "Bệnh nền & Dị ứng thực phẩm",
      description: "Bộ lọc tự động loại trừ món ăn kích ứng theo 17 danh mục bệnh lý chuẩn NIN",
      icon: ShieldAlert,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      currentValue:
        conditions.length > 0 ? `${conditions.length} mục đã khai báo` : "Chưa có bệnh nền / dị ứng",
      valueColor: conditions.length > 0 ? "#4F46E5" : "#64748B",
      actionText: "Quản lý",
      onAction: () => onGoTo("conditions"),
    },
    {
      id: "plan-history",
      label: "Lịch sử & Chu kỳ Thực đơn",
      description: "Quản lý các thực đơn đã tạo, thực đơn đang áp dụng và hoán đổi món ăn",
      icon: History,
      iconColor: "text-[#059669]",
      iconBg: "bg-emerald-50 border-emerald-100",
      currentValue: planCount > 0 ? `${planCount} thực đơn đã lưu` : "Chưa có thực đơn nào",
      valueColor: planCount > 0 ? "#059669" : "#64748B",
      actionText: "Xem danh sách",
      onAction: () => onGoTo("plan-history"),
    },
  ];

  // 2. Nhóm cài đặt tiện ích & lối sống
  const appPreferences = [
    {
      id: "reminders",
      label: "Nhắc nhở bữa ăn & Nước uống",
      description: "Cài đặt giờ chuông báo các bữa ăn chính, ăn phụ và nhắc uống đủ nước",
      icon: Bell,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50 border-violet-100",
      currentValue: "Đang kích hoạt thông báo",
      valueColor: "#7C3AED",
      actionText: "Cài đặt giờ",
      onAction: () => onGoTo("reminders"),
    },
    {
      id: "foods",
      label: "Kho Thực Phẩm Viện Dinh Dưỡng",
      description: "Tra cứu dữ liệu 1.247 món ăn và 847 thực phẩm chuẩn NIN với đầy đủ vi chất",
      icon: Apple,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      currentValue: "1.247 món & 847 thực phẩm",
      valueColor: "#059669",
      actionText: "Tra cứu",
      onAction: () => onGoTo("foods"),
    },
    {
      id: "exercise",
      label: "Nhật ký Thể thao & Tiêu hao (MET)",
      description: "Theo dõi 17 bộ môn thể thao với hệ số tiêu hao năng lượng MET theo cân nặng",
      icon: Activity,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50 border-cyan-100",
      currentValue: "17 bộ môn thể thao",
      valueColor: "#0891B2",
      actionText: "Ghi nhận",
      onAction: () => onGoTo("exercise"),
    },
  ];

  // 3. Nhóm gói dịch vụ & quyền lợi
  const subscriptionSettings = [
    {
      id: "premium",
      label: "Gói Dịch Vụ & Hạn Mức Tính Năng",
      description: isPremium
        ? "Tài khoản NutriCare Pro: Không giới hạn quét camera, AI và tự động nắn chỉnh Calo"
        : `Gói cơ bản: Còn lại ${user?.limits?.scan ?? 5} lượt quét ảnh & ${user?.limits?.aiPlan ?? 5} lượt tạo thực đơn AI`,
      icon: Crown,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50 border-amber-100",
      currentValue: isPremium ? "Hội viên Pro (Active)" : "Gói Miễn Phí (Free)",
      valueColor: isPremium ? "#059669" : "#D97706",
      actionText: isPremium ? "Quản lý gói" : "Nâng cấp Pro",
      onAction: () => onGoTo("premium"),
    },
  ];

  // 4. Nhóm quản trị hệ thống (Admin Console)
  const adminSettings = [
    {
      id: "admin-dashboard",
      label: "Thống Kê Quản Trị Hệ Thống",
      description: "Báo cáo tăng trưởng người dùng mới, số lượng thực đơn và tỉ lệ tuân thủ",
      icon: BarChart3,
      iconColor: "text-amber-400",
      iconBg: "bg-slate-800 border-slate-700",
      currentValue: "Quyền Quản Trị Cấp Cao",
      valueColor: "#F59E0B",
      actionText: "Mở Dashboard",
      onAction: () => onGoTo("admin-dashboard"),
    },
    {
      id: "admin-users",
      label: "Quản Lý Danh Sách Người Dùng",
      description: "Xem hồ sơ, lịch sử BMI, bệnh nền, mục tiêu và nhật ký dinh dưỡng người dùng",
      icon: Users,
      iconColor: "text-emerald-400",
      iconBg: "bg-slate-800 border-slate-700",
      currentValue: "Toàn quyền tra cứu",
      valueColor: "#10B981",
      actionText: "Quản lý",
      onAction: () => onGoTo("admin-users"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KHỐI 1: CẤU HÌNH THỂ TRẠNG & DINH DƯỠNG */}
      <div className="bg-white rounded-3xl border border-[#DCEEE7] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#059669]" />
              <span>Cấu Hình Hồ Sơ Thể Trạng & Dinh Dưỡng</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập chỉ số nhân trắc học, mục tiêu calo, bệnh lý và kế hoạch thực đơn
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {healthSettings.map((item) => (
            <div
              key={item.id}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2.5 rounded-2xl transition-colors group"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.iconColor} border flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#059669] transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 max-w-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <span
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100/80 truncate max-w-[200px]"
                  style={{ color: item.valueColor }}
                >
                  {item.currentValue}
                </span>

                <button
                  type="button"
                  onClick={item.onAction}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#059669] hover:bg-[#ECFDF5] text-[#059669] font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI 2: CÀI ĐẶT ỨNG DỤNG & TIỆN ÍCH */}
      <div className="bg-white rounded-3xl border border-[#DCEEE7] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Bell className="w-4 h-4 text-violet-600" />
              <span>Cài Đặt Ứng Dụng & Tiện Ích Thói Quen</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Lịch nhắc nhở giờ sinh học, tra cứu dữ liệu thực phẩm NIN và bài tập thể thao
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {appPreferences.map((item) => (
            <div
              key={item.id}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2.5 rounded-2xl transition-colors group"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.iconColor} border flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#059669] transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 max-w-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <span
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100/80 truncate max-w-[200px]"
                  style={{ color: item.valueColor }}
                >
                  {item.currentValue}
                </span>

                <button
                  type="button"
                  onClick={item.onAction}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#059669] hover:bg-[#ECFDF5] text-[#059669] font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI 3: GÓI DỊCH VỤ & HẠN MỨC TÍNH NĂNG */}
      <div className="bg-white rounded-3xl border border-[#DCEEE7] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Gói Hội Viên & Hạn Mức Dịch Vụ</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý gói tài khoản, gia hạn hội viên và số lượt tính năng AI khả dụng
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {subscriptionSettings.map((item) => (
            <div
              key={item.id}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2.5 rounded-2xl transition-colors group"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.iconColor} border flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#059669] transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 max-w-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <span
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100/80 truncate max-w-[200px]"
                  style={{ color: item.valueColor }}
                >
                  {item.currentValue}
                </span>

                <button
                  type="button"
                  onClick={item.onAction}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#059669] hover:opacity-95 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI 4: QUẢN TRỊ HỆ THỐNG (CHỈ HIỆN KHI LÀ ADMIN) */}
      {isAdmin && (
        <div className="bg-slate-900 rounded-3xl border border-slate-700/80 p-6 shadow-md space-y-4 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  ADMINISTRATION
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Bảng Điều Hành Quản Trị Hệ Thống
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Các chức năng quản trị cấp cao dành riêng cho tài khoản Quản trị viên
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {adminSettings.map((item) => (
              <div
                key={item.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/50 p-2.5 rounded-2xl transition-colors group"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.iconColor} border flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 max-w-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 shrink-0">
                  <span
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700 truncate"
                  >
                    {item.currentValue}
                  </span>

                  <button
                    type="button"
                    onClick={item.onAction}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>{item.actionText}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

