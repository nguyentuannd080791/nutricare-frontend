import React from "react";
import { CheckCircle2 } from "lucide-react";
import { evaluatePasswordRules } from "../domain/authInput";

export default function PasswordChecklist({ password }) {
  const rules = evaluatePasswordRules(password);

  return (
    <div className="p-3.5 rounded-xl bg-muted border border-border space-y-2">
      <p className="text-xs font-semibold text-fg/80">Tiêu chuẩn bảo mật mật khẩu:</p>
      <div className="grid grid-cols-1 gap-1.5">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              rule.passed ? "text-primary font-medium" : "text-fg/55"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${rule.passed ? "text-secondary" : "text-fg/30"}`} />
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
