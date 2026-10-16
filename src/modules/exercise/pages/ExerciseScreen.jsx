import React from "react";
import { COLORS } from "../../../assets/theme/colors";
import { ScreenHeader } from "../../../shared/components/ui";
import { dateKey } from "../../../shared/domain/planCycle";
import { sumEntryKcal } from "../domain/exerciseInput";
import { useDailyActivity } from "../hooks/useDailyActivity";
import { useExerciseCatalog } from "../hooks/useExerciseCatalog";
import ExerciseForm from "../components/ExerciseForm";
import ExerciseEntryList from "../components/ExerciseEntryList";

export default function ExerciseScreen({ onBack, showToast, reportError }) {
  const { loading, saving, entries, error, addExercise, removeExercise } = useDailyActivity(dateKey());
  const catalog = useExerciseCatalog();

  async function handleAdd(payload) {
    try {
      await addExercise(payload);
      showToast("Đã thêm bài tập");
      return true;
    } catch (e) {
      reportError(e);
      return false;
    }
  }

  async function handleRemove(id) {
    try {
      await removeExercise(id);
    } catch (e) {
      reportError(e);
    }
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Bài tập hôm nay" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
        {loading && (
          <p className="m-0 text-descGray" role="status">
            Đang tải…
          </p>
        )}
        {error && (
          <p className="m-0 text-destructive" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <>
            <div className="mb-4 rounded-[14px] bg-muted p-4">
              <span className="block text-[12.5px] text-descGray">Đã đốt hôm nay</span>
              <span className="block text-[28px] font-extrabold text-primaryDark">{sumEntryKcal(entries)} kcal</span>
            </div>
            <ExerciseForm catalog={catalog} saving={saving} onSubmit={handleAdd} />
            <span className="block mt-6 mb-3 text-[15.5px] font-bold text-fg">Đã ghi hôm nay</span>
            <ExerciseEntryList entries={entries} catalog={catalog} disabled={saving} onRemove={handleRemove} />
          </>
        )}
      </div>
    </div>
  );
}
