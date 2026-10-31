import React, { useState } from "react";
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Lock,
  RotateCcw,
  Database,
  Check,
  Receipt,
} from "lucide-react";
import { ScreenHeader, ModalSheet, Button } from "../../../shared/components/ui";
import ActivePremiumBanner from "../components/ActivePremiumBanner";
import PricingComparisonCards from "../components/PricingComparisonCards";
import PaymentCheckoutView from "../components/PaymentCheckoutView";
import PaymentHistoryModal from "../components/PaymentHistoryModal";
import FeatureComparisonTable from "../components/FeatureComparisonTable";
import PremiumFaqAccordion from "../components/PremiumFaqAccordion";

export default function PremiumScreen({ user, onBack, onSetPremium }) {
  const [view, setView] = useState("plans"); // "plans" | "checkout"
  const [billingCycle, setBillingCycle] = useState("yearly"); // "monthly" | "yearly"
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  const handleUpgradeSuccess = async () => {
    setView("plans");
    try {
      if (typeof onSetPremium === "function") {
        await onSetPremium(true);
      }
      setSuccessNotice("Chúc mừng bạn đã kích hoạt thành công gói Hội viên NutriCare Pro!");
      setTimeout(() => {
        setSuccessNotice(null);
      }, 6000);
    } catch {
      // Handled by parent
    }
  };

  const handleConfirmCancel = async () => {
    setConfirmCancel(false);
    if (typeof onSetPremium === "function") {
      await onSetPremium(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      {/* Top Header */}
      <ScreenHeader
        title={view === "checkout" ? "Thanh Toán Gói Hội Viên" : "Gói Hội Viên NutriCare Pro"}
        icon={Crown}
        subtitle={
          view === "checkout"
            ? "Thanh toán tự động qua cổng SePay với mã VietQR"
            : "Mở khoá sức mạnh AI không giới hạn & công nghệ cân chỉnh Calo tự động"
        }
        onBack={view === "checkout" ? () => setView("plans") : onBack}
        right={
          <div className="flex items-center gap-2">
            {successNotice && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-xl text-xs font-bold animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>{successNotice}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Lịch sử thanh toán</span>
            </button>
          </div>
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24">
        {view === "checkout" ? (
          /* ================= GIAO DIỆN THANH TOÁN SEPAY CHUYÊN BIỆT ================= */
          <PaymentCheckoutView
            billingCycle={billingCycle}
            onBack={() => setView("plans")}
            onSuccess={handleUpgradeSuccess}
          />
        ) : (
          /* ================= GIAO DIỆN CHỌN GÓI & SO SÁNH QUYỀN LỢI ================= */
          <>
            {/* Banner dành riêng cho tài khoản đã có Premium */}
            {user?.isPremium && (
              <ActivePremiumBanner
                user={user}
                onRequestCancel={() => setConfirmCancel(true)}
                onOpenHistory={() => setHistoryOpen(true)}
              />
            )}

            {/* Hero Pitch */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Đồng hành cùng 12.000+ người ăn uống lành mạnh & khoa học
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Chọn Gói Phù Hợp Cho Mục Tiêu Thể Trạng & Vóc Dáng Của Bạn
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bắt đầu miễn phí trọn đời hoặc bứt phá với công nghệ AI tự động hóa thực đơn & Vòng lặp phản hồi Calo (Feedback Loop Engine).
              </p>
            </div>

            {/* 2 Main Pricing Cards */}
            <PricingComparisonCards
              user={user}
              billingCycle={billingCycle}
              onSelectCycle={setBillingCycle}
              onOpenCheckout={() => setView("checkout")}
              onRequestCancel={() => setConfirmCancel(true)}
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#059669] mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-[#0F172A]">Hoàn Tiền 14 Ngày</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">100% nếu không hài lòng</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs">
                <Lock className="w-6 h-6 text-[#0284C7] mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-[#0F172A]">Bảo Mật Dữ Liệu</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Mã hóa chuẩn SSL</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs">
                <RotateCcw className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-[#0F172A]">Hủy Bất Kỳ Lúc Nào</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Không cam kết ràng buộc</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs">
                <Database className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-[#0F172A]">Dữ Liệu Chuẩn NIN</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">1.247 món & 847 thực phẩm</p>
              </div>
            </div>

            {/* Deep Dive Feature Comparison Table */}
            <FeatureComparisonTable />

            {/* FAQ Accordion */}
            <PremiumFaqAccordion />
          </>
        )}
      </main>

      {/* Modal Lịch sử thanh toán & hóa đơn */}
      <PaymentHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Confirmation Modal: Cancel Premium */}
      <ModalSheet
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Xác Nhận Hủy Gói Pro"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Bạn sẽ quay trở lại giới hạn 5 lượt quét món ăn bằng camera và 5 lượt tạo thực đơn AI. Vòng lặp phản hồi Calo tự động (Feedback Loop) sẽ tạm dừng hoạt động. Bạn có chắc chắn muốn hủy?
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button
              full
              variant="secondary"
              onPress={() => setConfirmCancel(false)}
            >
              Giữ Gói Pro
            </Button>
            <Button
              full
              variant="danger"
              onPress={handleConfirmCancel}
            >
              Xác Nhận Hủy
            </Button>
          </div>
        </div>
      </ModalSheet>
    </div>
  );
}
