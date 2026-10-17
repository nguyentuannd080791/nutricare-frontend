import React from "react";
import { CheckCircle2, Circle, Clock, Utensils } from "lucide-react";
import { mealLabel } from "../../../shared/domain/constants";
import { mealTimeWindow } from "../domain/mealTimes";

const MEAL_TYPE_CONFIG = {
  sang: { label: "Bữa sáng", bg: "#ECFDF5", text: "#059669" },
  trua: { label: "Bữa trưa", bg: "#F0F9FF", text: "#0284C7" },
  toi: { label: "Bữa tối", bg: "#F5F3FF", text: "#7C3AED" },
  an_vat: { label: "Bữa phụ", bg: "#FFF7ED", text: "#EA580C" },
};

/**
 * Danh sách Thực đơn hôm nay (SOLID: Single Responsibility)
 * Đồng bộ UI từ HealthDashboardPage:
 * - Chấm tròn màu tinh giản cho Đạm, Tinh bột, Béo
 * - Tên món KHÔNG gạch ngang, chỉ làm dịu màu khi đã ăn để giữ thẩm mỹ
 * - Calo màu xanh ngọc #059669 tách biệt với màu cam của bài tập
 * - Huy hiệu bữa ăn màu pastel dịu mắt
 */
export default function MealChecklist({
  planDay,
  progress = {},
  dayProgress,
  restDay = false,
  onToggleMeal,
}) {
  const completed = dayProgress?.completed || 0;
  const total = dayProgress?.total || planDay?.meals?.length || 0;
  const totalPlanned = dayProgress?.plannedKcal || 0;

  return (
    <section className="rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ECFDF5] text-[#059669]">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Thực đơn hôm nay - {totalPlanned.toLocaleString()} calo
            </h2>
            <p className="text-xs text-[#0F172A]/60">
              {restDay
                ? "Ngày nghỉ xả hơi: Ăn theo thực đơn hoặc thoải mái, không ảnh hưởng chuỗi"
                : "Bấm vào bữa ăn để hoàn thành hoặc bỏ hoàn thành"}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0F8F6] text-[#059669] border border-[#DCEEE7]">
          Đã dùng {completed}/{total} bữa
        </span>
      </div>

      <div className="space-y-3">
        {planDay.meals.map((meal) => {
          const done = Boolean(progress[meal.mealSlot]);
          const macros = meal.macros || {};
          const slotConfig = MEAL_TYPE_CONFIG[meal.mealSlot] || {
            label: mealLabel(meal.mealSlot),
            bg: "#ECFDF5",
            text: "#059669",
          };
          const timeWindow = mealTimeWindow(meal.mealSlot);

          return (
            <div
              key={meal.mealSlot}
              onClick={() => onToggleMeal(meal.mealSlot)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggleMeal(meal.mealSlot)}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3.5 select-none ${
                done
                  ? "bg-[#F4FBF7] border-[#10B981]/35"
                  : "bg-white border-[#DCEEE7] hover:border-[#059669]/50 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  type="button"
                  aria-label={done ? "Bỏ hoàn thành bữa ăn" : "Hoàn thành bữa ăn"}
                  className="mt-0.5 shrink-0 text-[#059669] transition-transform group-active:scale-90"
                >
                  {done ? (
                    <CheckCircle2 className="w-6 h-6 text-[#059669] fill-[#ECFDF5]" />
                  ) : (
                    <Circle className="w-6 h-6 text-[#0F172A]/25 group-hover:text-[#059669]" />
                  )}
                </button>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: slotConfig.bg,
                        color: slotConfig.text,
                      }}
                    >
                      {slotConfig.label}
                    </span>
                    {timeWindow && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#0F172A]/50 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {timeWindow}
                      </span>
                    )}
                  </div>

                  {/* Tên món ăn: Không gạch ngang, chỉ làm dịu màu khi đã dùng */}
                  <h3
                    className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                      done ? "text-[#0F172A]/60" : "text-[#0F172A]"
                    }`}
                  >
                    {meal.nameVi}
                  </h3>

                  {/* Dòng Macros tối giản: Chấm tròn màu + Chữ trung tính, bỏ khung viền thô */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs font-medium text-[#475569]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                      Đạm:{" "}
                      <strong className="font-semibold text-[#0F172A]/80">
                        {Math.round(macros.protein_g || 0)}g
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      Tinh bột:{" "}
                      <strong className="font-semibold text-[#0F172A]/80">
                        {Math.round(macros.carb_g || 0)}g
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                      Chất béo:{" "}
                      <strong className="font-semibold text-[#0F172A]/80">
                        {Math.round(macros.fat_g || 0)}g
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Cột phải: Calo màu xanh ngọc + Trạng thái đã dùng */}
              <div className="text-right shrink-0 space-y-0.5">
                <span
                  className={`block text-sm sm:text-base font-extrabold ${
                    done ? "text-[#059669]" : "text-[#0F172A]"
                  }`}
                >
                  +{Math.round(meal.kcal)} kcal
                </span>
                <span
                  className={`block text-[11px] font-semibold ${
                    done ? "text-[#059669]" : "text-[#0F172A]/40"
                  }`}
                >
                  {done ? "✓ Đã dùng" : "Chưa dùng"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
