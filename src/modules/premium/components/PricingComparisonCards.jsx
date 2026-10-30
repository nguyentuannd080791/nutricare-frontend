import React from "react";
import { Check, X, Sparkles, Crown, ArrowRight } from "lucide-react";
import { PRICING_PLANS } from "../domain/pricingData";

export default function PricingComparisonCards({
  user,
  billingCycle,
  onSelectCycle,
  onOpenCheckout,
  onRequestCancel,
}) {
  const freePlan = PRICING_PLANS.free;
  const premiumPlan = PRICING_PLANS.premium;

  const premiumPrice =
    billingCycle === "yearly" ? premiumPlan.priceYearly : premiumPlan.priceMonthly;

  const isUserPremium = Boolean(user?.isPremium);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* ================= CARD 1: GÓI MIỄN PHÍ (FREE TIER) ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between relative hover:border-slate-300 transition-all">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cơ bản & Trải nghiệm
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {freePlan.badge}
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#0F172A]">{freePlan.name}</h3>
          <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{freePlan.tagline}</p>

          {/* Price block */}
          <div className="my-6 pb-6 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                0
              </span>
              <span className="text-sm font-bold text-slate-500">VNĐ / {freePlan.periodLabel}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Sử dụng miễn phí trọn đời, không yêu cầu thông tin thẻ
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tính năng áp dụng:
            </p>
            {freePlan.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                {feat.included ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
                <div>
                  <span
                    className={
                      feat.included ? "text-slate-700 font-medium" : "text-slate-400 line-through"
                    }
                  >
                    {feat.text}
                  </span>
                  {feat.desc && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{feat.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100">
          {isUserPremium ? (
            <button
              type="button"
              onClick={onRequestCancel}
              className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer transition-colors"
            >
              Hạ cấp về Gói Miễn Phí
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs cursor-default flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Gói bạn đang sử dụng</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= CARD 2: GÓI PREMIUM (PRO AI) ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#059669] shadow-xl flex flex-col justify-between relative ring-4 ring-[#059669]/10 hover:shadow-2xl transition-all">
        {/* Top Tag */}
        <div className="absolute -top-3.5 right-6 sm:right-8 bg-gradient-to-r from-amber-500 to-[#059669] text-white px-3.5 py-1 rounded-full text-xs font-extrabold shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>{premiumPlan.badge}</span>
        </div>

        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-4 h-4 text-amber-500" />
              Tối ưu dinh dưỡng chuyên sâu
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <span>{premiumPlan.name}</span>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              PRO AI
            </span>
          </h3>
          <p className="text-xs text-slate-600 mt-1 min-h-[32px]">{premiumPlan.tagline}</p>

          {/* Billing Cycle Selector Tabs */}
          <div className="my-5 p-1 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] grid grid-cols-2 gap-1 text-center">
            <button
              type="button"
              onClick={() => onSelectCycle("monthly")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#059669] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Gói Tháng
            </button>

            <button
              type="button"
              onClick={() => onSelectCycle("yearly")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-[#059669] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Gói Năm</span>
              <span
                className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full ${
                  billingCycle === "yearly"
                    ? "bg-[#FEF3C7] text-amber-900"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                -31%
              </span>
            </button>
          </div>

          {/* Price Block */}
          <div className="mb-6 pb-6 border-b border-[#DCEEE7]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#059669] tracking-tight">
                {premiumPrice.toLocaleString("vi-VN")}
              </span>
              <span className="text-sm font-bold text-slate-500">
                VNĐ / {billingCycle === "yearly" ? "năm" : "tháng"}
              </span>
            </div>

            {billingCycle === "yearly" ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-[#ECFDF5] px-2.5 py-1 rounded-lg border border-[#A7F3D0]">
                  Tương đương ~82.500đ / tháng
                </span>
                <span className="text-xs text-rose-600 font-semibold">
                  Tiết kiệm ngay 450.000đ/năm
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-1.5">
                Thanh toán linh hoạt từng tháng 120.000đ. Có thể hủy bất kỳ lúc nào.
              </p>
            )}
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Đặc quyền nâng cấp nổi bật:
            </p>
            {premiumPlan.features.map((feat, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs transition-colors ${
                  feat.highlight
                    ? "bg-[#ECFDF5]/70 border-[#A7F3D0]"
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p
                      className={`font-bold ${
                        feat.highlight ? "text-[#065F46]" : "text-[#0F172A]"
                      }`}
                    >
                      {feat.text}
                    </p>
                    {feat.desc && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {feat.desc}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[#DCEEE7] space-y-2.5">
          {isUserPremium ? (
            <div className="w-full py-3.5 px-6 rounded-2xl bg-emerald-50 text-[#059669] border border-[#A7F3D0] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>Bạn Đang Sử Dụng Gói Hội Viên Pro</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenCheckout}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[#059669] to-[#047857] hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Crown className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
              <span>Nâng Cấp Gói Premium Ngay</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <p className="text-center text-[11px] text-slate-500">
            Kích hoạt tức thì qua VietQR • Đảm bảo hoàn tiền trong 14 ngày
          </p>
        </div>
      </div>
    </div>
  );
}

