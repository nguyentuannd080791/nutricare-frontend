import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { hasErrors, normalizeEmail, validateLoginFields } from "../domain/authInput";
import AuthFormShell from "../components/AuthFormShell";
import AuthTextField from "../components/AuthTextField";
import AuthFieldError from "../components/AuthFieldError";
import AuthSubmitButton from "../components/AuthSubmitButton";
import AuthSocialSection from "../components/AuthSocialSection";

const INITIAL_VALUES = { email: "", password: "" };
const NO_ERRORS = {};

/**
 * @param {(email:string, password:string) => Promise<string|null>} onLogin
 *   Trả về null nếu thành công, hoặc chuỗi lỗi để hiển thị.
 */
export default function LoginScreen({ onLogin, onGoRegister, onGoForgot }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const errors = submitted ? validateLoginFields(values) : NO_ERRORS;

  function handleChange(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors(validateLoginFields(values))) return;

    setBusy(true);
    setServerError("");
    const error = await onLogin(normalizeEmail(values.email), values.password);
    setBusy(false);
    if (error) setServerError(error);
  }

  return (
    <AuthFormShell mode="login">
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">Chào mừng bạn trở lại</h2>
        <p className="text-sm text-fg/65">
          Đăng nhập để tiếp tục theo dõi bảng điều khiển dinh dưỡng và lộ trình tập luyện của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthTextField
          id="login-email"
          label="Địa chỉ Email"
          type="email"
          icon={Mail}
          value={values.email}
          placeholder="ban@email.com"
          autoComplete="email"
          error={errors.email}
          onChange={(value) => handleChange("email", value)}
        />

        <AuthTextField
          id="login-password"
          label="Mật khẩu"
          secure
          icon={Lock}
          value={values.password}
          placeholder="Nhập mật khẩu của bạn"
          autoComplete="current-password"
          error={errors.password}
          headerAction={
            <button
              type="button"
              onClick={onGoForgot}
              className="text-xs font-semibold text-primary hover:text-primaryDark"
            >
              Quên mật khẩu?
            </button>
          }
          onChange={(value) => handleChange("password", value)}
        />

        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-fg/80 font-medium">Ghi nhớ đăng nhập</span>
        </label>

        <AuthFieldError message={serverError} />
        <AuthSubmitButton busy={busy}>Đăng nhập</AuthSubmitButton>
      </form>

      <AuthSocialSection label="Hoặc đăng nhập nhanh với" />

      <p className="text-center text-sm text-fg/70">
        Chưa có tài khoản?{" "}
        <button type="button" className="text-accent font-semibold hover:underline" onClick={onGoRegister}>
          Đăng ký ngay
        </button>
      </p>
    </AuthFormShell>
  );
}
