import React from "react";
import CtaLink from "./CtaLink";

export default function LandingNav() {
  return (
    <nav className="flex items-center justify-between py-[18px]" aria-label="Điều hướng chính">
      <span className="text-[20px] font-extrabold text-primaryDark">NutriCare</span>
      <CtaLink location="nav" variant="outline">Mở ứng dụng</CtaLink>
    </nav>
  );
}
