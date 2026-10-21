/**
 * DOMAIN LAYER: Quản lý danh mục bài tập & công thức tính calo theo MET (SOLID: SRP)
 * Độc lập hoàn toàn với React UI.
 * Tên bài tập được tinh gọn, tập trung chuẩn xác vào tên bài tập thay vì mô tả công dụng.
 * Công thức calo chuẩn y khoa: Calo đốt = (MET - 1) × Cân nặng (kg) × (Thời gian (phút) / 60)
 */

export const WORKOUT_CATEGORIES = [
  { id: "all", label: "Tất cả bài tập" },
  { id: "cardio", label: "Cardio & Đốt mỡ" },
  { id: "strength", label: "Sức mạnh & Kháng lực" },
  { id: "core", label: "Cơ lõi & Cột sống" },
  { id: "flexibility", label: "Giãn cơ & Yoga" },
  { id: "rehab", label: "Dưỡng sinh & Nhẹ nhàng" },
];

export const WORKOUT_CATALOG = [
  {
    id: "brisk_walking",
    title: "Đi bộ nhanh",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "light",
    intensityLabel: "Cường độ nhẹ",
    met: 4.3,
    defaultMinutes: 30,
    equipment: "Giày đi bộ",
    muscles: ["Bắp chân", "Đùi trước", "Tim mạch"],
  },
  {
    id: "walking",
    title: "Đi bộ thong thả",
    category: "rehab",
    categoryLabel: "Dưỡng sinh & Nhẹ nhàng",
    intensity: "light",
    intensityLabel: "Cường độ nhẹ",
    met: 3.5,
    defaultMinutes: 30,
    equipment: "Không cần dụng cụ",
    muscles: ["Chân", "Khớp hông"],
  },
  {
    id: "jogging",
    title: "Chạy bộ nhẹ",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "medium",
    intensityLabel: "Cường độ vừa",
    met: 7.0,
    defaultMinutes: 25,
    equipment: "Giày chạy bộ",
    muscles: ["Đùi", "Mông", "Tim mạch"],
  },
  {
    id: "running",
    title: "Chạy bộ nhanh",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "high",
    intensityLabel: "Cường độ cao",
    met: 9.8,
    defaultMinutes: 20,
    equipment: "Giày chạy bộ",
    muscles: ["Toàn thân", "Đùi", "Tim mạch"],
  },
  {
    id: "hiit",
    title: "HIIT",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "high",
    intensityLabel: "Cường độ cao",
    met: 9.5,
    defaultMinutes: 20,
    equipment: "Không cần dụng cụ",
    muscles: ["Toàn thân", "Cơ lõi", "Vai"],
  },
  {
    id: "jump_rope",
    title: "Nhảy dây",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "high",
    intensityLabel: "Cường độ cao",
    met: 11.8,
    defaultMinutes: 15,
    equipment: "Dây nhảy thể lực",
    muscles: ["Cẳng chân", "Bắp đùi", "Cánh tay"],
  },
  {
    id: "cycling_light",
    title: "Đạp xe nhẹ",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "light",
    intensityLabel: "Cường độ nhẹ",
    met: 4.0,
    defaultMinutes: 30,
    equipment: "Xe đạp / Xe đạp tập",
    muscles: ["Cơ đùi trước", "Cơ mông"],
  },
  {
    id: "cycling_moderate",
    title: "Đạp xe vừa",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "medium",
    intensityLabel: "Cường độ vừa",
    met: 8.0,
    defaultMinutes: 30,
    equipment: "Xe đạp / Xe đạp tập",
    muscles: ["Đùi trước", "Đùi sau", "Mông"],
  },
  {
    id: "swimming",
    title: "Bơi lội",
    category: "cardio",
    categoryLabel: "Cardio & Đốt mỡ",
    intensity: "medium",
    intensityLabel: "Cường độ vừa",
    met: 6.0,
    defaultMinutes: 30,
    equipment: "Hồ bơi",
    muscles: ["Lưng", "Vai", "Ngực", "Chân"],
  },
  {
    id: "strength",
    title: "Tập tạ / Kháng lực",
    category: "strength",
    categoryLabel: "Sức mạnh & Kháng lực",
    intensity: "medium",
    intensityLabel: "Cường độ vừa",
    met: 5.0,
    defaultMinutes: 30,
    equipment: "Tạ tay / Máy tập",
    muscles: ["Ngực", "Lưng", "Tay", "Vai"],
  },
  {
    id: "bodyweight_squats",
    title: "Squat & Lunge",
    category: "strength",
    categoryLabel: "Sức mạnh & Kháng lực",
    intensity: "medium",
    intensityLabel: "Cường độ vừa",
    met: 6.0,
    defaultMinutes: 20,
    equipment: "Không cần dụng cụ",
    muscles: ["Tứ đầu đùi", "Cơ mông lớn", "Gân kheo"],
  },
  {
    id: "pushups",
    title: "Hít đất",
    category: "strength",
    categoryLabel: "Sức mạnh & Kháng lực",
    intensity: "medium",
    intensityLabel: "Cường độ vừa",
    met: 5.8,
    defaultMinutes: 20,
    equipment: "Thảm tập",
    muscles: ["Ngực lớn", "Tay sau", "Vai trước"],
  },
  {
    id: "plank",
    title: "Plank",
    category: "core",
    categoryLabel: "Cơ lõi & Cột sống",
    intensity: "medium",
    intensityLabel: "Cường độ vừa",
    met: 5.0,
    defaultMinutes: 15,
    equipment: "Thảm tập",
    muscles: ["Cơ bụng ngang", "Cơ thẳng bụng", "Thắt lưng"],
  },
  {
    id: "deadbug",
    title: "Deadbug & Cầu mông",
    category: "core",
    categoryLabel: "Cơ lõi & Cột sống",
    intensity: "light",
    intensityLabel: "Cường độ nhẹ",
    met: 4.2,
    defaultMinutes: 20,
    equipment: "Thảm tập",
    muscles: ["Bụng dưới", "Sàn chậu", "Mông"],
  },
  {
    id: "yoga",
    title: "Yoga",
    category: "flexibility",
    categoryLabel: "Giãn cơ & Yoga",
    intensity: "light",
    intensityLabel: "Cường độ nhẹ",
    met: 2.5,
    defaultMinutes: 30,
    equipment: "Thảm yoga",
    muscles: ["Cột sống", "Gân kheo", "Vai"],
  },
  {
    id: "stretching",
    title: "Giãn cơ",
    category: "flexibility",
    categoryLabel: "Giãn cơ & Yoga",
    intensity: "light",
    intensityLabel: "Cường độ nhẹ",
    met: 2.8,
    defaultMinutes: 20,
    equipment: "Thảm tập",
    muscles: ["Toàn bộ hệ cơ", "Gân gót"],
  },
  {
    id: "aerobics",
    title: "Thể dục nhịp điệu (Aerobic)",
    category: "rehab",
    categoryLabel: "Dưỡng sinh & Nhẹ nhàng",
    intensity: "light",
    intensityLabel: "Cường độ nhẹ",
    met: 4.0,
    defaultMinutes: 30,
    equipment: "Không cần dụng cụ",
    muscles: ["Tim mạch", "Khớp vai", "Hông"],
  },
];

/**
 * Tính lượng calo đốt theo công thức MET chuẩn y khoa (khớp backend exerciseCalories.js)
 */
export function calcBurnedCalories(met, minutes, weightKg = 65) {
  const restingMet = 1;
  const extraMet = Math.max(0.5, met - restingMet);
  const hours = (minutes || 0) / 60;
  return Math.round(extraMet * (weightKg || 65) * hours);
}

/**
 * Lọc và tìm kiếm bài tập trong danh mục
 */
export function filterWorkouts(catalog, { query = "", category = "all" } = {}) {
  const q = query.trim().toLowerCase();

  return catalog.filter((item) => {
    // Lọc theo thể loại
    if (category !== "all" && item.category !== category) {
      return false;
    }

    // Lọc theo từ khóa tìm kiếm
    if (q) {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.categoryLabel.toLowerCase().includes(q);
      const matchMuscles = item.muscles.some((m) => m.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchMuscles;
    }

    return true;
  });
}
