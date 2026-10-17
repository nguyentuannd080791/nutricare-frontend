import React from "react";

/**
 * Đồng hồ đo bán nguyệt (Semi-circular BMI Gauge) theo chuẩn WHO
 * SOLID: Single Responsibility - Chỉ phụ trách render gauge trực quan.
 */
export default function BmiRadialGauge({ score, min = 15, max = 35 }) {
  const clampedScore = Math.min(Math.max(score, min), max);
  const percentage = (clampedScore - min) / (max - min);
  const rotationDeg = -90 + percentage * 180;

  return (
    <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
      <div className="relative w-56 h-28 sm:w-64 sm:h-32 overflow-hidden flex items-end justify-center">
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full transform transition-all duration-700"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="whoGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="25%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="78%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#whoGaugeGrad)"
            strokeWidth="18"
            strokeLinecap="round"
          />
        </svg>

        {/* Kim chỉ số (Needle) */}
        <div
          className="absolute bottom-0 left-1/2 w-1 origin-bottom bg-[#0F172A] rounded-full transition-transform duration-700 ease-out z-10 shadow-md"
          style={{
            height: "76px",
            transform: `translateX(-50%) rotate(${rotationDeg}deg)`,
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#0F172A] border-2 border-white absolute -top-1 -left-1 shadow" />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-[#0F172A] shadow-md z-20" />
      </div>

      {/* Các nhãn mốc số chuẩn WHO */}
      <div className="w-56 sm:w-64 flex justify-between text-[11px] font-bold text-[#0F172A]/50 px-3 mt-1.5">
        <span>15</span>
        <span className="text-[#059669]">18.5</span>
        <span className="text-[#059669]">24.9</span>
        <span className="text-[#D97706]">30.0</span>
        <span>35+</span>
      </div>
    </div>
  );
}
