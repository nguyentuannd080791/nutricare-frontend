import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
import { COLORS } from "../../../assets/theme/colors";
import { ScreenHeader, Button } from "../../../shared/components/ui";
import { useDebounced } from "../../../shared/hooks/useDebounced";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAdminUserDetail } from "../hooks/useAdminUserDetail";
import UserFilters from "../components/UserFilters";
import UserList from "../components/UserList";
import Pagination from "../components/Pagination";
import UserDetailView from "../components/UserDetailView";

/**
 * Màn hình quản trị người dùng: điều phối giữa Màn danh sách (3.1) và Màn chi tiết (3.2).
 */
export default function AdminUsersScreen({ onBack, onGoDashboard }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [premium, setPremium] = useState("");

  const debouncedSearch = useDebounced(search, 300);

  // Hook nạp danh sách
  const {
    loading: listLoading,
    data: listData,
    error: listError,
  } = useAdminUsers({
    page,
    pageSize,
    search: debouncedSearch,
    premium,
  });

  // Hook nạp chi tiết
  const {
    loading: detailLoading,
    data: detailData,
    error: detailError,
  } = useAdminUserDetail(selectedUserId);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handlePremiumChange = (val) => {
    setPremium(val);
    setPage(1);
  };

  // Xem chi tiết
  if (selectedUserId) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
        <ScreenHeader
          title="Chi tiết người dùng"
          onBack={() => setSelectedUserId(null)}
        />
        <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
          {detailLoading && (
            <p className="mt-6 text-slate-600" role="status">
              Đang tải…
            </p>
          )}

          {detailError && (
            <p className="mt-6 text-[#B91C1C]" role="alert">
              {detailError}
            </p>
          )}

          {detailData && <UserDetailView detail={detailData} />}
        </div>
      </div>
    );
  }

  // Xem danh sách
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader
        title="Quản trị người dùng"
        onBack={onBack}
        right={
          onGoDashboard ? (
            <Button
              variant="secondary"
              icon={BarChart3}
              onPress={onGoDashboard}
              className="!py-1.5 !px-3 !text-xs"
            >
              Thống kê
            </Button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
        <UserFilters
          search={search}
          onSearchChange={handleSearchChange}
          premium={premium}
          onPremiumChange={handlePremiumChange}
        />

        {listLoading && (
          <p className="mt-6 text-slate-600" role="status">
            Đang tải…
          </p>
        )}

        {listError && (
          <p className="mt-6 text-[#B91C1C]" role="alert">
            {listError}
          </p>
        )}

        {!listLoading && !listError && listData && (
          <>
            {listData.items.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-medium">
                Không có người dùng phù hợp
              </div>
            ) : (
              <>
                <UserList items={listData.items} onSelectUser={setSelectedUserId} />
                <Pagination
                  page={listData.page}
                  pageSize={listData.pageSize}
                  total={listData.total}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
