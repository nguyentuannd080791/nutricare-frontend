import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  ArrowLeft,
} from "lucide-react";
import { COLORS } from "../theme/colors";

/**
 * Bản port từ nutricare-expo/src/components/ui.js.
 * Giữ nguyên tên component + props để màn hình gọi giống hệt bản RN.
 * RN primitives -> HTML: View->div, Text->span, Pressable->button, TextInput->input,
 * Modal->overlay div dựng tay (RN Modal không có tương đương DOM trực tiếp).
 * Mọi con số (bo góc, khoảng cách, cỡ chữ) giữ nguyên giá trị px từ StyleSheet gốc.
 */

export function IconBadge({
  icon: Icon,
  bg = COLORS.muted,
  color = COLORS.primary,
  size = 40,
}) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.4,
        backgroundColor: bg,
      }}
    >
      <Icon size={size * 0.5} color={color} strokeWidth={2} />
    </div>
  );
}

const BUTTON_VARIANTS = {
  primary: "bg-primary text-white",
  secondary: "bg-muted text-primary",
  outline: "bg-transparent text-primary border-[1.5px] border-primary",
  ghost: "bg-transparent text-fg",
  danger: "bg-dangerBg text-destructive",
  accent: "bg-accent text-white",
};

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled,
  busy,
  icon: Icon,
  full,
  style,
  className,
}) {
  const isDisabled = disabled || busy;
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={isDisabled}
      style={style}
      className={[
        "flex flex-row items-center justify-center gap-2 rounded-[12px] py-[13px] px-[18px]",
        "text-[15px] font-bold transition-transform duration-100",
        BUTTON_VARIANTS[variant],
        full ? "w-full" : "",
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "active:scale-[0.97] cursor-pointer",
        className || "",
      ].join(" ")}
    >
      {busy ? (
        <span
          className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-label="Đang xử lý"
        />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

export function Card({ children, onPress, style, className }) {
  const content = (
    <div
      style={style}
      className={[
        "rounded-2xl bg-card border border-border",
        className || "",
      ].join(" ")}
    >
      {children}
    </div>
  );
  if (!onPress) return content;
  return (
    <button
      type="button"
      onClick={onPress}
      className="text-left w-full active:scale-[0.97] transition-transform duration-100"
    >
      {content}
    </button>
  );
}

export function TextField({
  label,
  error,
  icon: Icon,
  secure,
  style,
  className,
  ...props
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full">
      {label ? (
        <span className="block text-[13px] font-semibold text-fg mb-[6px]">
          {label}
        </span>
      ) : null}
      <div
        className="relative flex flex-row items-center rounded-[12px] border-[1.5px] bg-white"
        style={{ borderColor: error ? COLORS.destructive : "#000000" }}
      >
        {Icon ? (
          <Icon size={18} color="#94A3B8" className="ml-[14px] shrink-0" />
        ) : null}
        <input
          {...props}
          type={secure ? (show ? "text" : "password") : props.type || "text"}
          placeholder={props.placeholder}
          style={style}
          className={[
            // text-[16px] (không phải 15px như thiết kế gốc): dưới ngưỡng 16px,
            // Safari trên iPhone tự động zoom cả trang khi bấm vào ô nhập —
            // hành vi chỉ xảy ra trên web, không có ở TextInput của RN.
            "flex-1 min-w-0 bg-transparent text-[16px] py-[13px] pr-[14px] text-fg outline-none",
            "placeholder:text-placeholderGray",
            Icon ? "pl-[8px]" : "pl-[14px]",
            className || "",
          ].join(" ")}
        />
        {secure ? (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-[14px] flex items-center justify-center"
            aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {show ? (
              <EyeOff size={18} color="#94A3B8" />
            ) : (
              <Eye size={18} color="#94A3B8" />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <span className="block text-[12px] mt-[4px] text-destructive font-medium">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/** Picker dạng bottom-sheet — giữ đúng hành vi bản RN (thay cho <select> gốc trình duyệt). */
export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);
  return (
    <div className="w-full">
      {label ? (
        <span className="block text-[13px] font-semibold text-fg mb-[6px]">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex flex-row items-center justify-between rounded-[12px] border-[1.5px] bg-white py-[13px] px-[14px]"
        style={{ borderColor: error ? COLORS.destructive : "#000000" }}
      >
        <span
          className={
            selected
              ? "text-fg text-[15px]"
              : "text-placeholderGray text-[15px]"
          }
        >
          {selected ? selected.label : placeholder || "Chọn"}
        </span>
        <ChevronDown size={16} color="#94A3B8" />
      </button>
      {error ? (
        <span className="block text-[12px] mt-[4px] text-destructive font-medium">
          {error}
        </span>
      ) : null}

      {open ? (
        <Overlay onClose={() => setOpen(false)}>
          <div className="bg-white rounded-t-[24px] py-2 pb-7 z-10">
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
                className="w-full text-left py-[14px] px-6"
              >
                <span
                  className={`text-[15px] text-fg ${o.id === value ? "font-bold" : "font-normal"}`}
                >
                  {o.label}
                </span>
              </button>
            ))}
          </div>
        </Overlay>
      ) : null}
    </div>
  );
}

const BADGE_TONES = {
  muted: "bg-muted text-primary",
  warn: "bg-warnBg text-warnFg",
  danger: "bg-dangerBg text-destructive",
  dark: "bg-dark text-white",
};

export function Badge({ children, tone = "muted", textColor }) {
  return (
    <span
      className={[
        "inline-block self-start rounded-full px-[10px] py-[4px] text-[12px] font-semibold",
        BADGE_TONES[tone],
      ].join(" ")}
      style={textColor ? { color: textColor } : undefined}
    >
      {children}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center py-10 px-6 text-center">
      <IconBadge icon={Icon} size={64} />
      <span className="mt-4 text-[16px] font-bold text-fg">{title}</span>
      <span className="mt-[6px] text-[13.5px] text-descGray leading-[19px] max-w-[280px]">
        {desc}
      </span>
      {action ? (
        <div className="mt-5 w-full max-w-[220px]">{action}</div>
      ) : null}
    </div>
  );
}

export function ScreenHeader({ title, onBack, right }) {
  return (
    <div className="flex flex-row items-center justify-between px-5 pt-5 pb-3">
      <div className="flex flex-row items-center gap-[10px]">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1"
            aria-label="Quay lại"
          >
            <ArrowLeft size={22} color={COLORS.fg} />
          </button>
        ) : null}
        <span className="text-[20px] font-bold text-fg">{title}</span>
      </div>
      {right}
    </div>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  const tone = toast.tone || "success";
  const conf = {
    success: { bg: COLORS.primary, Icon: CheckCircle2 },
    warn: { bg: "#EA580C", Icon: AlertTriangle },
    error: { bg: COLORS.destructive, Icon: XCircle },
  }[tone];
  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-toast pointer-events-none">
      <div
        className="flex flex-row items-start gap-[10px] rounded-2xl px-4 py-3 max-w-[92%] shadow-lg"
        style={{ backgroundColor: conf.bg }}
      >
        <conf.Icon size={18} color="#fff" className="shrink-0 mt-[1px]" />
        <span className="flex-1 text-white text-[13.5px] font-medium">
          {toast.message}
        </span>
      </div>
    </div>
  );
}

export function FixedActionBar({ children }) {
  return (
    <div className="fixed left-0 right-0 bottom-0 p-4 pb-7 bg-white border-t border-border z-actionBar mx-auto max-w-app">
      {children}
    </div>
  );
}

export function RadioCard({ selected, title, desc, onPress }) {
  return (
    <Card
      onPress={onPress}
      className={`mb-2 ${selected ? "!border-primary !bg-muted" : ""}`}
    >
      <div className="flex flex-row items-center gap-3 p-[14px]">
        <div
          className="flex items-center justify-center shrink-0 w-5 h-5 rounded-full border-2"
          style={{ borderColor: selected ? COLORS.primary : COLORS.border }}
        >
          {selected ? (
            <div className="w-[10px] h-[10px] rounded-full bg-primary" />
          ) : null}
        </div>
        <div className="flex-1 text-left">
          <div className="text-[14px] font-bold text-fg">{title}</div>
          {desc ? (
            <div className="text-[12px] text-descGray mt-[1px]">{desc}</div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

/** Overlay dùng chung cho SelectField + ModalSheet: nền mờ + đóng khi bấm ra ngoài. */
function Overlay({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end justify-center z-overlay"
      onClick={onClose}
    >
      <div className="w-full max-w-app" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ModalSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-t-[28px] p-5 max-h-[88%] overflow-y-auto z-10">
        <div className="flex flex-row items-center justify-between mb-4">
          <span className="text-[17px] font-bold text-fg">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="p-[6px] rounded-full bg-muted"
            aria-label="Đóng"
          >
            <X size={16} color={COLORS.fg} />
          </button>
        </div>
        {children}
      </div>
    </Overlay>
  );
}
