import React, { useState, useMemo } from "react";
import {
  Scale,
  Sparkles,
  ArrowLeft,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { BmiEngine } from "../domain/bmiEngine";
import BmiRadialGauge from "../components/BmiRadialGauge";
import CompactBmiSpectrum from "../components/CompactBmiSpectrum";
import BmiMetricCards from "../components/BmiMetricCards";
import BmiStandardsTable from "../components/BmiStandardsTable";
import WeightUpdateCard from "../components/WeightUpdateCard";
import WeightHistoryCard from "../components/WeightHistoryCard";
import BmiTipsCard from "../components/BmiTipsCard";

const NOTE_STORAGE_KEY_PREFIX = "nutricare_bmi_notes_";

function getStoredNotes(userId) {
  try {
    const raw = localStorage.getItem(`${NOTE_STORAGE_KEY_PREFIX}${userId || "guest"}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredNote(userId, recordKey, note) {
  try {
    const key = `${NOTE_STORAGE_KEY_PREFIX}${userId || "guest"}`;
    const existing = getStoredNotes(userId);
    existing[recordKey] = note;
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // Ignore storage quota errors
  }
}

function formatRecordDate(dateInput) {
  if (!dateInput) return { dateDisplay: "Hôm nay", time: "07:00" };
  const d = new Date(dateInput);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");

  const dateDisplay = isToday ? `Hôm nay, ${day}/${month}` : `${day}/${month}/${year}`;
  const time = `${hours}:${mins}` === "00:00" ? "07:00" : `${hours}:${mins}`;

  return { dateDisplay, time, dateStr: `${year}-${month}-${day}` };
}

/**
 * Màn hình Tính & Theo Dõi Chỉ Số BMI (SOLID: Open/Closed & Single Responsibility)
 * Đồng bộ hoàn chỉnh từ BmiCalculatorPage của test-ui:
 * - Chuẩn Quốc tế WHO (18.5 - 24.9)
 * - Đồng hồ bán nguyệt BmiRadialGauge + quang phổ thu gọn CompactBmiSpectrum
 * - 4 Thẻ chỉ số thể trạng: BMI, Biến động, Mức cân chuẩn WHO, BMR & TDEE
 * - Cập nhật cân nặng tinh gọn với nút [-] / [+] 0.1kg và live preview BMI
 * - Lịch sử đo lường cố định (không cho phép xóa) với biểu đồ mini xu hướng
 * - Tab chuyển đổi trên mobile và bố cục 2 cột (5/7) trên desktop
 */
export default function BMIScreen({ data, user, onBack, onAddBMI }) {
  const records = useMemo(() => data?.bmiRecords || [], [data?.bmiRecords]);
  const latestRecord = records[0] || null;
  const activeTarget = data?.targets?.find((t) => t.isActive) || null;

  // Chiều cao cố định từ hồ sơ đo lường đầu tiên
  const fixedHeight = latestRecord?.heightCm || 173;
  const currentWeight = latestRecord?.weightKg || 65;
  const userName = user?.fullName || "Người dùng";
  const isMale = user?.gender !== "nu";

  // Tính tuổi từ ngày sinh
  let age = 26;
  if (user?.dob) {
    const birthYear = new Date(user.dob).getFullYear();
    if (birthYear) age = Math.max(10, Math.min(100, new Date().getFullYear() - birthYear));
  }

  // State nhập liệu & ghi chú
  const [inputWeight, setInputWeight] = useState(currentWeight);
  const [prevRecordId, setPrevRecordId] = useState(latestRecord?.id);
  if (latestRecord?.id && latestRecord.id !== prevRecordId) {
    setPrevRecordId(latestRecord.id);
    setInputWeight(latestRecord.weightKg);
  }

  const [optionalNote, setOptionalNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileTab, setMobileTab] = useState("update"); // "update" | "history" | "standards"
  const [storedNotes, setStoredNotes] = useState(() => getStoredNotes(user?.id));

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tính toán BMI và các chỉ số thể trạng
  const currentScore = useMemo(
    () => BmiEngine.calculateScore(currentWeight, fixedHeight),
    [currentWeight, fixedHeight]
  );

  const activeCategory = useMemo(
    () => BmiEngine.getCategory(currentScore),
    [currentScore]
  );

  const idealWeightRange = useMemo(
    () => BmiEngine.getIdealWeightRange(fixedHeight),
    [fixedHeight]
  );

  const bmrValue = useMemo(() => {
    if (activeTarget?.bmr) return activeTarget.bmr;
    return BmiEngine.calculateBMR(currentWeight, fixedHeight, age, isMale);
  }, [activeTarget, currentWeight, fixedHeight, age, isMale]);

  const tdeeValue = useMemo(() => {
    if (activeTarget?.tdee) return activeTarget.tdee;
    return BmiEngine.calculateTDEE(bmrValue, 1.375);
  }, [activeTarget, bmrValue]);

  // Ghép nối lịch sử đo với ngày giờ hiển thị và ghi chú lưu trữ
  const formattedHistory = useMemo(() => {
    return records.map((r, index) => {
      const { dateDisplay, time, dateStr } = formatRecordDate(r.date || r.createdAt);
      const bmiScore = r.bmi || BmiEngine.calculateScore(r.weightKg, r.heightCm || fixedHeight);
      const note = storedNotes[r.id] || storedNotes[dateStr] || storedNotes[String(r.weightKg)] || undefined;

      return {
        id: r.id || `bmi-${index}`,
        date: dateStr,
        dateDisplay,
        time,
        weightKg: r.weightKg,
        bmi: bmiScore,
        note,
      };
    });
  }, [records, fixedHeight, storedNotes]);

  // Tính toán delta so với lần đo trước
  const deltaInfo = useMemo(() => {
    if (formattedHistory.length < 2) return null;
    return BmiEngine.calculateDelta(formattedHistory[0], formattedHistory[1]);
  }, [formattedHistory]);

  // Xử lý lưu cân nặng mới
  const handleSaveNewWeight = async (e) => {
    if (e) e.preventDefault();
    const newWeightNum = Number(Number(inputWeight).toFixed(1));
    if (!newWeightNum || newWeightNum < 25 || newWeightNum > 250) {
      showToast("Vui lòng nhập cân nặng hợp lệ (25 - 250 kg)");
      return;
    }

    setIsSaving(true);
    try {
      if (optionalNote.trim()) {
        const todayStr = new Date().toISOString().slice(0, 10);
        saveStoredNote(user?.id, todayStr, optionalNote.trim());
        saveStoredNote(user?.id, String(newWeightNum), optionalNote.trim());
        setStoredNotes((prev) => ({
          ...prev,
          [todayStr]: optionalNote.trim(),
          [String(newWeightNum)]: optionalNote.trim(),
        }));
      }

      await onAddBMI({ weightKg: newWeightNum });
      const newScore = BmiEngine.calculateScore(newWeightNum, fixedHeight);
      showToast(`Đã lưu cân nặng ${newWeightNum} kg (BMI: ${newScore}) thành công!`);
      setOptionalNote("");
    } catch (err) {
      showToast(err.message || "Không thể lưu cân nặng mới");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      {/* TOAST THÔNG BÁO NỔI */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0F172A] text-white text-xs font-semibold shadow-xl border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER CHÍNH */}
      <header className="sticky top-0 z-30 shrink-0 bg-white/95 backdrop-blur-md border-b border-[#DCEEE7] px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-[#F0F8F6] hover:bg-[#ECFDF5] text-[#059669] border border-[#DCEEE7] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Quay lại Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Về Dashboard</span>
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
                  Tính & Theo Dõi Chỉ Số BMI
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  <Sparkles className="w-3 h-3 text-[#EA580C]" />
                  Chuẩn WHO
                </span>
              </div>
              <p className="text-[11px] text-[#0F172A]/55 font-medium">
                Hồ sơ: <strong className="text-[#059669]">{userName}</strong>
              </p>
            </div>
          </div>

          {/* HIỂN THỊ CHIỀU CAO CỐ ĐỊNH & TIÊU CHUẨN WHO */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCEEE7] bg-[#F0F8F6] text-xs font-semibold text-[#0F172A]/75">
              <span>
                Chiều cao: <strong className="text-[#059669]">{fixedHeight} cm</strong>
              </span>
              <span className="hidden sm:inline text-[10px] text-[#0F172A]/40">(Cố định)</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white border border-[#DCEEE7] text-xs font-bold text-[#059669] shadow-2xs">
              Chuẩn WHO
            </div>
          </div>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
        {/* PHẦN 1: HÀNG THỐNG KÊ NHANH 4 CHỈ SỐ */}
        <BmiMetricCards
          currentScore={currentScore}
          currentWeight={currentWeight}
          activeCategory={activeCategory}
          deltaInfo={deltaInfo}
          idealWeightRange={idealWeightRange}
          bmrValue={bmrValue}
          tdeeValue={tdeeValue}
        />

        {/* TAB SWITCHER TRÊN ĐIỆN THOẠI (KHÔNG CÓ ICON) */}
        <div className="lg:hidden bg-white p-1.5 rounded-2xl border border-[#DCEEE7] shadow-sm flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => setMobileTab("update")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              mobileTab === "update"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#0F172A]/60 hover:text-[#0F172A]"
            }`}
          >
            Cập nhật cân nặng
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("history")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              mobileTab === "history"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#0F172A]/60 hover:text-[#0F172A]"
            }`}
          >
            Lịch sử ({formattedHistory.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("standards")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              mobileTab === "standards"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#0F172A]/60 hover:text-[#0F172A]"
            }`}
          >
            Bảng chuẩn & Lời khuyên
          </button>
        </div>

        {/* PHẦN 2: BỐ CỤC 2 CỘT (DESKTOP: SONG SONG | MOBILE: HIỂN THỊ THEO TAB) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (5 CỘT TRÊN DESKTOP): ĐỒNG HỒ GAUGE & BẢNG CHUẨN WHO */}
          <div
            className={`lg:col-span-5 space-y-6 ${
              mobileTab === "standards" ? "block" : "hidden lg:block"
            }`}
          >
            {/* HERO CARD: ĐỒNG HỒ GAUGE THEO CHUẨN WHO */}
            <div className="rounded-3xl bg-white border border-[#DCEEE7] p-5 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A] whitespace-nowrap">
                      Đồng Hồ Chỉ Số Thể Trạng
                    </h2>
                    <p className="text-xs text-[#0F172A]/50">
                      Theo Chuẩn Quốc Tế (WHO)
                    </p>
                  </div>
                </div>

                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    color: activeCategory.color,
                    backgroundColor: activeCategory.bgColor,
                    borderColor: activeCategory.borderColor,
                  }}
                >
                  {activeCategory.label}
                </span>
              </div>

              <div className="hidden sm:block">
                <BmiRadialGauge score={currentScore} />
              </div>

              <div className="block sm:hidden">
                <CompactBmiSpectrum score={currentScore} />
              </div>

              {/* Tóm tắt tình trạng và so sánh lần đo trước */}
              <div className="p-4 rounded-2xl bg-[#F0F8F6] border border-[#DCEEE7] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F172A]">Chẩn đoán sức khỏe:</span>
                  <span className="font-semibold text-[#059669]">{activeCategory.risk}</span>
                </div>

                {deltaInfo && (
                  <div className="pt-2 border-t border-[#DCEEE7] flex items-center justify-between text-xs">
                    <span className="text-[#0F172A]/60">
                      Lần đo trước ({deltaInfo.previousDateDisplay}):
                    </span>
                    <span className="font-bold text-[#0F172A]">
                      {deltaInfo.previousWeight} kg (BMI {deltaInfo.previousBmi})
                    </span>
                  </div>
                )}

                <p className="text-xs leading-relaxed text-[#0F172A]/75 pt-1">
                  💡 <strong>Gợi ý:</strong> {activeCategory.advice}
                </p>
              </div>
            </div>

            {/* BẢNG PHÂN LOẠI CHUẨN WHO */}
            <BmiStandardsTable activeCategory={activeCategory} />
          </div>

          {/* CỘT PHẢI (7 CỘT TRÊN DESKTOP): CẬP NHẬT CÂN NẶNG & LỊCH SỬ KHÔNG CHO PHÉP XOÁ */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              mobileTab === "update" || mobileTab === "history"
                ? "block"
                : "hidden lg:block"
            }`}
          >
            {/* KHỐI CẬP NHẬT CÂN NẶNG TINH GỌN */}
            <WeightUpdateCard
              inputWeight={inputWeight}
              setInputWeight={setInputWeight}
              currentWeight={currentWeight}
              fixedHeight={fixedHeight}
              optionalNote={optionalNote}
              setOptionalNote={setOptionalNote}
              onSave={handleSaveNewWeight}
              isSaving={isSaving}
              className={mobileTab === "update" ? "block" : "hidden lg:block"}
            />

            {/* KHỐI LỊCH SỬ ĐO ĐẠC */}
            <WeightHistoryCard
              history={formattedHistory}
              currentWeight={currentWeight}
              idealWeightRange={idealWeightRange}
              targetWeight={activeTarget?.targetWeightKg}
              className={mobileTab === "history" ? "block" : "hidden lg:block"}
            />

            {/* MẸO THEO DÕI CÂN NẶNG */}
            <BmiTipsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
