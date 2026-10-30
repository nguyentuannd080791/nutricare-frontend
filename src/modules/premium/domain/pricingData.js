// Single Source of Truth cho gói dịch vụ & so sánh tính năng NutriCare
// Tuân thủ Karpathy Guidelines: Phản ánh 100% tính năng THỰC TẾ có trong code,
// KHÔNG hứa hẹn dịch vụ giả định (tư vấn bác sĩ 1-1, xuất PDF, v.v.).

export const PRICING_PLANS = {
  free: {
    id: "free",
    name: "Gói Cơ Bản (Free)",
    badge: "Mặc định",
    tagline: "Phù hợp cho người bắt đầu làm quen với dinh dưỡng cá nhân hoá",
    price: 0,
    periodLabel: "trọn đời",
    features: [
      { text: "5 lượt quét món ăn bằng AI Camera (Gemini Vision)", included: true },
      { text: "5 lượt tạo & tối ưu thực đơn bằng AI Gemini", included: true },
      { text: "Tra cứu 1.247 món ăn & 847 thực phẩm Viện Dinh Dưỡng (NIN)", included: true },
      { text: "Cảnh báo dị ứng & 17 bệnh lý nền theo ngưỡng y khoa", included: true },
      { text: "Thuật toán hoán đổi món ăn cân bằng calo", included: true },
      { text: "Theo dõi cân nặng, BMI, BMR, TDEE & 17 môn thể thao (MET)", included: true },
      { text: "Vòng lặp phản hồi Calo tự động (Feedback Loop Engine)", included: false, desc: "Tự động bù trừ calo theo xu hướng cân nặng 14 ngày" },
      { text: "Quét ảnh AI & Tạo thực đơn không giới hạn", included: false },
    ],
  },
  premium: {
    id: "premium",
    name: "Hội Viên NutriCare Pro",
    badge: "Khuyên Dùng",
    tagline: "Mở khoá sức mạnh AI không giới hạn & công nghệ tự động cân chỉnh Calo",
    priceMonthly: 120000,
    priceYearly: 990000, // ~82.500đ/tháng (-31%)
    features: [
      {
        text: "Quét món ăn bằng Camera AI không giới hạn",
        desc: "Nhận diện món ăn Việt, ước tính trọng lượng và phân tích calo qua Gemini Vision",
        highlight: true,
      },
      {
        text: "Tối ưu & Đa dạng hoá thực đơn bằng AI không giới hạn",
        desc: "Tạo thực đơn chu kỳ linh hoạt 3 - 30 ngày chuẩn mục tiêu calo & macro",
        highlight: true,
      },
      {
        text: "Vòng lặp phản hồi Calo tự động (Feedback Loop Engine)",
        desc: "Tự động phân tích xu hướng 14 ngày, nắn chỉnh ±125 kcal khi phát hiện chững cân",
        highlight: true,
      },
      {
        text: "Kiểm soát lâm sàng đa bệnh lý kết hợp chuyên sâu",
        desc: "Bộ lọc ngưỡng định lượng Carb (tiểu đường), Natri (huyết áp), Purin (gout), Đạm (thận)",
        highlight: false,
      },
      {
        text: "Toàn quyền tra cứu 1.247 món ăn & 847 thực phẩm NIN",
        desc: "Dữ liệu chuẩn Viện Dinh Dưỡng Quốc Gia Việt Nam với đầy đủ vi chất",
        highlight: false,
      },
      {
        text: "Ưu tiên cập nhật thuật toán & mô hình AI dinh dưỡng mới",
        desc: "Được áp dụng các cải tiến mô hình và thực phẩm mới nhất ngay khi phát hành",
        highlight: false,
      },
    ],
  },
};

