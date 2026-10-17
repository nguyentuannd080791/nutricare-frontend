import React, { useState, useMemo } from "react";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Minus,
  Activity,
  ShieldCheck,
  Info,
} from "lucide-react";

/**
 * Tạo danh sách 14 ngày gần nhất tính từ (Hôm nay - 13 ngày) đến Hôm nay
 * và điền dữ liệu cân nặng từ lịch sử hoặc nội suy / giữ đường thẳng
 */
function build14DayTimeline(history = [], currentWeight = 65) {
  const list = [];
  const now = new Date();

  // Bảng tra cứu bản ghi theo chuỗi ngày 'YYYY-MM-DD'
  const recordMap = new Map();
  if (Array.isArray(history)) {
    for (const item of history) {
      if (item && item.date && !recordMap.has(item.date)) {
        recordMap.set(item.date, item);
      }
    }
  }

  // Tạo 14 ngày từ ngày T-13 đến ngày T-0 (Hôm nay)
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const isToday = i === 0;
    const isStart = i === 13;
    const record = recordMap.get(dateStr) || null;

    list.push({
      dateStr,
      dayNum: day,
      monthNum: month,
      displayDate: isToday ? "Hôm nay" : `${day}/${month}`,
      fullDisplay: `${day}/${month}/${year}`,
      isToday,
      isStart,
      record,
      isMeasured: Boolean(record),
      weightKg: record ? Number(record.weightKg) : null,
      bmi: record?.bmi || null,
      note: record?.note || null,
      dayIndex: 13 - i,
    });
  }

  const measuredDays = list.filter((d) => d.isMeasured);
  const fallbackWeight = Number(
    (currentWeight || (history?.[0]?.weightKg ?? 65.0)).toFixed(1)
  );

  // YÊU CẦU: "nếu không có lịch sử hãy để đường thẳng"
  // Trường hợp 1: Hoàn toàn không có lần đo nào trong 14 ngày qua
  if (measuredDays.length === 0) {
    return {
      timeline: list.map((d) => ({
        ...d,
        weightKg: fallbackWeight,
        isEstimated: true,
      })),
      isStraightLine: true,
      hasMeasurements: false,
      fallbackWeight,
    };
  }

  // Trường hợp 2: Chỉ có đúng 1 lần đo trong 14 ngày qua -> đường thẳng ngang qua 14 ngày
  if (measuredDays.length === 1) {
    const singleWeight = measuredDays[0].weightKg;
    return {
      timeline: list.map((d) => ({
        ...d,
        weightKg: singleWeight,
        isEstimated: !d.isMeasured,
      })),
      isStraightLine: true,
      hasMeasurements: true,
      fallbackWeight: singleWeight,
    };
  }

  // Trường hợp 3: Có từ 2 lần đo trở lên -> nội suy tuyến tính giữa các mốc đo
  const result = [...list];
  const measuredIndices = [];
  result.forEach((d, idx) => {
    if (d.isMeasured) measuredIndices.push(idx);
  });

  // 1. Phía trước mốc đo đầu tiên: giữ mức cân của mốc đầu tiên
  const firstIdx = measuredIndices[0];
  const firstWeight = result[firstIdx].weightKg;
  for (let i = 0; i < firstIdx; i++) {
    result[i].weightKg = firstWeight;
    result[i].isEstimated = true;
  }

  // 2. Nội suy giữa các mốc đo liên tiếp
  for (let k = 0; k < measuredIndices.length - 1; k++) {
    const startIdx = measuredIndices[k];
    const endIdx = measuredIndices[k + 1];
    const startW = result[startIdx].weightKg;
    const endW = result[endIdx].weightKg;
    const steps = endIdx - startIdx;

    for (let i = startIdx + 1; i < endIdx; i++) {
      const ratio = (i - startIdx) / steps;
      result[i].weightKg = Number((startW + ratio * (endW - startW)).toFixed(1));
      result[i].isEstimated = true;
    }
  }

  // 3. Phía sau mốc đo cuối cùng đến hôm nay: giữ mức cân của mốc cuối cùng
  const lastIdx = measuredIndices[measuredIndices.length - 1];
  const lastWeight = result[lastIdx].weightKg;
  for (let i = lastIdx + 1; i < result.length; i++) {
    result[i].weightKg = lastWeight;
    result[i].isEstimated = true;
  }

  // Kiểm tra nếu tất cả các mốc có giá trị cân nặng giống hệt nhau
  const uniqueWeights = new Set(result.map((d) => d.weightKg));
  const isStraightLine = uniqueWeights.size === 1;

  return {
    timeline: result,
    isStraightLine,
    hasMeasurements: true,
    fallbackWeight: result[result.length - 1].weightKg,
  };
}

