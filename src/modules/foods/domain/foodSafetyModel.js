/**
 * FoodSafetyModel
 * Evaluates food contraindications, allergens, and doctor prescriptions
 * Follows SOLID (Single Responsibility, Open/Closed)
 */

export const SafetyLevel = Object.freeze({
  DANGER: "DANGER",   // Cảnh báo đỏ nguy hiểm / Chống chỉ định
  CAUTION: "CAUTION", // Cần thận trọng
  SAFE: "SAFE",       // Phù hợp, an toàn
});

export class FoodSafetyModel {
  /**
   * Đánh giá mức độ an toàn của thực phẩm
   * @param {Object} item - Món ăn / thực phẩm từ backend (hoặc detail)
   * @param {Array} userConditions - Danh sách bệnh nền / dị ứng của người dùng
   * @returns {Object} Kết quả đánh giá
   */
  static evaluate(item, userConditions = []) {
    if (!item) {
      return {
        hasRedWarning: false,
        safetyLevel: SafetyLevel.SAFE,
        conflicts: [],
        primaryConditionName: null,
      };
    }

    const rawConflicts = item.conflicts || [];
    const conflicts = rawConflicts.map((cName) => {
      const isAllergy =
        cName.toLowerCase().includes("dị ứng") ||
        (userConditions || []).some(
          (u) => u.name === cName && u.type === "DI_UNG"
        );

      return {
        conditionName: cName,
        conditionType: isAllergy ? "DI_UNG" : "CHONG_CHI_DINH",
        severity: SafetyLevel.DANGER,
        reason: `Món ăn có thành phần hoặc dưỡng chất vi phạm chỉ định của: ${cName}`,
        recommendation: isAllergy
          ? "Tránh tuyệt đối! Nguy cơ phản ứng dị ứng hoặc sốc phản vệ."
          : "Nên hạn chế hoặc trao đổi với chuyên gia dinh dưỡng trước khi dùng.",
      };
    });

    const hasRedWarning = conflicts.length > 0;
    const safetyLevel = hasRedWarning ? SafetyLevel.DANGER : SafetyLevel.SAFE;

    return {
      hasRedWarning,
      safetyLevel,
      conflicts,
      totalConflicts: conflicts.length,
      primaryConditionName: conflicts[0]?.conditionName || null,
      primaryWarningReason: conflicts[0]?.reason || null,
    };
  }
}
