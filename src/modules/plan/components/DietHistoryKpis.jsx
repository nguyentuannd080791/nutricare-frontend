import React from "react";
import { Award, Flame, Utensils, CheckCircle2 } from "lucide-react";

/**
 * 3 KPI CỐT LÕI (SOLID: Single Responsibility).
 * Tinh giản tối đa, bố cục thoáng đãng, chống gãy chữ (anti-wrap) trên mọi kích thước màn hình.
 */
export default function DietHistoryKpis({ kpis, targetCalories, className = "" }) {
  if (!kpis) return null;

  const adherenceRate = Math.round(kpis.adherenceRate || 0);
  const avgKcal = Math.round(kpis.avgKcal || 0);
  const targetKcal = Math.round(targetCalories || 1800);
  const completedMeals = kpis.completedMeals || 0;
  const totalScheduled = kpis.totalScheduledMeals || 0;

  const adherenceQuality =
    adherenceRate >= 80
      ? { label: "Xuất sắc", badgeBg: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" }
      : adherenceRate >= 50
      ? { label: "Khá ổn định", badgeBg: "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]" }
      : { label: "Cần cải thiện", badgeBg: "bg-slate-100 text-slate-700 border-slate-200" };

  const kcalDiff = avgKcal - targetKcal;
  const kcalDiffText =
    Math.abs(kcalDiff) <= 50
      ? "Khớp sát mục tiêu"
      : kcalDiff > 0
      ? `Vượt +${kcalDiff.toLocaleString()} calo`
      : `Thiếu ${Math.abs(kcalDiff).toLocaleString()} calo`;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {/* KPI 1: Tỉ lệ tuân thủ */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wide whitespace-nowrap">
            Tỉ lệ tuân thủ
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#DCEEE7] flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="text-3xl font-extrabold text-[#059669] tracking-tight">
            {adherenceRate}%
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#059669] transition-all duration-500"
              style={{ width: `${Math.min(100, adherenceRate)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold gap-2">
          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] whitespace-nowrap font-bold ${adherenceQuality.badgeBg}`}>
            {adherenceQuality.label}
          </span>
          <span className="text-[#0F172A]/50 whitespace-nowrap text-[11px]">{kpis.passedDays} ngày qua</span>
        </div>
      </div>

      {/* KPI 2: Calo trung bình */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wide whitespace-nowrap">
            Calo nạp TB / ngày
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {avgKcal.toLocaleString()}
            </span>
            <span className="text-xs text-[#0F172A]/50 font-semibold whitespace-nowrap">
              / {targetKcal.toLocaleString()} kcal
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#EA580C] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((avgKcal / targetKcal) * 100))}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold gap-2">
          <span className="text-[#EA580C] font-bold whitespace-nowrap text-[11px]">{kcalDiffText}</span>
          <span className="text-[#0F172A]/50 whitespace-nowrap text-[11px]">Mục tiêu ngày</span>
        </div>
      </div>

      {/* KPI 3: Bữa ăn hoàn thành */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEEE7] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wide whitespace-nowrap">
            Bữa ăn hoàn thành
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {completedMeals}
            </span>
            <span className="text-xs text-[#0F172A]/50 font-semibold whitespace-nowrap">
              / {totalScheduled} bữa
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0284C7] transition-all duration-500"
              style={{
                width: `${totalScheduled > 0 ? Math.min(100, Math.round((completedMeals / totalScheduled) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold gap-2">
          <span className="text-[#0284C7] font-bold flex items-center gap-1 whitespace-nowrap text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Đúng thực đơn
          </span>
          <span className="text-[#0F172A]/50 whitespace-nowrap text-[11px]">
            {totalScheduled > 0 ? Math.round((completedMeals / totalScheduled) * 100) : 0}% kế hoạch
          </span>
        </div>
      </div>
    </div>
  );
}
