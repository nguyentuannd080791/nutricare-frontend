import { useEffect, useState, useMemo } from "react";
import { dishApi } from "../api/dishApi";
import { rawFoodApi } from "../api/rawFoodApi";
import { useDebounced } from "../../../shared/hooks/useDebounced";

/**
 * Trách nhiệm duy nhất: Quản lý trạng thái & kết nối API backend cho luồng
 * "Tra cứu danh sách Món ăn & Thực phẩm" (SOLID: Single Responsibility).
 * - Chuyển đổi tab Món ăn (dishes) / Thực phẩm (raw)
 * - Tìm kiếm theo tên (debounced)
 * - Lọc theo nhóm món / thực phẩm từ backend
 * - Lọc theo trạng thái an toàn sức khỏe (An toàn / Có cảnh báo)
 * - Tự động tải chi tiết vi chất khi chọn món
 * - Phân trang tải thêm (pagination)
 */
export function useFoodsCatalog(userConditions = []) {
  const [tabType, setTabType] = useState("dishes"); // "dishes" | "raw"
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 300);
  const [groupId, setGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [healthFilter, setHealthFilter] = useState("all"); // "all" | "safe" | "warning"
  const [filterOpen, setFilterOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const api = tabType === "dishes" ? dishApi : rawFoodApi;

  // Xử lý chuyển đổi giữa Món ăn và Thực phẩm
  function handleTabChange(nextTab) {
    if (nextTab === tabType) return;
    setLoading(true);
    setItems([]);
    setTabType(nextTab);
    setGroupId(null);
    setHealthFilter("all");
    setQuery("");
    setPage(1);
    setSelectedId(null);
    setDetail(null);
  }

  // Tải danh sách nhóm (groups) khi đổi tab
  useEffect(() => {
    let cancelled = false;
    api
      .groups()
      .then((data) => {
        if (!cancelled) setGroups(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setGroups([]);
      });
    return () => {
      cancelled = true;
    };
  }, [tabType, api]);

  // Tải danh sách món ăn / thực phẩm từ backend theo query, groupId, page
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .search({ query: debouncedQuery.trim(), groupId, page })
      .then((res) => {
        if (cancelled) return;
        const newItems = res.items || [];
        setItems((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
        setTotal(res.total || 0);

        // Tự động chọn món đầu tiên trên desktop nếu chưa có món nào được chọn
        if (page === 1 && newItems.length > 0) {
          setSelectedId(newItems[0].id);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Không thể tải danh sách thực phẩm");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tabType, debouncedQuery, groupId, page, api]);

  // Tải chi tiết vi chất và thông tin lâm sàng khi selectedId thay đổi
  useEffect(() => {
    if (selectedId === null) {
      setDetail(null);
      setDetailLoading(false);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    api
      .get(selectedId)
      .then((res) => {
        if (!cancelled) setDetail(res);
      })
      .catch(() => {
        if (!cancelled) setDetail(null);
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, tabType, api]);

  // Bộ lọc phụ theo trạng thái an toàn sức khỏe
  const filteredItems = useMemo(() => {
    if (healthFilter === "all") return items;
    if (healthFilter === "safe") {
      return items.filter((item) => !item.conflicts || item.conflicts.length === 0);
    }
    if (healthFilter === "warning") {
      return items.filter((item) => item.conflicts && item.conflicts.length > 0);
    }
    return items;
  }, [items, healthFilter]);

  function changeFilter(nextGroupId) {
    if (nextGroupId === groupId) return;
    setLoading(true);
    setItems([]);
    setPage(1);
    setGroupId(nextGroupId);
    setSelectedId(null);
    setFilterOpen(false);
  }

  function handleQueryChange(text) {
    setQuery(text);
    setPage(1);
  }

  const handleClearAllFilters = () => {
    setGroupId(null);
    setHealthFilter("all");
    setQuery("");
    setPage(1);
  };

  const isFilterActive = groupId !== null || healthFilter !== "all";
  const activeGroupLabel = groups.find((g) => g.id === groupId)?.nameVi || null;

  return {
    tabType,
    handleTabChange,
    query,
    handleQueryChange,
    groupId,
    groups,
    changeFilter,
    healthFilter,
    setHealthFilter,
    isFilterActive,
    activeGroupLabel,
    handleClearAllFilters,
    filterOpen,
    setFilterOpen,
    items: filteredItems,
    rawItemsCount: items.length,
    total,
    loading,
    error,
    loadMore: () => setPage((p) => p + 1),
    hasMore: items.length < total,
    selectedId,
    setSelectedId,
    selectedItem: items.find((i) => i.id === selectedId) || null,
    detail,
    detailLoading,
    userConditions,
  };
}
