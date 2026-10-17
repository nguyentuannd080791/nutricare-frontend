import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Thẻ mẹo theo dõi cân nặng chuẩn xác (SOLID: Single Responsibility)
 */
export default function BmiTipsCard({ className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-[#ECFDF5]/70 border border-[#A7F3D0] p-4 sm:p-5 flex items-start gap-3.5 ${className}`}
    >
      <div className="p-2 rounded-xl bg-[#059669] text-white shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="space-y-1 text-xs">
        <h4 className="font-bold text-[#047857]">Mẹo theo dõi cân nặng chuẩn xác</h4>
        <ul className="text-[#0F172A]/70 space-y-0.5 list-disc list-inside text-[11px] leading-relaxed">
          <li>
            Cân vào <strong>buổi sáng sau khi đi vệ sinh</strong> và trước khi ăn uống.
          </li>
          <li>Sử dụng cùng một chiếc cân, đặt trên mặt sàn cứng phẳng cố định.</li>
          <li>
            Chỉ cần cân <strong>1-2 lần mỗi tuần</strong> vào cùng một khung giờ để xem xu hướng thực tế.
          </li>
        </ul>
      </div>
    </div>
  );
}
