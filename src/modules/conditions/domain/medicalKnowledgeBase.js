import {
  Activity,
  ShieldAlert,
  Stethoscope,
  HelpCircle,
} from "lucide-react";

/**
 * DOMAIN LAYER: Phân loại tình trạng sức khỏe & Bảng tri thức y khoa chuẩn
 * (SOLID: Single Responsibility & Open/Closed)
 */

export const CONDITION_TYPES = {
  BENH_NEN: {
    id: "BENH_NEN",
    label: "Bệnh nền",
    shortLabel: "Bệnh nền",
    color: "#0284C7", // Sky blue
    bgLight: "#F0F9FF",
    borderColor: "#BAE6FD",
    icon: Activity,
  },
  DI_UNG: {
    id: "DI_UNG",
    label: "Dị ứng thực phẩm",
    shortLabel: "Dị ứng",
    color: "#EA580C", // Orange
    bgLight: "#FFF7ED",
    borderColor: "#FED7AA",
    icon: ShieldAlert,
  },
  CHI_DINH_BAC_SI: {
    id: "CHI_DINH_BAC_SI",
    label: "Chỉ định của bác sĩ",
    shortLabel: "Chỉ định",
    color: "#7C3AED", // Purple
    bgLight: "#F5F3FF",
    borderColor: "#DDD6FE",
    icon: Stethoscope,
  },
  CHUA_NHAN_DIEN: {
    id: "CHUA_NHAN_DIEN",
    label: "Chưa nhận diện",
    shortLabel: "Chưa nhận diện",
    color: "#D97706", // Amber
    bgLight: "#FFFBEB",
    borderColor: "#FDE68A",
    icon: HelpCircle,
  },
};

export const AVOID_TAGS = {
  duong_cao: { id: "duong_cao", label: "Đường cao" },
  natri_cao: { id: "natri_cao", label: "Natri (Muối) cao" },
  hai_san: { id: "hai_san", label: "Hải sản" },
  dau_phong: { id: "dau_phong", label: "Đậu phộng / Lạc" },
  sua: { id: "sua", label: "Sữa & Lactose" },
  gluten: { id: "gluten", label: "Gluten / Bột mì" },
  purin_cao: { id: "purin_cao", label: "Purin cao" },
  dam_cao: { id: "dam_cao", label: "Đạm động vật cao" },
  dau_mo_cao: { id: "dau_mo_cao", label: "Chất béo / Cholesterol" },
  trung: { id: "trung", label: "Trứng gia cầm" },
  dau_nanh: { id: "dau_nanh", label: "Đậu nành" },
  hat_cay: { id: "hat_cay", label: "Hạt cây béo" },
  buoi_chum: { id: "buoi_chum", label: "Bưởi chùm (Statin)" },
  cay_nong: { id: "cay_nong", label: "Chua cay / Kích ứng" },
};

