import React from "react";

const shortDate = (key) => key.slice(5).replace("-", "/"); // 2026-10-07 -> 10/07

/**
 * Trách nhiệm duy nhất: biểu đồ cột theo ngày bằng CSS (không thêm thư viện).
 * Giá trị không chỉ nằm ở chiều cao cột: có số lớn nhất hiện thành chữ và
 * bảng số liệu đầy đủ trong <details> (không phụ thuộc hover/màu).
 * valueOf trả null = ngày không có dữ liệu (không vẽ cột).
 */
export default function DailyBarChart({ title, series, valueOf, format = String }) {
  const values = series.map(valueOf);
  const max = Math.max(0, ...values.filter((v) => v != null));

  return (
    <figure className="m-0 bg-card border border-border rounded-2xl p-4">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-[14px] font-bold text-fg">{title}</span>
        <span className="text-[12px] text-slate-600">Cao nhất: {format(max)}</span>
      </figcaption>
      <div className="mt-3 h-24 flex items-end gap-[2px]" role="img" aria-label={`${title}, từ ${series[0].date} đến ${series.at(-1).date}`}>
        {values.map((v, i) => (
          <div key={series[i].date} className="flex-1 h-full flex items-end" title={`${series[i].date}: ${v == null ? "không có dữ liệu" : format(v)}`}>
            {v != null && <div className="w-full rounded-t-sm bg-primaryDark" style={{ height: `${max ? Math.max((v / max) * 100, v > 0 ? 3 : 0) : 0}%` }} />}
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-600">
        <span>{shortDate(series[0].date)}</span>
        <span>{shortDate(series.at(-1).date)}</span>
      </div>
      <details className="mt-2 text-[12px] text-slate-600">
        <summary className="cursor-pointer min-h-[32px] flex items-center">Xem số liệu từng ngày</summary>
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-left">
            <tbody>
              {series.map((d, i) => (
                <tr key={d.date} className="border-t border-border">
                  <th scope="row" className="py-1 font-normal">{d.date}</th>
                  <td className="py-1 text-right text-fg">{values[i] == null ? "—" : format(values[i])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
