import React, { useState } from "react";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import {
  hasErrors,
  normalizeEmail,
  normalizeFullName,
  validateRegisterFields,
} from "../domain/authInput";
import AuthFormShell from "../components/AuthFormShell";
import AuthTextField from "../components/AuthTextField";
import AuthFieldError from "../components/AuthFieldError";
import AuthSubmitButton from "../components/AuthSubmitButton";
import AuthSocialSection from "../components/AuthSocialSection";
import AuthTermsCheckbox from "../components/AuthTermsCheckbox";
import PasswordHint from "../components/PasswordHint";

const INITIAL_VALUES = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};
const NO_ERRORS = {};

export default function RegisterScreen({ onRegister, onGoLogin }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const errors = submitted ? validateRegisterFields(values) : NO_ERRORS;

  function handleChange(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors(validateRegisterFields(values))) return;

    setBusy(true);
    setServerError("");
    const error = await onRegister({
      fullName: normalizeFullName(values.fullName),
      email: normalizeEmail(values.email),
      password: values.password,
    });
    setBusy(false);
    if (error) setServerError(error);
  }

  return (
    <AuthFormShell mode="register" wide>
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">Tạo tài khoản</h2>
        <p className="text-sm text-fg/65">Bắt đầu hành trình ăn uống lành mạnh của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3 lg:space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <AuthTextField
            id="register-full-name"
            label="Họ và tên"
            icon={UserIcon}
            value={values.fullName}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            error={errors.fullName}
            onChange={(value) => handleChange("fullName", value)}
          />
          <AuthTextField
            id="register-email"
            label="Địa chỉ Email"
            type="email"
            icon={Mail}
            value={values.email}
            placeholder="ban@email.com"
            autoComplete="email"
            error={errors.email}
            onChange={(value) => handleChange("email", value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <AuthTextField
            id="register-password"
            label="Mật khẩu"
            secure
            icon={Lock}
            value={values.password}
            placeholder="Tạo mật khẩu"
            autoComplete="new-password"
            error={errors.password}
            onChange={(value) => handleChange("password", value)}
          />
          <AuthTextField
            id="register-confirm-password"
            label="Nhập lại mật khẩu"
            secure
            icon={Lock}
            value={values.confirmPassword}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            error={errors.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
          />
        </div>
        <PasswordHint password={values.password} />

        <AuthTermsCheckbox
          checked={values.acceptedTerms}
          error={errors.terms}
          onChange={(checked) => handleChange("acceptedTerms", checked)}
        />

        <AuthFieldError message={serverError} />
        <AuthSubmitButton busy={busy}>Đăng ký</AuthSubmitButton>
      </form>

      <AuthSocialSection label="Hoặc đăng ký nhanh với" />

      <p className="text-center text-sm text-fg/70">
        Đã có tài khoản?{" "}
        <button type="button" className="text-accent font-semibold hover:underline" onClick={onGoLogin}>
          Đăng nhập
        </button>
      </p>
    </AuthFormShell>
  );
}
