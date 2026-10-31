import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Crown,
  ShieldCheck,
  Lock,
  Copy,
  CheckCheck,
  Clock,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { paymentApi } from "../api/paymentApi";
import { PRICING_PLANS } from "../domain/pricingData";

const CHECKOUT_SESSION_KEY = "nutricare_active_checkout";

export default function PaymentCheckoutView({ billingCycle, onBack, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút
  const [isSuccess, setIsSuccess] = useState(false);

  const pollTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const cycleTitle = billingCycle === "yearly" ? "Gói Năm (12 tháng)" : "Gói Tháng (1 tháng)";

  // 1. Khởi tạo đơn hàng thanh toán hoặc khôi phục từ sessionStorage (tránh mất khi chuyển thiết bị)
  useEffect(() => {
    let isMounted = true;
    const sessionKey = `${CHECKOUT_SESSION_KEY}_${billingCycle}`;

    // Kiểm tra xem đã có đơn hàng hợp lệ còn thời hạn không
    try {
      const cached = sessionStorage.getItem(sessionKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const elapsed = Math.floor((Date.now() - parsed.createdAt) / 1000);
        if (elapsed < 900 && parsed.orderData?.order?.orderCode) {
          setOrderData(parsed.orderData);
          setTimeLeft(900 - elapsed);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(true);
    setError(null);

    paymentApi
      .createOrder(billingCycle)
      .then((res) => {
        if (isMounted) {
          setOrderData(res);
          setLoading(false);
          try {
            sessionStorage.setItem(
              sessionKey,
              JSON.stringify({ orderData: res, createdAt: Date.now() })
            );
          } catch {}
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Không thể tạo đơn hàng thanh toán.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [billingCycle]);

  // 2. Đếm ngược thời gian giữ đơn hàng
  useEffect(() => {
    countdownTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownTimerRef.current);
  }, []);

  // 3. Polling kiểm tra trạng thái đơn hàng thời gian thực
  useEffect(() => {
    if (!orderData?.order?.orderCode || isSuccess) return;

    const checkStatus = async () => {
      try {
        const res = await paymentApi.getOrderStatus(orderData.order.orderCode);
        if (res?.status === "COMPLETED" || res?.isPremium) {
          clearInterval(pollTimerRef.current);
          setIsSuccess(true);
          try {
            sessionStorage.removeItem(`${CHECKOUT_SESSION_KEY}_${billingCycle}`);
          } catch {}
          setTimeout(() => {
            onSuccess();
          }, 2200);
        }
      } catch {
        // Tiếp tục polling
      }
    };

    pollTimerRef.current = setInterval(checkStatus, 2500);
    return () => clearInterval(pollTimerRef.current);
  }, [orderData, isSuccess, onSuccess, billingCycle]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(String(text));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-9 h-9 border-3 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-700">Đang khởi tạo mã thanh toán VietQR...</p>
        <p className="text-xs text-slate-400">Vui lòng chờ trong giây lát</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-3xl border border-rose-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">Không Thể Khởi Tạo Đơn Hàng</h3>
        <p className="text-xs text-slate-500">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
        >
          Quay lại chọn gói
        </button>
      </div>
    );
  }

  const { order, paymentInfo } = orderData || {};

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3.5 animate-in fade-in duration-200">
      {/* Top Header Bar: Gọn gàng, không chiếm chiều cao */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#DCEEE7]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Quay lại chọn gói</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden sm:inline">Mã đơn:</span>
            <span className="font-mono font-extrabold text-[#059669] text-xs px-2.5 py-0.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
              {order?.orderCode}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>
      </div>

      {isSuccess ? (
        /* ================= MÀN HÌNH CHÚC MỪNG KÍCH HOẠT THÀNH CÔNG ================= */
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#DCEEE7] shadow-xl text-center space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Crown className="w-3 h-3 text-amber-600" />
              NÂNG CẤP THÀNH CÔNG
            </span>
            <h3 className="text-xl font-black text-[#0F172A]">Thanh Toán Hoàn Tất!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Hệ thống đã nhận thanh toán đơn hàng <strong className="text-slate-800">{order?.orderCode}</strong>. Đặc quyền NutriCare Pro đã kích hoạt!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Gói dịch vụ:</span>
              <strong className="text-slate-800">{order?.planName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số tiền:</span>
              <strong className="text-[#059669]">
                {Number(order?.amount).toLocaleString("vi-VN")} VNĐ
              </strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">Đang chuyển tiếp về ứng dụng trong giây lát...</p>
        </div>
      ) : (
        /* ================= BỐ CỤC KHÔNG CUỘN (NO-SCROLL LAYOUT) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* CỘT TRÁI: THÔNG TIN GÓI, QUYỀN LỢI & STK DỰ PHÒNG (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-3">
            {/* Card Tóm tắt gói & Quyền lợi */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DCEEE7] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  HỘI VIÊN PRO AI
                </span>
                <span className="text-xs text-slate-500">{cycleTitle}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-base sm:text-lg font-black text-[#0F172A]">{order?.planName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#059669]">
                    {Number(order?.amount).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-xs font-bold text-slate-500">VNĐ</span>
                </div>
              </div>

              {/* 3 Quyền lợi súc tích */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <p className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 stroke-[2.5]" />
                  <span>Quét món ăn bằng camera AI không giới hạn</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 stroke-[2.5]" />
                  <span>Gợi ý & đa dạng hoá thực đơn dinh dưỡng AI</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 stroke-[2.5]" />
                  <span>Vòng lặp tự động cân chỉnh Calo (Feedback Loop)</span>
                </p>
              </div>

              {/* Radar trạng thái thời gian thực */}
              <div className="p-2.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs text-[#065F46]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]" />
                  </span>
                  <span className="font-bold">Đang chờ hệ thống xác nhận thanh toán...</span>
                </div>
                <div className="w-3.5 h-3.5 border-2 border-[#059669] border-t-transparent rounded-full animate-spin shrink-0" />
              </div>
            </div>

            {/* Thông tin chuyển khoản thủ công dự phòng (Gọn gàng, 1-click copy) */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Ngân hàng:</span>
                <span className="font-bold text-slate-800">{paymentInfo?.bankName} ({paymentInfo?.accountName})</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Số tài khoản:</span>
                <div className="flex items-center gap-1.5">
                  <strong className="font-mono text-slate-900 text-sm">{paymentInfo?.bankAccount}</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentInfo?.bankAccount, "stk")}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === "stk" ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Số tiền:</span>
                <div className="flex items-center gap-1.5">
                  <strong className="text-[#059669] font-extrabold text-xs">
                    {Number(paymentInfo?.amount).toLocaleString("vi-VN")} VNĐ
                  </strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentInfo?.amount, "amount")}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                    title="Sao chép số tiền"
                  >
                    {copiedField === "amount" ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" /> Hoàn tiền 14 ngày
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Bảo mật SSL 256-bit
              </span>
            </div>
          </div>

          {/* CỘT PHẢI: POSTER VIETQR ĐẦY ĐỦ ĐÚNG KÍCH THƯỚC THẬT (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[360px] p-2.5 sm:p-3 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-lg flex flex-col items-center">
              <img
                src={paymentInfo?.qrUrl || paymentInfo?.vietQrAppUrl || paymentInfo?.sepayQrUrl}
                alt={`VietQR ${order?.orderCode}`}
                className="w-full h-auto object-contain rounded-2xl block"
                onError={(e) => {
                  if (paymentInfo?.sepayQrUrl && e.currentTarget.src !== paymentInfo.sepayQrUrl) {
                    e.currentTarget.src = paymentInfo.sepayQrUrl;
                  }
                }}
              />
              <p className="mt-2 text-[11px] font-medium text-slate-500 text-center">
                Mở app ngân hàng bất kỳ để quét mã thanh toán tức thì
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
