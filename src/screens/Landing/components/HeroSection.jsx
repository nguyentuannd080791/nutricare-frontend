import React from "react";
import CtaLink from "./CtaLink";

const SAMPLE_MEALS = [
  ["Sáng · Phở gà"],
  ["Trưa · Cơm, cá kho, canh rau"],
  ["Tối · Bún chả"],
];

// Thẻ minh hoạ tĩnh (không phải dữ liệu thật) — nhãn "Ví dụ" nói rõ điều đó.
function SamplePlanCard() {
  return (
    <div className="bg-card border border-border rounded-[28px] p-[22px] shadow-[0_12px_40px_rgba(4,120,87,0.12)]" aria-label="Minh hoạ thực đơn trong ứng dụng">
      <span className="block text-[14px] text-slate-600">Mục tiêu hôm nay</span>
      <p className="m-0 text-[40px] font-extrabold text-primaryDark">1.800 kcal</p>
      <div className="h-[10px] rounded-full bg-border my-[6px] mb-4 overflow-hidden">
        <div className="h-full bg-primaryDark" style={{ width: "64%" }} />
      </div>
      {SAMPLE_MEALS.map(([name]) => (
        <div key={name} className="flex justify-between py-3 border-t border-border text-[15px]">
          <span>{name}</span>
          <span className="text-slate-600">Ví dụ</span>
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="grid gap-8 items-center pt-4 pb-16 md:pt-10 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="text-[14px] font-bold tracking-[0.06em] uppercase text-primaryDark">Dinh dưỡng dành cho người Việt</div>
        <h1 className="mt-[10px] mb-4 text-[clamp(32px,5.5vw,54px)] leading-[1.1] font-extrabold text-fg">
          Ăn đúng món Việt, đạt đúng mục tiêu sức khỏe
        </h1>
        <p className="max-w-[520px] mb-7 text-[18px] text-slate-600">
          Chụp một tấm ảnh để biết món ăn chứa bao nhiêu dinh dưỡng, và nhận thực đơn hằng ngày phù hợp với cơ thể của bạn.
        </p>
        <div className="flex flex-wrap gap-3">
          <CtaLink location="hero">Bắt đầu miễn phí</CtaLink>
          <CtaLink location="hero_pricing" variant="outline" href="#gia">Xem bảng giá</CtaLink>
        </div>
      </div>
      <SamplePlanCard />
    </div>
  );
}