export const COMPARISON_CATEGORIES = [
  {
    category: "Trí Tuệ Nhân Tạo & Nhận Diện Món",
    items: [
      {
        name: "Quét món ăn bằng Camera AI (Gemini Vision)",
        free: "Tối đa 5 lượt",
        premium: "Không giới hạn",
      },
      {
        name: "Tối ưu & sinh thực đơn tự động bằng AI Gemini",
        free: "Tối đa 5 lượt",
        premium: "Không giới hạn",
      },
      {
        name: "Thuật toán hoán đổi món ăn cân đối calo & macro",
        free: true,
        premium: true,
      },
      {
        name: "Khóa món ăn yêu thích khi xây dựng lại thực đơn",
        free: true,
        premium: true,
      },
    ],
  },
  {
    category: "Vòng Lặp Phản Hồi & Kiểm Soát Y Khoa",
    items: [
      {
        name: "Vòng lặp phản hồi Calo tự động (Feedback Loop Engine)",
        free: false,
        premium: "Tự động cân chỉnh ±125 kcal / 14 ngày",
      },
      {
        name: "Kho dữ liệu 1.247 món ăn & 847 thực phẩm chuẩn NIN",
        free: true,
        premium: true,
      },
      {
        name: "Cảnh báo tương thích 17 bệnh lý nền & dị ứng",
        free: true,
        premium: true,
      },
      {
        name: "Kiểm soát định lượng lâm sàng (Carb, Natri, Đạm, Kali)",
        free: true,
        premium: true,
      },
    ],
  },
  {
    category: "Theo Dõi Thể Trạng & Hoạt Động",
    items: [
      {
        name: "Tính chỉ số BMI, BMR, TDEE & biểu đồ cân nặng",
        free: true,
        premium: true,
      },
      {
        name: "Bộ tính calo tiêu hao 17 bộ môn thể thao (chuẩn MET)",
        free: true,
        premium: true,
      },
      {
        name: "Ghi nhận nhật ký dinh dưỡng & nước uống hàng ngày",
        free: true,
        premium: true,
      },
      {
        name: "Chuỗi kỷ luật Streak & cảnh báo đứt chuỗi",
        free: true,
        premium: true,
      },
    ],
  },
];

export const PREMIUM_FAQS = [
  {
    q: "Gói Hội viên NutriCare Pro khác gì so với phiên bản Miễn phí?",
    a: "Phiên bản Miễn phí cho phép bạn tra cứu toàn bộ 1.247 món ăn, 847 thực phẩm NIN và trải nghiệm 5 lượt quét món bằng camera cùng 5 lượt tạo thực đơn bằng AI Gemini. Khi nâng cấp Pro, bạn sẽ được mở khóa không giới hạn lượt quét món, không giới hạn tạo thực đơn AI, và đặc biệt là kích hoạt Vòng lặp phản hồi Calo tự động (Feedback Loop Engine) giúp tự động bù trừ ±125 kcal theo xu hướng cân nặng 14 ngày.",
  },
  {
    q: "Vòng lặp phản hồi Calo tự động (Feedback Loop Engine) hoạt động như thế nào?",
    a: "Đây là thuật toán phân tích biến động cân nặng liên tục trong 14 ngày (7 ngày gần nhất so với 7 ngày trước đó). Nếu hệ thống phát hiện cân nặng của bạn bị chững (thay đổi dưới 0.2kg) hoặc tốc độ giảm/tăng không khớp với mục tiêu, thuật toán sẽ tự động điều chỉnh mục tiêu calo mỗi ngày thêm hoặc bớt 125 kcal để đưa thể trạng trở lại lộ trình tối ưu.",
  },
  {
    q: "Phương thức thanh toán và kích hoạt gói như thế nào?",
    a: "Hệ thống hỗ trợ thanh toán tức thì qua VietQR (mã QR liên ngân hàng MBBank), ví MoMo, hoặc thẻ thanh toán quốc tế. Sau khi thực hiện chuyển khoản, gói Hội viên Pro sẽ được kích hoạt ngay lập tức vào tài khoản của bạn.",
  },
  {
    q: "Tôi có thể hủy gói hội viên bất kỳ lúc nào không?",
    a: "Có. Bạn hoàn toàn có thể hủy gói Hội viên Pro bất kỳ lúc nào trực tiếp trong ứng dụng. Sau khi hủy, tài khoản của bạn sẽ quay trở lại giới hạn thông thường mà không có bất kỳ khoản phí phát sinh nào.",
  },
  {
    q: "NutriCare có cam kết bảo mật thông tin sức khỏe không?",
    a: "Toàn bộ dữ liệu thể trạng, cân nặng, tiền sử bệnh nền và nhật ký ăn uống của bạn đều được mã hóa theo tiêu chuẩn y tế và chỉ phục vụ duy nhất cho mục đích tính toán dinh dưỡng cá nhân hoá cho bạn.",
  },
];

