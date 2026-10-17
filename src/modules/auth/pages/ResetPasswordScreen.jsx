import React, { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { hasErrors, validateResetFields } from "../domain/authInput";
import AuthFormShell from "../components/AuthFormShell";
import AuthBackLink from "../components/AuthBackLink";
import AuthTextField from "../components/AuthTextField";
import AuthFieldError from "../components/AuthFieldError";
import AuthSubmitButton from "../components/AuthSubmitButton";
import PasswordHint from "../components/PasswordHint";

const INITIAL_VALUES = { password: "", confirmPassword: "" };
const NO_ERRORS = {};

/**
 * @param {(password:string) => Promise<string|null>} onResetPassword
 *   Trả về null nếu thành công, hoặc chuỗi lỗi để hiển thị.
 */
export default function ResetPasswordScreen({ onResetPassword, onGoLogin, onGoForgot }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const errors = submitted ? validateResetFields(values) : NO_ERRORS;

  function handleChange(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors(validateResetFields(values))) return;

    setBusy(true);
    setServerError("");
    const error = await onResetPassword(values.password);
    setBusy(false);
    if (error) {
      setServerError(error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <AuthFormShell mode="reset">
        <div className="space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">Đã đặt lại mật khẩu</h2>
            <p className="text-sm text-fg/65 leading-relaxed">
              Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập bằng mật khẩu mới.
            </p>
          </div>
          <AuthBackLink onClick={onGoLogin}>Đến trang Đăng nhập</AuthBackLink>
        </div>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell mode="reset">
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">Đặt mật khẩu mới</h2>
        <p className="text-sm text-fg/65 leading-relaxed">Nhập mật khẩu mới cho tài khoản NutriCare của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthTextField
          id="reset-password"
          label="Mật khẩu mới"
          secure
          icon={Lock}
          value={values.password}
          placeholder="Tạo mật khẩu mới"
          autoComplete="new-password"
          error={errors.password}
          onChange={(value) => handleChange("password", value)}
        />
        <PasswordHint password={values.password} />

        <AuthTextField
          id="reset-confirm-password"
          label="Nhập lại mật khẩu mới"
          secure
          icon={Lock}
          value={values.confirmPassword}
          placeholder="Nhập lại mật khẩu mới"
          autoComplete="new-password"
          error={errors.confirmPassword}
          onChange={(value) => handleChange("confirmPassword", value)}
        />

        <AuthFieldError message={serverError} />
        <AuthSubmitButton busy={busy}>Đặt lại mật khẩu</AuthSubmitButton>
      </form>

      <p className="text-center text-sm text-fg/70">
        Liên kết hết hạn?{" "}
        <button type="button" className="text-accent font-semibold hover:underline" onClick={onGoForgot}>
          Yêu cầu liên kết mới
        </button>
      </p>
    </AuthFormShell>
  );
}
