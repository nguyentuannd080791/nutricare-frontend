import React, { useState, useEffect } from "react";
import { Receipt, X, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { paymentApi } from "../api/paymentApi";

export default function PaymentHistoryModal({ open, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    setLoading(true);
    paymentApi
      .getMyHistory()
      .then((data) => {
        if (isMounted) {
          setHistory(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Không thể tải lịch sử thanh toán.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-800 to-[#059669] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Receipt className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Lịch Sử Giao Dịch & Hóa Đơn</h3>
              <p className="text-xs text-emerald-100">Lịch sử thanh toán và nâng cấp gói Hội viên Pro</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {loading && (
            <div className="py-12 text-center text-slate-500 text-xs">
              <div className="w-6 h-6 border-2 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Đang tải lịch sử thanh toán...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600">Chưa có giao dịch thanh toán nào</p>
              <p>Các hóa đơn mua gói Hội viên Pro sẽ được lưu trữ tại đây.</p>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {history.map((tx) => (
                <div key={tx.id || tx.orderCode} className="p-4 bg-white hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-slate-800 text-sm">
                        {tx.orderCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === "COMPLETED"
                            ? "bg-emerald-100 text-[#065F46]"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {tx.status === "COMPLETED" ? "Thành công" : "Đang chờ"}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      Gói: <strong>{tx.plan === "yearly" ? "Hội viên 1 Năm" : "Hội viên 1 Tháng"}</strong> • Phương thức: VietQR
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-[#059669]">
                      {Number(tx.amount).toLocaleString("vi-VN")} VNĐ
                    </p>
                    {tx.status === "COMPLETED" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#059669] font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Đã kích hoạt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                        <Clock className="w-3 h-3" /> Chờ chuyển khoản
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

