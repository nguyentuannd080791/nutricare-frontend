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
  Zap,
} from "lucide-react";
import { paymentApi } from "../api/paymentApi";
import { PRICING_PLANS } from "../domain/pricingData";

export default function PaymentCheckoutView({ billingCycle, onBack, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const pollTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const selectedPlan =
    billingCycle === "yearly" ? PRICING_PLANS.premium.priceYearly : PRICING_PLANS.premium.priceMonthly;
  const cycleTitle = billingCycle === "yearly" ? "Gói Năm (12 tháng)" : "Gói Tháng (1 tháng)";

  // 1. Khởi tạo đơn hàng SePay qua API backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    paymentApi
      .createOrder(billingCycle)
      .then((res) => {
        if (isMounted) {
          setOrderData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Không thể tạo đơn hàng thanh toán SePay.");
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

  // 3. Polling kiểm tra trạng thái đơn hàng thời gian thực qua SePay webhook
  useEffect(() => {
    if (!orderData?.order?.orderCode || isSuccess) return;

    const checkStatus = async () => {
      try {
        const res = await paymentApi.getOrderStatus(orderData.order.orderCode);
        if (res?.status === "COMPLETED" || res?.isPremium) {
          clearInterval(pollTimerRef.current);
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 2500);
        }
      } catch {
        // Tiếp tục polling
      }
    };

    pollTimerRef.current = setInterval(checkStatus, 2500);
    return () => clearInterval(pollTimerRef.current);
  }, [orderData, isSuccess, onSuccess]);

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

  // Giả lập thanh toán tức thì trong môi trường Test / Sandbox
  const handleSimulateTestPayment = async () => {
    if (!orderData?.order?.orderCode || isSimulating) return;
    setIsSimulating(true);
    try {
      await paymentApi.simulateSuccess(orderData.order.orderCode);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err) {
      alert(err?.message || "Lỗi giả lập thanh toán");
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-700">Đang khởi tạo cổng thanh toán SePay...</p>
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DCEEE7]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Quay lại chọn gói khác</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Mã đơn hàng:</span>
          <span className="font-mono font-extrabold text-[#059669] text-xs px-2.5 py-1 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
            {order?.orderCode}
          </span>
        </div>
      </div>

      {isSuccess ? (
        /* ================= MÀN HÌNH CHÚC MỪNG KÍCH HOẠT THÀNH CÔNG ================= */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#DCEEE7] shadow-xl text-center space-y-5 max-w-lg mx-auto animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Crown className="w-3.5 h-3.5" />
              NÂNG CẤP THÀNH CÔNG
            </span>
            <h3 className="text-2xl font-black text-[#0F172A]">Thanh Toán Hoàn Tất!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Cổng thanh toán SePay đã xác nhận thành công đơn hàng{" "}
              <strong className="text-slate-800">{order?.orderCode}</strong>. Toàn bộ đặc quyền Hội
              viên NutriCare Pro đã được mở khóa!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Gói dịch vụ:</span>
              <strong className="text-slate-800">{order?.planName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số tiền thanh toán:</span>
              <strong className="text-[#059669]">
                {Number(order?.amount).toLocaleString("vi-VN")} VNĐ
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái:</span>
              <strong className="text-emerald-700">Đã kích hoạt</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">Đang chuyển tiếp về ứng dụng trong giây lát...</p>
        </div>
      ) : (
        /* ================= GIAO DIỆN THANH TOÁN SEPAY VIETQR ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: TÓM TẮT ĐƠN HÀNG & HƯỚNG DẪN */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#DCEEE7] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chi tiết đơn hàng
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  PRO AI
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-[#0F172A]">{order?.planName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{cycleTitle}</p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#059669]">
                    {Number(order?.amount).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-sm font-bold text-slate-500">VNĐ</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-medium">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Đơn hàng hết hạn sau:</span>
                </div>
                <span className="font-mono font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* Đặc quyền kích hoạt */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Đặc quyền được kích hoạt ngay:</span>
                </p>
                <div className="space-y-1.5 pl-1 text-[11.5px]">
                  <p className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span>Quét món ăn bằng camera AI không giới hạn</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span>Gợi ý & đa dạng hoá thực đơn AI không giới hạn</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span>Vòng lặp phản hồi Calo tự động (Feedback Loop Engine)</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" /> Hoàn tiền 14 ngày
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Bảo mật SSL
                </span>
              </div>
            </div>

            {/* Hướng dẫn thanh toán 3 bước */}
            <div className="p-5 rounded-3xl bg-[#F0F8F6] border border-[#DCEEE7] space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hướng dẫn thanh toán tự động SePay
              </h4>
              <ol className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Mở app ngân hàng bất kỳ (MB, Vietcombank, Techcombank, Momo...)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Quét mã QR bên cạnh hoặc chuyển khoản theo đúng thông tin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Hệ thống SePay tự động nhận diện nội dung và kích hoạt Pro sau 3 - 5 giây
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* CỘT PHẢI: MÃ QR SEPAY & THÔNG TIN CHUYỂN KHOẢN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#059669] shadow-xl space-y-6 relative overflow-hidden">
              {/* Radar status */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#065F46]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]" />
                  </span>
                  <span className="font-bold">Đang chờ cổng SePay xác nhận chuyển khoản...</span>
                </div>
                <div className="w-4 h-4 border-2 border-[#059669] border-t-transparent rounded-full animate-spin shrink-0" />
              </div>

              {/* QR & Bank Information */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* QR Code Container */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 p-2.5 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex items-center justify-center shrink-0">
                  <img
                    src={paymentInfo?.qrUrl || paymentInfo?.vietQrAppUrl || paymentInfo?.sepayQrUrl}
                    alt={`SePay VietQR ${order?.orderCode}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      if (paymentInfo?.sepayQrUrl && e.currentTarget.src !== paymentInfo.sepayQrUrl) {
                        e.currentTarget.src = paymentInfo.sepayQrUrl;
                      }
                    }}
                  />
                </div>

                {/* Bank Information Details */}
                <div className="w-full space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <strong className="text-slate-900 font-bold">{paymentInfo?.bankName}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="font-mono text-slate-900 text-sm">
                        {paymentInfo?.bankAccount}
                      </strong>
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

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Chủ tài khoản:</span>
                    <strong className="text-slate-900 uppercase">{paymentInfo?.accountName}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Số tiền:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#059669] font-extrabold text-sm">
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

                  {/* Transfer memo (Cực kỳ quan trọng) */}
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900 uppercase">
                        Nội dung chuyển khoản (bắt buộc):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentInfo?.transferContent, "memo")}
                        className="p-1 hover:bg-amber-200/80 rounded text-amber-800 cursor-pointer flex items-center gap-1 font-bold text-[10px]"
                      >
                        {copiedField === "memo" ? (
                          <>
                            <CheckCheck className="w-3 h-3 text-emerald-700" />
                            <span className="text-emerald-700">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-sm sm:text-base font-black text-[#059669] tracking-wider select-all">
                      {paymentInfo?.transferContent}
                    </p>
                    <p className="text-[10px] text-amber-800 leading-tight">
                      * Giữ nguyên mã này trong nội dung chuyển tiền để SePay tự động kích hoạt gói.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dev / Test Sandbox Trigger Button */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={handleSimulateTestPayment}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#059669] border-t-transparent rounded-full animate-spin" />
                      <span>Đang kiểm tra SePay IPN...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>⚡ Giả lập thanh toán thành công (Môi trường Test / Sandbox)</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-slate-400">
                  Nút trên mô phỏng Webhook của SePay gửi tín hiệu xác nhận thành công mà không cần chuyển tiền thật.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

