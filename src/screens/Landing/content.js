// Nội dung trang giới thiệu — tách khỏi component để chỉnh câu chữ/giá không
// phải động vào JSX. Mọi con số dưới đây đối chiếu với code thật:
//  - 1.247 món / 19 nhóm, 847 thực phẩm: prisma/schema.prisma (dữ liệu seed)
//  - Giới hạn Free 5 lượt quét + 5 lượt gợi ý AI: backend domain/constants.js (FREE_LIMITS)
//  - Giá Pro: screens/Premium/PremiumScreen.jsx (PLANS)
import {
  Camera,
  Activity,
  HeartPulse,
  Database,
  CalendarDays,
  Sparkles,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react";

export const APP_PATH = "/app";

export const VALUE_CARDS = [
  {
    title: "Nhận diện món Việt",
    desc: "Camera nhận diện món ăn dựa trên danh mục món Việt được chọn lọc riêng. AI chỉ nhận diện — calo và dinh dưỡng luôn được tính lại từ danh mục.",
  },
  {
    title: "Số liệu đáng tin",
    desc: "1.247 món ăn và 847 thực phẩm tự nhiên với dữ liệu dinh dưỡng từ Viện Dinh dưỡng, thay vì con số ước chừng.",
  },
  {
    title: "An toàn cho sức khỏe",
    desc: "Khai báo bệnh nền hoặc dị ứng, NutriCare tự loại bớt món không phù hợp khi xây thực đơn.",
  },
];

export const STEPS = [
  {
    title: "Nhập thông tin cơ thể",
    desc: "Chiều cao, cân nặng, mục tiêu. NutriCare tính BMI, BMR và nhu cầu năng lượng mỗi ngày.",
  },
  {
    title: "Nhận thực đơn",
    desc: "Thuật toán tạo thực đơn theo ngày sát mục tiêu calo và dinh dưỡng của bạn.",
  },
  {
    title: "Quét và theo dõi",
    desc: "Chụp món ăn, đánh dấu bữa đã ăn và xem mình tiến gần mục tiêu thế nào.",
  },
];

// tier: "free" = dùng được ở gói miễn phí; "pro" = chỉ có ở Pro.
export const FEATURES = [
  {
    icon: Activity,
    tier: "free",
    title: "BMI, BMR, TDEE và mục tiêu",
    desc: "Tính nhu cầu năng lượng theo công thức Mifflin-St Jeor, cho mục tiêu giữ, giảm hoặc tăng cân có thời hạn và mức thay đổi an toàn.",
  },
  {
    icon: HeartPulse,
    tier: "free",
    title: "Lọc món theo sức khỏe",
    desc: "Tự động loại bớt món không phù hợp với bệnh nền và dị ứng bạn đã khai báo. Bộ lọc an toàn này luôn miễn phí.",
  },
  {
    icon: Database,
    tier: "free",
    title: "Tra cứu món Việt",
    desc: "Tìm 1.247 món ăn chia theo 19 nhóm, kèm 847 thực phẩm tự nhiên với bảng dinh dưỡng chi tiết.",
  },
  {
    icon: CalendarDays,
    tier: "free",
    title: "Thực đơn theo mục tiêu",
    desc: "Tạo thực đơn chu kỳ nhiều ngày theo mục tiêu calo hiện tại, đổi món trong các lựa chọn gợi ý.",
  },
  {
    icon: ClipboardCheck,
    tier: "free",
    title: "Theo dõi tiến độ",
    desc: "Đánh dấu bữa đã ăn mỗi ngày và xem tỉ lệ bám sát thực đơn. Khi tạo lại thực đơn, dấu tích cũ tự làm mới.",
  },
  {
    icon: Camera,
    tier: "free",
    title: "Quét món ăn bằng camera",
    desc: "Chụp món ăn để biết dinh dưỡng. Gói miễn phí có 5 lượt quét; Pro không giới hạn.",
  },
  {
    icon: Sparkles,
    tier: "free",
    title: "Đa dạng hoá thực đơn bằng AI",
    desc: "AI gợi ý món thay thế cho thực đơn của bạn. Gói miễn phí có 5 lượt; Pro không giới hạn.",
  },
  {
    icon: TrendingUp,
    tier: "pro",
    title: "Tự điều chỉnh calo theo cân nặng",
    desc: "Khi cân nặng 7 ngày qua chưa khớp mục tiêu, NutriCare tự tăng hoặc giảm lượng calo mỗi ngày cho bạn.",
  },
];

export const FEATURE_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
];

export const FREE_PLAN = {
  name: "Free",
  price: "0đ",
  perks: [
    "BMI, BMR, TDEE và mục tiêu dinh dưỡng",
    "Lọc món theo sức khỏe",
    "Tra cứu món Việt",
    "Thực đơn theo mục tiêu và theo dõi tiến độ",
    "5 lượt quét món ăn, 5 lượt gợi ý AI",
  ],
};

export const PRO_PLAN = {
  name: "Pro",
  perks: [
    "Mọi tính năng Free",
    "Quét món ăn không giới hạn",
    "Gợi ý thực đơn bằng AI không giới hạn",
    "Tự điều chỉnh calo theo cân nặng",
    "Ưu tiên nhận tính năng mới",
  ],
  billing: [
    { id: "monthly", label: "Hàng tháng", price: "120.000đ", period: " / tháng", note: "Huỷ bất cứ lúc nào" },
    { id: "yearly", label: "Hàng năm", price: "990.000đ", period: " / năm", note: "Tiết kiệm 450.000đ (khoảng 31%), tương đương 82.500đ mỗi tháng" },
  ],
};
