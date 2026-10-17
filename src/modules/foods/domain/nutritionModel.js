/**
 * Domain Model & Value Objects for Nutrition
 * Follows SOLID (Single Responsibility, Value Objects, Immutability)
 * Tương thích linh hoạt với cả dữ liệu tóm tắt và chi tiết vi chất từ backend NutriCare.
 */

export class NutritionFacts {
  constructor({
    calories = 0,
    protein = 0,
    carbs = 0,
    fat = 0,
    fiber = 0,
    sodium = 0,
    sugar = 0,
    purinLevel = "Thấp",
    cholesterol = 0,
    salt = 0,
  } = {}) {
    this.calories = Math.round(Number(calories) || 0);
    this.protein = Number((Number(protein) || 0).toFixed(1));
    this.carbs = Number((Number(carbs) || 0).toFixed(1));
    this.fat = Number((Number(fat) || 0).toFixed(1));
    this.fiber = Number((Number(fiber) || 0).toFixed(1));
    this.sodium = Math.round(Number(sodium) || 0);
    this.sugar = Number((Number(sugar) || 0).toFixed(1));
    this.purinLevel = purinLevel || "Thấp";
    this.cholesterol = Math.round(Number(cholesterol) || 0);
    this.salt = Number((Number(salt) || 0).toFixed(1));
    Object.freeze(this);
  }

  /**
   * Tạo instance từ đối tượng backend (summary hoặc detail)
   */
  static fromBackend(item, detail = null) {
    if (!item && !detail) return new NutritionFacts();
    const source = detail || item || {};
    const calories = source.kcal ?? source.calories ?? 0;
    const protein = source.protein_g ?? source.protein ?? 0;
    const fat = source.fat_g ?? source.fat ?? 0;
    const carbs = source.carb_g ?? source.carbs ?? 0;

    const nutrientList = detail?.nutrients || [];
    const getVal = (key) => {
      const found = nutrientList.find((n) => n.key === key || n.code === key);
      return found ? Number(found.value) || 0 : 0;
    };

    const sodium = getVal("sodium_mg") || source.sodium || 0;
    const cholesterol = getVal("cholesterol_mg") || source.cholesterol || 0;
    const salt = getVal("salt_g") || source.salt || (sodium ? Number(((sodium * 2.5) / 1000).toFixed(1)) : 0);
    const fiber = getVal("fiber_g") || source.fiber || 0;
    const sugar = getVal("sugar_g") || source.sugar || 0;

    return new NutritionFacts({
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sodium,
      sugar,
      cholesterol,
      salt,
      purinLevel: source.purinLevel || (cholesterol > 120 ? "Cao" : "Thấp"),
    });
  }

  /**
   * Tính tỷ lệ phân bổ năng lượng (% calo) từ Đạm, Tinh bột và Chất béo
   * 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
   */
  getMacroPercentages() {
    const proteinKcal = this.protein * 4;
    const carbsKcal = this.carbs * 4;
    const fatKcal = this.fat * 9;
    const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || this.calories || 1;

    return {
      protein: Math.round((proteinKcal / totalMacroKcal) * 100),
      carbs: Math.round((carbsKcal / totalMacroKcal) * 100),
      fat: Math.round((fatKcal / totalMacroKcal) * 100),
    };
  }

  /**
   * Tính phần trăm nhu cầu dinh dưỡng khuyến nghị hàng ngày (DV%)
   * Dựa trên chế độ ăn tiêu chuẩn 2000 kcal/ngày cho người trưởng thành
   */
  getDailyValuePercentages() {
    return {
      calories: Math.min(100, Math.round((this.calories / 2000) * 100)),
      protein: Math.min(100, Math.round((this.protein / 60) * 100)),
      carbs: Math.min(100, Math.round((this.carbs / 275) * 100)),
      fat: Math.min(100, Math.round((this.fat / 70) * 100)),
      fiber: Math.min(100, Math.round((this.fiber / 28) * 100)),
      sodium: Math.min(100, Math.round((this.sodium / 2000) * 100)),
      sugar: Math.min(100, Math.round((this.sugar / 50) * 100)),
      cholesterol: Math.min(100, Math.round((this.cholesterol / 300) * 100)),
    };
  }

  isHighSodium() {
    return this.sodium >= 800;
  }

  isHighSugar() {
    return this.sugar >= 15;
  }

  isHighPurin() {
    return this.purinLevel === "Cao" || this.purinLevel === "Nghiêm ngặt";
  }

  isHighFat() {
    return this.fat >= 25;
  }
}
