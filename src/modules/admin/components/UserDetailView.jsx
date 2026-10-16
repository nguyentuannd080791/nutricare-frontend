import React from "react";
import {
  User,
  Scale,
  Flame,
  ShieldCheck,
  ClipboardList,
  Utensils,
  Dumbbell,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { GOALS, ACTIVITY_LEVELS } from "../../../shared/domain/constants";
import DetailSection from "./DetailSection";
import KeyValueList from "./KeyValueList";

const goalLabel = (goalId) => {
  if (!goalId) return "—";
  return GOALS.find((g) => g.id === goalId)?.label || goalId;
};

const activityLabel = (actId) => {
  if (!actId) return "—";
  return ACTIVITY_LEVELS.find((a) => a.id === actId)?.label || actId;
};

const fmtDelta = (val, unit = "kg") => {
  if (val == null) return "—";
  const sign = val > 0 ? "+" : "";
  return `${sign}${val} ${unit}`;
};

/**
 * Trách nhiệm duy nhất: hiển thị 8 thành phần A đến H của màn chi tiết người dùng.
 */
export default function UserDetailView({ detail }) {
  if (!detail) return null;

  const { profile, body, target, conditions, plan, meals, exercise, usage } = detail;

  // A. Hồ sơ
  const profileItems = [
    { label: "Họ và tên", value: profile?.fullName || "(chưa đặt tên)" },
    { label: "Email", value: profile?.email },
    {
      label: "Giới tính",
      value: profile?.gender === "nam" ? "Nam" : profile?.gender === "nu" ? "Nữ" : "—",
    },
    { label: "Tuổi", value: profile?.age != null ? `${profile?.age} tuổi` : "—" },
    {
      label: "Gói hội viên",
      value: profile?.isPremium ? "Premium" : "Free",
      badge: (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            profile?.isPremium ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
          }`}
        >
          {profile?.isPremium ? "Premium" : "Free"}
        </span>
      ),
    },
    { label: "Ngày tạo tài khoản", value: profile?.createdAt },
    { label: "Hoạt động gần nhất", value: profile?.lastActiveDate || "Chưa có" },
  ];

  // B. Chỉ số cơ thể
  const bodyItems = [
    { label: "Chiều cao", value: body?.heightCm != null ? `${body.heightCm} cm` : null },
    { label: "Cân nặng hiện tại", value: body?.weightKg != null ? `${body.weightKg} kg` : null },
    { label: "BMI", value: body?.bmi != null ? String(body.bmi) : null },
    { label: "Cân nặng lần ghi đầu", value: body?.startWeightKg != null ? `${body.startWeightKg} kg` : null },
    { label: "Thay đổi tổng", value: fmtDelta(body?.change?.total) },
    { label: "Thay đổi 7 ngày", value: fmtDelta(body?.change?.days7) },
    { label: "Thay đổi 30 ngày", value: fmtDelta(body?.change?.days30) },
    { label: "Số lần ghi nhận", value: body?.recordCount != null ? `${body.recordCount} lần` : null },
  ];

  // C. Mục tiêu dinh dưỡng
  const targetItems = target
    ? [
        { label: "Mục tiêu", value: goalLabel(target.goalId) },
        { label: "Mức vận động", value: activityLabel(target.activityId) },
        { label: "Calo mục tiêu", value: target.calories != null ? `${target.calories} kcal/ngày` : null },
        { label: "Đạm (Protein)", value: target.protein != null ? `${target.protein} g` : null },
        { label: "Carb (Đường/bột)", value: target.carb != null ? `${target.carb} g` : null },
        { label: "Béo (Fat)", value: target.fat != null ? `${target.fat} g` : null },
        { label: "Chất xơ", value: target.fiber != null ? `${target.fiber} g` : null },
        { label: "BMR (Chuyển hoá cơ bản)", value: target.bmr != null ? `${target.bmr} kcal` : null },
        { label: "TDEE (Tổng tiêu hao)", value: target.tdee != null ? `${target.tdee} kcal` : null },
        { label: "Cân nặng đích", value: target.targetWeightKg != null ? `${target.targetWeightKg} kg` : null },
        { label: "Thời hạn áp dụng", value: target.durationMonths != null ? `${target.durationMonths} tháng` : null },
        { label: "Độ lệch calo mỗi ngày", value: fmtDelta(target.dailyKcalDelta, "kcal") },
        { label: "Hiệu lực từ ngày", value: target.effectiveFrom },
        { label: "Lần điều chỉnh tự động gần nhất", value: target.lastFeedbackCheckAt || "Chưa có" },
        {
          label: "Tiến độ về cân nặng đích",
          value: target.progressPercent != null ? `${target.progressPercent}%` : "—",
        },
      ]
    : [];

  // D. Bệnh nền, dị ứng
  const conditionItems = [
    { label: "Bệnh nền", value: `${conditions?.BENH_NEN ?? 0} mục` },
    { label: "Dị ứng", value: `${conditions?.DI_UNG ?? 0} mục` },
    { label: "Chỉ định bác sĩ", value: `${conditions?.CHI_DINH_BAC_SI ?? 0} mục` },
  ];

  // E. Thực đơn
  const planItems = [
    {
      label: "Nguồn thực đơn",
      value:
        plan?.source === "ai"
          ? "Gợi ý AI"
          : plan?.source === "algorithm"
          ? "Thuật toán"
          : null,
    },
    { label: "Ngày tạo", value: plan?.createdAt },
    { label: "Số ngày trong chu kỳ", value: plan?.cycleDays != null ? `${plan.cycleDays} ngày` : null },
    { label: "Calo lúc tạo", value: plan?.caloriesAtCreation != null ? `${plan.caloriesAtCreation} kcal` : null },
    { label: "Số ngày đã dùng", value: plan?.daysInUse != null ? `${plan.daysInUse} ngày` : null },
    { label: "Tổng thực đơn đã tạo", value: plan?.totalPlans != null ? `${plan.totalPlans} thực đơn` : null },
  ];

  // G. Tập luyện 14 ngày
  const exerciseItems = [
    { label: "Số ngày có tập", value: `${exercise?.activeDays ?? 0} ngày` },
    { label: "Tổng thời gian", value: `${exercise?.totalMinutes ?? 0} phút` },
    { label: "Tổng calo đốt", value: `${exercise?.totalKcal ?? 0} kcal` },
    {
      label: "Calo đốt TB / ngày có tập",
      value: exercise?.avgKcalPerActiveDay != null ? `${exercise.avgKcalPerActiveDay} kcal` : null,
    },
  ];

  // H. Mức sử dụng
  const usageItems = [
    {
      label: "Số lượt quét món (Scan)",
      value:
        usage?.scan?.limit != null
          ? `${usage.scan.used}/${usage.scan.limit}`
          : `${usage?.scan?.used ?? 0} (không giới hạn)`,
    },
    {
      label: "Số lượt tạo thực đơn AI",
      value:
        usage?.aiPlan?.limit != null
          ? `${usage.aiPlan.used}/${usage.aiPlan.limit}`
          : `${usage?.aiPlan?.used ?? 0} (không giới hạn)`,
    },
  ];

  return (
    <div className="space-y-4">
      {/* A. Hồ sơ */}
      <DetailSection title="A. Hồ sơ người dùng" icon={User}>
        <KeyValueList items={profileItems} />
      </DetailSection>

      {/* B. Chỉ số cơ thể */}
      <DetailSection
        title="B. Chỉ số cơ thể"
        icon={Scale}
        isEmpty={!body || body.recordCount === 0}
      >
        <KeyValueList items={bodyItems} />

        {body?.recent && body.recent.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-[13px] font-bold text-slate-700 mb-2">10 bản ghi cân nặng gần nhất:</h4>
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="py-2 px-3">Ngày</th>
                    <th className="py-2 px-3">Cân nặng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {body.recent.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-slate-600 font-mono">{r.date}</td>
                      <td className="py-2 px-3 font-semibold text-fg">{r.weightKg} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DetailSection>

      {/* C. Mục tiêu dinh dưỡng */}
      <DetailSection
        title="C. Mục tiêu dinh dưỡng"
        icon={Flame}
        isEmpty={!target}
      >
        <KeyValueList items={targetItems} />
      </DetailSection>

      {/* D. Bệnh nền, dị ứng */}
      <DetailSection
        title="D. Bệnh nền & Dị ứng"
        icon={ShieldCheck}
        isEmpty={!conditions || (conditions.BENH_NEN === 0 && conditions.DI_UNG === 0 && conditions.CHI_DINH_BAC_SI === 0)}
      >
        <KeyValueList items={conditionItems} />
      </DetailSection>

      {/* E. Thực đơn */}
      <DetailSection
        title="E. Thực đơn đang dùng"
        icon={ClipboardList}
        isEmpty={!plan || plan.totalPlans === 0}
      >
        <KeyValueList items={planItems} />
      </DetailSection>

      {/* F. Ăn uống 14 ngày */}
      <DetailSection
        title="F. Ăn uống (14 ngày gần nhất)"
        icon={Utensils}
        isEmpty={!meals || meals.days.length === 0}
      >
        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Số ngày hoàn thành:</span>
            <span className="font-bold text-fg text-sm">
              {meals?.completedDays ?? 0}/{meals?.expectedDays ?? 0} ngày
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Tỉ lệ hoàn thành:</span>
            <span className="font-bold text-fg text-sm">
              {meals?.completionPercent != null ? `${meals.completionPercent}%` : "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Số ngày có ghi nhận:</span>
            <span className="font-bold text-fg text-sm">{meals?.loggedDays ?? 0} ngày</span>
          </div>
          <div>
            <span className="text-slate-500 block">Calo nạp trung bình:</span>
            <span className="font-bold text-fg text-sm">
              {meals?.avgIntakeKcal != null ? `${meals.avgIntakeKcal} kcal` : "—"}
            </span>
          </div>
        </div>

        {meals?.days && meals.days.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="py-2 px-2.5">Ngày</th>
                  <th className="py-2 px-2.5">Đã ăn</th>
                  <th className="py-2 px-2.5">Thực đơn</th>
                  <th className="py-2 px-2.5">Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meals.days.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2 px-2.5 text-slate-600 font-mono">{d.date}</td>
                    <td className="py-2 px-2.5 font-semibold text-fg">
                      {d.intakeKcal > 0 ? `${d.intakeKcal} kcal` : "0 kcal"}
                    </td>
                    <td className="py-2 px-2.5 text-slate-500">
                      {d.plannedKcal > 0 ? `${d.plannedKcal} kcal` : "—"}
                    </td>
                    <td className="py-2 px-2.5">
                      {d.completed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-[11px]">
                          <CheckCircle2 size={12} />
                          Đạt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded text-[11px]">
                          <XCircle size={12} />
                          Chưa đạt
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DetailSection>

      {/* G. Tập luyện 14 ngày */}
      <DetailSection
        title="G. Tập luyện (14 ngày gần nhất)"
        icon={Dumbbell}
        isEmpty={!exercise || exercise.activeDays === 0}
      >
        <KeyValueList items={exerciseItems} />

        {exercise?.topExercises && exercise.topExercises.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <h4 className="text-[13px] font-bold text-slate-700 mb-2">Bài tập làm nhiều nhất:</h4>
            <div className="flex flex-col gap-1.5">
              {exercise.topExercises.map((ex, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-slate-50">
                  <span className="font-semibold text-fg">{ex.label}</span>
                  <span className="text-slate-500">{ex.count} lần ghi</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DetailSection>

      {/* H. Mức sử dụng */}
      <DetailSection title="H. Mức sử dụng tính năng" icon={Activity}>
        <KeyValueList items={usageItems} />
      </DetailSection>
    </div>
  );
}
