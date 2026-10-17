import React, { useState, useMemo } from "react";
import {
  HeartPulse,
  Search,
  Plus,
  ChevronDown,
  X,
  CheckCircle2,
  HelpCircle,
  Ban,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import {
  CONDITION_TYPES,
  smartRecognizeCondition,
  enrichConditionData,
  normalizeVietnamese,
} from "../domain/medicalKnowledgeBase";
import ConditionCard from "../components/ConditionCard";
import PresetCatalogDropdown from "../components/PresetCatalogDropdown";
import ConditionEditModal from "../components/ConditionEditModal";

const CONDITION_NOTES_KEY = "nutricare_condition_notes_v1";

function getLocalNotes() {
  try {
    const raw = localStorage.getItem(CONDITION_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalNote(conditionName, note) {
  try {
    const current = getLocalNotes();
    current[conditionName] = note;
    localStorage.setItem(CONDITION_NOTES_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage quota
  }
}

/**
 * Màn hình Hồ Sơ Bệnh Nền, Dị Ứng & Chỉ Định Bác Sĩ (SOLID: SRP & Open/Closed)
 * Đồng bộ hoàn chỉnh từ test-ui (MedicalProfilePage):
 * - Bố cục 2 cột (5/7 trên desktop, xếp chồng trên mobile)
 * - Tự động nhận diện tình trạng sức khỏe thông minh (smart recognition)
 * - Chọn nhanh từ kho tri thức y khoa chuẩn (Preset Knowledge Base)
 * - Khối phân loại: Bệnh nền, Dị ứng, Chỉ định của bác sĩ
 * - Chi tiết thực phẩm cần kiêng, nên ăn và lời dặn lâm sàng
 * - Kết nối trực tiếp API Backend & đồng bộ trạng thái toàn ứng dụng
 */
export default function ConditionsScreen({
  data,
  onBack,
  onSave,
  onDelete,
}) {
  const rawConditions = useMemo(() => data?.conditions || [], [data?.conditions]);
  const [localNotes, setLocalNotes] = useState(getLocalNotes);

  // Làm giàu dữ liệu điều kiện từ backend bằng cơ sở tri thức y khoa và ghi chú cá nhân
  const conditions = useMemo(() => {
    return rawConditions.map((c) => {
      const enriched = enrichConditionData(c);
      const customNote = localNotes[c.name] || localNotes[c.id];
      return {
        ...enriched,
        notes: customNote || enriched.notes,
      };
    });
  }, [rawConditions, localNotes]);

  // State nhập liệu & nhận diện tự động
  const [inputValue, setInputValue] = useState("");
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  // State tìm kiếm & bộ lọc danh mục trong danh sách đã lưu
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [expandedCardId, setExpandedCardId] = useState(null);

  // State modal chỉnh sửa & xác nhận xoá
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Nhận diện theo thời gian thực khi người dùng gõ phím
  const liveRecognition = useMemo(() => {
    if (!inputValue.trim()) return null;
    return smartRecognizeCondition(inputValue.trim());
  }, [inputValue]);

  // Thêm mới từ ô nhập liệu tự do
  const handleAddNewCondition = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const recog = liveRecognition;
    // Nếu nhận diện được, lấy loại chuẩn; nếu không, gán loại mặc định BENH_NEN cho backend
    const backendType =
      recog && recog.isRecognized ? recog.type : "BENH_NEN";
    const canonicalName =
      recog && recog.isRecognized ? recog.canonicalName : trimmed;

    // Lưu ghi chú vào local store nếu có
    if (recog?.notes) {
      saveLocalNote(canonicalName, recog.notes);
      setLocalNotes((prev) => ({ ...prev, [canonicalName]: recog.notes }));
    }

    onSave({ name: canonicalName, type: backendType });
    setInputValue("");
    setShowCatalogDropdown(false);
  };

  // Chọn từ danh mục mẫu chuẩn có sẵn
  const handleSelectFromPreset = (preset) => {
    if (preset.notes) {
      saveLocalNote(preset.name, preset.notes);
      setLocalNotes((prev) => ({ ...prev, [preset.name]: preset.notes }));
    }

    onSave({ name: preset.name, type: preset.type });
    setShowCatalogDropdown(false);
    setInputValue("");
  };

  // Cập nhật điều kiện
  const handleUpdateCondition = (updated) => {
    if (updated.notes) {
      saveLocalNote(updated.name, updated.notes);
      setLocalNotes((prev) => ({ ...prev, [updated.name]: updated.notes }));
    }

    onSave({ name: updated.name, type: updated.type }, updated.id);
    setEditingItem(null);
  };

  // Thống kê số lượng theo nhóm
  const categoryCounts = useMemo(() => {
    return {
      ALL: conditions.length,
      BENH_NEN: conditions.filter((c) => c.type === "BENH_NEN").length,
      DI_UNG: conditions.filter((c) => c.type === "DI_UNG").length,
      CHI_DINH_BAC_SI: conditions.filter((c) => c.type === "CHI_DINH_BAC_SI").length,
      CHUA_NHAN_DIEN: conditions.filter((c) => c.type === "CHUA_NHAN_DIEN").length,
    };
  }, [conditions]);

  // Lọc danh sách theo danh mục và từ khóa tìm kiếm
  const filteredConditions = useMemo(() => {
    let list = conditions;
    if (selectedCategoryFilter !== "ALL") {
      list = list.filter((c) => c.type === selectedCategoryFilter);
    }
    if (searchQuery.trim()) {
      const q = normalizeVietnamese(searchQuery);
      list = list.filter((item) => {
        const matchName = normalizeVietnamese(item.name).includes(q);
        const matchFoods = (item.restrictedFoods || []).some((f) =>
          normalizeVietnamese(f).includes(q)
        );
        const matchNotes = normalizeVietnamese(item.notes || "").includes(q);
        const matchTags = (item.tagLabels || []).some((t) =>
          normalizeVietnamese(t).includes(q)
        );
        return matchName || matchFoods || matchNotes || matchTags;
      });
    }
    return list;
  }, [conditions, selectedCategoryFilter, searchQuery]);

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      {/* HEADER CỐ ĐỊNH */}
      <header className="sticky top-0 z-30 shrink-0 bg-white/95 backdrop-blur-md border-b border-[#DCEEE7] px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-[#F0F8F6] hover:bg-[#ECFDF5] text-[#059669] border border-[#DCEEE7] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Quay lại"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Quay lại</span>
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] text-white flex items-center justify-center shadow-xs">
                <HeartPulse className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
                  Hồ Sơ Bệnh Nền, Dị Ứng & Chỉ Định
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  {conditions.length} mục đã lưu
                </span>
              </div>
              <p className="text-[11px] text-[#0F172A]/55 font-medium">
                Hệ thống tự động lọc món ăn và cảnh báo dựa trên hồ sơ này
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH (BỐ CỤC 2 CỘT 5/7 TRÊN DESKTOP) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (5 CỘT TRÊN DESKTOP): KHAI BÁO & NHẬN DIỆN THÔNG MINH */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEEE7] shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
                    Khai báo tình trạng sức khỏe
                  </h2>
                </div>
                <span className="text-[10.5px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                  Tự động nhận diện
                </span>
              </div>

              {/* Form nhập liệu */}
              <form onSubmit={handleAddNewCondition} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập tên bệnh, dị ứng, chỉ định... (VD: tiểu đường, dị ứng tôm, ăn nhạt)"
                    className="w-full text-xs sm:text-sm pl-3.5 pr-8 py-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all placeholder:text-[#94A3B8]"
                  />
                  {inputValue.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInputValue("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                      title="Xóa chữ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Nút Thêm vào hồ sơ */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm vào hồ sơ</span>
                  </button>

                  {/* Nút Chọn từ danh mục có sẵn */}
                  <button
                    type="button"
                    onClick={() => setShowCatalogDropdown((prev) => !prev)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-[#059669] hover:text-[#047857] bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3 py-2.5 rounded-2xl border border-[#A7F3D0] transition-colors cursor-pointer"
                  >
                    <span>Chọn từ danh mục</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        showCatalogDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* KHUNG NHẬN DIỆN THÔNG MINH (LIVE RECOGNITION BOX) */}
                {inputValue.trim().length > 0 && liveRecognition && (
                  <div
                    className={`rounded-2xl p-4 text-xs space-y-2.5 border transition-all animate-in fade-in slide-in-from-top-1 ${
                      liveRecognition.isRecognized
                        ? "bg-[#F0FDF4] border-[#86EFAC]"
                        : "bg-[#FFFBEB] border-[#FDE68A]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        {liveRecognition.isRecognized ? (
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-[#D97706] shrink-0" />
                        )}
                        <span
                          className={`font-semibold shrink-0 ${
                            liveRecognition.isRecognized
                              ? "text-[#065F46]"
                              : "text-[#92400E]"
                          }`}
                        >
                          {liveRecognition.isRecognized
                            ? "Đã nhận diện:"
                            : "Chưa nhận diện:"}
                        </span>
                        <span className="font-bold text-[#0F172A] truncate">
                          {liveRecognition.canonicalName || inputValue.trim()}
                        </span>
                      </div>

                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-2xs shrink-0 tracking-wide"
                        style={{
                          backgroundColor:
                            CONDITION_TYPES[liveRecognition.type]?.color ||
                            "#D97706",
                        }}
                      >
                        {CONDITION_TYPES[liveRecognition.type]?.shortLabel?.toUpperCase() ||
                          "CHƯA NHẬN DIỆN"}
                      </span>
                    </div>

                    {/* Món cần kiêng nếu có */}
                    {liveRecognition.restrictedFoods?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
                        <div className="flex items-center gap-1 text-[#DC2626] font-bold shrink-0">
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cần kiêng:</span>
                        </div>
                        {liveRecognition.restrictedFoods
                          .slice(0, 3)
                          .map((food, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[10.5px] font-medium"
                            >
                              {food}
                            </span>
                          ))}
                        {liveRecognition.restrictedFoods.length > 3 && (
                          <span className="text-[#64748B] text-[10.5px]">
                            +{liveRecognition.restrictedFoods.length - 3} món nữa
                          </span>
                        )}
                      </div>
                    )}

                    {/* Lời khuyên dinh dưỡng chuẩn */}
                    {liveRecognition.isRecognized && liveRecognition.notes && (
                      <p className="text-[#065F46] text-xs italic pt-0.5 leading-relaxed">
                        {liveRecognition.notes}
                      </p>
                    )}

                    {!liveRecognition.isRecognized && (
                      <p className="text-[#92400E] text-[11px] pt-0.5 leading-relaxed">
                        Mục này chưa có trong thư viện chuẩn. Khi bấm{" "}
                        <strong>"Thêm vào hồ sơ"</strong>, hệ thống vẫn lưu để
                        bạn theo dõi và bổ sung ghi chú sau.
                      </p>
                    )}
                  </div>
                )}
              </form>

              {/* DROPDOWN DANH MỤC MẪU CÓ SẴN */}
              {showCatalogDropdown && (
                <PresetCatalogDropdown
                  existingConditions={conditions}
                  onSelectPreset={handleSelectFromPreset}
                  onClose={() => setShowCatalogDropdown(false)}
                />
              )}
            </div>
          </div>

          {/* CỘT PHẢI (7 CỘT TRÊN DESKTOP): DANH SÁCH HỒ SƠ ĐÃ LƯU */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEEE7] shadow-sm space-y-4">
              {/* Header danh sách: Tiêu đề + Tổng số lượng */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
                    Danh sách hồ sơ sức khỏe
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    {filteredConditions.length} mục
                  </span>
                </div>
              </div>

              {/* Thanh tìm kiếm trong danh sách */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên bệnh, dị ứng, chỉ định, món cần kiêng..."
                  className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all placeholder:text-[#94A3B8]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] p-1 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bộ lọc theo danh mục (Tất cả, Bệnh nền, Dị ứng, Chỉ định) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {[
                  { id: "ALL", label: `Tất cả (${categoryCounts.ALL})` },
                  {
                    id: "BENH_NEN",
                    label: `Bệnh nền (${categoryCounts.BENH_NEN})`,
                    color: "#0284C7",
                  },
                  {
                    id: "DI_UNG",
                    label: `Dị ứng (${categoryCounts.DI_UNG})`,
                    color: "#EA580C",
                  },
                  {
                    id: "CHI_DINH_BAC_SI",
                    label: `Chỉ định (${categoryCounts.CHI_DINH_BAC_SI})`,
                    color: "#7C3AED",
                  },
                  {
                    id: "CHUA_NHAN_DIEN",
                    label: `Chưa nhận diện (${categoryCounts.CHUA_NHAN_DIEN})`,
                    color: "#D97706",
                  },
                ].map((cat) => {
                  const isSelected = selectedCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs ${
                        isSelected
                          ? "bg-[#059669] text-white shadow-2xs"
                          : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
                      }`}
                      style={
                        isSelected && cat.color
                          ? { backgroundColor: cat.color }
                          : undefined
                      }
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Danh sách các thẻ hồ sơ */}
              <div className="space-y-3 pt-1">
                {filteredConditions.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#94A3B8] space-y-2">
                    <p>Không tìm thấy mục nào phù hợp trong danh sách.</p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-[#059669] font-bold hover:underline cursor-pointer"
                      >
                        Xóa bộ lọc tìm kiếm
                      </button>
                    )}
                  </div>
                ) : (
                  filteredConditions.map((item) => (
                    <ConditionCard
                      key={item.id}
                      condition={item}
                      isExpanded={expandedCardId === item.id}
                      onToggleExpand={() =>
                        setExpandedCardId(
                          expandedCardId === item.id ? null : item.id
                        )
                      }
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => setConfirmDelete(item)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL CHỈNH SỬA TÌNH TRẠNG SỨC KHỎE */}
      {editingItem && (
        <ConditionEditModal
          editingItem={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateCondition}
        />
      )}

      {/* MODAL XÁC NHẬN XOÁ */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Xác nhận xóa</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Bạn có chắc chắn muốn xóa <strong>"{confirmDelete.name}"</strong> khỏi
              hồ sơ bệnh lý? Hệ thống sẽ ngừng lọc món ăn theo chỉ định này.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs cursor-pointer"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
