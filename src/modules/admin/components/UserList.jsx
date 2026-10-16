import React from "react";
import { ChevronRight, Crown } from "lucide-react";
import { GOALS } from "../../../shared/domain/constants";
import { Card, Badge } from "../../../shared/components/ui";

const goalLabel = (goalId) => {
  if (!goalId) return "Chưa có";
  return GOALS.find((g) => g.id === goalId)?.label || goalId;
};

/**
 * Trách nhiệm duy nhất: vẽ danh sách người dùng.
 * Máy tính dạng bảng (table), điện thoại dạng thẻ (cards).
 */
export default function UserList({ items, onSelectUser }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      {/* Giao diện máy tính (ẩn trên màn nhỏ, hiện từ md:block) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-[13.5px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
              <th className="py-3 px-3.5">Tên</th>
              <th className="py-3 px-3.5">Email</th>
              <th className="py-3 px-3.5">Gói</th>
              <th className="py-3 px-3.5">Mục tiêu</th>
              <th className="py-3 px-3.5">Calo MT</th>
              <th className="py-3 px-3.5">Cân nặng</th>
              <th className="py-3 px-3.5">Hoạt động gần nhất</th>
              <th className="py-3 px-3.5">Ngày tạo</th>
              <th className="py-3 px-2 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((u) => {
              const nameDisplay = u.fullName?.trim() ? u.fullName : "(chưa đặt tên)";
              return (
                <tr
                  key={u.id}
                  onClick={() => onSelectUser(u.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3.5 font-semibold text-fg">
                    <span className={u.fullName?.trim() ? "" : "text-slate-400 italic font-normal"}>
                      {nameDisplay}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600 font-mono text-[13px]">{u.emailMasked}</td>
                  <td className="py-3 px-3.5">
                    {u.isPremium ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-xs font-semibold">
                        <Crown size={12} className="text-amber-600" />
                        Premium
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-medium">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">{goalLabel(u.goalId)}</td>
                  <td className="py-3 px-3.5 text-slate-600">
                    {u.targetKcal != null ? `${u.targetKcal} kcal` : "—"}
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">
                    {u.weightKg != null ? `${u.weightKg} kg` : "—"}
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">
                    {u.lastActiveDate || "Chưa có"}
                  </td>
                  <td className="py-3 px-3.5 text-slate-500 text-xs">{u.createdAt}</td>
                  <td className="py-3 px-2 text-right text-slate-400">
                    <ChevronRight size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Giao diện điện thoại (hiện trên màn nhỏ, ẩn từ md:hidden) */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {items.map((u) => {
          const nameDisplay = u.fullName?.trim() ? u.fullName : "(chưa đặt tên)";
          return (
            <Card
              key={u.id}
              onPress={() => onSelectUser(u.id)}
              className="p-3.5 active:bg-slate-50 transition-colors"
            >
              <div className="flex flex-row items-center justify-between gap-2 mb-1.5">
                <span className={`text-[15px] font-bold ${u.fullName?.trim() ? "text-fg" : "text-slate-400 italic font-normal"}`}>
                  {nameDisplay}
                </span>
                {u.isPremium ? (
                  <Badge tone="warn">Premium</Badge>
                ) : (
                  <Badge tone="muted">Free</Badge>
                )}
              </div>

              <div className="flex flex-row items-center justify-between text-[13px] text-slate-500 mb-1">
                <span className="font-mono text-xs">{u.emailMasked}</span>
                <span>{goalLabel(u.goalId)}</span>
              </div>

              <div className="flex flex-row items-center justify-between text-[12px] text-slate-400 pt-1.5 border-t border-slate-100">
                <span>Tạo: {u.createdAt}</span>
                <span>Gần nhất: {u.lastActiveDate || "Chưa có"}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