export const PRESET_KNOWLEDGE_BASE = [
  // --- BỆNH NỀN ---
  {
    id: "kb-diabetes",
    name: "Đái tháo đường Type 2",
    type: "BENH_NEN",
    keywords: ["tiểu đường", "tieu duong", "đường huyết", "diabetes", "t2dm", "đái tháo đường", "duong cao"],
    tags: ["duong_cao"],
    restrictedFoods: ["Nước ngọt có gas", "Bánh kẹo ngọt tinh luyện", "Trái cây sấy khô", "Cơm trắng ăn quá nhiều"],
    recommendedFoods: ["Gạo lứt nguyên cám", "Yến mạch thô", "Bông cải xanh", "Cá hồi"],
    notes: "Nên ăn rau xanh đầu bữa để làm chậm hấp thu đường. Giữ lượng tinh bột (Carb) dưới 45-60g mỗi bữa chính.",
    severity: "Cao",
  },
  {
    id: "kb-hypertension",
    name: "Tăng huyết áp",
    type: "BENH_NEN",
    keywords: ["huyết áp", "huyet ap", "tăng huyết áp", "cao huyết áp", "hypertension", "tha", "huyet ap cao"],
    tags: ["natri_cao"],
    restrictedFoods: ["Mắm tôm, mắm nêm đậm", "Thực phẩm đóng hộp", "Dưa muối chua, cà pháo", "Xúc xích, lạp xưởng"],
    recommendedFoods: ["Chuối chín", "Khoai lang hấp", "Cải bó xôi", "Cần tây ép"],
    notes: "Khống chế lượng muối tiêu thụ dưới 5g/ngày. Hạn chế chấm ngập nước mắm.",
    severity: "Cao",
  },
  {
    id: "kb-gout",
    name: "Bệnh Gout (Thống phong)",
    type: "BENH_NEN",
    keywords: ["gout", "gút", "axit uric", "acid uric", "thống phong", "viêm khớp gout"],
    tags: ["purin_cao"],
    restrictedFoods: ["Nội tạng động vật", "Thịt bò, thịt dê", "Hải sản đậm (cua, tôm)", "Bia rượu"],
    recommendedFoods: ["Quả anh đào (Cherry)", "Dưa leo", "Táo tây", "Uống đủ 2-2.5 lít nước/ngày"],
    notes: "Tránh tuyệt đối rượu bia vì ức chế đào thải axit uric. Uống nhiều nước khoáng kiềm nhẹ.",
    severity: "Nghiêm ngặt",
  },
  {
    id: "kb-ckd",
    name: "Suy thận mạn (CKD)",
    type: "BENH_NEN",
    keywords: ["suy thận", "suy than", "thận ứ nước", "ckd", "than yeu"],
    tags: ["dam_cao", "natri_cao"],
    restrictedFoods: ["Quả khế", "Thực phẩm nhiều muối", "Lòng đỏ trứng ăn nhiều", "Thịt đỏ nhiều đạm"],
    recommendedFoods: ["Miến dong", "Bột sắn dây", "Bí xanh luộc"],
    notes: "Kiểm soát nghiêm ngặt hàm lượng protein theo chỉ định của bác sĩ thận. Tuyệt đối không ăn khế.",
    severity: "Nghiêm ngặt",
  },
  {
    id: "kb-lipid",
    name: "Rối loạn lipid máu / Gan nhiễm mỡ",
    type: "BENH_NEN",
    keywords: ["mỡ máu", "mo mau", "cholesterol", "gan nhiễm mỡ", "gan nhiem mo", "triglyceride"],
    tags: ["dau_mo_cao"],
    restrictedFoods: ["Mỡ động vật, tóp mỡ", "Da gà, da vịt", "Đồ chiên rán ngập dầu", "Phủ tạng động vật"],
    recommendedFoods: ["Cá hồi, cá thu", "Quả bơ", "Hạt chia", "Dầu ô liu", "Yến mạch"],
    notes: "Ưu tiên hấp luộc thay vì chiên xào. Tăng cường chất xơ hòa tan.",
    severity: "Trung bình",
  },
  {
    id: "kb-gerd",
    name: "Trào ngược dạ dày (GERD)",
    type: "BENH_NEN",
    keywords: ["trào ngược", "trao nguoc", "dạ dày", "gerd", "ợ chua", "đau bao tử"],
    tags: ["cay_nong"],
    restrictedFoods: ["Ớt, tiêu cay nóng", "Cà phê, trà đặc", "Nước ngọt có gas", "Nước cam chanh lúc đói"],
    recommendedFoods: ["Cháo yến mạch ấm", "Chuối chín", "Trà gừng ấm nhẹ", "Bánh mì nướng khô"],
    notes: "Không nằm ngay sau khi ăn tối thiểu 2 tiếng. Tránh ăn quá no căng bụng.",
    severity: "Trung bình",
  },

  // --- DỊ ỨNG THỰC PHẨM ---
  {
    id: "kb-allergy-seafood",
    name: "Dị ứng hải sản (Tôm, cua, ốc)",
    type: "DI_UNG",
    keywords: ["dị ứng hải sản", "di ung hai san", "dị ứng tôm", "dị ứng cua", "hai san", "seafood"],
    tags: ["hai_san"],
    restrictedFoods: ["Tôm sú, tôm thẻ", "Cua biển, ghẹ", "Mực, bạch tuộc", "Ốc, nghêu"],
    recommendedFoods: ["Ức gà phi lê", "Thịt heo nạc", "Đậu phụ tươi"],
    notes: "Hỏi kỹ thành phần nước sốt chiết xuất tôm cua khi ăn ngoài quán.",
    severity: "Nghiêm ngặt",
  },
  {
    id: "kb-allergy-peanut",
    name: "Dị ứng đậu phộng (Lạc)",
    type: "DI_UNG",
    keywords: ["đậu phộng", "dau phong", "dị ứng lạc", "lạc", "peanut", "bơ đậu phộng"],
    tags: ["dau_phong"],
    restrictedFoods: ["Đậu phộng rang", "Bơ đậu phộng", "Dầu phộng thủ công", "Kẹo cu đơ, kẹo lạc"],
    recommendedFoods: ["Dầu hạt cải", "Hạt hướng dương", "Hạt bí ngô"],
    notes: "Nguy cơ sốc phản vệ cao. Cẩn trọng với thực phẩm có nhãn 'Có thể chứa vết đậu phộng'.",
    severity: "Nghiêm ngặt",
  },
  {
    id: "kb-allergy-dairy",
    name: "Dị ứng sữa bò / Không dung nạp Lactose",
    type: "DI_UNG",
    keywords: ["dị ứng sữa", "di ung sua", "lactose", "sữa bò", "không dung nạp sữa", "dairy"],
    tags: ["sua"],
    restrictedFoods: ["Sữa bò tươi", "Phô mai", "Kem tươi (Whipping cream)", "Sữa đặc có đường"],
    recommendedFoods: ["Sữa hạnh nhân", "Sữa yến mạch", "Sữa chua không lactose"],
    notes: "Có thể dùng sữa hạt hoặc các sản phẩm có nhãn 'Lactose-Free'.",
    severity: "Trung bình",
  },
  {
    id: "kb-allergy-gluten",
    name: "Không dung nạp Gluten / Celiac",
    type: "DI_UNG",
    keywords: ["gluten", "celiac", "dị ứng lúa mì", "bột mì", "wheat"],
    tags: ["gluten"],
    restrictedFoods: ["Bánh mì trắng", "Mì ống, Spaghetti", "Bánh ngọt lúa mì", "Bia lúa mạch"],
    recommendedFoods: ["Cơm gạo tẻ, gạo lứt", "Bún phở tươi làm từ gạo", "Khoai lang, khoai tây"],
    notes: "Chọn sản phẩm có chứng nhận nhãn 'Gluten-Free'.",
    severity: "Nghiêm ngặt",
  },
  {
    id: "kb-allergy-egg",
    name: "Dị ứng trứng gia cầm",
    type: "DI_UNG",
    keywords: ["dị ứng trứng", "di ung trung", "trứng gà", "lòng trắng trứng", "egg allergy"],
    tags: ["trung"],
    restrictedFoods: ["Trứng luộc, trứng chiên", "Sốt Mayonnaise", "Bánh bông lan", "Mì trứng"],
    recommendedFoods: ["Đậu phụ", "Thịt ức gà", "Cá hồi phi lê"],
    notes: "Đặc biệt chú ý lòng trắng trứng vì chứa phần lớn protein ovalbumin.",
    severity: "Nghiêm ngặt",
  },
  {
    id: "kb-allergy-soy",
    name: "Dị ứng đậu nành",
    type: "DI_UNG",
    keywords: ["đậu nành", "dau nanh", "dị ứng tương", "soy", "edamame"],
    tags: ["dau_nanh"],
    restrictedFoods: ["Đậu phụ tươi", "Sữa đậu nành", "Nước tương truyền thống", "Tương miso"],
    recommendedFoods: ["Đậu Hà Lan", "Đậu lăng", "Nước mắm cá cơm", "Dầu ô liu"],
    notes: "Kiểm tra kỹ thành phần 'Lecithin đậu nành' trong bánh kẹo đóng gói.",
    severity: "Trung bình",
  },

  // --- CHỈ ĐỊNH BÁC SĨ ---
  {
    id: "kb-order-low-salt",
    name: "Bác sĩ chỉ định: Giảm muối (Dưới 3g/ngày)",
    type: "CHI_DINH_BAC_SI",
    keywords: ["bác sĩ dặn ăn nhạt", "ăn nhạt", "giảm muối", "kiêng mặn", "ít muối", "low sodium"],
    tags: ["natri_cao"],
    restrictedFoods: ["Nước mắm chấm sống", "Đồ kho mặn, cá kho tộ", "Mì ăn liền", "Thịt nguội đóng hộp"],
    recommendedFoods: ["Món hấp luộc thanh đạm", "Rau củ tươi luộc", "Gia vị thảo mộc tự nhiên"],
    notes: "Phác đồ bảo tồn tim mạch & huyết áp. Không nêm mắm muối trực tiếp trên bàn ăn.",
    severity: "Cao",
  },
  {
    id: "kb-order-low-sugar",
    name: "Bác sĩ chỉ định: Kiêng đường ngọt tinh luyện",
    type: "CHI_DINH_BAC_SI",
    keywords: ["kiêng đồ ngọt", "bác sĩ dặn kiêng ngọt", "kiêng đường", "cắt giảm đường", "không ăn ngọt"],
    tags: ["duong_cao"],
    restrictedFoods: ["Chè ngọt, trà sữa", "Bánh kem, sô cô la ngọt", "Nước tăng lực", "Nước ép cô đặc"],
    recommendedFoods: ["Trà xanh không đường", "Nước lọc ngâm lát chanh", "Trái cây ít ngọt (ổi, bơ)"],
    notes: "Uống một cốc nước ấm hoặc ăn vài lát ổi tươi khi có cảm giác thèm ngọt.",
    severity: "Cao",
  },
  {
    id: "kb-order-statin",
    name: "Bác sĩ chỉ định: Kiêng bưởi chùm khi dùng Statin",
    type: "CHI_DINH_BAC_SI",
    keywords: ["thuốc statin", "uống statin", "bưởi chùm", "grapefruit", "atorvastatin", "rosuvastatin"],
    tags: ["buoi_chum"],
    restrictedFoods: ["Bưởi chùm (Grapefruit)", "Nước ép bưởi chùm đóng chai"],
    recommendedFoods: ["Cam sành Việt Nam", "Quýt ngọt", "Táo tây", "Dưa hấu"],
    notes: "Bưởi chùm ức chế enzyme CYP3A4 làm tăng nồng độ statin trong máu gây độc gan và cơ.",
    severity: "Nghiêm ngặt",
  },
  {
    id: "kb-order-low-protein",
    name: "Bác sĩ chỉ định: Tiết chế Protein (< 40g/ngày)",
    type: "CHI_DINH_BAC_SI",
    keywords: ["giảm đạm", "kiêng đạm", "tiết chế protein", "ít đạm", "low protein"],
    tags: ["dam_cao"],
    restrictedFoods: ["Thịt bò bít tết", "Hải sản đậm đặc", "Bột whey protein", "Thịt nạc lượng lớn"],
    recommendedFoods: ["Miến dong", "Bí đao luộc", "Cơm trộn khoai lang"],
    notes: "Ưu tiên đạm sinh học cao với số lượng được định lượng nghiêm ngặt.",
    severity: "Nghiêm ngặt",
  },
];

