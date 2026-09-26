import { useEffect, useState } from "react";
import { dishApi, rawFoodApi } from "../../../services/api";
import { useDebounced } from "../../../hooks/useDebounced";

/**
 * Trách nhiệm duy nhất: trạng thái + gọi API cho luồng "Tra cứu dinh dưỡng"
 * (tab thực phẩm/món ăn, tìm kiếm, lọc theo nhóm, phân trang, xem chi tiết).
 * FoodsScreen chỉ còn lo hiển thị dựa trên state hook này trả về.
 */
export function useFoodsCatalog() {
  const [tabType, setTabType] = useState("raw"); // "raw" | "dishes"
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query);
  const [groupId, setGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [fullNutrientsOpen, setFullNutrientsOpen] = useState(false);

  const api = tabType === "dishes" ? dishApi : rawFoodApi;

  function handleTabChange(nextTab) {
    if (nextTab === tabType) return;
    setLoading(true);
    setItems([]);
    setTabType(nextTab);
    setGroupId(null);
    setQuery("");
    setPage(1);
  }

  useEffect(() => {
    api.groups().then(setGroups).catch(() => setGroups([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabType]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .search({ query: debouncedQuery.trim(), groupId, page })
      .then((res) => {
        if (cancelled) return;
        setItems((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
        setTotal(res.total);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabType, debouncedQuery, groupId, page]);

  useEffect(() => {
    if (selectedId === null) { setDetail(null); setFullNutrientsOpen(false); return; }
    setFullNutrientsOpen(false);
    let cancelled = false;
    api.get(selectedId).then((res) => !cancelled && setDetail(res)).catch(() => !cancelled && setSelectedId(null));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, tabType]);

  function changeFilter(nextGroupId) {
    if (nextGroupId === groupId) return;
    setLoading(true);
    setItems([]);
    setPage(1);
    setGroupId(nextGroupId);
    setFilterOpen(false);
  }

  function handleQueryChange(text) {
    setQuery(text);
    setLoading(true);
    setItems([]);
  }

  useEffect(() => { setPage(1); }, [debouncedQuery]);

  return {
    tabType, handleTabChange,
    query, handleQueryChange,
    groupId, groups, changeFilter,
    filterOpen, setFilterOpen,
    items, total, loading, error,
    loadMore: () => setPage((p) => p + 1),
    selectedId, setSelectedId,
    detail,
    fullNutrientsOpen, setFullNutrientsOpen,
  };
}
