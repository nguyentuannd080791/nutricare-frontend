import React, { useState } from "react";
import { Plus } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { ScreenHeader, FixedActionBar, Button } from "../../components/ui";
import BmiSummaryCard from "./components/BmiSummaryCard";
import BmiHistoryList from "./components/BmiHistoryList";
import AddBmiModal from "./components/AddBmiModal";

export default function BMIScreen({ data, onBack, onAddBMI }) {
  const [modalOpen, setModalOpen] = useState(false);
  const records = data.bmiRecords; // server đã sắp xếp mới nhất trước

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <ScreenHeader title="Chỉ số BMI" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 120 }}>
        <BmiSummaryCard last={records[0]} prev={records[1]} />
        <BmiHistoryList records={records} />
      </div>

      <FixedActionBar>
        <Button full icon={Plus} onPress={() => setModalOpen(true)}>Cập nhật cân nặng</Button>
      </FixedActionBar>

      <AddBmiModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(payload) => { onAddBMI(payload); setModalOpen(false); }} />
    </div>
  );
}
