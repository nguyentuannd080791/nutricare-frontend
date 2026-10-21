// ============================================================================
// DOMAIN LAYER: VALUE OBJECTS, SLOTS & DISH REPOSITORY (SOLID: SRP, CLEAN CODE)
// ============================================================================
import { dateKey } from "../../../shared/domain/planCycle";

export const MEAL_SLOT_CONFIGS = [
  {
    id: "sang",
    aliases: ["breakfast", "sang"],
    label: "Bữa sáng",
    time: "07:00",
    ratio: 0.25,
    tag: "Khởi đầu năng lượng",
    accent: "#059669",
    bg: "#ECFDF5",
  },
  {
    id: "trua",
    aliases: ["lunch", "trua"],
    label: "Bữa trưa",
    time: "12:00",
    ratio: 0.35,
    tag: "Bữa chính giàu đạm",
    accent: "#0284C7",
    bg: "#F0F9FF",
  },
  {
    id: "an_vat",
    aliases: ["snack", "an_vat", "phu", "xe"],
    label: "Bữa xế chiều",
    time: "15:30",
    ratio: 0.15,
    tag: "Phục hồi & no lâu",
    accent: "#EA580C",
    bg: "#FFF7ED",
  },
  {
    id: "toi",
    aliases: ["dinner", "toi"],
    label: "Bữa tối",
    time: "19:00",
    ratio: 0.25,
    tag: "Thanh đạm, dễ tiêu",
    accent: "#7C3AED",
    bg: "#F5F3FF",
  },
];

export const CYCLE_OPTIONS = [3, 5, 7, 14, 21, 30];
export const MONTH_OPTIONS = [1, 2, 3, 6];

export function normalizeSlotId(slot) {
  if (!slot) return "sang";
  const s = String(slot).toLowerCase().trim();
  for (const cfg of MEAL_SLOT_CONFIGS) {
    if (cfg.aliases.includes(s)) return cfg.id;
  }
  return "sang";
}

export function getSlotConfig(slot) {
  const normalized = normalizeSlotId(slot);
  return (
    MEAL_SLOT_CONFIGS.find((c) => c.id === normalized) || MEAL_SLOT_CONFIGS[0]
  );
}

