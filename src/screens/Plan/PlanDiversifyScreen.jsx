import React from "react";
import { Sparkles, Crown, RotateCcw } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Card, Button, EmptyState, ScreenHeader } from "../../components/ui";
import { usePlanDiversification } from "./hooks/usePlanDiversification";
import DiversifyDayCard from "./components/DiversifyDayCard";

export default function PlanDiversifyScreen({ plan, user, onBack, onGoUpgrade, onProposed, onApply }) {
  const { phase, proposal, aiPlanLimit, selectionsFromProposal } = usePlanDiversification({ plan, user, onProposed });

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Đa dạng hoá bằng AI" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
        {phase === "limit" && (
          <div>
            <div className="flex flex-row gap-2 rounded-xl p-[14px] mb-3" style={{ backgroundColor: "#FFF7ED" }}>
              <Crown size={16} color="#C2410C" className="mt-[1px] shrink-0" />
              <span className="flex-1 text-[12.5px] leading-[18px]" style={{ color: "#C2410C" }}>
                Bạn đã dùng hết {aiPlanLimit}/{aiPlanLimit} lượt gợi ý AI miễn phí. Nâng cấp Premium để tiếp tục sử dụng không giới hạn.
              </span>
            </div>
            <Button full icon={Crown} onPress={onGoUpgrade}>Nâng cấp Premium</Button>
          </div>
        )}

        {phase === "loading" && (
          <EmptyState icon={Sparkles} title="Đang phân tích thực đơn..." desc="AI đang xem xét thực đơn hiện tại để đề xuất đa dạng hoá món ăn, giữ nguyên khung ngày/bữa." />
        )}

        {phase === "error" && (
          <div>
            <EmptyState icon={Sparkles} title="Chưa thể tạo gợi ý" desc="Đã có lỗi xảy ra hoặc kết quả AI không hợp lệ. Thực đơn hiện tại của bạn không bị thay đổi." />
            <Button full variant="outline" icon={RotateCcw} onPress={onBack} className="mt-3">Quay lại</Button>
          </div>
        )}

        {phase === "ready" && (
          <div className="flex flex-col gap-4">
            {!!proposal.analysis && (
              <Card className="p-4" style={{ backgroundColor: COLORS.muted }}>
                <span className="block text-[11.5px] font-bold text-primary mb-1">Nhận xét từ AI</span>
                <span className="block text-[13px] text-[#334155] leading-[19px]">{proposal.analysis}</span>
              </Card>
            )}

            <span className={proposal.changedCount === 0 ? "text-[12.5px] text-descGray italic" : "text-[12px] text-descGray leading-[17px]"}>
              {proposal.changedCount === 0
                ? "AI cho rằng thực đơn hiện tại đã đủ đa dạng, không đề xuất hoán đổi món nào."
                : `AI đề xuất hoán đổi ${proposal.changedCount} bữa để tăng đa dạng. Số liệu dinh dưỡng dưới đây luôn được hệ thống tính lại từ catalog, không lấy trực tiếp từ AI.`}
            </span>

            <div className="flex flex-col gap-[10px]">
              {proposal.days.map((day) => <DiversifyDayCard key={day.dayIndex} day={day} />)}
            </div>

            <div className="flex flex-col gap-[10px] mt-1">
              {proposal.changedCount > 0 && (
                <Button full icon={Sparkles} onPress={() => onApply(selectionsFromProposal())}>Áp dụng gợi ý AI</Button>
              )}
              <Button full variant="outline" onPress={onBack}>Giữ nguyên thực đơn hiện tại</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
