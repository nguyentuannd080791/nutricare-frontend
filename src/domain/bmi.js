// Phân loại theo chuẩn WHO Châu Á — chỉ phục vụ hiển thị nhãn/màu (giá trị BMI do server tính).
export function classifyBMI(bmi) {
  if (bmi < 18.5) return { label: "Thiếu cân", color: "#2563EB" };
  if (bmi < 23) return { label: "Bình thường", color: "#059669" };
  if (bmi < 25) return { label: "Thừa cân", color: "#D97706" };
  if (bmi < 30) return { label: "Béo phì độ I", color: "#EA580C" };
  return { label: "Béo phì độ II", color: "#DC2626" };
}
