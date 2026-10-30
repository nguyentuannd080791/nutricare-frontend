import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { PREMIUM_FAQS } from "../domain/pricingData";

export default function PremiumFaqAccordion() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="bg-white rounded-3xl border border-[#DCEEE7] p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-[#059669]" />
        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">Câu Hỏi Thường Gặp</h3>
      </div>

      <div className="space-y-3">
        {PREMIUM_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#0F172A] hover:bg-slate-50 cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#059669] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F8FAFC]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

