import { useCallback, useEffect, useRef, useState } from "react";
import { exerciseApi, dailySummaryApi } from "../services/api";

const EMPTY_DAY = { date: null, summary: null, entries: [], error: null };

async function fetchDay(date) {
  const [summary, exercise] = await Promise.all([
    dailySummaryApi.get(date).catch(() => null),
    exerciseApi.list(date),
  ]);
  return { date, summary, entries: exercise.entries, error: null };
}

export function useDailyActivity(date, refreshKey = 0) {
  const [day, setDay] = useState(EMPTY_DAY);
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchDay(date)
      .then((loaded) => {
        if (!cancelled) setDay(loaded);
      })
      .catch((error) => {
        if (!cancelled) setDay({ ...EMPTY_DAY, date, error: error.message });
      });
    return () => {
      cancelled = true;
    };
  }, [date, refreshKey]);

  const runThenRefresh = useCallback(
    async (action) => {
      if (submitting.current) return;
      submitting.current = true;
      setSaving(true);
      try {
        await action();
        setDay(await fetchDay(date));
      } finally {
        submitting.current = false;
        setSaving(false);
      }
    },
    [date]
  );

  const addExercise = (payload) => runThenRefresh(() => exerciseApi.add(payload));
  const removeExercise = (id) => runThenRefresh(() => exerciseApi.remove(id));

  return {
    loading: day.date !== date,
    saving,
    summary: day.summary,
    entries: day.entries,
    error: day.error,
    addExercise,
    removeExercise,
  };
}
