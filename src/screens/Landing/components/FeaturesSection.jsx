import React, { useState } from "react";
import Section from "./Section";
import SegmentedControl from "../../../components/SegmentedControl";
import { FEATURES, FEATURE_FILTERS } from "../content";

function FeatureCard({ feature: { icon: Icon, tier, title, desc } }) {
  const isPro = tier === "pro";
  return (
    <article className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-[10px]">
      <div className="w-11 h-11 rounded-xl bg-muted text-primaryDark grid place-items-center" aria-hidden="true">
        <Icon size={24} strokeWidth={2} />
      </div>
      <span className={`self-start text-[13px] font-bold px-[10px] py-[2px] rounded-full ${isPro ? "bg-[#FDF1D6] text-[#92600A]" : "bg-muted text-primaryDark"}`}>
        {isPro ? "Chỉ có ở Pro" : "Có ở gói Free"}
      </span>
      <h3 className="m-0 text-[18px] font-bold text-fg">{title}</h3>
      <p className="m-0 flex-1 text-[15px] text-slate-600">{desc}</p>
    </article>
  );
}

export default function FeaturesSection() {
  const [filter, setFilter] = useState("all");
  const visible = FEATURES.filter((f) => filter === "all" || f.tier === filter);

  return (
    <Section
      id="tinh-nang"
      title="Tính năng của NutriCare"
      subtitle="Từ tính BMI đến quét món ăn bằng camera. Lọc để xem tính năng nào có ở gói Free, tính năng nào chỉ có ở Pro."
    >
      <div className="mb-5">
        <SegmentedControl label="Lọc theo gói" options={FEATURE_FILTERS} value={filter} onChange={setFilter} />
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {visible.map((f) => <FeatureCard key={f.title} feature={f} />)}
      </div>
    </Section>
  );
}
