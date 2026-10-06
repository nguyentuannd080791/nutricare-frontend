import React, { useEffect } from "react";
import { trackPageView } from "../../lib/analytics";
import { VALUE_CARDS, STEPS } from "./content";
import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import InfoCardsSection from "./components/InfoCardsSection";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
import CtaBand from "./components/CtaBand";
import LandingFooter from "./components/LandingFooter";

/**
 * Trang chủ giới thiệu (đường dẫn "/") — điểm vào của khách CHƯA vào app.
 * Chỉ ghép các mục + báo GA 1 lượt xem trang "/" (tên "Home") mỗi lần mở;
 * mọi nút dẫn vào app đi qua CtaLink nên đo được phễu trang chủ → app.
 */
export default function LandingScreen() {
  useEffect(() => {
    trackPageView("/", "Home — Giới thiệu NutriCare");
  }, []);

  return (
    <div className="min-h-screen bg-bg font-landing text-fg">
      <div className="max-w-[1080px] mx-auto px-5">
        <LandingNav />
        <main>
          <HeroSection />
          <InfoCardsSection id="vi" title="Vì sao chọn NutriCare?" subtitle="Các ứng dụng quốc tế thường thiếu món Việt. NutriCare được xây dựng quanh bữa cơm của chúng ta." items={VALUE_CARDS} />
          <InfoCardsSection id="cach" title="Cách hoạt động" subtitle="Ba bước đơn giản." items={STEPS} numbered />
          <FeaturesSection />
          <PricingSection />
          <CtaBand />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
