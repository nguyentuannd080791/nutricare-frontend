import React, { useState } from "react";
import { Crown, CheckCircle2 } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Card, Button, ScreenHeader, ModalSheet } from "../../components/ui";
import PlanOptionCard from "./components/PlanOptionCard";

const BENEFITS = [
  "Quét món ăn bằng camera không giới hạn",
  "Tối ưu & xây dựng thực đơn thông minh không giới hạn",
  "Ưu tiên nhận tính năng và cập nhật mới",
];

const PLANS = [
  { id: "monthly", title: "Gói Tháng", price: "120.000đ", period: "/ tháng", desc: "Linh hoạt từng tháng, huỷ bất kỳ lúc nào" },
  { id: "yearly", title: "Gói Năm", price: "990.000đ", period: "/ năm", badge: "Tiết kiệm 31%", desc: "Chỉ ~82.500đ / tháng · Thanh toán 1 lần / năm" },
];

export default function PremiumScreen({ user, onBack, onSetPremium }) {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const activePlanObj = PLANS.find((p) => p.id === selectedPlan);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Premium" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
        <Card className="flex flex-col items-center p-6 gap-2" style={{ backgroundColor: COLORS.primary }}>
          <Crown size={32} color="#fff" />
          <span className="text-[17px] font-extrabold text-white text-center">{user.isPremium ? "Bạn là hội viên Premium" : "Nâng cấp Premium"}</span>
          {!user.isPremium && <span className="text-[12.5px] text-center" style={{ color: "rgba(255,255,255,0.85)" }}>Mở khoá toàn bộ tính năng, không giới hạn</span>}
        </Card>

        <div className="flex flex-col gap-3 mt-5">
          {BENEFITS.map((b) => (
            <div key={b} className="flex flex-row items-center gap-[10px]">
              <CheckCircle2 size={18} color={COLORS.primary} className="shrink-0" />
              <span className="flex-1 text-[13.5px] text-fg">{b}</span>
            </div>
          ))}
        </div>

        {!user.isPremium && (
          <>
            <span className="block text-[14px] font-bold text-fg mt-[22px] mb-[10px]">Chọn gói hội viên</span>
            <div className="flex flex-col gap-[10px]">
              {PLANS.map((plan) => (
                <PlanOptionCard key={plan.id} plan={plan} isSelected={selectedPlan === plan.id} onPress={() => setSelectedPlan(plan.id)} />
              ))}
            </div>
          </>
        )}

        <div className="mt-6">
          {user.isPremium ? (
            <Button full variant="outline" onPress={() => setConfirmCancel(true)}>Huỷ Premium</Button>
          ) : (
            <Button full icon={Crown} onPress={() => onSetPremium(true)}>
              Nâng cấp ngay · {activePlanObj ? `${activePlanObj.price}${activePlanObj.period}` : "120.000đ"}
            </Button>
          )}
        </div>
      </div>

      <ModalSheet open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Huỷ Premium">
        <p className="text-[14px] text-[#475569] mb-5 leading-5">Bạn sẽ quay lại giới hạn {user.limits.scan} lượt quét món ăn miễn phí. Tiếp tục?</p>
        <div className="flex flex-row gap-3">
          <Button full variant="secondary" onPress={() => setConfirmCancel(false)}>Huỷ bỏ</Button>
          <Button full variant="danger" onPress={() => { onSetPremium(false); setConfirmCancel(false); }}>Xác nhận</Button>
        </div>
      </ModalSheet>
    </div>
  );
}