// Kho món ăn chuẩn dinh dưỡng phân chia theo 4 buổi trong ngày
export const DISH_DATABASE = [
  // --- BỮA SÁNG (sang) ---
  {
    id: "bf-1",
    name: "Phở Gà Xé Nước Trong & Rau Thơm",
    slot: "sang",
    category: "mon_sang",
    categoryLabel: "Điểm tâm nước",
    calories: 420,
    protein: 34,
    carbs: 58,
    fat: 6.5,
    serving: "1 tô vừa (450g)",
    desc: "Nước dùng gà hầm gừng hành nướng, bánh phở tươi ít béo",
  },
  {
    id: "bf-2",
    name: "Cháo Yến Mạch Thịt Bằm & Trứng Gà Ta",
    slot: "sang",
    category: "mon_sang",
    categoryLabel: "Điểm tâm nước",
    calories: 385,
    protein: 26,
    carbs: 48,
    fat: 8.5,
    serving: "1 tô ấm (400g)",
    desc: "Yến Mạch Úc nguyên cám, thịt thăn nạc băm nhỏ và lòng đào",
  },
  {
    id: "bf-3",
    name: "Bánh Mì Nguyên Cám Trứng Ốp La & Bơ Dầm",
    slot: "sang",
    category: "mon_sang",
    categoryLabel: "Bánh mì & Tinh bột tốt",
    calories: 410,
    protein: 22,
    carbs: 44,
    fat: 16.0,
    serving: "2 lát bánh + 1 trứng + 1/2 quả bơ",
    desc: "Bánh mì lúa mạch đen nướng giòn kèm bơ sáp 0% cholesterol",
  },
  {
    id: "bf-4",
    name: "Hủ Tiếu Nam Vang Tôm Thịt Thanh Đạm",
    slot: "sang",
    category: "mon_sang",
    categoryLabel: "Điểm tâm nước",
    calories: 440,
    protein: 31,
    carbs: 62,
    fat: 7.2,
    serving: "1 tô (480g)",
    desc: "Tôm sú tươi, thịt thăn heo luộc, nước củ cải ngọt tự nhiên",
  },
  {
    id: "bf-5",
    name: "Bún Mọc Dọc Mùng Sườn Nạc Hà Nội",
    slot: "sang",
    category: "mon_sang",
    categoryLabel: "Điểm tâm nước",
    calories: 395,
    protein: 28,
    carbs: 52,
    fat: 8.0,
    serving: "1 tô (450g)",
    desc: "Mọc nạc trộn mộc nhĩ nấm hương, dọc mùng thanh nhiệt",
  },
  {
    id: "bf-6",
    name: "Xôi Yến Mạch Hạt Sen & Ức Gà Xé Phay",
    slot: "sang",
    category: "mon_sang",
    categoryLabel: "Bánh mì & Tinh bột tốt",
    calories: 430,
    protein: 32,
    carbs: 54,
    fat: 7.5,
    serving: "1 đĩa vừa (250g)",
    desc: "Hạt sen Huế ninh mềm, ức gà luộc xé trộn tiêu chanh",
  },

  // --- BỮA TRƯA (trua) ---
  {
    id: "lu-1",
    name: "Cơm Gạo Lứt Ức Gà Áp Chảo & Bông Cải Xanh",
    slot: "trua",
    category: "mon_chinh",
    categoryLabel: "Món chính cân đối",
    calories: 590,
    protein: 45,
    carbs: 68,
    fat: 12.0,
    serving: "1 chén cơm gạo lứt + 180g ức gà + bông cải hấp",
    desc: "Ức gà ướp sốt teriyaki ít muối, bổ sung dồi dào chất xơ",
  },
  {
    id: "lu-2",
    name: "Cá Hồi Nướng Măng Tây & Khoai Lang Hấp",
    slot: "trua",
    category: "mon_chinh",
    categoryLabel: "Món chính cân đối",
    calories: 610,
    protein: 42,
    carbs: 55,
    fat: 20.0,
    serving: "150g fillet cá hồi + 1 củ khoai lang Nhật + măng tây",
    desc: "Giàu Omega-3 kháng viêm tự nhiên, tinh bột hấp thu chậm",
  },
  {
    id: "lu-3",
    name: "Bò Xào Ớt Chuông Nấm Đùi Gà & Cơm Hạt Quinoa",
    slot: "trua",
    category: "mon_chinh",
    categoryLabel: "Món chính cân đối",
    calories: 580,
    protein: 48,
    carbs: 60,
    fat: 14.5,
    serving: "160g bắp bò hoa + ớt chuông 3 màu + 1 chén cơm quinoa",
    desc: "Tăng cường sắt và kẽm sinh học, giàu chất chống oxy hóa",
  },
  {
    id: "lu-4",
    name: "Tôm Sú Hấp Nước Dừa & Salad Bơ Trứng Luộc",
    slot: "trua",
    category: "mon_chinh",
    categoryLabel: "Món chính cân đối",
    calories: 560,
    protein: 46,
    carbs: 45,
    fat: 16.0,
    serving: "180g tôm sú + 1/2 quả bơ + 1 quả trứng gà ta",
    desc: "Đạm tinh khiết từ hải sản biển, vị ngọt thanh tự nhiên",
  },
  {
    id: "lu-5",
    name: "Đậu Hũ Nhồi Thịt Nạc Hấp Nấm Mèo Sốt Cà",
    slot: "trua",
    category: "mon_chinh",
    categoryLabel: "Món chính cân đối",
    calories: 540,
    protein: 38,
    carbs: 52,
    fat: 15.0,
    serving: "3 bìa đậu hũ nhồi + chén cơm gạo lứt nhỏ",
    desc: "Kết hợp đạm thực vật isoflavone và thịt thăn heo xay",
  },
  {
    id: "lu-6",
    name: "Bún Bò Huế Nạc Hoa Bắp Cải Tươi",
    slot: "trua",
    category: "mon_chinh",
    categoryLabel: "Món chính cân đối",
    calories: 620,
    protein: 44,
    carbs: 72,
    fat: 13.5,
    serving: "1 tô lớn (150g bắp bò nạc, không mỡ màng)",
    desc: "Nước dùng hầm xương sả gừng thanh vị, ăn kèm bắp chuối",
  },

  // --- BỮA XẾ (an_vat) ---
  {
    id: "sn-1",
    name: "Sữa Chua Hy Lạp Hạt Chia & Việt Quất",
    slot: "an_vat",
    category: "an_nhe",
    categoryLabel: "Tráng miệng & Ăn xế",
    calories: 220,
    protein: 16,
    carbs: 24,
    fat: 4.5,
    serving: "1 hũ 150g + 1 muỗng hạt chia + quả mọng",
    desc: "Men vi sinh Probiotics dồi dào bảo vệ hệ tiêu hóa đường ruột",
  },
  {
    id: "sn-2",
    name: "Sinh Tố Bơ Chuối Hạnh Nhân Không Đường",
    slot: "an_vat",
    category: "an_nhe",
    categoryLabel: "Thức uống dinh dưỡng",
    calories: 240,
    protein: 8,
    carbs: 32,
    fat: 9.5,
    serving: "1 ly lớn (300ml)",
    desc: "Cung cấp năng lượng tức thì và kali chống co rút cơ bắp",
  },
  {
    id: "sn-3",
    name: "Hạt Hỗn Hợp Hạnh Nhân, Óc Chó & Táo Xanh",
    slot: "an_vat",
    category: "an_nhe",
    categoryLabel: "Hạt & Trái cây",
    calories: 210,
    protein: 7,
    carbs: 20,
    fat: 12.0,
    serving: "30g hạt sấy khô + 1 quả táo xanh giòn",
    desc: "Chất béo đơn không bão hòa tốt cho tim mạch và não bộ",
  },
  {
    id: "sn-4",
    name: "Bánh Pancake Yến Mạch Chuối & Mật Ong Rừng",
    slot: "an_vat",
    category: "an_nhe",
    categoryLabel: "Tráng miệng & Ăn xế",
    calories: 230,
    protein: 11,
    carbs: 38,
    fat: 3.5,
    serving: "2 chiếc bánh nhỏ kèm 1 thìa mật ong",
    desc: "Không bột mì, hoàn toàn từ yến mạch xay mịn và lòng trắng",
  },
  {
    id: "sn-5",
    name: "Trứng Gà Ta Luộc Lòng Đào & Trà Xanh Hoa Nhài",
    slot: "an_vat",
    category: "an_nhe",
    categoryLabel: "Tráng miệng & Ăn xế",
    calories: 160,
    protein: 14,
    carbs: 2,
    fat: 10.0,
    serving: "2 quả trứng luộc + tách trà ấm",
    desc: "Nhanh gọn, đạm nguyên bản tinh khiết, 0g tinh bột xấu",
  },
  {
    id: "sn-6",
    name: "Sữa Hạt Macca Hạt Sen Tươi Không Đường",
    slot: "an_vat",
    category: "an_nhe",
    categoryLabel: "Thức uống dinh dưỡng",
    calories: 190,
    protein: 6,
    carbs: 18,
    fat: 11.0,
    serving: "1 chai 250ml thanh trùng",
    desc: "Hương thơm dịu dàng, an thần nhẹ nhàng cho buổi chiều tập trung",
  },

  // --- BỮA TỐI (toi) ---
  {
    id: "di-1",
    name: "Cá Chẽm Hấp Hành Gừng & Canh Cải Xanh Nấu Nấm",
    slot: "toi",
    category: "mon_chinh",
    categoryLabel: "Món tối nhẹ bụng",
    calories: 430,
    protein: 38,
    carbs: 35,
    fat: 8.5,
    serving: "160g cá chẽm + 1 chén canh cải + 1/2 chén cơm lứt",
    desc: "Thịt cá trắng mềm ngọt, tiêu hóa nhanh không gây ậm ạch",
  },
  {
    id: "di-2",
    name: "Gỏi Cuốn Tôm Thịt Nạc Chấm Tương Bơ Đậu Phộng",
    slot: "toi",
    category: "mon_chinh",
    categoryLabel: "Món tối nhẹ bụng",
    calories: 410,
    protein: 30,
    carbs: 48,
    fat: 9.0,
    serving: "3 cuốn lớn đầy đặn rau sống",
    desc: "Đầy đủ chất đạm, tinh bột chậm và rau xanh giòn mát",
  },
  {
    id: "di-3",
    name: "Canh Chua Cá Lóc Đồng Nam Bộ & 1/2 Bát Cơm Lứt",
    slot: "toi",
    category: "mon_chinh",
    categoryLabel: "Món tối nhẹ bụng",
    calories: 420,
    protein: 34,
    carbs: 42,
    fat: 6.0,
    serving: "1 tô lớn nhiều cá và dọc mùng, đậu bắp",
    desc: "Vị chua thanh mát kích thích vị giác, ngủ ngon giấc hơn",
  },
  {
    id: "di-4",
    name: "Thịt Thăn Heo Nướng Thảo Mộc & Xà Lách Trộn Dầu Giấm",
    slot: "toi",
    category: "mon_chinh",
    categoryLabel: "Món tối nhẹ bụng",
    calories: 440,
    protein: 39,
    carbs: 28,
    fat: 13.0,
    serving: "150g thăn heo nạc nướng + đĩa xà lách Roman",
    desc: "Hương thơm lá xạ hương và oregano, hạn chế tối đa tinh bột",
  },
  {
    id: "di-5",
    name: "Mực Ống Hấp Gừng Tươi & Canh Rau Củ Thập Cẩm",
    slot: "toi",
    category: "mon_chinh",
    categoryLabel: "Món tối nhẹ bụng",
    calories: 390,
    protein: 36,
    carbs: 32,
    fat: 5.5,
    serving: "150g mực ống giòn + 1 tô canh củ sen cà rốt",
    desc: "Calo cực thấp, phù hợp ngày có mục tiêu thâm hụt calo sâu",
  },
  {
    id: "di-6",
    name: "Cháo Cá Chép Nấu Nấm Rơm & Hành Hoa Tiêu Đen",
    slot: "toi",
    category: "mon_chinh",
    categoryLabel: "Món tối nhẹ bụng",
    calories: 400,
    protein: 29,
    carbs: 50,
    fat: 7.0,
    serving: "1 tô ấm nóng (450g)",
    desc: "Ấm bụng, bổ khí huyết và phục hồi thể lực sau ngày làm việc",
  },
];

