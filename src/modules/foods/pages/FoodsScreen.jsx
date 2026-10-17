import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  ShieldCheck,
  Utensils,
  Apple,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";
import { useFoodsCatalog } from "../hooks/useFoodsCatalog";
import FoodCard from "../components/FoodCard";
import NutritionInspector from "../components/NutritionInspector";

/**
 * Màn hình Tra Cứu Danh Sách Món Ăn & Thực Phẩm (SOLID: Open/Closed & SRP)
 * Đồng bộ toàn diện từ test-ui (FoodCatalogPage):
 * - Bố cục 2 cột Master-Detail trên desktop (7 cột danh sách / 5 cột chi tiết cố định)
 * - Tương tác Bottom Sheet trên thiết bị di động
 * - Kết nối trực tiếp API Backend thực tế (hơn 2.000 món ăn/thực phẩm)
 * - Tra cứu vi chất đầy đủ & cảnh báo chống chỉ định y tế theo hồ sơ bệnh lý người dùng
 */
export default function FoodsScreen({
  onBack,
  userConditions = [],
  onNavigateToConditions,
}) {
  const c = useFoodsCatalog(userConditions);
  const isDish = c.tabType === "dishes";

  // State quản lý Bottom Sheet trên thiết bị di động
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Khoá cuộn nền khi mở modal bottom sheet trên mobile
  useEffect(() => {
    if (isMobileSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSheetOpen]);

  const handleSelectFood = (foodId) => {
    c.setSelectedId(foodId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileSheetOpen(true);
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto bg-[#F0F8F6] text-[#0F172A] flex flex-col font-sans">
      {/* HEADER CỐ ĐỊNH */}
      <header className="sticky top-0 z-20 shrink-0 bg-white/95 backdrop-blur-md border-b border-[#DCEEE7] px-4 py-3.5 sm:px-8 flex items-center justify-between gap-4">
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
            <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-xs shrink-0">
              {isDish ? (
                <Utensils className="w-5 h-5" />
              ) : (
                <Apple className="w-5 h-5" />
              )}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
                Danh Sách Món Ăn & Thực Phẩm
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                <Sparkles className="w-3 h-3 text-[#EA580C]" />
                Viện Dinh Dưỡng Quốc Gia
              </span>
            </div>
            <p className="text-xs text-[#0F172A]/55 mt-0.5 font-medium">
              Tra cứu chỉ số dinh dưỡng & cảnh báo chống chỉ định y tế
            </p>
          </div>
        </div>

        {/* NÚT TRUY CẬP HỒ SƠ BỆNH LÝ */}
        {typeof onNavigateToConditions === "function" && (
          <button
            type="button"
            onClick={onNavigateToConditions}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold hover:bg-[#D1FAE5] transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span className="hidden sm:inline">Hồ sơ bệnh lý</span>
          </button>
        )}
      </header>

      {/* WORKSPACE CHÍNH */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5 pb-24">
        {/* KHỐI ĐIỀU KHIỂN: 2 TABS + TÌM KIẾM + BỘ LỌC */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCEEE7] shadow-xs space-y-3.5">
          {/* 2 Tabs chuyển đổi: Món ăn (Dishes) vs Thực phẩm (Raw) */}
          <div className="grid grid-cols-2 gap-2 bg-[#F0F8F6] p-1.5 rounded-2xl border border-[#DCEEE7]/70">
            <button
              type="button"
              onClick={() => c.handleTabChange("dishes")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isDish
                  ? "bg-[#059669] text-white shadow-sm"
                  : "text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-white/60"
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Món ăn</span>
            </button>

            <button
              type="button"
              onClick={() => c.handleTabChange("raw")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                !isDish
                  ? "bg-[#059669] text-white shadow-sm"
                  : "text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-white/60"
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>Thực phẩm</span>
            </button>
          </div>

          {/* Thanh tìm kiếm & Nút mở bộ lọc */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={c.query}
                onChange={(e) => c.handleQueryChange(e.target.value)}
                placeholder={
                  isDish
                    ? "Tìm món ăn (phở bò, tôm nướng, canh chua...)"
                    : "Tìm thực phẩm (ức gà, cá hồi, quả bơ, gạo lứt...)"
                }
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
              />
              {c.query && (
                <button
                  type="button"
                  onClick={() => c.handleQueryChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title="Xoá tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Nút bật/tắt bộ lọc */}
            <button
              type="button"
              onClick={() => c.setFilterOpen(!c.filterOpen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                c.isFilterActive || c.filterOpen
                  ? "bg-[#059669] text-white border-[#059669] shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              {c.isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-white ml-0.5 animate-pulse" />
              )}
            </button>
          </div>

          {/* Dòng hiển thị bộ lọc đang kích hoạt */}
          {c.isFilterActive && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">
                Đang lọc:
              </span>

              {c.groupId !== null && (
                <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                  {c.activeGroupLabel || "Nhóm đã chọn"}
                  <button
                    type="button"
                    onClick={() => c.changeFilter(null)}
                    className="hover:text-emerald-950 font-bold ml-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}

              {c.healthFilter !== "all" && (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                  {c.healthFilter === "warning"
                    ? "Có cảnh báo y tế"
                    : "An toàn / Phù hợp"}
                  <button
                    type="button"
                    onClick={() => c.setHealthFilter("all")}
                    className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={c.handleClearAllFilters}
                className="text-[11px] text-slate-500 hover:text-[#DC2626] font-semibold underline ml-1 cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Khối bộ lọc thu gọn (Collapsible Filter Panel) */}
          {c.filterOpen && (
            <div className="pt-3 border-t border-slate-100 space-y-3.5 animate-in fade-in duration-150">
              {/* Nhóm món / thực phẩm */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Nhóm {isDish ? "món ăn" : "thực phẩm"} từ Viện Dinh Dưỡng
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => c.changeFilter(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      c.groupId === null
                        ? "bg-[#059669] text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    Tất cả nhóm
                  </button>

                  {c.groups.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => c.changeFilter(g.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        c.groupId === g.id
                          ? "bg-[#059669] text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {g.nameVi}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trạng thái an toàn sức khỏe */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Trạng thái an toàn sức khỏe
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => c.setHealthFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      c.healthFilter === "all"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => c.setHealthFilter("safe")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      c.healthFilter === "safe"
                        ? "bg-[#059669] text-white shadow-xs"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>An toàn / Phù hợp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => c.setHealthFilter("warning")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      c.healthFilter === "warning"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Có cảnh báo y tế</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BỐ CỤC 2 CỘT MASTER-DETAIL (DESKTOP: SONG SONG | MOBILE: MODAL BOTTOM SHEET) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (7 CỘT TRÊN DESKTOP): DANH SÁCH MÓN ĂN / THỰC PHẨM */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>
                Hiển thị <strong>{c.items.length}</strong>{" "}
                {isDish ? "món ăn" : "thực phẩm"}
                {c.total > 0 && ` (Tổng: ${c.total} mục)`}
              </span>
              <span className="hidden sm:inline text-slate-400">
                Bấm vào thẻ để xem bảng phân tích dinh dưỡng chi tiết
              </span>
            </div>

            {/* Trạng thái lỗi nếu có */}
            {c.error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {c.error}
              </div>
            )}

            {/* Trạng thái rỗng không tìm thấy */}
            {!c.loading && c.items.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700">
                  Không tìm thấy kết quả phù hợp
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để hiển thị toàn
                  bộ danh mục.
                </p>
                <button
                  type="button"
                  onClick={c.handleClearAllFilters}
                  className="px-4 py-2 bg-[#059669] text-white rounded-xl text-xs font-bold hover:bg-[#047857] cursor-pointer transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* Danh sách thẻ món ăn */}
            <div className="flex flex-col gap-3">
              {c.items.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  isSelected={item.id === c.selectedId}
                  onClick={() => handleSelectFood(item.id)}
                  isDish={isDish}
                  userConditions={userConditions}
                />
              ))}
            </div>

            {/* Trạng thái đang tải */}
            {c.loading && (
              <div className="flex justify-center my-6">
                <span className="w-6 h-6 rounded-full border-2 border-[#059669] border-t-transparent animate-spin" />
              </div>
            )}

            {/* Nút Xem thêm phân trang */}
            {!c.loading && c.hasMore && (
              <button
                type="button"
                onClick={c.loadMore}
                className="w-full py-3.5 bg-white hover:bg-[#ECFDF5] border border-[#DCEEE7] rounded-2xl text-xs font-bold text-[#059669] transition-all cursor-pointer shadow-2xs text-center mt-2"
              >
                Xem thêm các mục tiếp theo (còn {c.total - c.rawItemsCount} mục)
              </button>
            )}
          </div>

          {/* CỘT PHẢI (5 CỘT TRÊN DESKTOP): BẢNG PHÂN TÍCH DINH DƯỠNG CỐ ĐỊNH */}
          <div className="hidden lg:block lg:col-span-5 sticky top-20 h-[calc(100vh-7rem)] min-h-0 flex flex-col">
            <NutritionInspector
              item={c.selectedItem}
              detail={c.detail}
              loading={c.detailLoading}
              isDish={isDish}
              userConditions={userConditions}
              isMobileModal={false}
            />
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM SHEET MODAL (KHI CHỌN MÓN TRÊN ĐIỆN THOẠI) */}
      {isMobileSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileSheetOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl h-[88vh] max-h-[88vh] flex flex-col shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-250 overflow-hidden">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <NutritionInspector
                item={c.selectedItem}
                detail={c.detail}
                loading={c.detailLoading}
                isDish={isDish}
                userConditions={userConditions}
                onClose={() => setIsMobileSheetOpen(false)}
                isMobileModal={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
