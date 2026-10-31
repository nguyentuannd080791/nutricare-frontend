import React from "react";
import { Crown, Sparkles, Camera, Scale, ShieldAlert } from "lucide-react";

export default function ActivePremiumBanner({ user, onRequestCancel, onOpenHistory }) {
  if (!user?.isPremium) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-[#059669] to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            <Crown className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black">Hội Viên NutriCare Pro</h3>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              Toàn bộ tính năng AI và thuật toán tự động cân chỉnh dinh dưỡng đang được kích hoạt.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer text-center"
            >
              Lịch Sử Thanh Toán
            </button>
          )}
          <button
            type="button"
            onClick={onRequestCancel}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/30 text-xs font-bold text-white transition-all cursor-pointer text-center"
          >
            Hủy Gói
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-white/15">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4 text-amber-200" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Quét Món Camera</p>
            <p className="text-[11px] text-emerald-200 font-medium">Không giới hạn</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Đa Dạng Hóa AI</p>
            <p className="text-[11px] text-emerald-200 font-medium">Không giới hạn</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4 text-amber-200" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Feedback Loop Calo</p>
            <p className="text-[11px] text-emerald-200 font-medium">Đang tự động cân chỉnh</p>
          </div>
        </div>
      </div>
    </div>
  );
}