/**
 * Tính ngày bắt đầu chu kỳ sao cho ngày hiện tại (Hôm nay) luôn nằm trong chu kỳ
 */
export function getCycleStartDate(cycleDays) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (cycleDays === 3) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return d;
  }

  if (cycleDays === 5) {
    const d = new Date(now);
    d.setDate(d.getDate() - 2);
    return d;
  }

  // Các chu kỳ tuần (7, 14, 21, 30 ngày):
  // Bắt đầu từ Thứ 2 của tuần hiện tại để Tuần 1 luôn chứa ngày Hôm nay
  const day = now.getDay();
  const diff = (day + 6) % 7; // Thứ 2 = 0, CN = 6
  const d = new Date(now);
  d.setDate(d.getDate() - diff);
  return d;
}

/**
 * Tìm đúng 3 lựa chọn thay thế trong cùng hệ thực phẩm và slot
 */
export function getSwapAlternatives(currentMeal, currentDish) {
  const slot = normalizeSlotId(currentMeal.mealSlot || currentMeal.slotId);
  const targetCalories =
    currentDish?.calories || currentMeal?.kcal || Math.round(currentMeal?.macros?.protein_g * 4 + currentMeal?.macros?.carb_g * 4 + currentMeal?.macros?.fat_g * 9) || 450;

  // 1. Kiểm tra nếu backend đã cung cấp swapCandidates trong meal hoặc items
  const serverCandidates = [];
  if (Array.isArray(currentMeal.swapCandidates)) {
    for (const c of currentMeal.swapCandidates) {
      if (!c.dishId || c.dishId === currentDish?.id || c.dishId === currentMeal?.dishId) continue;
      const kcal = c.kcal || Math.round((c.macros?.protein_g || 0) * 4 + (c.macros?.carb_g || 0) * 4 + (c.macros?.fat_g || 0) * 9) || 400;
      serverCandidates.push({
        id: c.dishId,
        dishId: c.dishId,
        name: c.nameVi || c.name || "Món thay thế",
        calories: Math.round(kcal),
        protein: Math.round(c.macros?.protein_g || 25),
        carbs: Math.round(c.macros?.carb_g || 40),
        fat: Math.round(c.macros?.fat_g || 10),
        serving: c.serving || "1 phần chuẩn",
        desc: c.desc || "Món ăn cân đối dinh dưỡng đã lọc theo thể trạng",
        slot,
      });
    }
  }

  // 2. Lọc các món cùng buổi từ DISH_DATABASE
  const dbCandidates = DISH_DATABASE.filter(
    (d) => d.slot === slot && d.id !== currentDish?.id && d.name !== currentDish?.name
  );

  // Gộp danh sách, loại trùng tên hoặc ID
  const pool = [...serverCandidates];
  for (const d of dbCandidates) {
    if (!pool.some((p) => p.id === d.id || p.name === d.name)) {
      pool.push(d);
    }
  }

  // Sắp xếp theo mức độ chênh lệch calo gần nhất
  pool.sort(
    (a, b) =>
      Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
  );

  // Lấy chính xác 3 lựa chọn tốt nhất
  return pool.slice(0, 3);
}

