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

const CHECKOUT_VIEW_STORAGE_KEY = "nutricare_active_checkout_view";

export default function PremiumScreen({ user, onBack, onSetPremium }) {
  // Khôi phục view nếu phiên thanh toán chưa hết hạn (15 phút)
  const [view, setView] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CHECKOUT_VIEW_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.time < 15 * 60 * 1000) {
          return "checkout";
        }
      }
    } catch {}
    return "plans";
  });

  const [billingCycle, setBillingCycle] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CHECKOUT_VIEW_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.billingCycle || "yearly";
      }
    } catch {}
    return "yearly";
  });

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  const handleStartCheckout = (cycle = billingCycle) => {
    setBillingCycle(cycle);
    setView("checkout");
    try {
      sessionStorage.setItem(
        CHECKOUT_VIEW_STORAGE_KEY,
        JSON.stringify({ view: "checkout", billingCycle: cycle, time: Date.now() })
      );
    } catch {}
  };

  const handleBackToPlans = () => {
    try {
      sessionStorage.removeItem(CHECKOUT_VIEW_STORAGE_KEY);
    } catch {}
    setView("plans");
  };

  const handleUpgradeSuccess = async () => {
    try {
      sessionStorage.removeItem(CHECKOUT_VIEW_STORAGE_KEY);
    } catch {}
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
    <div
      className={`flex-1 min-h-0 h-full w-full bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans ${
        view === "checkout" ? "overflow-hidden" : "overflow-y-auto"
      }`}
    >
      {/* Top Header */}
      <ScreenHeader
        title={view === "checkout" ? "Thanh Toán Gói Hội Viên" : "Gói Hội Viên NutriCare Pro"}
        icon={Crown}
        subtitle={
          view === "checkout"
            ? "Quét mã VietQR chuyển khoản tự động, kích hoạt tức thì"
            : "Mở khoá sức mạnh AI không giới hạn & công nghệ cân chỉnh Calo tự động"
        }
        onBack={view === "checkout" ? handleBackToPlans : onBack}
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
      <main
        className={`flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 ${
          view === "checkout"
            ? "py-2 sm:py-3 flex flex-col justify-center max-h-full overflow-hidden"
            : "space-y-8 pb-24"
        }`}
      >
        {view === "checkout" ? (
          /* ================= GIAO DIỆN THANH TOÁN VIETQR ================= */
          <PaymentCheckoutView
            billingCycle={billingCycle}
            onBack={handleBackToPlans}
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
              onOpenCheckout={() => handleStartCheckout(billingCycle)}
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

            {/* Bảng so sánh tính năng chuyên sâu */}
            <FeatureComparisonTable />

            {/* Câu hỏi thường gặp */}
            <PremiumFaqAccordion />
          </>
        )}
      </main>

      {/* Modal xác nhận huỷ gói */}
      {confirmCancel && (
        <ModalSheet
          title="Xác Nhận Hủy Gói Pro"
          isOpen={confirmCancel}
          onClose={() => setConfirmCancel(false)}
        >
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn hủy gói Hội viên NutriCare Pro không? Sau khi hủy, tài khoản sẽ chuyển về gói Miễn phí và bạn sẽ mất quyền truy cập vào các tính năng nâng cao (quét món ăn bằng camera AI, đa dạng hóa món AI và vòng lặp phản hồi calo tự động).
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
                Giữ gói Pro
              </Button>
              <Button variant="danger" onClick={handleConfirmCancel}>
                Xác nhận hủy
              </Button>
            </div>
          </div>
        </ModalSheet>
      )}

      {/* Modal xem lịch sử giao dịch */}
      {historyOpen && <PaymentHistoryModal onClose={() => setHistoryOpen(false)} />}
    </div>
  );
}
