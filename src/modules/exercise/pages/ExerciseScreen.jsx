import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Activity,
  Dumbbell,
  Sparkles,
  HeartPulse,
  CheckCircle2,
  Star,
} from "lucide-react";
import { COLORS } from "../../../assets/theme/colors";
import { ScreenHeader } from "../../../shared/components/ui";
import { dateKey } from "../../../shared/domain/planCycle";
import { useDailyActivity } from "../hooks/useDailyActivity";
import { useExerciseCatalog } from "../hooks/useExerciseCatalog";
import {
  WORKOUT_CATEGORIES,
  WORKOUT_CATALOG,
  filterWorkouts,
} from "../domain/exerciseCatalogModel";
import WorkoutCatalogCard from "../components/WorkoutCatalogCard";
import QuickLogExerciseModal from "../components/QuickLogExerciseModal";
import TodayActivitySummary from "../components/TodayActivitySummary";

export default function ExerciseScreen({
  onBack,
  showToast,
  reportError,
  user,
  userData,
  onActivityChange,
}) {
  const {
    loading,
    saving,
    entries,
    workoutPlan,
    error,
    addExercise,
    removeExercise,
  } = useDailyActivity(dateKey());
  const catalog = useExerciseCatalog();

  // Xác định cân nặng thực tế của người dùng để cá nhân hóa calo
  const weightKg = userData?.bmiRecords?.[0]?.weightKg || user?.weightKg || 65;

  // State bộ lọc và tìm kiếm
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loggingWorkout, setLoggingWorkout] = useState(null);

  // Tập hợp các ID bài tập thuộc Kế hoạch thực đơn hôm nay
  const planExerciseIds = useMemo(() => {
    return new Set(workoutPlan?.workouts?.map((w) => w.exerciseId) || []);
  }, [workoutPlan]);

  // Bảng tra cứu các bài tập đã hoàn thành trong ngày hôm nay
  const completedLogsMap = useMemo(() => {
    const map = new Map();
    for (const entry of entries || []) {
      map.set(entry.exerciseId, entry);
    }
    return map;
  }, [entries]);

  // Danh mục có thêm tab "Kế hoạch hôm nay" nếu có bài tập đi kèm
  const categories = useMemo(() => {
    if (planExerciseIds.size > 0) {
      return [
        { id: "all", label: "Tất cả bài tập" },
        {
          id: "today_plan",
          label: `⭐ Kế hoạch hôm nay (${planExerciseIds.size})`,
        },
        ...WORKOUT_CATEGORIES.filter((c) => c.id !== "all"),
      ];
    }
    return WORKOUT_CATEGORIES;
  }, [planExerciseIds]);

  // Lọc bài tập theo từ khóa, danh mục hoặc kế hoạch hôm nay
  const filteredWorkouts = useMemo(() => {
    let list = WORKOUT_CATALOG;
    if (selectedCategory === "today_plan") {
      list = list.filter((item) => planExerciseIds.has(item.id));
      if (query) {
        list = filterWorkouts(list, { query, category: "all" });
      }
      return list;
    }
    return filterWorkouts(list, {
      query,
      category: selectedCategory,
    });
  }, [query, selectedCategory, planExerciseIds]);

  // Xử lý ghi nhận bài tập
  async function handleLogSubmit(payload) {
    try {
      await addExercise({ ...payload, date: dateKey() });
      onActivityChange?.();
      showToast?.("Đã ghi nhận bài tập hôm nay!");
      return true;
    } catch (e) {
      reportError?.(e);
      return false;
    }
  }

  // Xử lý xóa bài tập
  async function handleRemove(id) {
    try {
      await removeExercise(id);
      onActivityChange?.();
      showToast?.("Đã xóa bài tập");
    } catch (e) {
      reportError?.(e);
    }
  }

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ backgroundColor: COLORS.bg }}
    >
      <ScreenHeader title="Thư viện bài tập" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 pb-28 md:pb-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Lỗi hệ thống nếu có */}
          {error && (
            <div
              className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Bố cục Bento 2 cột (Desktop: 8:4, Mobile: 1 cột) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT PHỤ TRÊN MOBILE: Hiện bảng hoạt động hôm nay ở đầu trang cho người dùng điện thoại */}
            <div className="lg:hidden">
              <TodayActivitySummary
                entries={entries}
                catalog={catalog}
                disabled={saving}
                onRemove={handleRemove}
                weightKg={weightKg}
              />
            </div>

            {/* CỘT CHÍNH (Desktop 8 cột): Thanh công cụ tìm kiếm, danh mục & Lưới bài tập */}
            <div className="lg:col-span-8 space-y-4">
              {/* Thanh tìm kiếm & Lọc danh mục */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
                {/* Search Bar */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-descGray"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm bài tập, nhóm cơ, lợi ích..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-bg text-fg text-[13.5px] placeholder:text-descGray/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-descGray hover:text-fg cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Danh mục Category Pills cuộn ngang */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    const isPlanTab = cat.id === "today_plan";
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-[12.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? isPlanTab
                              ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                              : "bg-primary text-white shadow-sm shadow-primary/25"
                            : isPlanTab
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
                              : "bg-muted/80 hover:bg-muted text-descGray hover:text-fg border border-border/50"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Số lượng kết quả */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[13px] font-semibold text-descGray">
                  {filteredWorkouts.length} bài tập phù hợp
                  {selectedCategory === "today_plan"
                    ? " trong kế hoạch hôm nay"
                    : ""}
                </span>
                {selectedCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="text-[12px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Xem tất cả bài tập
                  </button>
                )}
              </div>

              {/* Lưới bài tập (Desktop: 2 cột, Mobile: 1 cột) */}
              {filteredWorkouts.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-dashed border-border bg-card p-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-descGray mx-auto mb-3">
                    <Search size={22} />
                  </div>
                  <h4 className="text-[15px] font-bold text-fg m-0 mb-1">
                    Không tìm thấy bài tập nào
                  </h4>
                  <p className="text-[13px] text-descGray m-0 max-w-sm mx-auto">
                    Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc danh mục hiện
                    tại.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredWorkouts.map((workout) => (
                    <WorkoutCatalogCard
                      key={workout.id}
                      workout={workout}
                      weightKg={weightKg}
                      isPlanWorkout={planExerciseIds.has(workout.id)}
                      completedLog={completedLogsMap.get(workout.id) || null}
                      onLog={(item) => setLoggingWorkout(item)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHỤ TRÊN DESKTOP (Desktop 4 cột, Sticky): Bảng hoạt động hôm nay + Lời khuyên */}
            <div className="hidden lg:block lg:col-span-4 sticky top-4 space-y-4">
              <TodayActivitySummary
                entries={entries}
                catalog={catalog}
                disabled={saving}
                onRemove={handleRemove}
                weightKg={weightKg}
              />

              {/* Card kiến thức dinh dưỡng & vận động */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-[13.5px]">
                  <Sparkles size={16} />
                  <span>Mẹo duy trì vóc dáng</span>
                </div>
                <ul className="m-0 p-0 pl-4 list-disc text-[12px] text-descGray space-y-1.5 leading-relaxed">
                  <li>
                    Kết hợp <strong>Cardio đốt mỡ</strong> và{" "}
                    <strong>Kháng lực</strong> giúp cơ thể săn chắc và giữ cơ
                    nạc.
                  </li>
                  <li>
                    Uống 200 - 300ml nước trước khi tập 15 phút để đảm bảo cân
                    bằng điện giải.
                  </li>
                  <li>
                    Ăn nhẹ với một quả chuối hoặc sữa hạt trước buổi tập 30 - 45
                    phút nếu cảm thấy đói.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal ghi nhận bài tập nhanh */}
      <QuickLogExerciseModal
        workout={loggingWorkout}
        weightKg={weightKg}
        saving={saving}
        onClose={() => setLoggingWorkout(null)}
        onSubmit={handleLogSubmit}
      />
    </div>
  );
}