/**
 * Chuyển đổi dữ liệu plan từ backend hoặc mock thành ViewModel hoàn chỉnh
 */
export function buildPlanViewModel(plan, targetCalories = 1850, userProgress = {}) {
  const cycleDays = plan?.days?.length || 7;
  const startDate = getCycleStartDate(cycleDays);
  const nowZero = new Date();
  nowZero.setHours(0, 0, 0, 0);

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dayFullNames = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  const days = [];

  for (let dayIdx = 0; dayIdx < cycleDays; dayIdx++) {
    const rawDay = plan?.days?.[dayIdx] || null;
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + dayIdx);
    dayDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dayDate.getTime() - nowZero.getTime()) / 86400000);
    const isToday = diffDays === 0;
    const isPast = diffDays < 0;
    const isFuture = diffDays > 0;
    const dateKeyStr = dateKey(dayDate);

    const dayOfWeekShort = dayNames[dayDate.getDay()];
    const dayOfWeekFull = dayFullNames[dayDate.getDay()];
    const dateFormatted = `${dayDate.getDate()}/${String(dayDate.getMonth() + 1).padStart(2, "0")}`;

    // 4 slot bữa ăn chuẩn
    const meals = MEAL_SLOT_CONFIGS.map((slotConfig) => {
      // Tìm bữa tương ứng từ rawDay nếu có
      const rawMeal = rawDay?.meals?.find(
        (m) => normalizeSlotId(m.mealSlot || m.slotId) === slotConfig.id
      );

      // Trạng thái đã ăn: kiểm tra trong userProgress[dateKeyStr] hoặc local state
      const progressEaten = userProgress?.[dateKeyStr]?.[slotConfig.id];
      const completed = Boolean(progressEaten);

      // Thông tin món ăn
      let dish;
      if (rawMeal) {
        const kcal = Math.round(rawMeal.kcal || (rawMeal.dish?.calories) || 400);
        const protein = Math.round(rawMeal.macros?.protein_g || rawMeal.dish?.protein || 25);
        const carbs = Math.round(rawMeal.macros?.carb_g || rawMeal.dish?.carbs || 50);
        const fat = Math.round(rawMeal.macros?.fat_g || rawMeal.dish?.fat || 10);
        dish = {
          id: rawMeal.dishId || rawMeal.dish?.id || `dish-${dayIdx}-${slotConfig.id}`,
          name: rawMeal.nameVi || rawMeal.dish?.name || "Món ăn cân bằng",
          calories: kcal,
          protein,
          carbs,
          fat,
          serving: rawMeal.serving || rawMeal.dish?.serving || "1 phần chuẩn",
          desc: rawMeal.desc || rawMeal.dish?.desc || "",
          items: rawMeal.items || [],
        };
      } else {
        // Fallback từ DISH_DATABASE
        const pool = DISH_DATABASE.filter((d) => d.slot === slotConfig.id);
        const dishIndex = (dayIdx * 2 + (slotConfig.id === "trua" ? 1 : 0)) % pool.length;
        dish = { ...pool[dishIndex] };
      }

      return {
        slotId: slotConfig.id,
        mealSlot: slotConfig.id,
        slotLabel: slotConfig.label,
        slotTime: slotConfig.time,
        accent: slotConfig.accent,
        bg: slotConfig.bg,
        tag: slotConfig.tag,
        dish,
        kcal: dish.calories,
        nameVi: dish.name,
        macros: { protein_g: dish.protein, carb_g: dish.carbs, fat_g: dish.fat },
        items: dish.items || rawMeal?.items || [],
        swapCandidates: rawMeal?.swapCandidates || [],
        completed,
      };
    });

    const dayTotalCalories = meals.reduce((s, m) => s + m.dish.calories, 0);
    const dayTotalProtein = meals.reduce((s, m) => s + m.dish.protein, 0);
    const dayTotalCarbs = meals.reduce((s, m) => s + m.dish.carbs, 0);
    const dayTotalFat = meals.reduce((s, m) => s + m.dish.fat, 0);

    days.push({
      dayIndex: rawDay?.dayIndex ?? dayIdx,
      dayNumber: dayIdx + 1,
      title: `Ngày ${dayIdx + 1}`,
      date: dayDate.toISOString(),
      dateKey: dateKeyStr,
      dateFormatted,
      dayOfWeekShort,
      dayOfWeekFull,
      isToday,
      isPast,
      isFuture,
      totalKcal: dayTotalCalories,
      totalProtein: dayTotalProtein,
      totalCarbs: dayTotalCarbs,
      totalFat: dayTotalFat,
      meals,
    });
  }

  return {
    id: plan?.id || "plan-active",
    cycleDays,
    durationMonths: plan?.durationMonths || 3,
    targetCalories: targetCalories || plan?.caloriesAtCreation || 1850,
    createdAt: plan?.createdAt || new Date().toISOString(),
    days,
  };
}

/**
 * Phân chia danh sách ngày theo tuần 7 ngày cho DayNavigator Cấp 1
 */
export function buildWeeks(days) {
  const result = [];
  const totalDays = days.length;
  const numWeeks = Math.ceil(totalDays / 7);

  for (let w = 0; w < numWeeks; w++) {
    const startIdx = w * 7;
    const endIdx = Math.min(totalDays, (w + 1) * 7);
    const daysInWeek = days.slice(startIdx, endIdx);
    result.push({
      weekIndex: w,
      weekNumber: w + 1,
      startDayNumber: daysInWeek[0]?.dayNumber || 1,
      endDayNumber: daysInWeek[daysInWeek.length - 1]?.dayNumber || totalDays,
      days: daysInWeek,
      hasToday: daysInWeek.some((d) => d.isToday),
    });
  }
  return result;
}
