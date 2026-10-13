import React from "react";
import { Card } from "../../../components/ui";
import { dateKey } from "../../../domain/planCycle";
import { describeRemaining } from "../../../domain/calorieDisplay";
import { useDailyActivity } from "../../../hooks/useDailyActivity";

function Figure({ label, kcal, danger }) {
  return (
    <div className="flex-1">
      <span className="block text-[12px] text-descGray">{label}</span>
      <span className={`block text-[19px] font-extrabold ${danger ? "text-destructive" : "text-fg"}`}>{kcal}</span>
      <span className="block text-[11.5px] text-descGray">kcal</span>
    </div>
  );
}

export default function TodayCalorieCard({ refreshKey, onOpenExercise }) {
  const { summary } = useDailyActivity(dateKey(), refreshKey);
  if (!summary) return null;

  const remaining = describeRemaining(summary.remainingKcal);

  return (
    <Card className="p-4 mb-5">
      <span className="block text-[15.5px] font-bold text-fg mb-3">Calo hôm nay</span>
      <div className="flex flex-row gap-3">
        <Figure label="Đã ăn" kcal={summary.intakeKcal} />
        <Figure label="Đã đốt" kcal={summary.burnedKcal} />
        <Figure label={remaining.label} kcal={remaining.kcal} danger={remaining.over} />
      </div>
      <button
        type="button"
        onClick={onOpenExercise}
        className="mt-3 min-h-[44px] text-[13.5px] font-semibold text-primaryDark cursor-pointer"
      >
        Ghi bài tập →
      </button>
    </Card>
  );
}
