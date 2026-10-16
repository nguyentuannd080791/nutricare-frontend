import React from "react";
import { Salad, Flame, Sparkles } from "lucide-react";
import AuthBrandLogo from "./AuthBrandLogo";

const BANNER_COPY = {
  login: {
    badge: "Đồng hành cùng sức khoẻ của bạn",
    title: "Khởi đầu ngày mới tràn đầy năng lượng tích cực.",
    description:
      "Đăng nhập để tiếp tục theo dõi lộ trình dinh dưỡng, mục tiêu vận động và duy trì thói quen sống lành mạnh mỗi ngày.",
  },
  register: {
    badge: "Khởi tạo lộ trình sức khoẻ mới",
    title: "Xây dựng thói quen lành mạnh ngay từ hôm nay.",
    description:
      "Tạo tài khoản miễn phí để thiết lập chỉ số cơ thể, nhận gợi ý thực đơn phù hợp và theo dõi năng lượng mỗi ngày.",
  },
};

const HIGHLIGHTS = [
  {
    icon: Salad,
    title: "Thực đơn cá nhân hóa",
    description: "Cân bằng dinh dưỡng theo chỉ số cơ thể mỗi ngày",
  },
  {
    icon: Flame,
    title: "Theo dõi năng lượng & TDEE",
    description: "Kiểm soát lượng calo nạp vào và tiêu hao chuẩn xác",
  },
];

export default function AuthBrandShowcase({ mode }) {
  const copy = BANNER_COPY[mode];

  return (
    <aside className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative overflow-hidden bg-gradient-to-br from-primary via-primaryDark to-[#065F46] p-12 xl:p-16 text-white flex-col justify-between">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <AuthBrandLogo light />

        <div className="mt-16 space-y-5 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-bg backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            {copy.badge}
          </span>
          <h1 className="text-3xl xl:text-5xl font-bold leading-tight">{copy.title}</h1>
          <p className="text-white/85 text-base leading-relaxed">{copy.description}</p>
        </div>
      </div>

      <div className="relative z-10 space-y-4 max-w-lg">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15"
            >
              <div className="p-2.5 rounded-xl bg-white/15 text-bg shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-white/80 mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
