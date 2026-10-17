import React from "react";
import { Droplets, Minus, Plus } from "lucide-react";
import { calcWaterProgress } from "../domain/waterProgress";

export default function WaterCard({ water, onChange, className = "" }) {
  const { percent, liters, goalLiters } = calcWaterProgress(water);
  const canDecrease = water.cups > 0;
  const canIncrease = water.cups < water.maxCups;
  const buttonStyle =
    "w-9 h-9 rounded-xl border border-sky-200 bg-sky-50 text-sky-600 flex items-center justify-center disabled:opacity-40";

  return (
    <div className={`rounded-3xl bg-white border border-border p-5 sm:p-6 shadow-sm flex flex-col gap-3 ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600">
        <Droplets className="w-4 h-4" />
        Nước uống
      </span>

      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-3xl font-extrabold text-fg">{liters.toFixed(2).replace(/\.?0+$/, "")}</span>
          <span className="ml-1.5 text-xs font-semibold text-fg/50">/ {goalLiters} lít</span>
          <p className="text-xs text-fg/60">
            {water.cups}/{water.goalCups} cốc ({water.cupMl} ml)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Bớt một cốc"
            disabled={!canDecrease}
            onClick={() => onChange(water.cups - 1)}
            className={buttonStyle}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Thêm một cốc"
            disabled={!canIncrease}
            onClick={() => onChange(water.cups + 1)}
            className={buttonStyle}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full h-2.5 rounded-full bg-sky-100 overflow-hidden">
        <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
