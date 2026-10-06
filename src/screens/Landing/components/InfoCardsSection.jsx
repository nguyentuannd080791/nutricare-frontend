import React from "react";
import Section from "./Section";

/** Trách nhiệm duy nhất: lưới thẻ tiêu đề + mô tả; numbered=true thêm số bước 1-2-3. */
export default function InfoCardsSection({ id, title, subtitle, items, numbered = false }) {
  return (
    <Section id={id} title={title} subtitle={subtitle}>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {items.map((item, i) => (
          <div key={item.title} className="bg-card border border-border rounded-2xl p-6">
            {numbered && (
              <div className="w-10 h-10 rounded-full bg-muted text-primaryDark grid place-items-center font-extrabold mb-3" aria-hidden="true">{i + 1}</div>
            )}
            <h3 className="m-0 mb-[6px] text-[18px] font-bold text-fg">{item.title}</h3>
            <p className="m-0 text-[15px] text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
