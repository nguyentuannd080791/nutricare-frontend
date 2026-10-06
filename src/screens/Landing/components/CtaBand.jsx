import React from "react";
import CtaLink from "./CtaLink";

export default function CtaBand() {
  return (
    <section className="bg-muted rounded-3xl px-7 py-10 text-center mb-6">
      <h2 className="m-0 mb-2 text-[clamp(24px,4vw,34px)] font-extrabold text-fg">Sẵn sàng ăn uống khoẻ hơn?</h2>
      <p className="max-w-[520px] mx-auto mb-6 text-slate-600">
        Các tính năng cơ bản như BMI, BMR và lọc món an toàn luôn miễn phí.
      </p>
      <CtaLink location="band">Bắt đầu miễn phí</CtaLink>
    </section>
  );
}
