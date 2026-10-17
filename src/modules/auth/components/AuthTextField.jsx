import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthFieldError from "./AuthFieldError";

export default function AuthTextField({
  id,
  label,
  type = "text",
  secure = false,
  icon: Icon,
  value,
  placeholder,
  autoComplete,
  error,
  headerAction,
  onChange,
}) {
  const [visible, setVisible] = useState(false);
  const inputType = secure ? (visible ? "text" : "password") : type;
  const borderStyle = error
    ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
    : "border-border focus:ring-primary/20 focus:border-primary";
  const rightPadding = secure ? "pr-11" : "pr-4";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-fg">
          {label}
        </label>
        {headerAction}
      </div>
      <div className="relative">
        <Icon className="w-5 h-5 text-fg/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id={id}
          name={id}
          type={inputType}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full pl-11 ${rightPadding} py-2.5 rounded-xl bg-muted text-fg placeholder:text-fg/40 text-base border transition-all outline-none focus:bg-white focus:ring-4 ${borderStyle}`}
        />
        {secure ? (
          <button
            type="button"
            onClick={() => setVisible((previous) => !previous)}
            aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-fg/50 hover:text-fg hover:bg-border/50 transition-colors"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : null}
      </div>
      <AuthFieldError message={error} />
    </div>
  );
}
