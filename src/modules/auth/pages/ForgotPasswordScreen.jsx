import React, { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { normalizeEmail, validateEmail } from "../domain/authInput";
import AuthFormShell from "../components/AuthFormShell";
import AuthBackLink from "../components/AuthBackLink";
import AuthTextField from "../components/AuthTextField";
import AuthFieldError from "../components/AuthFieldError";
import AuthSubmitButton from "../components/AuthSubmitButton";
import ResetEmailSent from "../components/ResetEmailSent";

/**
 * @param {(email:string) => Promise<string|null>} onRequestReset
 *   Trả về null nếu thành công, hoặc chuỗi lỗi để hiển thị.
 */
export default function ForgotPasswordScreen({ onRequestReset, onGoLogin }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentEmail, setSentEmail] = useState(null);

  const emailError = submitted ? validateEmail(email) : null;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (validateEmail(email)) return;

    setBusy(true);
    setServerError("");
    const normalized = normalizeEmail(email);
    const error = await onRequestReset(normalized);
    setBusy(false);
    if (error) {
      setServerError(error);
      return;
    }
    setSentEmail(normalized);
  }

  if (sentEmail) {
    return (
      <AuthFormShell mode="forgot">
        <ResetEmailSent email={sentEmail} onResend={onRequestReset} onGoLogin={onGoLogin} />
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell mode="forgot">
      <AuthBackLink onClick={onGoLogin}>Quay lại trang Đăng nhập</AuthBackLink>

      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">Quên mật khẩu?</h2>
        <p className="text-sm text-fg/65 leading-relaxed">
          Đừng lo, hãy nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu đến hộp thư của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthTextField
          id="forgot-email"
          label="Địa chỉ Email tài khoản"
          type="email"
          icon={Mail}
          value={email}
          placeholder="ban@email.com"
          autoComplete="email"
          error={emailError}
          onChange={setEmail}
        />
        <AuthFieldError message={serverError} />
        <AuthSubmitButton busy={busy}>Gửi liên kết khôi phục</AuthSubmitButton>
      </form>

      <div className="p-4 rounded-xl bg-muted border border-border flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-fg/75 space-y-0.5 leading-relaxed">
          <p className="font-semibold text-fg">Bảo mật liên kết</p>
          <p>Liên kết chỉ sử dụng được 1 lần và tự động hết hạn sau 15 phút.</p>
        </div>
      </div>
    </AuthFormShell>
  );
}