/**
 * Xây dựng đường cong Bézier mượt mà từ mảng toạ độ các điểm
 */
function buildSmoothPath(pts) {
  if (!pts || pts.length === 0) return "";
  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) * 0.45;
    const cp1y = p0.y;
    const cp2x = p1.x - (p1.x - p0.x) * 0.45;
    const cp2y = p1.y;
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return path;
}

/**
 * Khối lịch sử đo đạc cân nặng & BMI (SOLID: Single Responsibility)
 * - Biểu đồ đường (Line Chart) theo dõi đúng 14 ngày gần nhất
 * - Biểu thị đường chuẩn WHO / mục tiêu (Standard Line) nét đứt
 * - Nếu không có lịch sử: biểu thị đường thẳng ngang ổn định 14 ngày
 * - Danh sách nhật ký cố định không thể xoá bên dưới
 */
export default function WeightHistoryCard({
  history = [],
  currentWeight = 65,
  idealWeightRange = null,
  targetWeight = null,
  className = "",
}) {
  const [activeIdx, setActiveIdx] = useState(null);

  // Tính mức cân chuẩn WHO hoặc mục tiêu cá nhân để vẽ đường chuẩn
  const standardWeight = useMemo(() => {
    if (targetWeight && Number(targetWeight) > 0) {
      return Number(Number(targetWeight).toFixed(1));
    }
    if (idealWeightRange?.min && idealWeightRange?.max) {
      return Number(((idealWeightRange.min + idealWeightRange.max) / 2).toFixed(1));
    }
    return 65.0;
  }, [targetWeight, idealWeightRange]);

  // Xây dựng dữ liệu 14 ngày gần nhất
  const { timeline, isStraightLine, hasMeasurements, fallbackWeight } = useMemo(() => {
    return build14DayTimeline(history, currentWeight);
  }, [history, currentWeight]);

  // Tính biến động giữa ngày đầu tiên (T-13) và ngày hôm nay (T-0) trong chu kỳ 14 ngày
  const earliestWeight = timeline[0].weightKg;
  const latestWeight = timeline[timeline.length - 1].weightKg;
  const netDiff = Number((latestWeight - earliestWeight).toFixed(1));

  // Tọa độ SVG cho biểu đồ đường
  const svgWidth = 560;
  const svgHeight = 180;
  const padL = 46;
  const padR = 24;
  const padT = 26;
  const padB = 34;
  const plotW = svgWidth - padL - padR;
  const plotH = svgHeight - padT - padB;

  // Tính toán trục Y tự động co giãn đẹp mắt
  const weights = timeline.map((d) => d.weightKg);
  const allValues = [...weights, standardWeight].filter(
    (v) => typeof v === "number" && !isNaN(v)
  );

  let minW = Math.min(...allValues);
  let maxW = Math.max(...allValues);

  if (isStraightLine && Math.abs(maxW - minW) < 0.1) {
    // Nếu là đường thẳng, tạo khoảng đệm trên dưới 3kg để đường nằm ngay chính giữa biểu đồ
    minW = Number((minW - 3.0).toFixed(1));
    maxW = Number((maxW + 3.0).toFixed(1));
  } else {
    const diff = maxW - minW;
    const pad = Math.max(diff * 0.22, 1.2);
    minW = Number(Math.max(0, minW - pad).toFixed(1));
    maxW = Number((maxW + pad).toFixed(1));
  }
  const yRange = maxW - minW || 1;

  // Tính toạ độ 14 điểm dữ liệu
  const points = useMemo(() => {
    return timeline.map((d, i) => {
      const x = padL + (i / 13) * plotW;
      const y = padT + ((maxW - d.weightKg) / yRange) * plotH;
      return { x, y, data: d, index: i };
    });
  }, [timeline, padL, plotW, padT, plotH, maxW, yRange]);

  // Toạ độ Y của đường chuẩn (WHO Standard Reference Line)
  const yStandard = padT + ((maxW - standardWeight) / yRange) * plotH;
  const getY = (val) => padT + ((maxW - val) / yRange) * plotH;

  // Xây dựng đường nét vẽ và vùng gradient diện tích
  const linePath = useMemo(() => {
    if (isStraightLine) {
      return `M ${points[0].x} ${points[0].y} L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    }
    return buildSmoothPath(points);
  }, [points, isStraightLine]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    return `${linePath} L ${points[points.length - 1].x} ${padT + plotH} L ${points[0].x} ${padT + plotH} Z`;
  }, [linePath, points, padT, plotH]);

  // Điểm được chọn hoặc mặc định xem
  const currentActivePoint = activeIdx !== null ? points[activeIdx] : null;

  return (
    <div
      className={`rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm space-y-5 ${className}`}
    >
      {/* TIÊU ĐỀ KHỐI LỊCH SỬ CÂN NẶNG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
            {netDiff < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : netDiff > 0 ? (
              <TrendingUp className="w-4 h-4 text-[#EA580C]" />
            ) : (
              <Minus className="w-4 h-4 text-[#059669]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#0F172A]">
                Lịch Sử Cân Nặng (14 ngày gần nhất)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                14 ngày
              </span>
            </div>
            <p className="text-xs text-[#0F172A]/50">
              Biểu đồ đường theo dõi biến động & đối chiếu đường chuẩn WHO
            </p>
          </div>
        </div>

        {/* CHÚ THÍCH CÁC ĐƯỜNG BIỂU ĐỒ (LEGEND) */}
        <div className="flex items-center gap-3 text-xs font-semibold text-[#0F172A]/70 self-start sm:self-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#059669] rounded-full inline-block" />
            <span className="text-[11px]">Cân nặng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-[#10B981] inline-block" />
            <span className="text-[11px] text-[#059669]">
              Đường chuẩn ({standardWeight} kg)
            </span>
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ ĐƯỜNG 14 NGÀY GẦN NHẤT */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] space-y-3">
        {/* THANH TRẠNG THÁI TÓM TẮT XU HƯỚNG */}
        <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]/70">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#059669]" />
            <span>Tiến trình 14 ngày</span>
          </div>

          <div className="flex items-center gap-2">
            {!hasMeasurements ? (
              <span className="text-[#059669] bg-white px-2.5 py-0.5 rounded-full border border-[#DCEEE7] text-[11px]">
                Đường thẳng chuẩn ({fallbackWeight} kg)
              </span>
            ) : isStraightLine ? (
              <span className="text-[#059669] bg-white px-2.5 py-0.5 rounded-full border border-[#DCEEE7] text-[11px]">
                Giữ ổn định: {timeline[0].weightKg} kg
              </span>
            ) : (
              <span
                className={`bg-white px-2.5 py-0.5 rounded-full border border-[#DCEEE7] text-[11px] ${
                  netDiff < 0
                    ? "text-[#059669]"
                    : netDiff > 0
                    ? "text-[#EA580C]"
                    : "text-[#0F172A]/70"
                }`}
              >
                {netDiff < 0
                  ? `Tổng giảm: ${Math.abs(netDiff)} kg`
                  : netDiff > 0
                  ? `Tổng tăng: +${netDiff} kg`
                  : "Giữ ổn định"}
              </span>
            )}
          </div>
        </div>

        {/* TOOLTIP HIỂN THỊ KHI CHỌN HOẶC HOVER VÀO MỐC NGÀY */}
        {currentActivePoint && (
          <div className="p-2.5 rounded-xl bg-white border border-[#059669]/30 shadow-xs flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A]">
                {currentActivePoint.data.displayDate} ({currentActivePoint.data.fullDisplay}):
              </span>
              <span className="font-extrabold text-[#059669]">
                {currentActivePoint.data.weightKg} kg
              </span>
              {currentActivePoint.data.bmi && (
                <span className="text-[11px] text-[#0F172A]/50">
                  (BMI {currentActivePoint.data.bmi})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentActivePoint.data.isMeasured ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                  Đã ghi nhận
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B]">
                  Đường chuẩn
                </span>
              )}
            </div>
          </div>
        )}

        {/* KHUNG VẼ BIỂU ĐỒ SVG LINE CHART */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-44 sm:h-52 select-none"
            onMouseLeave={() => setActiveIdx(null)}
          >
            <defs>
              {/* Gradient vùng diện tích dưới đường biểu đồ */}
              <linearGradient id="weightGrad14" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>

              {/* Shadow cho các điểm đo */}
              <filter id="pointShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* CÁC ĐƯỜNG KẺ LƯỚI NGANG (Y-AXIS GRID) */}
            {[maxW, (maxW + minW) / 2, minW].map((val, idx) => {
              const y = getY(val);
              return (
                <g key={`grid-y-${idx}`}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={padL + plotW}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padL - 6}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="9.5"
                    fontWeight="600"
                    fill="#94A3B8"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* ĐƯỜNG CHUẨN WHO / MỤC TIÊU (BENCHMARK REFERENCE LINE) */}
            <g>
              <line
                x1={padL}
                y1={yStandard}
                x2={padL + plotW}
                y2={yStandard}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                strokeOpacity="0.85"
              />
              <text
                x={padL + plotW}
                y={Math.max(padT + 10, yStandard - 6)}
                textAnchor="end"
                fontSize="9.5"
                fontWeight="700"
                fill="#059669"
              >
                Đường chuẩn: {standardWeight} kg
              </text>
            </g>

            {/* VÙNG DIỆN TÍCH PHÍA DƯỚI ĐƯỜNG CÂN NẶNG */}
            <path d={areaPath} fill="url(#weightGrad14)" />

            {/* ĐƯỜNG BIỂU ĐỒ CÂN NẶNG CHÍNH (WEIGHT TREND LINE) */}
            <path
              d={linePath}
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* ĐƯỜNG THẲNG TRƯỜNG HỢP KHÔNG CÓ LỊCH SỬ / ỔN ĐỊNH */}
            {isStraightLine && (
              <g>
                <rect
                  x={padL + plotW / 2 - 70}
                  y={points[0].y - 20}
                  width="140"
                  height="16"
                  rx="8"
                  fill="#ECFDF5"
                  stroke="#A7F3D0"
                  strokeWidth="1"
                />
                <text
                  x={padL + plotW / 2}
                  y={points[0].y - 8}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#059669"
                >
                  Đường thẳng chuẩn • {fallbackWeight} kg
                </text>
              </g>
            )}

            {/* ĐƯỜNG DỌNG CHỈ THỊ KHI ĐANG HOVER MỘT NGÀY */}
            {currentActivePoint && (
              <line
                x1={currentActivePoint.x}
                y1={padT}
                x2={currentActivePoint.x}
                y2={padT + plotH}
                stroke="#059669"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}

            {/* CÁC ĐIỂM DỮ LIỆU TRÊN BIỂU ĐỒ (DATA DOTS) */}
            {points.map((pt, i) => {
              const isSelected = activeIdx === i;
              const isMeasured = pt.data.isMeasured;

              // Chỉ vẽ điểm nổi bật nếu ngày đó người dùng có đo, hoặc khi đang chọn mốc đó
              if (!isMeasured && !isSelected && !pt.data.isToday) {
                return null;
              }

              return (
                <g key={`point-${i}`} className="transition-all">
                  {/* Vòng sáng ngoài khi chọn hoặc hover */}
                  {(isSelected || isMeasured) && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 7 : 5}
                      fill={isMeasured ? "#ECFDF5" : "#F8FAFC"}
                      stroke="#059669"
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      filter="url(#pointShadow)"
                    />
                  )}

                  {/* Chấm tròn tâm */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 3.5 : 2.5}
                    fill={isMeasured ? "#059669" : "#64748B"}
                  />

                  {/* Nhãn cân nặng phía trên điểm đo thực tế */}
                  {isMeasured && !isSelected && (
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill="#0F172A"
                    >
                      {pt.data.weightKg}
                    </text>
                  )}
                </g>
              );
            })}

            {/* TRỤC HOÀNH (X-AXIS): VẠCH ĐO VÀ NHÃN NGÀY THÁNG TRONG 14 NGÀY */}
            {points.map((pt, i) => {
              // Vạch đo nhỏ cho từng ngày trong 14 ngày
              const isKeyTick = i === 0 || i === 4 || i === 8 || i === 11 || i === 13;
              return (
                <line
                  key={`tick-${i}`}
                  x1={pt.x}
                  y1={padT + plotH}
                  x2={pt.x}
                  y2={padT + plotH + (isKeyTick ? 4 : 2.5)}
                  stroke={isKeyTick ? "#94A3B8" : "#CBD5E1"}
                  strokeWidth="1"
                />
              );
            })}

            {/* HIỂN THỊ CÁC MỐC THỜI GIAN CHÍNH (NGÀY ĐẦU 14 NGÀY TRƯỚC, CÁC MỐC TRUNG GIAN, HÔM NAY) */}
            {[0, 4, 8, 11, 13].map((idx) => {
              const pt = points[idx];
              const d = timeline[idx];
              if (!pt || !d) return null;
              const isLast = idx === 13;
              const isFirst = idx === 0;

              return (
                <text
                  key={`xlabel-${idx}`}
                  x={pt.x}
                  y={padT + plotH + 17}
                  textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
                  fontSize="9.5"
                  fontWeight={isLast ? "700" : "500"}
                  fill={isLast ? "#059669" : "#64748B"}
                >
                  {d.displayDate}
                </text>
              );
            })}

            {/* VÙNG TƯƠNG TÁC CLICK / HOVER CHO TỪNG NGÀY TRONG 14 NGÀY */}
            {points.map((pt, i) => {
              const slotW = plotW / 14;
              return (
                <rect
                  key={`hover-zone-${i}`}
                  x={pt.x - slotW / 2}
                  y={padT}
                  width={slotW}
                  height={plotH + padB}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => setActiveIdx(i)}
                />
              );
            })}
          </svg>
        </div>

        {/* THÔNG TIN HƯỚNG DẪN DƯỚI BIỂU ĐỒ */}
        <div className="flex items-center justify-between text-[11px] text-[#0F172A]/50 pt-1 border-t border-[#DCEEE7]/70">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-[#059669]" />
            Chạm hoặc rê chuột vào biểu đồ để xem chi tiết từng ngày
          </span>
          <span className="font-semibold text-[#059669]">
            {hasMeasurements
              ? `${history.length} lần đo đạc đã lưu`
              : "Đường tham chiếu chuẩn"}
          </span>
        </div>
      </div>

      {/* DANH SÁCH BẢN GHI LỊCH SỬ CỐ ĐỊNH - KHÔNG CÓ NÚT XÓA */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wider">
            Nhật ký đo lường ({history.length} bản ghi)
          </span>
          <div className="flex items-center gap-1 text-[11px] text-[#059669] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dữ liệu cố định bảo đảm tính chuẩn xác</span>
          </div>
        </div>

        {history && history.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {history.map((log, index) => {
              const nextEarlier = history[index + 1];
              const diffWeight = nextEarlier
                ? Number((log.weightKg - nextEarlier.weightKg).toFixed(1))
                : null;

              return (
                <div
                  key={log.id || index}
                  className="p-3.5 rounded-2xl bg-white border border-[#DCEEE7] hover:border-[#059669]/40 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F8F6] border border-[#DCEEE7] flex flex-col items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-[#059669]" />
                      <span className="text-[9px] font-bold text-[#0F172A]/60">
                        {log.time || "07:00"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A]">
                          {log.dateDisplay || log.date}
                        </span>
                      </div>

                      {log.note && (
                        <p className="text-[11px] text-[#0F172A]/55 truncate mt-0.5 italic">
                          "{log.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-base font-extrabold text-[#0F172A]">
                        {log.weightKg}
                      </span>
                      <span className="text-[10px] font-semibold text-[#0F172A]/50">
                        kg
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold">
                      <span className="text-[#059669]">BMI {log.bmi}</span>
                      {diffWeight !== null && (
                        <span
                          className={
                            diffWeight < 0
                              ? "text-[#059669]"
                              : diffWeight > 0
                              ? "text-[#EA580C]"
                              : "text-[#0F172A]/50"
                          }
                        >
                          {diffWeight > 0 ? `(+${diffWeight})` : `(${diffWeight})`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#F0F8F6] border border-dashed border-[#DCEEE7] text-center space-y-1.5">
            <p className="text-xs font-bold text-[#0F172A]/70">
              Chưa có bản ghi đo đạc nào được lưu
            </p>
            <p className="text-[11px] text-[#0F172A]/50 max-w-sm mx-auto">
              Biểu đồ trên đang biểu diễn đường thẳng chuẩn 14 ngày ({fallbackWeight} kg).
              Hãy nhập cân nặng tại mục "Cập nhật cân nặng" để bắt đầu theo dõi tiến trình!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
