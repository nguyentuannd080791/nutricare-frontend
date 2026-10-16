import React from "react";
import { trackEvent } from "../../../lib/analytics";
import { APP_PATH } from "../content";

const VARIANTS = {
  solid: "bg-primaryDark text-white border-primaryDark hover:bg-[#065F46]",
  outline: "bg-transparent text-primaryDark border-primaryDark hover:bg-muted",
};

/**
 * Trách nhiệm duy nhất: liên kết dẫn vào app + báo GA `cta_click`, để đo được
 * bao nhiêu khách ở trang giới thiệu bấm vào app và bấm từ vị trí nào.
 * transport_type=beacon: trang sắp chuyển hướng ngay, beacon giúp event không bị mất.
 */
export default function CtaLink({ location, variant = "solid", children, href = APP_PATH }) {
  return (
    <a
      href={href}
      onClick={() => trackEvent("cta_click", { location, transport_type: "beacon" })}
      className={`inline-flex items-center justify-center min-h-[48px] px-6 rounded-full border-2 font-bold cursor-pointer motion-safe:transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primaryDark ${VARIANTS[variant]}`}
    >
      {children}
    </a>
  );
}
