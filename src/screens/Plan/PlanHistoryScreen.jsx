import React from "react";
import { ClipboardList } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { EmptyState, ScreenHeader } from "../../components/ui";
import PlanStatsCard from "./components/PlanStatsCard";

export default function PlanHistoryScreen({ data, onBack }) {
  const plans = data.mealPlans; // server đã sắp xếp mới nhất trước

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Lịch sử thực đơn" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
        {plans.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Chưa có thực đơn nào" desc="Các thực đơn bạn tạo — đang dùng hoặc đã kết thúc — sẽ hiển thị chi tiết ở đây." />
        ) : (
          plans.map((p) => <PlanStatsCard key={p.id} plan={p} progress={data.progress} />)
        )}
      </div>
    </div>
  );
}
