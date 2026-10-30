import React, { useState, useEffect } from "react";
import {
  X,
  QrCode,
  Smartphone,
  CreditCard,
  Copy,
  CheckCheck,
  Clock,
  ShieldCheck,
  Lock,
  Crown,
  Check,
} from "lucide-react";
import { PRICING_PLANS } from "../domain/pricingData";

export default function PaymentCheckoutModal({ billingCycle, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("vietqr"); // vietqr | momo | card
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [orderCode] = useState(() => `NUTRI${Math.floor(100000 + Math.random() * 900000)}`);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút
  const [isSuccess, setIsSuccess] = useState(false);

  const price =
    billingCycle === "yearly"
      ? PRICING_PLANS.premium.priceYearly
      : PRICING_PLANS.premium.priceMonthly;

  const cycleText = billingCycle === "yearly" ? "Gói Năm (12 tháng)" : "Gói Tháng (1 tháng)";

  // Đếm ngược thời gian giữ chỗ thanh toán
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Giả lập xác thực giao dịch qua cổng thanh toán
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    }, 1800);
  };

  // URL VietQR chuẩn liên ngân hàng
  const qrUrl = `https://img.vietqr.io/image/MB-09888886886-compact2.png?amount=${price}&addInfo=${encodeURIComponent(
    orderCode
  )}&accountName=NUTRICARE`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-[#059669] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Kích Hoạt Gói Hội Viên Pro</h3>
              <p className="text-xs text-emerald-100">{cycleText}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-xl font-extrabold text-[#0F172A]">Thanh Toán Thành Công!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Tài khoản của bạn đã được nâng cấp lên Hội viên NutriCare Pro. Vui lòng chờ giây lát...
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Countdown notice */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Mã giao dịch có hiệu lực trong:</span>
              </div>
              <span className="font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                {formatTimer(timeLeft)}
              </span>
            </div>

            {/* Payment Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("vietqr")}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "vietqr"
                    ? "bg-[#ECFDF5] border-[#059669] text-[#065F46] shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>VietQR Chuyển Khoản</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("momo")}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "momo"
                    ? "bg-pink-50 border-pink-500 text-pink-700 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Ví MoMo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Thẻ Quốc Tế</span>
              </button>
            </div>

            {/* VietQR View */}
            {paymentMethod === "vietqr" && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
                    <img
                      src={qrUrl}
                      alt="VietQR NutriCare"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs flex-1 w-full">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-slate-500">Ngân hàng:</span>
                      <strong className="text-slate-800">MBBank (Quân Đội)</strong>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-slate-500">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-slate-900">0988 888 6886</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy("09888886886", "stk")}
                          className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-500"
                          title="Sao chép số tài khoản"
                        >
                          {copiedKey === "stk" ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-slate-500">Chủ tài khoản:</span>
                      <strong className="text-slate-800">NUTRICARE CORP</strong>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-slate-500">Nội dung CK:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-[#059669]">{orderCode}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(orderCode, "memo")}
                          className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-500"
                          title="Sao chép nội dung chuyển khoản"
                        >
                          {copiedKey === "memo" ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 font-bold">
                      <span className="text-slate-700">Số tiền:</span>
                      <span className="text-sm font-extrabold text-[#059669]">
                        {price.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MoMo View */}
            {paymentMethod === "momo" && (
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center mx-auto font-bold text-xs shadow-xs">
                  MOMO
                </div>
                <p className="text-xs text-pink-900 font-semibold">
                  Mã QR và phiên kết nối MoMo bảo mật đang sẵn sàng.
                </p>
                <p className="text-[11px] text-pink-700">
                  Số tiền thanh toán: <strong>{price.toLocaleString("vi-VN")} VNĐ</strong>
                </p>
              </div>
            )}

            {/* Card View */}
            {paymentMethod === "card" && (
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  placeholder="Số thẻ (16 chữ số Visa / MasterCard)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]/30"
                  defaultValue="4242 •••• •••• 4242"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]/30"
                    defaultValue="12/28"
                  />
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="CVC / CVV"
                    className="p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]/30"
                    defaultValue="888"
                  />
                </div>
              </div>
            )}

            {/* Trust guarantees */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" /> Hoàn tiền trong 14 ngày
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Mã hóa SSL 256-bit
              </span>
            </div>

            {/* Action Submit */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmPayment}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-[#059669] to-[#047857] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xác thực giao dịch...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-amber-200" />
                  <span>Xác Nhận Thanh Toán {price.toLocaleString("vi-VN")} VNĐ</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

