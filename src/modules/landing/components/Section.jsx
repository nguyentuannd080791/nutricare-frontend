import React from "react";

/** Trách nhiệm duy nhất: khung 1 mục của trang (neo #id, tiêu đề, mô tả ngắn). */
export default function Section({ id, title, subtitle, centered = false, children }) {
  return (
    <section id={id} className="py-14">
      <h2 className={`text-[clamp(24px,4vw,34px)] font-extrabold leading-tight text-fg ${centered ? "text-center" : ""}`}>{title}</h2>
      {subtitle && <p className={`mt-2 mb-8 max-w-[600px] text-slate-600 ${centered ? "mx-auto text-center" : ""}`}>{subtitle}</p>}
      {children}
    </section>
  );
}
