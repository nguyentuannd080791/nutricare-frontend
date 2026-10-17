/**
 * DOMAIN LAYER: BMI Engine & WHO Standard (SOLID: Single Responsibility Principle)
 * Độc lập hoàn toàn với React UI. Chịu trách nhiệm:
 * - Định nghĩa tiêu chuẩn đánh giá thể trạng toàn cầu của WHO
 * - Tính toán chỉ số BMI, phân loại thể trạng
 * - Tính khoảng cân nặng lý tưởng (18.5 - 24.9)
 * - Tính tỷ lệ trao đổi chất cơ bản (BMR) & tổng tiêu hao năng lượng (TDEE)
 * - Tính toán độ lệch và xu hướng cân nặng qua các lần đo
 */

export const WHO_BMI_STANDARD = {
  id: "who",
  name: "Chuẩn Quốc Tế (WHO)",
  description: "Tiêu chuẩn đánh giá thể trạng toàn cầu của Tổ chức Y tế Thế giới",
  ranges: [
    {
      key: "underweight",
      label: "Thiếu cân",
      minBmi: 0,
      maxBmi: 18.49,
      color: "#EA580C",
      bgColor: "#FFF7ED",
      borderColor: "#FED7AA",
      badgeText: "Thiếu cân",
      risk: "Nguy cơ suy dinh dưỡng, giảm sức đề kháng",
      advice:
        "Cần tăng lượng calo nạp hằng ngày, bổ sung thực phẩm giàu đạm lành mạnh và tập kháng lực để tăng khối cơ.",
    },
    {
      key: "normal",
      label: "Bình thường (Cân đối)",
      minBmi: 18.5,
      maxBmi: 24.99,
      color: "#059669",
      bgColor: "#ECFDF5",
      borderColor: "#A7F3D0",
      badgeText: "Cân đối lý tưởng",
      risk: "Nguy cơ bệnh lý chuyển hoá thấp nhất",
      advice:
        "Thể trạng rất tốt! Tiếp tục duy trì chế độ dinh dưỡng cân đối và tập thể dục thể thao đều đặn 150 phút/tuần.",
    },
    {
      key: "overweight",
      label: "Thừa cân",
      minBmi: 25.0,
      maxBmi: 29.99,
      color: "#D97706",
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
      badgeText: "Thừa cân",
      risk: "Tăng nguy cơ bệnh tim mạch, mỡ máu và huyết áp",
      advice:
        "Nên thâm hụt calo nhẹ khoảng 300 - 500 kcal/ngày, giảm thực phẩm chế biến sẵn và tăng thời lượng vận động cardio.",
    },
    {
      key: "obese",
      label: "Béo phì",
      minBmi: 30.0,
      maxBmi: 99.0,
      color: "#DC2626",
      bgColor: "#FEF2F2",
      borderColor: "#FECACA",
      badgeText: "Béo phì",
      risk: "Nguy cơ rất cao về gan nhiễm mỡ, tiểu đường type 2 và tim mạch",
      advice:
        "Cần xây dựng lộ trình giảm cân nghiêm ngặt, kiểm soát khẩu phần định lượng và theo dõi thể trạng định kỳ.",
    },
  ],
};

export class BmiEngine {
  /**
   * Tính chỉ số BMI từ cân nặng (kg) và chiều cao (cm)
   */
  static calculateScore(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }

  /**
   * Xác định nhóm thể trạng theo chuẩn WHO
   */
  static getCategory(score) {
    for (const r of WHO_BMI_STANDARD.ranges) {
      if (score <= r.maxBmi) {
        return r;
      }
    }
    return WHO_BMI_STANDARD.ranges[WHO_BMI_STANDARD.ranges.length - 1];
  }

  /**
   * Tính khoảng cân nặng lý tưởng theo chuẩn WHO (BMI 18.5 - 24.9)
   */
  static getIdealWeightRange(heightCm) {
    if (!heightCm || heightCm <= 0) return { min: 0, max: 0 };
    const heightM = heightCm / 100;
    const hSquared = heightM * heightM;
    return {
      min: Number((18.5 * hSquared).toFixed(1)),
      max: Number((24.9 * hSquared).toFixed(1)),
    };
  }

  /**
   * Tính BMR theo công thức Mifflin-St Jeor
   */
  static calculateBMR(weightKg, heightCm, age = 26, isMale = true) {
    if (!weightKg || !heightCm) return 0;
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return Math.round(isMale ? base + 5 : base - 161);
  }

  /**
   * Tính TDEE theo hệ số hoạt động (mặc định vận động nhẹ: 1.375)
   */
  static calculateTDEE(bmr, activityMultiplier = 1.375) {
    return Math.round(bmr * activityMultiplier);
  }

  /**
   * So sánh độ lệch với lần đo liền trước
   */
  static calculateDelta(currentRecord, previousRecord) {
    if (!previousRecord || !currentRecord) return null;
    const weightDiff = Number((currentRecord.weightKg - previousRecord.weightKg).toFixed(1));
    const bmiDiff = Number((currentRecord.bmi - previousRecord.bmi).toFixed(1));

    return {
      weightDiff,
      bmiDiff,
      isDecrease: weightDiff < 0,
      isIncrease: weightDiff > 0,
      isNeutral: weightDiff === 0,
      previousDateDisplay: previousRecord.dateDisplay || previousRecord.date,
      previousWeight: previousRecord.weightKg,
      previousBmi: previousRecord.bmi,
    };
  }
}
