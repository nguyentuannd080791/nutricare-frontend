import React from "react";
import { COLORS } from "../../theme/colors";

/**
 * Trách nhiệm duy nhất: khung layout dùng chung cho Login/Register (nền,
 * padding, cuộn dọc). Không biết gì về form hay xác thực — thuần bố cục,
 * tương đương KeyboardAvoidingView+ScrollView của bản RN.
 */
export default function AuthFormShell({ children, topPadding = 64 }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto" style={{ backgroundColor: COLORS.bg }}>
      <div className="px-6 flex flex-col flex-1" style={{ paddingTop: topPadding, paddingBottom: 24 }}>
        {children}
      </div>
    </div>
  );
}
