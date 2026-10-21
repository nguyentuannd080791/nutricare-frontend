/**
 * DOMAIN LAYER: CalorieBalance (SOLID: Single Responsibility Principle)
 * Độc lập hoàn toàn với React UI. Chịu trách nhiệm tính toán cân bằng năng lượng:
 * - Hạn mức cơ sở (Base Allowance) = Mục tiêu ngày - Lượng calo kế hoạch đốt
 * - Hạn mức mở khóa (Unlocked Allowance) = Hạn mức cơ sở + Calo thực tế đã đốt
 * - Calo dư thừa (Surplus) = Calo đã nạp - Hạn mức mở khóa
 * - Trạng thái đánh giá lộ trình (evaluateStatus)
 */
export class CalorieBalance {
  constructor({ fullTargetKcal = 0, plannedBurnKcal = 0, consumedKcal = 0, burnedKcal = 0 } = {}) {
    this.fullTarget = Math.round(fullTargetKcal || 0);
    this.plannedBurn = Math.round(plannedBurnKcal || 0);
    this.consumed = Math.round(consumedKcal || 0);
    this.burned = Math.round(burnedKcal || 0);
  }

  getBaseAllowance() {
    return Math.max(0, this.fullTarget - this.plannedBurn);
  }

  getUnlockedAllowance() {
    return this.getBaseAllowance() + this.burned;
  }

  getUnburnedWorkoutCalories() {
    return Math.max(0, this.plannedBurn - this.burned);
  }

  getSurplusCalories() {
    return Math.max(0, this.consumed - this.getUnlockedAllowance());
  }

  getRemainingUnlockedCalories() {
    return Math.max(0, this.getUnlockedAllowance() - this.consumed);
  }

  getIntakePercentageOfFullTarget() {
    if (this.fullTarget <= 0) return 0;
    return Math.min(Math.round((this.consumed / this.fullTarget) * 100), 100);
  }

  getUnlockedPercentageOfFullTarget() {
    if (this.fullTarget <= 0) return 0;
    return Math.min(Math.round((this.getUnlockedAllowance() / this.fullTarget) * 100), 100);
  }

  evaluateStatus(restDay = false) {
    if (restDay) {
      return {
        type: "rest_day",
        badge: "Ngày nghỉ xả hơi",
      };
    }

    const surplus = this.getSurplusCalories();
    const unburned = this.getUnburnedWorkoutCalories();

    if (surplus > 0) {
      return {
        type: "warning_surplus",
        badge: null,
      };
    }

    if (this.fullTarget > 0 && this.consumed >= this.fullTarget && unburned === 0) {
      return {
        type: "perfect_match",
        badge: "Đạt chuẩn mục tiêu hôm nay",
      };
    }

    return {
      type: "on_track",
      badge: "Đang đúng lộ trình",
    };
  }
}
