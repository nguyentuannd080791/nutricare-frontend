// Nhãn hiển thị cho các danh sách lựa chọn. Công thức, hệ số và ngưỡng nghiệp
// vụ nằm ở backend (domain/constants.js) — client chỉ cần id + nhãn để hiển thị
// và gửi id lên.

export const CONDITION_TYPES = [
  { id: "BENH_NEN", label: "Bệnh nền" },
  { id: "DI_UNG", label: "Dị ứng" },
  { id: "CHI_DINH_BAC_SI", label: "Chỉ định của bác sĩ" },
];

// changeVerb: có mặt ⇒ mục tiêu theo số cân, người dùng phải nhập số kg muốn
// giảm/tăng + thời gian (server kiểm tra tốc độ/BMI an toàn và tính calo).
export const GOALS = [
  { id: "giam_can", label: "Giảm cân", desc: "Thâm hụt calo để giảm mỡ", changeVerb: "giảm" },
  { id: "giu_dang", label: "Giữ dáng / Duy trì", desc: "Giữ nguyên cân nặng hiện tại" },
  { id: "tang_can", label: "Tăng cân", desc: "Thặng dư calo để tăng cân", changeVerb: "tăng" },
  { id: "tang_co", label: "Tăng cơ", desc: "Thặng dư nhẹ, ưu tiên đạm cao" },
];

export const ACTIVITY_LEVELS = [
  { id: "it", label: "Ít vận động", desc: "Ngồi nhiều, ít/không tập luyện" },
  { id: "nhe", label: "Nhẹ", desc: "Tập nhẹ 1–3 ngày/tuần" },
  { id: "vua", label: "Vừa phải", desc: "Tập vừa 3–5 ngày/tuần" },
  { id: "nhieu", label: "Nhiều", desc: "Tập nặng 6–7 ngày/tuần" },
  { id: "rat_nhieu", label: "Rất nhiều", desc: "Vận động viên / lao động nặng" },
];

const DURATIONS = [3, 6, 9, 12]; // tháng
export const DURATION_OPTIONS = DURATIONS.map((d) => ({ id: String(d), label: `${d} tháng` }));

export const MEAL_TYPES = [
  { id: "sang", label: "Sáng" },
  { id: "trua", label: "Trưa" },
  { id: "toi", label: "Tối" },
  { id: "an_vat", label: "Ăn vặt" },
];

export const mealLabel = (slotId) => MEAL_TYPES.find((m) => m.id === slotId)?.label ?? slotId;
