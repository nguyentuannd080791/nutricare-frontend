import React from "react";
import { Search, Filter, X, Utensils, Apple } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { TextField, EmptyState, ScreenHeader } from "../../components/ui";
import { useFoodsCatalog } from "./hooks/useFoodsCatalog";
import FoodListItem from "./components/FoodListItem";
import CategoryFilterSheet from "./components/CategoryFilterSheet";
import FoodDetailSheet from "./components/FoodDetailSheet";
import FullNutrientsSheet from "./components/FullNutrientsSheet";

export default function FoodsScreen({ onBack }) {
  const c = useFoodsCatalog();
  const groupLabel = c.groups.find((g) => g.id === c.groupId)?.nameVi;
  const isDish = c.tabType === "dishes";

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Tra cứu dinh dưỡng" onBack={onBack} />

      <div className="px-5 pt-2 pb-3" style={{ backgroundColor: COLORS.bg, borderBottom: "1px solid #F1F5F9" }}>
        <div className="flex flex-row gap-2 mb-[10px]">
          <button
            type="button"
            onClick={() => c.handleTabChange("raw")}
            className="flex-1 flex flex-row items-center justify-center gap-[5px] py-[7px] rounded-[10px]"
            style={!isDish ? { backgroundColor: "#DCFCE7", border: `1px solid ${COLORS.primary}` } : { backgroundColor: COLORS.muted }}
          >
            <Apple size={14} color={!isDish ? COLORS.primary : "#64748B"} />
            <span className={`text-[12px] font-semibold ${!isDish ? "text-primary" : "text-descGray"}`}>Thực phẩm</span>
          </button>
          <button
            type="button"
            onClick={() => c.handleTabChange("dishes")}
            className="flex-1 flex flex-row items-center justify-center gap-[5px] py-[7px] rounded-[10px]"
            style={isDish ? { backgroundColor: "#DCFCE7", border: `1px solid ${COLORS.primary}` } : { backgroundColor: COLORS.muted }}
          >
            <Utensils size={14} color={isDish ? COLORS.primary : "#64748B"} />
            <span className={`text-[12px] font-semibold ${isDish ? "text-primary" : "text-descGray"}`}>Món ăn</span>
          </button>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <div className="flex-1">
            <TextField icon={Search} placeholder={isDish ? "Tìm món ăn..." : "Tìm thực phẩm..."} value={c.query} onChange={(e) => c.handleQueryChange(e.target.value)} />
          </div>
          <button
            type="button"
            onClick={() => c.setFilterOpen(true)}
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: c.groupId ? COLORS.primary : COLORS.muted }}
          >
            <Filter size={17} color={c.groupId ? "#fff" : COLORS.primary} />
          </button>
        </div>

        {groupLabel && (
          <div className="flex flex-row mt-2">
            <div className="flex flex-row items-center gap-[6px] rounded-full pl-3 pr-2 py-[6px]" style={{ backgroundColor: COLORS.muted }}>
              <span className="text-[12.5px] font-semibold text-primary">Đang lọc: {groupLabel}</span>
              <button type="button" onClick={() => c.changeFilter(null)} className="p-[2px] rounded-full bg-white">
                <X size={11} color={COLORS.primary} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-3" style={{ paddingBottom: 40 }}>
        <div className="flex flex-col gap-[10px]">
          {c.items.map((f) => (
            <FoodListItem key={f.id} item={f} isDish={isDish} onPress={() => c.setSelectedId(f.id)} />
          ))}
          {c.loading && (
            <div className="flex justify-center my-6">
              <span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
          {!c.loading && !c.error && c.items.length === 0 && (
            <EmptyState icon={Search} title="Không tìm thấy" desc={isDish ? "Không có món ăn nào khớp với tìm kiếm." : "Không có thực phẩm nào khớp với tìm kiếm."} />
          )}
        </div>
        {!!c.error && <p className="text-center text-destructive text-[13px] mt-4">{c.error}</p>}
        {!c.loading && c.items.length < c.total && (
          <button type="button" onClick={c.loadMore} className="w-full py-3 text-center">
            <span className="text-[13px] font-bold text-primary">Xem thêm ({c.total - c.items.length} mục)</span>
          </button>
        )}
      </div>

      <CategoryFilterSheet open={c.filterOpen} onClose={() => c.setFilterOpen(false)} groups={c.groups} groupId={c.groupId} onSelect={c.changeFilter} />

      <FoodDetailSheet
        open={c.selectedId !== null && !c.fullNutrientsOpen}
        onClose={() => c.setSelectedId(null)}
        detail={c.detail}
        isDish={isDish}
        onOpenFullNutrients={() => c.setFullNutrientsOpen(true)}
      />

      <FullNutrientsSheet
        open={c.fullNutrientsOpen}
        onClose={() => { c.setFullNutrientsOpen(false); c.setSelectedId(null); }}
        detail={c.detail}
      />
    </div>
  );
}
