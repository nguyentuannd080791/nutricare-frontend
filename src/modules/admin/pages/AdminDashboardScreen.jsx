import React, { useState } from "react";
import { COLORS } from "../../../assets/theme/colors";
import { Users } from "lucide-react";
import { ScreenHeader, Button } from "../../../shared/components/ui";
import SegmentedControl from "../../../shared/components/SegmentedControl";
import KpiCard from "../components/KpiCard";
import DailyBarChart from "../components/DailyBarChart";
import { useAdminStats } from "../hooks/useAdminStats";

const RANGES = [
  { id: "7", label: "7 ngày" },
  { id: "30", label: "30 ngày" },
  { id: "90", label: "90 ngày" },
];

const pct = (rate) => (rate == null ? "—" : `${Math.round(rate * 100)}%`);

/**
 * Dashboard admin: chỉ số TỔNG HỢP, không hiển thị dữ liệu cá nhân. Quyền do
 * backend quyết định (ADMIN_EMAILS); màn này chỉ hiển thị 403 nếu bị từ chối.
 */
export default function AdminDashboardScreen({ onBack, onGoUsers }) {
  const [range, setRange] = useState("30");
  const days = Number(range);
  const { loading, data, error } = useAdminStats(days);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader
        title="Thống kê quản trị"
        onBack={onBack}
        right={
          onGoUsers ? (
            <Button
              variant="secondary"
              icon={Users}
              onPress={onGoUsers}
              className="!py-1.5 !px-3 !text-xs"
            >
              Người dùng
            </Button>
          ) : null
        }
      />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 40 }}>
        <SegmentedControl label="Khoảng thời gian" options={RANGES} value={range} onChange={setRange} />

        {loading && <p className="mt-6 text-slate-600" role="status">Đang tải số liệu…</p>}
        {error && <p className="mt-6 text-[#B91C1C]" role="alert">{error}</p>}

        {data && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div
                className={onGoUsers ? "cursor-pointer active:scale-95 transition-transform" : ""}
                onClick={onGoUsers}
                role={onGoUsers ? "button" : undefined}
                tabIndex={onGoUsers ? 0 : undefined}
              >
                <KpiCard label="Tổng người dùng" value={data.totals.users} note={`${data.totals.premiumUsers} đang dùng Premium (bấm để xem)`} />
              </div>
              <KpiCard label={`Người dùng mới (${days} ngày)`} value={data.window.newUsers} />
              <KpiCard label={`Thực đơn đã tạo (${days} ngày)`} value={data.window.plansCreated} note={`${data.totals.activePlans} thực đơn đang dùng`} />
              <KpiCard
                label={`Tỉ lệ hoàn thành (${days} ngày)`}
                value={pct(data.window.completionRate)}
                note={`${data.window.completedUserDays}/${data.window.expectedUserDays} ngày-người dùng`}
              />
            </div>
            <p className="mt-2 text-[12px] text-slate-600">
              Một ngày được tính là hoàn thành khi tổng calo các bữa đã ăn đạt từ {Math.round(data.definition.dayCompletionKcalRatio * 100)}% calo thực đơn của ngày đó.
              Ngày tính theo giờ UTC.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <DailyBarChart title="Người dùng mới mỗi ngày" series={data.series} valueOf={(d) => d.newUsers} />
              <DailyBarChart title="Thực đơn tạo mỗi ngày" series={data.series} valueOf={(d) => d.plansCreated} />
              <DailyBarChart title="Người dùng có ghi nhận bữa ăn mỗi ngày" series={data.series} valueOf={(d) => d.loggingUsers} />
              <DailyBarChart title="Tỉ lệ hoàn thành mỗi ngày" series={data.series} valueOf={(d) => d.completionRate} format={pct} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
