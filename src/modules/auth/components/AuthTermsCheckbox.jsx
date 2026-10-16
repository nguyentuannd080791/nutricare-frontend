import React from "react";
import AuthFieldError from "./AuthFieldError";

const LINK_STYLE = "font-semibold text-primary hover:text-primaryDark";

export default function AuthTermsCheckbox({ checked, error, onChange }) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-border accent-primary shrink-0"
        />
        <span className="text-sm text-fg/80">
          Tôi đồng ý với{" "}
          <button type="button" className={LINK_STYLE}>Điều khoản dịch vụ</button>
          {" "}và{" "}
          <button type="button" className={LINK_STYLE}>Chính sách bảo mật</button>
        </span>
      </label>
      <AuthFieldError message={error} />
    </div>
  );
}
