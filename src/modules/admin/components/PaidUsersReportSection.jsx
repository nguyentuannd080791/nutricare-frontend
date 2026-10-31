import React, { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, DollarSign, Users, ArrowUpRight, TrendingUp } from "lucide-react";
import { adminApi } from "../api/adminApi";

export default function PaidUsersReportSection({ days = 30 }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    adminApi
      .paymentReport(days)
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Không thể tải báo cáo thanh toán");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [days]);

  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-[#DCEEE7] shadow-xs text-center text-xs text-slate-500">
        <div className="w-5 h-5 border-2 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Đang tổng hợp báo cáo doanh thu & người dùng trả phí...</span>
      </div>
    );
  }

  if (error || !report) {
    return null; // Không chặn trang chính nếu API lỗi
  }

  const { totals, planBreakdown, recentTransactions } = report;

  return (
    <div className="bg-white rounded-3xl border border-[#DCEEE7] p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#059669] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-[#0F172A]">
              Báo Cáo Doanh Thu & Người Dùng Trả Phí
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp dữ liệu thanh toán, doanh số và tỷ lệ chuyển đổi gói Hội viên Pro
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 px-3 py-1 bg-slate-100 rounded-full w-fit">
          Thống kê {days} ngày gần nhất
        </span>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-[#A7F3D0] space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Tổng doanh thu
          </span>
          <p className="text-2xl font-black text-[#065F46]">
            {Number(totals?.totalRevenue || 0).toLocaleString("vi-VN")} đ
          </p>
          <p className="text-[11px] text-emerald-700">
            {totals?.completedTransactions || 0} giao dịch thành công
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
            Người dùng trả phí
          </span>
          <p className="text-2xl font-black text-sky-900">
            {totals?.paidUsersCount || 0}
          </p>
          <p className="text-[11px] text-sky-700">
            Trên tổng số {totals?.totalUsers || 0} người dùng
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Tỷ lệ chuyển đổi
          </span>
          <p className="text-2xl font-black text-amber-900">
            {Math.round((totals?.conversionRate || 0) * 100)}%
          </p>
          <p className="text-[11px] text-amber-700">
            Tháng: {planBreakdown?.monthly?.count || 0} • Năm: {planBreakdown?.yearly?.count || 0}
          </p>
        </div>
      </div>

      {/* Danh sách giao dịch trả phí gần nhất */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Giao dịch thanh toán gần nhất
        </h4>

        {recentTransactions?.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Chưa có giao dịch trả phí nào được ghi nhận.
          </p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left min-w-[580px]">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3.5">Mã Đơn</th>
                  <th className="py-2.5 px-3.5">Khách Hàng</th>
                  <th className="py-2.5 px-3.5">Gói Cước</th>
                  <th className="py-2.5 px-3.5">Số Tiền</th>
                  <th className="py-2.5 px-3.5">Cổng</th>
                  <th className="py-2.5 px-3.5">Thời Gian</th>
                  <th className="py-2.5 px-3.5 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id || tx.orderCode} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-[#059669]">
                      {tx.orderCode}
                    </td>
                    <td className="py-3 px-3.5">
                      <p className="font-bold text-slate-800">{tx.userFullName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{tx.userEmail}</p>
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-700">
                      {tx.plan === "yearly" ? "Gói Năm (12 tháng)" : "Gói Tháng (1 tháng)"}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      {Number(tx.amount).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 font-medium">
                      VietQR
                    </td>
                    <td className="py-3 px-3.5 text-slate-400 text-[11px]">
                      {new Date(tx.completedAt || tx.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === "COMPLETED"
                            ? "bg-emerald-100 text-[#065F46]"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {tx.status === "COMPLETED" ? "Thành công" : "Đang chờ"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

