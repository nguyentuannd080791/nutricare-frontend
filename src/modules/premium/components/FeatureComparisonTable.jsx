import React from "react";
import { Check, X } from "lucide-react";
import { COMPARISON_CATEGORIES } from "../domain/pricingData";

export default function FeatureComparisonTable() {
  return (
    <div className="bg-white rounded-3xl border border-[#DCEEE7] p-6 sm:p-8 shadow-xs space-y-5">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
          Bảng So Sánh Quyền Lợi Chi Tiết
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Đối chiếu toàn diện sự khác biệt giữa phiên bản Miễn phí và Hội viên NutriCare Pro
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[560px]">
          <thead>
            <tr className="border-b border-[#DCEEE7] text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Tính năng & Quyền lợi</th>
              <th className="py-3 px-4 font-bold text-center w-36">Gói Miễn Phí</th>
              <th className="py-3 px-4 font-bold text-center w-48 text-[#059669]">
                Gói Premium Pro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {COMPARISON_CATEGORIES.map((group) => (
              <React.Fragment key={group.category}>
                <tr className="bg-slate-50/70">
                  <td
                    colSpan={3}
                    className="py-2.5 px-4 font-extrabold text-[#0F172A] uppercase text-[11px] tracking-wide"
                  >
                    {group.category}
                  </td>
                </tr>
                {group.items.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700">{row.name}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-4 h-4 text-[#059669] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-500 font-medium">{row.free}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center bg-[#ECFDF5]/30 font-bold text-[#059669]">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <Check className="w-4 h-4 text-[#059669] mx-auto stroke-[2.5]" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span>{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

