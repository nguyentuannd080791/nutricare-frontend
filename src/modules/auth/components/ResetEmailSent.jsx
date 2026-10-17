import React, { useState } from "react";
import { Mail, RotateCw } from "lucide-react";
import { useCountdown } from "../hooks/useCountdown";
import AuthBackLink from "./AuthBackLink";
import AuthFieldError from "./AuthFieldError";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ResetEmailSent({ email, onResend, onGoLogin }) {
  const { secondsLeft, restart } = useCountdown(RESEND_COOLDOWN_SECONDS);
  const [resendError, setResendError] = useState("");

  async function handleResend() {
    setResendError("");
    const error = await onResend(email);
    if (error) {
      setResendError(error);
      return;
    }
    restart();
  }

  return (
    <div className="space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center shadow-sm">
        <Mail className="w-8 h-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">Kiểm tra hòm thư của bạn</h2>
        <p className="text-sm text-fg/65 leading-relaxed">
          Nếu email này đã đăng ký, chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến:
        </p>
        <p className="inline-block px-3 py-1.5 rounded-lg bg-muted border border-border font-semibold text-primary text-sm break-all">
          {email}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-fg/60">
          Không nhận được email? Kiểm tra thư mục Spam hoặc{" "}
          {secondsLeft > 0 ? (
            <span className="font-semibold text-accent">gửi lại sau ({secondsLeft}s)</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <RotateCw className="w-3 h-3" />
              <span>Gửi lại ngay</span>
            </button>
          )}
        </p>
        <AuthFieldError message={resendError} />
      </div>

      <div className="pt-4 border-t border-border">
        <AuthBackLink onClick={onGoLogin}>Quay lại trang Đăng nhập</AuthBackLink>
      </div>
    </div>
  );
}