export function normalizeVietnamese(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Động cơ nhận diện thông minh: Khớp chuỗi nhập liệu của người dùng
 * với cơ sở tri thức y khoa để tự động gợi ý phân loại, thực phẩm kiêng và lời dặn.
 */
export function smartRecognizeCondition(input = "") {
  const raw = (input || "").trim();
  if (!raw) return null;

  const normalizedInput = normalizeVietnamese(raw);

  let bestMatch = null;
  let highestScore = 0;

  for (const preset of PRESET_KNOWLEDGE_BASE) {
    let score = 0;
    const normPresetName = normalizeVietnamese(preset.name);

    if (normalizedInput === normPresetName) {
      score += 100;
    } else if (normPresetName.includes(normalizedInput) || normalizedInput.includes(normPresetName)) {
      score += 50;
    }

    for (const kw of preset.keywords) {
      const normKw = normalizeVietnamese(kw);
      if (normalizedInput === normKw) {
        score += 80;
      } else if (normalizedInput.includes(normKw)) {
        score += 40;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = preset;
    }
  }

  if (bestMatch && highestScore >= 40) {
    return {
      isRecognized: true,
      matchedPresetId: bestMatch.id,
      canonicalName: bestMatch.name,
      type: bestMatch.type,
      tags: bestMatch.tags,
      restrictedFoods: bestMatch.restrictedFoods,
      recommendedFoods: bestMatch.recommendedFoods,
      notes: bestMatch.notes,
    };
  }

  return {
    isRecognized: false,
    matchedPresetId: null,
    canonicalName: raw,
    type: "CHUA_NHAN_DIEN",
    tags: [],
    restrictedFoods: [],
    recommendedFoods: [],
    notes: "Chưa nhận diện được trong cơ sở dữ liệu chuẩn. Bạn có thể bấm Chỉnh sửa để bổ sung ghi chú dinh dưỡng.",
  };
}

/**
 * Làm giàu dữ liệu điều kiện từ backend bằng tri thức y khoa chuẩn
 */
export function enrichConditionData(condition) {
  if (!condition) return condition;
  const recog = smartRecognizeCondition(condition.name);

  return {
    ...condition,
    recognized: condition.recognized ?? (recog ? recog.isRecognized : false),
    tags: condition.tags || recog?.tags || [],
    restrictedFoods: condition.restrictedFoods || recog?.restrictedFoods || [],
    recommendedFoods: condition.recommendedFoods || recog?.recommendedFoods || [],
    notes: condition.notes || recog?.notes || "",
  };
}
