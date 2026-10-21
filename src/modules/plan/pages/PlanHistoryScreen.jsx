import React, { useMemo, useState } from "react";
import { ClipboardList, Target } from "lucide-react";
import { EmptyState, ScreenHeader } from "../../../shared/components/ui";
import { buildDietHistoryModel } from "../domain/dietHistoryDomain";
import CycleMonthTabs from "../components/CycleMonthTabs";
import DietHistoryKpis from "../components/DietHistoryKpis";
import WeekCycleNavigator from "../components/WeekCycleNavigator";
import DayHistoryCard from "../components/DayHistoryCard";

/**
 * Màn hình Lịch sử Chế độ ăn & Thực đơn (SOLID: Dependency Inversion & Single Responsibility).
 *
 * Tính năng chính:
 * 1. Phân cấp chu kỳ: Chu kỳ lớn 3 / 6 / 9 / 12 tháng -> Chu kỳ tuần -> Chi tiết từng ngày.
 * 2. Tinh giản tối đa: 3 KPI cốt lõi, thanh calo theo ngày, trạng thái bữa ăn (Sáng - Trưa - Tối - Phụ).
 * 3. Responsive chuẩn mực:
 *    - Row 1: Bộ chọn chu kỳ tháng (3/6/9/12 tháng).
 *    - Row 2: 3 KPI cốt lõi trải ngang trọn vẹn, không bị bó hẹp trong cột hẹp.
 *    - Row 3: Bento 2 cột (Cột trái 4 cột: Mục tiêu chu kỳ & Macros; Cột phải 8 cột: Tuần & Nhật ký ngày).
 */
export default function PlanHistoryScreen({ data, onBack }) {
  const model = useMemo(() => buildDietHistoryModel(data), [data]);
  const [selectedCycleId, setSelectedCycleId] = useState(() => model.activeCycleId);

  const currentCycle = useMemo(() => {
    return model.cycles.find((c) => c.id === selectedCycleId) || model.cycles[0];
  }, [model.cycles, selectedCycleId]);

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(() => {
    return currentCycle?.currentWeekIndex ?? 0;
  }, [currentCycle?.id]);

  // Cập nhật tuần an toàn khi đổi chu kỳ
  const safeWeekIndex = Math.min(
    Math.max(0, selectedWeekIndex),
    (currentCycle?.weeks?.length || 1) - 1
  );
  const activeWeek = currentCycle?.weeks?.[safeWeekIndex];

  return (
    <div className="flex-1 h-full flex flex-col bg-bg overflow-hidden">
      <ScreenHeader title="Lịch sử chế độ ăn" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 pb-16 [scrollbar-width:thin] [scrollbar-color:#DCEEE7_transparent]">
        {!currentCycle ? (
          <div className="max-w-md mx-auto mt-10">
            <EmptyState
              icon={ClipboardList}
              title="Chưa có dữ liệu lịch sử"
              desc="Bắt đầu ghi nhận các bữa ăn trong ngày để hệ thống tự động tổng hợp lịch sử ăn uống của bạn."
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* HÀNG 1: CHỌN CHU KỲ MỤC TIÊU (3 / 6 / 9 / 12 THÁNG) */}
            <CycleMonthTabs
              cycles={model.cycles}
              selectedCycleId={selectedCycleId}
              onSelectCycle={(id) => {
                setSelectedCycleId(id);
                const nextCycle = model.cycles.find((c) => c.id === id);
                setSelectedWeekIndex(nextCycle?.currentWeekIndex ?? 0);
              }}
            />

            {/* HÀNG 2: 3 KPI CỐT LÕI TRẢI RỘNG TRỌN VẸN TRÊN MÀN HÌNH */}
            <DietHistoryKpis
              kpis={currentCycle.kpis}
              targetCalories={currentCycle.targetCalories}
            />

            {/* HÀNG 3: BỐ CỤC 2 CỘT (CỘT TRÁI 4 CỘT: MỤC TIÊU & MACROS; CỘT PHẢI 8 CỘT: TUẦN & 7 NGÀY) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* CỘT TRÁI (LG 4 CỘT): THÔNG TIN MỤC TIÊU CHU KỲ & MACROS */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DCEEE7] shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                      <Target className="w-4 h-4 text-[#059669] shrink-0" />
                      Mục tiêu chu kỳ
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] whitespace-nowrap">
                      {currentCycle.goalLabel}
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                      <span className="text-[11px] font-semibold text-slate-400 block">Thời hạn áp dụng</span>
                      <strong className="text-sm font-extrabold text-[#0F172A] mt-0.5 block">
                        {currentCycle.durationMonths} tháng
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {currentCycle.startDateText} - {currentCycle.endDateText}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5]">
                      <span className="text-[11px] font-semibold text-[#EA580C] block">Mục tiêu calo / ngày</span>
                      <strong className="text-sm font-extrabold text-[#0F172A] mt-0.5 block">
                        {currentCycle.targetCalories.toLocaleString()} kcal
                      </strong>
                      <span className="text-[10px] text-[#EA580C]/80">
                        Đã thực hiện {currentCycle.kpis.passedDays} ngày
                      </span>
                    </div>
                  </div>

                  {/* Macros Kế hoạch */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      Dưỡng chất đa lượng mục tiêu (Gram/ngày):
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5]">
                        <span className="text-[10px] font-bold text-[#EA580C] block">Đạm</span>
                        <strong className="text-xs font-extrabold text-[#0F172A]">
                          {Math.round(currentCycle.macrosTarget.protein)}g
                        </strong>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FEF3C7]/60 border border-[#FDE68A]">
                        <span className="text-[10px] font-bold text-[#D97706] block">Tinh bột</span>
                        <strong className="text-xs font-extrabold text-[#0F172A]">
                          {Math.round(currentCycle.macrosTarget.carbs)}g
                        </strong>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD]">
                        <span className="text-[10px] font-bold text-[#0284C7] block">Chất béo</span>
                        <strong className="text-xs font-extrabold text-[#0F172A]">
                          {Math.round(currentCycle.macrosTarget.fat)}g
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (LG 8 CỘT): ĐIỀU HƯỚNG TUẦN & DANH SÁCH 7 NGÀY */}
              <div className="lg:col-span-8 space-y-4">
                {/* Bộ chọn tuần */}
                <WeekCycleNavigator
                  weeks={currentCycle.weeks}
                  selectedWeekIndex={safeWeekIndex}
                  onSelectWeek={setSelectedWeekIndex}
                />

                {/* Danh sách 7 ngày trong tuần */}
                <div className="space-y-3">
                  {activeWeek?.days?.map((day) => (
                    <DayHistoryCard key={day.dateKey} day={day} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
