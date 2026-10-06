import React, { useState } from "react";
import { Check } from "lucide-react";
import Section from "./Section";
import SegmentedControl from "../../../components/SegmentedControl";
import CtaLink from "./CtaLink";
import { FREE_PLAN, PRO_PLAN } from "../content";

function PerkList({ perks }) {
  return (
    <ul className="m-0 mt-2 p-0 list-none flex flex-col gap-2 text-[15px] text-slate-600">
      {perks.map((p) => (
        <li key={p} className="flex gap-2 items-start">
          <Check size={18} className="shrink-0 mt-[3px] text-primaryDark" aria-hidden="true" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PricingSection() {
  const [billingId, setBillingId] = useState("monthly");
  const billing = PRO_PLAN.billing.find((b) => b.id === billingId);

  return (
    <Section id="gia" title="Chọn gói phù hợp" subtitle="Bắt đầu miễn phí, nâng cấp Pro khi bạn cần nhiều hơn." centered>
      <div className="grid gap-4 max-w-[820px] mx-auto md:grid-cols-2">
        <div className="bg-card border border-border rounded-[20px] p-7 flex flex-col gap-2">
          <h3 className="m-0 text-[20px] font-bold">{FREE_PLAN.name}</h3>
          <p className="m-0 text-[32px] font-extrabold text-primaryDark">{FREE_PLAN.price}</p>
          <PerkList perks={FREE_PLAN.perks} />
        </div>
        <div className="bg-card border-2 border-primaryDark rounded-[20px] p-7 flex flex-col gap-2">
          <h3 className="m-0 text-[20px] font-bold">{PRO_PLAN.name}</h3>
          <SegmentedControl label="Chu kỳ thanh toán" options={PRO_PLAN.billing} value={billingId} onChange={setBillingId} fill />
          <p className="m-0 text-[32px] font-extrabold text-primaryDark">
            {billing.price}<small className="text-[15px] font-medium text-slate-600">{billing.period}</small>
          </p>
          <p className="m-0 text-[14px] font-bold text-primaryDark" aria-live="polite">{billing.note}</p>
          <PerkList perks={PRO_PLAN.perks} />
        </div>
      </div>
      <div className="mt-8"><CtaLink location="pricing">Bắt đầu miễn phí</CtaLink></div>
    </Section>
  );
}
