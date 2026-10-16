import React from "react";
import { Card } from "../../../shared/components/ui";

/**
 * Trách nhiệm duy nhất: khung chung cho mỗi thẻ A đến H trong màn chi tiết.
 * Thành phần không có dữ liệu thì thẻ vẫn hiện, kèm câu "Chưa có dữ liệu".
 */
export default function DetailSection({ title, icon: Icon, children, isEmpty, emptyMessage = "Chưa có dữ liệu", right }) {
  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-row items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex flex-row items-center gap-2">
          {Icon && <Icon size={18} className="text-primary shrink-0" />}
          <h3 className="text-[15px] font-bold text-fg">{title}</h3>
        </div>
        {right}
      </div>

      {isEmpty ? (
        <p className="text-slate-400 text-[13.5px] italic py-2">{emptyMessage}</p>
      ) : (
        children
      )}
    </Card>
  );
}
