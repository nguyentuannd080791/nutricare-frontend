import React from "react";
import { Check } from "lucide-react";
import { evaluatePasswordRules } from "../domain/authInput";

export default function PasswordHint({ password }) {
  const rules = evaluatePasswordRules(password);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-fg/60">Gợi ý:</span>
      {rules.map((rule) => {
        const chipStyle = rule.passed
          ? "bg-primary/10 border-primary/30 text-primary font-medium"
          : "bg-muted border-border text-fg/60";
        return (
          <span
            key={rule.id}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-colors ${chipStyle}`}
          >
            {rule.passed ? <Check className="w-3 h-3" /> : null}
            {rule.label}
          </span>
        );
      })}
    </div>
  );
}
