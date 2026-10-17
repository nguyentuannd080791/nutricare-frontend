import React from "react";
import {
  AlertTriangle,
  Utensils,
  X,
  Activity,
  Apple,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { NutritionFacts } from "../domain/nutritionModel";
import { FoodSafetyModel } from "../domain/foodSafetyModel";

function EmptyInspectorState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white rounded-3xl border border-[#DCEEE7]">
      <Apple className="w-14 h-14 text-[#059669]/30 mb-3 stroke-[1.5]" />
      <p className="font-bold text-[#0F172A]">Chưa chọn mục nào</p>
      <p className="text-xs text-[#0F172A]/55 max-w-xs mt-1">
        Bấm vào bất kỳ món ăn hoặc thực phẩm nào ở danh sách bên trái để xem phân tích dinh dưỡng và cảnh báo y khoa chi tiết.
      </p>
    </div>
  );
}

function MedicalConflictAlertBox({ conflicts }) {
  return (
    <div className="rounded-2xl bg-rose-50 border border-rose-300 p-4 shadow-2xs">
      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs sm:text-sm mb-1.5">
        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>CẢNH BÁO NGUY CƠ SỨC KHỎE</span>
      </div>
      <p className="text-xs text-rose-700 mb-3 leading-relaxed">
        Mục này chứa thành phần hoặc chỉ số xung đột với hồ sơ bệnh lý của bạn:
      </p>

      <div className="space-y-2">
        {conflicts.map((conflict, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-3 border border-rose-200/90 text-xs text-[#0F172A] space-y-1"
          >
            <div className="flex items-center justify-between gap-2 font-bold text-rose-900">
              <span>{conflict.conditionName}</span>
              <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                {conflict.conditionType === "DI_UNG" ? "Dị ứng" : "Chống chỉ định"}
              </span>
            </div>
            <p className="text-[#475569] leading-snug">
              <strong className="text-[#0F172A]">Lý do:</strong> {conflict.reason}
            </p>
            {conflict.recommendation && (
              <p className="text-[11px] text-rose-600 italic mt-0.5">
                💡 {conflict.recommendation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MacroDistributionSection({ facts, macroPercent }) {
  const macroCards = [
    {
      label: "Chất Đạm",
      amount: facts.protein,
      percent: macroPercent.protein,
      boxClass: "bg-[#FFF7ED] border-[#FFEDD5]",
      titleClass: "text-[#EA580C]",
      barClass: "bg-[#EA580C]",
    },
    {
      label: "Tinh Bột",
      amount: facts.carbs,
      percent: macroPercent.carbs,
      boxClass: "bg-[#FEF3C7]/60 border-[#FDE68A]",
      titleClass: "text-[#D97706]",
      barClass: "bg-[#F59E0B]",
    },
    {
      label: "Chất Béo",
      amount: facts.fat,
      percent: macroPercent.fat,
      boxClass: "bg-[#F0F9FF] border-[#BAE6FD]",
      titleClass: "text-[#0284C7]",
      barClass: "bg-[#0284C7]",
    },
  ];

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]/55 mb-2.5">
        Phân bổ đa lượng (Macronutrients)
      </h4>
      <div className="grid grid-cols-3 gap-2.5">
        {macroCards.map((item) => (
          <div
            key={item.label}
            className={`border rounded-2xl p-3 space-y-1.5 ${item.boxClass}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold ${item.titleClass}`}>
                {item.label}
              </span>
              <span className={`text-[10px] font-bold ${item.titleClass}`}>
                {item.percent}%
              </span>
            </div>
            <p className="text-base sm:text-lg font-extrabold text-[#0F172A]">
              {item.amount}g
            </p>
            <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
              <div
                className={`h-full rounded-full ${item.barClass}`}
                style={{ width: `${Math.min(100, item.percent)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MicronutrientClinicalTable({ facts, detail }) {
  // Trích xuất các vi chất mở rộng từ backend detail (Vitamins, Canxi, Sắt, Kẽm, v.v.)
  const additionalNutrients = (detail?.nutrients || []).filter(
    (n) =>
      ![
        "protein_g",
        "fat_g",
        "carb_g",
        "sodium_mg",
        "salt_g",
        "cholesterol_mg",
      ].includes(n.key)
  );

  return (
    <div className="border border-[#DCEEE7] rounded-2xl p-4 bg-[#F8FAFC] space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]/60 flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-[#059669]" />
        <span>Chỉ số Vi chất & Lâm sàng</span>
      </h4>

      <div className="space-y-2.5 text-xs">
        {/* Natri / Muối */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#475569]">Natri (Muối)</span>
            {facts.isHighSodium() && (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                Cao (Cần kiêng)
              </span>
            )}
          </div>
          <strong
            className={
              facts.isHighSodium() ? "text-rose-600 font-bold" : "text-[#0F172A]"
            }
          >
            {facts.sodium} mg
          </strong>
        </div>

        {/* Tương đương muối ăn */}
        {facts.salt > 0 && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <span className="font-semibold text-[#475569]">Tương đương muối ăn</span>
            <strong className="text-[#0F172A]">{facts.salt} g</strong>
          </div>
        )}

        {/* Đường đơn nếu có */}
        {facts.sugar > 0 && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#475569]">Đường đơn</span>
              {facts.isHighSugar() && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                  Cao
                </span>
              )}
            </div>
            <strong
              className={
                facts.isHighSugar() ? "text-rose-600 font-bold" : "text-[#0F172A]"
              }
            >
              {facts.sugar} g
            </strong>
          </div>
        )}

        {/* Chất xơ tiêu hóa nếu có */}
        {facts.fiber > 0 && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#475569]">Chất xơ tiêu hóa</span>
              <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                Tốt cho tiêu hóa
              </span>
            </div>
            <strong className="font-bold text-[#059669]">{facts.fiber} g</strong>
          </div>
        )}

        {/* Cholesterol & Purin */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#475569]">Cholesterol / Purin</span>
          <div className="text-right text-[#0F172A]">
            <strong>{facts.cholesterol} mg</strong>
            <span className="mx-1.5 text-slate-300">|</span>
            <span
              className={
                facts.isHighPurin()
                  ? "text-rose-600 font-bold"
                  : "text-[#475569] font-semibold"
              }
            >
              Purin: {facts.purinLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Vi chất mở rộng từ backend (Canxi, Sắt, Kẽm, Vitamin A, Vitamin C...) */}
      {additionalNutrients.length > 0 && (
        <div className="pt-2.5 border-t border-slate-200/70 space-y-2">
          <span className="text-[11px] font-bold text-[#0F172A]/50 block">
            Khoáng chất & Vitamin mở rộng:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {additionalNutrients.map((n) => (
              <div
                key={n.key || n.code}
                className="bg-white p-2 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
              >
                <span className="text-[#475569] truncate mr-1">{n.nameVi}</span>
                <strong className="text-[#059669] shrink-0 font-bold">
                  {n.value} {n.unit}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Thanh tra dinh dưỡng & Cảnh báo y khoa Master-Detail (SOLID: Single Responsibility)
 * Đồng bộ từ test-ui (NutritionInspector) với khả năng tích hợp chi tiết API backend
 */
export default function NutritionInspector({
  item,
  detail,
  loading = false,
  isDish = true,
  userConditions = [],
  onClose,
  isMobileModal = false,
}) {
  if (!item && !detail) return <EmptyInspectorState />;

  const currentData = detail || item;
  const facts = NutritionFacts.fromBackend(item, detail);
  const macroPercent = facts.getMacroPercentages();
  const evaluation = FoodSafetyModel.evaluate(currentData, userConditions);
  const hasWarning = Boolean(evaluation?.hasRedWarning);
  const servingLabel = isDish ? "1 phần món ăn chuẩn" : "100g thực phẩm chuẩn";

  return (
    <div
      className={`bg-white flex flex-col h-full min-h-0 overflow-hidden ${
        isMobileModal
          ? ""
          : "rounded-3xl border border-[#DCEEE7] shadow-sm max-h-full"
      }`}
    >
      {/* Header cố định */}
      <div className="p-4 sm:p-5 border-b border-[#DCEEE7] flex items-start justify-between gap-3 bg-[#F8FAFC] shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
              {currentData.nameVi}
            </h2>
            {loading && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#059669] border-t-transparent animate-spin shrink-0" />
            )}
          </div>
          {currentData.nameEn && currentData.nameEn !== currentData.nameVi && (
            <p className="text-xs text-[#0F172A]/40 italic truncate mt-0.5">
              {currentData.nameEn}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#DCEEE7] px-2.5 py-0.5 rounded-lg">
              {currentData.groupNameVi || (isDish ? "Món ăn" : "Thực phẩm")}
            </span>
            <span className="text-xs text-[#0F172A]/60 font-medium">
              Khẩu phần: <strong className="text-[#0F172A]">{servingLabel}</strong>
            </span>
          </div>
        </div>

        {isMobileModal && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
            aria-label="Đóng bảng dinh dưỡng"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nội dung cuộn độc lập */}
      <div className="flex-1 min-h-0 p-4 sm:p-5 pb-8 overflow-y-auto space-y-4 text-[#0F172A] overscroll-contain [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
        {/* 1. Cảnh báo y khoa hoặc Chứng nhận an toàn */}
        {hasWarning ? (
          <MedicalConflictAlertBox conflicts={evaluation.conflicts} />
        ) : (
          <div className="rounded-2xl bg-[#ECFDF5]/80 border border-[#A7F3D0] px-4 py-3 flex items-center gap-2.5 text-xs font-semibold text-[#047857]">
            <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Tương thích an toàn với hồ sơ sức khỏe của bạn</span>
          </div>
        )}

        {/* 2. Thẻ gắn nhãn đặc trưng (Tags) nếu có */}
        {detail?.tagLabels && detail.tagLabels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {detail.tagLabels.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#F0F8F6] text-[#059669] border border-[#DCEEE7] px-2.5 py-0.5 rounded-full"
              >
                <Sparkles className="w-3 h-3 text-[#EA580C]" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 3. Tổng năng lượng (Đồng bộ tông xanh ngọc với FoodCard & Dashboard) */}
        <div className="bg-[#ECFDF5]/60 rounded-2xl p-4 border border-[#DCEEE7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-xs shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#0F172A]/60 font-semibold">
                Năng lượng cung cấp
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#0F172A]">
                  {facts.calories}
                </span>
                <span className="text-xs font-bold text-[#059669]">kcal</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#0F172A]/50 font-medium text-right">
            {servingLabel}
          </span>
        </div>

        {/* 4. Phân bổ đa lượng Đạm (Cam) - Bột (Vàng) - Béo (Xanh dương) */}
        <MacroDistributionSection facts={facts} macroPercent={macroPercent} />

        {/* 5. Bảng vi chất & lâm sàng */}
        <MicronutrientClinicalTable facts={facts} detail={detail} />

        {/* 6. Ghi chú nguồn dữ liệu Viện Dinh Dưỡng Quốc Gia */}
        {detail?.sourceUrl && (
          <div className="pt-2 text-center">
            <a
              href={detail.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#059669] hover:underline font-semibold"
            >
              <span>Nguồn: Viện Dinh Dưỡng Quốc Gia (NIN)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
